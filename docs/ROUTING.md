# Rotas — registro central

Fonte única de verdade para caminhos de URL e níveis de acesso: `app/src/core/routes/route-registry.ts`.
Páginas, links, redirecionamentos, navegação do painel e guards derivam desse arquivo. Nenhum outro
lugar define caminho ou papel mínimo de uma página.

## Resumo operacional

- Toda `page.tsx` tem **exatamente uma** entrada em `ROUTES`. O teste `route-registry.test.ts` compara
  as páginas de `app/app/` com o registro e falha em qualquer divergência (página sem entrada ou entrada
  sem página).
- Links e redirecionamentos são montados com `href(chave, params)`. Literais de caminho não são usados
  em código novo.
- O papel mínimo de acesso é declarado somente em `access`. A UI o aplica; a autorização efetiva é do
  backend.
- Caminho fora do registro nunca chega a uma página: `app/proxy.ts` o reescreve para `/_unregistered`
  (404).

## Arquivos

| Arquivo | Papel |
| --- | --- |
| `src/core/routes/route-registry.ts` | `ROUTES`, `RouteKey` e `href` |
| `src/core/routes/types.ts` | `Role`, `RouteAccess`, `RouteEntry` |
| `src/core/routes/match-route.ts` | `findRoute(pathname)`, `hasRole`, `canAccess` |
| `proxy.ts` (raiz de `app/`) | barra caminhos fora do registro |
| `src/features/auth/components/access-gate.tsx` | aplica `access` na UI do painel |
| `src/features/dashboard/constants/sections.ts` | navegação do painel, derivada do registro |

`core/routes` não importa nada do projeto (regra de camadas de `ARCHITECTURE.md`).

## Estrutura do registro

```ts
export const ROUTES = {
  home: { path: "/", access: "public" },
  manageMatch: { path: "/partidas/gerenciar/:id", access: { minRole: "MONITOR" } },
  // ...
} as const satisfies Record<string, RouteEntry>
```

- **Chave** (`manageMatch`): identificador em inglês, `camelCase`. É o que o código importa.
- **`path`**: caminho em português do Brasil, minúsculo, com hífen quando composto. Segmento dinâmico
  usa `:nome` (ex.: `:id`). Cada segmento `:nome` casa exatamente um segmento não vazio.
- **`access`**: `"public"` ou `{ minRole: "USER" | "MONITOR" | "ADMIN" }`.
- `as const satisfies` preserva os literais: `RouteKey` e os nomes dos parâmetros de `href` são
  inferidos dos caminhos. Não trocar por anotação de tipo explícita (`: Record<…>`), pois isso apaga a
  inferência.

### Papéis

Hierarquia `USER` (0) < `MONITOR` (1) < `ADMIN` (2), definida em `match-route.ts`. Um papel
desconhecido vindo do backend é tratado como `USER`. `"public"` não exige sessão.

### Estado atual do registro

| Chave | Caminho | Acesso | Grupo em `app/` |
| --- | --- | --- | --- |
| `home` | `/` | público | `app/page.tsx` (ainda placeholder do create-next-app) |
| `login` | `/login` | público | `(auth)` |
| `authCallback` | `/auth/callback` | público | `(auth)` |
| `matches` | `/partidas` | público | `(public)` |
| `match` | `/partidas/:id` | público | `(public)` |
| `modalities` | `/modalidades` | público | `(public)` |
| `modalityTeams` | `/modalidades/:id/times` | USER | `(public)` + `AuthGuard` na página |
| `myTeams` | `/equipes` | USER | `(dashboard)` |
| `dashboard` | `/dashboard` | USER | `(dashboard)` |
| `dashboardSection` | `/dashboard/:section` | USER | `(dashboard)` |
| `manageMatches` | `/partidas/gerenciar` | MONITOR | `(dashboard)` |
| `manageMatch` | `/partidas/gerenciar/:id` | MONITOR | `(dashboard)` |

A tabela é um retrato; o arquivo prevalece em caso de divergência.

## `href(chave, params)`

