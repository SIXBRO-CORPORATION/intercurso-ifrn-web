# Arquitetura

Organização de pastas, direção das dependências, fluxo de dados e receita para criar uma feature.
Todo o código executável fica em `app/`; os caminhos abaixo são relativos a essa pasta. Rotas e
acesso estão em `ROUTING.md`; sessão em `AUTH.md`; tempo real em `REALTIME.md`.

## Resumo operacional

- Três camadas principais: `app/` (rotas finas) → `src/features/` (domínio) → `src/infrastructure/`
  (detalhes técnicos). `src/core/` guarda contratos globais; `src/shared/` guarda código sem domínio.
- Uma feature é uma fatia vertical de domínio (`match`, `modality`, `season`, `team`, `auth`,
  `dashboard`). Contém UI, hooks, repositório, schemas e utilidades do próprio domínio.
- Dados externos seguem sempre: **componente → hook (TanStack Query) → repository (axios + Zod) →
  backend**.
- Páginas e layouts não têm regra de negócio.
- Uma feature importa outra somente pelo `index.ts` público dela.

## Mapa de pastas

```text
app/
├── app/                       # App Router (somente rotas, layouts, metadata, globals.css)
│   ├── layout.tsx             # raiz: QueryProvider > AuthProvider
│   ├── (public)/              # sem login obrigatório; layout com PublicHeader (navbar)
│   ├── (auth)/                # login e callback do SUAP
│   ├── (dashboard)/           # painel autenticado: layout com AuthGuard + AccessGate
│   └── api/                   # reservado (Route Handlers); vazio
├── proxy.ts                   # barra caminhos fora do registro de rotas
└── src/
    ├── core/                  # contratos globais, sem dependência do projeto
    │   ├── routes/            # route-registry, types, match-route (ver ROUTING.md)
    │   ├── auth/              # session-store (estado de sessão em memória)
    │   ├── realtime/          # tipos do cliente SSE
    │   └── config/endpoints/  # constantes dos endpoints (/api/...)
    ├── features/              # fatias de domínio
    │   ├── auth/  dashboard/  match/  modality/  season/  team/
    ├── infrastructure/        # integrações técnicas
    │   ├── realtime/          # cliente SSE (ticket, reconexão, validação)
    │   └── storage/           # sessionStorage (caminho de retorno)
    ├── lib/                   # configuração de bibliotecas: axios, QueryProvider, cn, iso-date
    ├── shared/                # sem domínio
    │   ├── components/        # compartilhados (+ ui/ do shadcn)
    │   ├── schemas/           # envelope-schema
    │   └── utils/
    ├── assets/                # imagens importadas (logos, favicon)
    └── tests/                 # setup do Vitest e fixtures compartilhadas
```

Pastas contendo apenas `.gitkeep` são reservadas, sem código: `core/http`, `core/errors`, `config`,
`constants`, `infrastructure/http`, `shared/hooks`, `shared/models`, `shared/types`, `styles`,
`app/api`. Criar conteúdo nelas só quando houver necessidade concreta, removendo o `.gitkeep`.

## Camadas e direção das dependências

```text
app/  →  features/  →  infrastructure/
  ↘          ↘             ↘
        shared/  ←──  core/
```

| Camada | Pode importar | Não pode importar |
| --- | --- | --- |
| `core/` | nada do projeto | qualquer outra camada; `axios`, `fetch`, `EventSource`, `localStorage` |
| `shared/` | `core`, `lib` | `features`, `infrastructure`, `app` |
| `infrastructure/` | `core`, `lib` | `features`, `shared/components`, `app` |
| `features/<x>` | `core`, `shared`, `lib`, `infrastructure`, `features/<y>` (só pelo `index.ts`) | internos de outra feature, `app` |
| `app/` | tudo acima | — (mas continua fino) |

- `core` define **o quê** a aplicação precisa; `infrastructure` define **como** executar;
  `features` define **por quê e quando**.
- `lib/` configura bibliotecas (instância `api`, `QueryClient`, `cn`). Pode ser importado por
  qualquer camada exceto `core`.
- Alias `@/*` → `src/*` (`tsconfig.json`). Usar `@/` em vez de caminhos relativos que subam
  pastas; dentro da mesma feature, caminho relativo curto (`../schemas/x`) é aceito.
