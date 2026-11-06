# Intercurso IFRN Web

Frontend do Intercurso IFRN: acompanhamento de partidas ao vivo, modalidades, equipes e painel de
gestão para monitores. Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, TanStack
Query e Zod. O backend é outro repositório (`intercurso-ifrn-backend`), consumido por `/api/*`.

Todo o código executável fica em `app/`. A documentação técnica fica em `docs/`. Este arquivo reúne
as regras de maior impacto e o índice dos documentos; o detalhe de cada assunto está no documento
indicado, que deve ser lido **antes** de alterar a área correspondente e **somente** ele (os demais
são desnecessários para a tarefa).

## Comandos

Executados dentro de `app/` (o ambiente de desenvolvimento normal é o Docker descrito em `README.md`).

| Comando | Função |
| --- | --- |
| `npm run dev` | servidor de desenvolvimento |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest (`vitest run`), com os projetos `unit` e `components` |
| `npm run build` | build de produção (`output: "standalone"`) |

Uma alteração só está concluída com `lint`, `typecheck`, `test` e `build` sem erro. É o que o CI
executa em PRs para `develop` e `main`. O hook de pré-commit roda `eslint --fix --max-warnings=0`
nos arquivos staged e `typecheck`.

## Regras invariantes

1. **Rotas centralizadas.** Toda página (`page.tsx`) tem uma entrada em
   `app/src/core/routes/route-registry.ts` (`ROUTES`), com `path` e `access`. O teste
   `route-registry.test.ts` compara as páginas de `app/app/` com o registro e falha em qualquer
   divergência. Um caminho fora do registro é reescrito por `app/proxy.ts` para `/_unregistered`
   (resulta em 404). Detalhes em `docs/ROUTING.md`.
2. **Links e redirecionamentos usam `href(chave, params)`**, importado de
   `@/core/routes/route-registry`. Caminhos literais (`"/partidas"`, template strings de URL) não
   são usados em código novo. `href` não monta query string; ela é anexada à parte.
3. **Controle de acesso por papel** (`USER` < `MONITOR` < `ADMIN`) é definido apenas no campo
   `access` do registro. Na UI, é aplicado por `AuthGuard` + `AccessGate` em
   `app/app/(dashboard)/layout.tsx`. Páginas fora desse layout não são protegidas
   automaticamente (usar `<AuthGuard>` na página). A UI controla somente a experiência; a
   autorização efetiva pertence ao backend. Detalhes em `docs/AUTH.md`.
4. **Next.js 16 difere de versões anteriores.** `proxy.ts` substitui `middleware.ts`, e `params` e
   `searchParams` são `Promise`. A documentação do framework instalado fica em
   `app/node_modules/next/dist/docs/` e prevalece sobre conhecimento prévio.
5. **Camadas.** `app/` (rotas finas) → `features/` → `infrastructure/`. `core/` não importa nada
   do projeto; `shared/` não importa `features/` nem `infrastructure/`. Uma feature só importa outra
   pelo `index.ts` público dela. Regras completas em `docs/ARCHITECTURE.md`.
6. **Dados externos.** Requisições HTTP ficam somente em `repositories/` da feature, usando `api`
   de `@/lib/axios`. Endpoints vêm de `@/core/config/endpoints`. A resposta é validada com Zod
   (`schema.parse`) antes de sair do repositório. A UI consome por hooks do TanStack Query.
7. **Estados de UI.** Telas que consomem dados tratam carregamento, erro, vazio e sucesso
   (`@/shared/components/request-states`).
8. **Testes colocalizados** ao lado do arquivo testado: `.test.ts` (ambiente node) e `.test.tsx`
   (jsdom). Convenções em `docs/CONVENTIONS.md`.
9. **Idioma.** Texto de interface, mensagens de erro e caminhos de URL em português do Brasil.
   Identificadores de código, chaves do registro de rotas e mensagens de commit em inglês
   (`feat(match): finish match from the monitor console`).
10. **Estilo.** Tokens semânticos de `app/app/globals.css` (sem hex nem cores literais em JSX) e
    `cn` de `@/lib/utils`. Detalhes em `docs/SHADCN_UI.md`.
11. **Documentação acompanha o código.** Alteração em rota, acesso, sessão, camada, token de UI ou
    canal realtime atualiza o documento correspondente na mesma mudança.

## Índice da documentação

| Tarefa | Documento |
| --- | --- |
| Criar, renomear ou remover rota; proteger página; montar links; `proxy.ts` | `docs/ROUTING.md` |
| Login SUAP, sessão, token, refresh, papéis, guards, retorno pós-login | `docs/AUTH.md` |
| Estrutura de pastas, camadas, fluxo de dados, nova feature | `docs/ARCHITECTURE.md` |
| Nomenclatura, componentes React, imports, testes, commits | `docs/CONVENTIONS.md` |
| SSE, eventos ao vivo, ticket, novo canal | `docs/REALTIME.md` |
| Componentes de UI, tokens de design, CLI do shadcn, referências visuais | `docs/SHADCN_UI.md` |
| Bibliotecas adotadas, variáveis de ambiente | `docs/stack.md` |
| Subir o ambiente, Docker, branches | `README.md` |

Imagens de referência de tela: `docs/visual-guidelines/` (consultar só a tela em implementação).

## Mapa do código

```text
app/
├── app/                 # App Router: páginas finas, layouts, globals.css
│   ├── (public)/        # sem login obrigatório
│   ├── (auth)/          # login e callback do SUAP
│   └── (dashboard)/     # painel autenticado (AuthGuard + AccessGate)
├── proxy.ts             # barra caminhos fora do registro de rotas
└── src/
    ├── core/            # contratos globais: routes, auth/session-store, realtime/types, config/endpoints
    ├── features/        # auth, dashboard, match, modality, season, team
    ├── infrastructure/  # realtime/realtime-client (SSE), storage/return-to-storage
    ├── lib/             # axios (api, authHttp), query-provider, utils (cn), iso-date
    ├── shared/          # components (+ ui/ do shadcn), schemas/envelope-schema, utils
    └── tests/           # setup.ts e fixtures compartilhadas
```

## Estado atual (pontos que costumam gerar dúvida)

- `app/app/page.tsx` (rota `home`, `/`) ainda é o placeholder do create-next-app.
- Pastas com apenas `.gitkeep` são reservadas e sem código: `core/http`, `core/errors`, `config`,
  `constants`, `infrastructure/http`, `shared/hooks`, `shared/models`, `shared/types`, `styles`,
  `app/api`.
- Os domínios `users` e `bracket` ainda não existem no frontend. Itens de
  `features/dashboard/constants/sections.ts` sem `href` representam telas futuras.
- `NEW_TEAM_PATH` (`/equipes/nova`) e o link de `my-team-card.tsx` (`/equipes/:id`) apontam para
  telas ainda não registradas e resultam em 404 até a rota existir.
- `app/vitest.config.ts` (com os projetos `unit` e `components`) é a configuração efetiva do Vitest;
  `app/vitest.config.mts` é redundante e não é usada.
- Primitivos de `shared/components/ui` importam `cn` do pacote `cn`; `aliases.utils` do
  `components.json` aponta para um caminho inexistente (detalhes em `docs/SHADCN_UI.md`).
- Não há MSW nem Playwright instalados.