```ts
import { href } from "@/core/routes/route-registry"

href("matches")                         // "/partidas"
href("manageMatch", { id: matchId })    // "/partidas/gerenciar/<id codificado>"
router.replace(href("login"))
<Link href={href("modalities")}>…</Link>
```

- Os valores dos parâmetros passam por `encodeURIComponent`; não codificar antes.
- Rota com parâmetro exige o objeto de parâmetros (erro de tipo caso falte ou sobre nome).
- `href` **não monta query string**. Anexa-se à parte: `` `${href("matches")}?status=IN_PROGRESS` ``
  ou com `URLSearchParams`.
- Sem âncora (`#`) embutida; anexar também à parte.
- Chave inexistente é erro de compilação: renomear ou remover uma rota no registro expõe todos os
  usos pelo `typecheck`.

### Exceção controlada

`features/dashboard/constants/sections.ts` lê `ROUTES[key].path` e `access` diretamente, só para
rotas estáticas, porque precisa do papel mínimo além do caminho. Código de tela não replica esse padrão.

### Dívidas conhecidas (não copiar)

- `NEW_TEAM_PATH` (`features/team/constants`) e o link em `my-team-card.tsx` usam literais de caminho
  e apontam para telas não registradas (`/equipes/nova`, `/equipes/:id`): resultam em 404 até a rota
  existir. Ao criar essas telas, registrar as rotas e trocar os literais por `href`.
- `app/page.tsx` é o placeholder do Next.js. `app/(public)/home/.gitkeep` está reservado e vazio.

## Resolução de caminho: `findRoute`

`findRoute(pathname)` devolve a `RouteEntry` correspondente ou `undefined`.

- Ignora barra final (`/partidas/` equivale a `/partidas`).
- Compara segmento a segmento; `:param` casa um único segmento não vazio (`/partidas/42/extra` não casa
  com `match`).
- **Estático vence dinâmico**: `/partidas/gerenciar` resolve para `manageMatches`, não para
  `match` com `id = "gerenciar"`. Cada linha da tabela recebe uma pontuação por segmento
  (`0` estático, `1` dinâmico) e a menor pontuação ganha.
- Não conhece query string nem hash: recebe só o `pathname`.

## `proxy.ts`

Next.js 16 usa `proxy.ts` no lugar de `middleware.ts` (documentação em
`app/node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`).

```ts
export function proxy(request: NextRequest) {
  if (findRoute(request.nextUrl.pathname)) return NextResponse.next()
  return NextResponse.rewrite(new URL("/_unregistered", request.url))
}
export const config = { matcher: ["/((?!api|_next|.*\\..*).*)"] }
```

- O `matcher` exclui `/api/*`, `/_next/*` e qualquer caminho com ponto (arquivos estáticos). Esses
  não passam pelo registro.
- `/_unregistered` não tem página: a reescrita resulta em 404. O prefixo `_` torna a pasta privada no
  App Router, então o caminho não pode ser criado por engano.
- O proxy **não** verifica papel nem sessão (roda no servidor, sem acesso ao estado de sessão do
  navegador). Apenas decide se o caminho existe.
- Efeito colateral útil: `/equipes/nova` e outros caminhos de telas futuras dão 404 mesmo que alguém
  crie a pasta em `app/` sem registrar.

## Controle de acesso na UI

O campo `access` é aplicado em duas camadas, ambas a partir do registro:

1. `AuthGuard` (`features/auth/components/auth-guard.tsx`): sem sessão, salva o caminho de retorno e
   redireciona para `href("login")`. Enquanto a sessão carrega, mostra "Carregando…".
2. `AccessGate` (`features/auth/components/access-gate.tsx`): resolve a rota atual com `findRoute`
   e, se `canAccess(route.access, user.role)` for falso (ou a rota não existir), mostra
   `PermissionDenied`.

Ambos são montados em `app/(dashboard)/layout.tsx`:

```tsx
<AuthGuard><DashboardShell><AccessGate>{children}</AccessGate></DashboardShell></AuthGuard>
```

Consequências:

- Toda página dentro de `app/(dashboard)/` herda login obrigatório e checagem de papel sem código
  adicional na página.