- Código compartilhado entre duas features: se não tem domínio, vai para `shared`; se tem, expor
  pelo `index.ts` da feature dona ou extrair um novo domínio. Nunca importar arquivo interno.

### `index.ts` público

Hoje existem em `features/modality/index.ts` e `features/season/index.ts`, exportando apenas o que
outras features consomem (hooks, tipos, utilitários). Criar um `index.ts` quando outra feature
passar a depender de algo; exportar o mínimo. Importações entre features usam
`@/features/<nome>` (sem subcaminho).

## Anatomia de uma feature

Cada feature tem só as pastas de que precisa:

```text
src/features/<dominio>/
├── components/      # UI que conhece o domínio (views, cards, dialogs, listas)
├── constants/       # valores estáveis do domínio (rótulos, opções, nomes de eventos, tamanhos)
├── contexts/        # React Context exclusivo da feature (provider + hook tipado)
├── hooks/           # useQuery/useMutation, assinatura de realtime, estado de tela
├── repositories/    # chamadas HTTP + validação Zod
├── schemas/         # Zod: contratos da API e de formulários
├── services/        # orquestração sem React (usado em auth)
├── types/           # tipos públicos que não vêm de schema
├── utils/           # funções puras do domínio (formatação, regras, mapeamento de erro)
└── index.ts         # contrato público (somente se outras features consomem)
```

Estado real: `match` (components, constants, hooks, repositories, schemas, types, utils),
`modality`/`team`/`season` (subconjuntos), `auth` (components, constants, contexts, hooks,
services), `dashboard` (components, constants).

### Responsabilidade de cada pasta

| Pasta | Contém | Regras |
| --- | --- | --- |
| `repositories/` | funções `async` que chamam `api` e devolvem dados já validados | único lugar com HTTP; recebe `AbortSignal` em leituras; sem React |
| `schemas/` | schemas Zod e tipos inferidos (`z.infer`) | o tipo do domínio nasce do schema; nomes terminam em `Schema` |
| `hooks/` | `useQuery`, `useMutation`, `connectRealtime` | chaves de query definidas aqui; sem JSX |
| `utils/` | funções puras e testáveis | sem React, sem HTTP; erros de API traduzidos para texto em português ficam aqui (`*-error.ts`) |
| `constants/` | rótulos, listas, limites | texto de UI em português; sem dados vindos da API |
| `components/` | views e peças de UI | consomem hooks; tratam os 4 estados (ver abaixo) |
| `contexts/` | estado de UI compartilhado na feature | provider + hook que lança erro fora do provider; nunca para cache de servidor |
| `services/` | regras sem UI | usar só quando houver orquestração que não cabe em hook nem util |

Sufixos de arquivo: `*-view.tsx` (componente de tela que consome dados), `*-list.tsx`,
`*-card.tsx`, `*-dialog.tsx`, `use-*.ts`, `*-repository.ts`, `*-schema.ts`.

## Fluxo de dados

```text
page.tsx (fina) → <XView> (feature/components)
                    → useX()  (feature/hooks, TanStack Query)
                        → listX()  (feature/repositories)
                            → api.get(ENDPOINT)  (@/lib/axios)
                            → schema.parse(data)  (feature/schemas)
```

### Repositório

```ts
import { MODALITY_API } from "@/core/config/endpoints"
import { api } from "@/lib/axios"
import { modalityListSchema } from "../schemas/modality-schema"

export async function listModalities(seasonId: string | undefined, signal: AbortSignal) {
  const { data } = await api.get(MODALITY_API, { params: seasonId ? { season_id: seasonId } : undefined, signal })
  return modalityListSchema.parse(data).data ?? []
}
```

- Endpoints vêm de `@/core/config/endpoints` (constantes `*_API`). Parâmetros de caminho passam por
  `encodeURIComponent`.
- Toda resposta é validada com `schema.parse` **antes** de sair do repositório. A API responde num
  envelope `{ data: ... }`; usar `envelopeSchema(...)` de `@/shared/schemas/envelope-schema`.
- Erro esperado (ex.: 404 de recurso inexistente) pode ser convertido em `null` no repositório
  (`getMatch`); os demais propagam.
- Nomes de campo dos schemas seguem o backend (`snake_case`: `modality_id`, `min_members`).

### Hook de leitura e de escrita

```ts
export function useModalities(seasonId?: string) {
  return useQuery({
    queryKey: ["modalities", seasonId ?? "all"],
    queryFn: ({ signal }) => listModalities(seasonId, signal),
  })
}
```