- Páginas **fora** desse layout **não** são protegidas automaticamente, mesmo com `access` restrito
  no registro. Se a página precisa de login fora do painel, envolve-se o conteúdo em `<AuthGuard>`
  (padrão em `app/(public)/modalidades/[id]/times/page.tsx`). Alternativa preferível: mover a página
  para `(dashboard)`.
- `access` na UI é experiência, não segurança. Todo endpoint continua validando papel no backend.
- Refinamento por seção: `/dashboard/:section` é `USER`, e `app/(dashboard)/dashboard/[section]/page.tsx`
  filtra os itens de `SECTIONS` por papel (`canUse`, alias de `hasRole`).

## Procedimentos

### Criar rota

1. Criar a pasta e `page.tsx` em `app/app/` no grupo correto:
   - `(public)`: sem login obrigatório;
   - `(auth)`: login e callback do SUAP;
   - `(dashboard)`: painel autenticado (herda `AuthGuard` + `AccessGate`).
   Os grupos entre parênteses não entram na URL. Pasta `[id]` vira `:id` no registro.
2. Adicionar a entrada em `ROUTES` com `path` e `access`. O caminho deve ser idêntico ao que o
   App Router gera para a pasta.
3. Se for dinâmica, ler o parâmetro como `Promise` (Next 16):
   `export default async function Page({ params }: { params: Promise<{ id: string }> }) { const { id } = await params }`.
   Em Client Component, usar `use(params)`. O mesmo vale para `searchParams`.
4. Manter a página fina: compor componentes de `features/` (ver `ARCHITECTURE.md`).
5. Se a rota aparece na navegação do painel, referenciá-la em
   `features/dashboard/constants/sections.ts` via `link("chave")`.
6. Rodar `npm test`: `route-registry.test.ts` confirma a correspondência.

### Renomear caminho ou chave

- Caminho: alterar `path` no registro e mover a pasta em `app/app/`. Os usos por `href` seguem
  automaticamente; procurar literais restantes com `grep -rn '"/<caminho-antigo>' app/src app/app`.
- Chave: alterar no registro e corrigir os erros do `typecheck`.
- Atualizar testes que citam o caminho (`match-route.test.ts`, `route-registry.test.ts`).

### Remover rota

Apagar a pasta da página e a entrada do registro (ambos, na mesma alteração). Corrigir os usos
apontados pelo `typecheck` e remover itens correspondentes em `sections.ts`.

### Alterar o papel mínimo

Editar somente `access` da entrada. Não duplicar checagem de papel em componentes de tela para a
mesma finalidade; para exibir/ocultar elementos conforme papel, usar `hasRole`/`canAccess` de
`@/core/routes/match-route`.

### Rota que depende de query string

Query não faz parte do registro. Ler em Server Component via `searchParams` (Promise) ou, em Client
Component, via `useSearchParams`. Filtros de listagem ficam em `features/<feature>/utils` (ver
`features/match/utils/match-filters.ts`).

## Armadilhas

- Criar `page.tsx` sem registrar: o teste falha e, em runtime, o proxy devolve 404.
- Registrar caminho diferente do gerado pela pasta (ex.: esquecer um segmento): mesmo efeito.
- Montar URL com template string (`` `/partidas/${id}` ``): contorna o registro e o `encodeURIComponent`.
- Esperar que `href("rota")` carregue query string ou hash.
- Assumir que `AuthGuard`/`AccessGate` cobrem páginas fora de `(dashboard)`.
- Redirecionar com `router.replace("/login")`: usar `router.replace(href("login"))`.
- Caminhos de URL são em português; chaves do registro, em inglês.

## Testes relacionados

- `route-registry.test.ts`: cobertura registro × páginas, comportamento de `href` (parâmetros,
  codificação, erro de tipo).
- `match-route.test.ts`: `findRoute` (estático × dinâmico, barra final, não registrado) e `canAccess`.
- Ao adicionar rota com precedência sensível (estático e dinâmico no mesmo nível), acrescentar um caso
  em `match-route.test.ts`.