- Hooks são Client Components (`"use client"`).
- A chave de query inclui todos os parâmetros que alteram o resultado. Chaves existentes:
  `["match", id]`, `["matches", query]`, `["modalities", seasonId|"all"]`.
- Padrões do `QueryClient` (`lib/query-provider.tsx`): `retry: false`, `staleTime: 30_000`,
  `refetchOnWindowFocus: false`. Sobrescrever por hook só com motivo.
- Mutações usam `useMutation`; ao concluir, gravam o resultado com `setQueryData` e/ou invalidam a
  chave (`useMatchAction`).

### Estados de UI

Tela que consome dados trata **carregamento, erro, vazio e sucesso** com os componentes de
`@/shared/components/request-states`: `GridSkeleton`, `ErrorState` (com `onRetry`), `EmptyState`.
Cada `*-view.tsx` decide qual exibir a partir de `isPending`/`isError`/dados vazios.

### Páginas finas

`page.tsx`, `layout.tsx` e `route.ts` apenas: ler `params`/`searchParams` (Promises), definir
`metadata`, montar o layout da página e renderizar componentes da feature. Exemplo:
`app/(public)/partidas/[id]/page.tsx` renderiza `<MatchDetailView id={id} />`.

## Server × Client Components

- Padrão: Server Component. Adicionar `"use client"` apenas com estado, efeito, evento de browser
  ou API client-only.
- Sessão, TanStack Query e realtime só existem no cliente; qualquer componente que use `useAuth`,
  `useQuery` ou `connectRealtime` é Client Component.
- Providers globais ficam em `app/layout.tsx`.

## Component-Driven Development

1. Definir o contrato visual: props, estados (carregando/erro/vazio) e acessibilidade.
2. Componente sem domínio e reutilizável em ≥ 2 features → `shared/components`. Com domínio →
   `features/<x>/components`.
3. `shared/components/ui` contém primitivos genéricos (shadcn); não recebem entidades de domínio.
4. Estados e variações devem ser testáveis sem montar a página inteira (ver `CONVENTIONS.md`).

## Realtime

Divisão de responsabilidades (detalhes e contrato em `REALTIME.md`):

- `infrastructure/realtime`: transporte (ticket, `EventSource`, reconexão, parsing do envelope).
  Desconhece telas e regras.
- `features/<x>/hooks`: assina o canal e expõe status à UI.
- Interpretação do evento (gravar no cache, invalidar) pertence à feature consumidora.
- `core/realtime`: apenas tipos/contratos.

## Criar uma feature nova

1. Criar `src/features/<dominio>/` com somente as pastas necessárias; nome acompanha o domínio do
   backend (`auth`, `users`, `season`, `modality`, `team`, `bracket`, `match`), no singular.
2. Declarar endpoint em `src/core/config/endpoints/index.ts`.
3. Escrever o schema Zod (envelope + entidade) em `schemas/`.
4. Escrever o repositório em `repositories/` (`api` + `parse`).
5. Escrever os hooks em `hooks/` (query key explícita).
6. Construir a view em `components/` tratando os quatro estados.
7. Criar a página em `app/` e registrar a rota (`ROUTING.md`); manter a página fina.
8. Escrever testes colocalizados (repositório, schema, utils; componente quando houver interação).
9. Se outra feature precisar de algo, expor no `index.ts`.
10. Validar com `lint`, `typecheck`, `test` e `build`.

Domínios ainda inexistentes no front: `users`, `bracket`. Itens de
`features/dashboard/constants/sections.ts` sem `href` representam telas futuras.

## Correspondência com o backend

| Backend (`intercurso-ifrn-backend`) | Frontend |
| --- | --- |
| `domain/<domínio>` | `features/<domínio>/schemas` e `types` |
| `business/<domínio>` | `features/<domínio>/utils`, `hooks` e `services` |
| `persistence/` | `features/<domínio>/repositories` |
| `core/realtime` | `infrastructure/realtime` + hooks da feature |
| `web/controllers` | `app/` + `features/<domínio>/components` |
| `security/` | `core/auth` + `features/auth` |

O backend é consumido por `/api/*`, reescrito para `NEXT_API_URL` (padrão `http://localhost:8000`) em
`next.config.ts`; `NEXT_PUBLIC_API_URL` define o `baseURL` do axios.
