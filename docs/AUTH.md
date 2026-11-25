# Autenticação e autorização

Login via SUAP, sessão em memória, renovação por cookie, papéis e guards da UI. A definição de
quem acessa cada página está em `ROUTING.md` (campo `access` do registro); este documento cobre o
mecanismo de sessão.

## Resumo operacional

- O login é feito pelo backend (`/api/auth/login/suap`) com redirecionamento ao SUAP. O front nunca
  vê a senha.
- O **access token vive só em memória** (`core/auth/session-store.ts`). Não há `localStorage`,
  `sessionStorage` nem cookie legível pelo JS para o token.
- A sessão sobrevive a recarregamentos por um **cookie de refresh httpOnly** emitido pelo backend.
  Em cada carga da aplicação, `bootstrapSession()` troca o cookie por um access token novo.
- Requisições à API usam a instância `api` (`@/lib/axios`), que injeta `Authorization: Bearer` e
  renova o token uma vez em caso de 401.
- Papéis: `USER` < `MONITOR` < `ADMIN`. A UI só controla experiência; a autorização efetiva é do
  backend.
- Estado de sessão na UI: `useAuth()` (`status`, `user`, `login`, `logout`).

## Mapa de arquivos

| Arquivo | Papel |
| --- | --- |
| `src/core/auth/session-store.ts` | store externo: token, `SessionSnapshot`, `subscribe`, `setSession`, `clearSession` |
| `src/features/auth/services/auth-service.ts` | `bootstrapSession`, `refreshSession`, `logout`, `startLogin` |
| `src/features/auth/contexts/auth-context.tsx` | `AuthProvider` e `useAuth` |
| `src/features/auth/components/auth-guard.tsx` | exige sessão; redireciona anônimo ao login |
| `src/features/auth/components/access-gate.tsx` | exige papel conforme o registro de rotas; `PermissionDenied` |
| `src/features/auth/hooks/use-require-auth.ts` | executa uma ação só se autenticado; senão inicia o login |
| `src/features/auth/constants/index.ts` | `LOGIN_URL`, mensagens de erro de login |
| `src/lib/axios.ts` | `api` (Bearer + retry em 401), `authHttp` (cookies), `setRefreshHandler` |
| `src/infrastructure/storage/return-to-storage.ts` | caminho de retorno pós-login (`sessionStorage`) |
| `app/(auth)/login/page.tsx` | tela de login; exibe `?erro=` |
| `app/(auth)/auth/callback/page.tsx` | finaliza o login e redireciona |
| `app/layout.tsx` | monta `QueryProvider` > `AuthProvider` para toda a aplicação |

## Modelo de sessão

```ts
type SessionStatus = "loading" | "authenticated" | "anonymous"
type SessionUser = { userId; name; email: string | null; matricula; role: string; atleta: boolean }
```

- `loading`: estado inicial (também é o snapshot de servidor, para a hidratação coincidir).
- `authenticated`: token em memória e `user` preenchido.
- `anonymous`: sem sessão. `clearSession()` zera o token e vai para este estado.
- `role` vem do backend como `string`; a UI compara via `hasRole`/`canAccess`
  (`@/core/routes/match-route`), que tratam papel desconhecido como `USER`.
- `AuthProvider` lê o store com `useSyncExternalStore`. Componentes consomem por `useAuth()`, que
  lança erro fora do provider.
- `core/auth` não importa axios nem storage (camada `core`). O token é lido em `lib/axios.ts` por
  `getAccessToken()`.

## Fluxos

### Carga da aplicação (bootstrap)

```text
AuthProvider monta → bootstrapSession() → refreshSession()
  POST /api/auth/refresh (cookie httpOnly)
    200 → setAccessToken → GET /api/auth/me (só se ainda não há user) → setSession(user)
    401 → clearSession() → anonymous
    outro status / erro de rede → mantém o estado local (falha transitória)
  se continuar "loading" ao final → clearSession()
```

### Login

```text
startLogin(): saveReturnPath(pathname + search) → window.location.assign(LOGIN_URL)
  → backend → SUAP → backend define o cookie de refresh → /auth/callback
callback: espera status !== "loading"
  authenticated → router.replace(takeReturnPath() ?? href("dashboard"))
  anonymous     → router.replace(href("login") + "?erro=sessao_nao_recuperada")
```

- `LOGIN_URL` = `` `${AUTH_API}/login/suap` ``. A navegação é completa (não SPA) porque atravessa
  SUAP; `/api/*` é reescrito para o backend em `next.config.ts` (`NEXT_API_URL`).
- Botão de login: `LoginButton` é um `<a href={LOGIN_URL}>` que grava o caminho de retorno no clique;
  `login()` do contexto (`startLogin`) faz o equivalente por código.
- Erros: a tela de login lê `?erro=` e mapeia em `LOGIN_ERROR_MESSAGES`
  (`state_invalido`, `login_falhou`, `sessao_nao_recuperada`); código desconhecido usa
  `GENERIC_LOGIN_ERROR`. Texto sempre em português.

### Renovação transparente

`api` (axios) tem dois interceptors:

1. Request: se há token em memória, define `Authorization: Bearer <token>`.
2. Response: em **401**, com token presente, ainda não repetida (`config.retried`) e com
   `refreshHandler` registrado, chama `refreshSession()` e, se retornar `true`, reenvia a
   requisição original com `retried: true`. Caso contrário propaga o erro original.

`auth-service.ts` registra `setRefreshHandler(refreshSession)` ao ser carregado. `refreshSession`
deduplica chamadas concorrentes (`inflight`): várias requisições com 401 simultâneo geram um único
`POST /refresh`.

### Logout

`logout()` chama `POST /api/auth/logout` (ignora falha de rede) e depois `clearSession()`. O
`DashboardShell` oferece o botão "Sair".

### Caminho de retorno

`return-to-storage.ts` guarda o destino em `sessionStorage` (`intercurso:return-to`).

- `saveReturnPath` só grava caminho seguro; `takeReturnPath` lê e remove (uso único).
- `isSafeReturnPath` aceita somente caminho interno iniciado por **uma** `/` (rejeita `//host`,
  `/\`, caracteres de controle e barras invertidas) e que não comece com `/login` ou `/auth`.
  Isso evita open redirect e laço de login.
- Qualquer falha de storage (modo privado, bloqueio) é engolida: segue sem retorno.
- Quem grava: `AuthGuard` (anônimo em página protegida) e `startLogin`.

## Guards e papéis na UI

| Mecanismo | Uso |
| --- | --- |
| `AuthGuard` | página/árvore que exige apenas sessão |
| `AccessGate` | exige o papel do registro para a rota atual (só funciona onde `findRoute` resolve o caminho) |
| `useRequireAuth()` | ação disparada por usuário em página pública; anônimo vai ao login, `loading` não faz nada (hook disponível, ainda sem uso) |
| `hasRole` / `canAccess` | mostrar ou ocultar elementos por papel |

Regras:

- `app/(dashboard)/layout.tsx` monta `AuthGuard` + `AccessGate`: qualquer página nesse grupo está
  protegida. Páginas em outros grupos precisam de `<AuthGuard>` explícito (ver `ROUTING.md`).
- `AuthGuard` mostra "Carregando…" até a sessão resolver, evitando flash de conteúdo e redirecionamento
  prematuro.
- Ocultar um botão por papel **não** substitui a checagem do backend. Todo endpoint sensível valida
  o papel; a UI deve tratar 401/403 do backend como possibilidade normal.
- Papel mínimo de uma rota: somente em `ROUTES[chave].access`. Papel exigido por um item de seção
  do painel: `role` em `features/dashboard/constants/sections.ts`.

## Como usar em código novo

- Ler o usuário/estado: `const { status, user } = useAuth()` em Client Component.
- Chamar API autenticada: sempre `api` de `@/lib/axios` dentro de um `repository` da feature
  (ver `ARCHITECTURE.md`). Nunca montar o header `Authorization` à mão nem usar `fetch` cru para
  endpoints autenticados.
- `authHttp` (`withCredentials`, `validateStatus: () => true`) é exclusivo do serviço de
  autenticação (`/api/auth/*`), pois depende do cookie de refresh e trata status manualmente.
- Redirecionar para o login: `router.replace(href("login"))` e, quando o usuário deve voltar depois,
  `saveReturnPath(...)` antes.
- Nunca persistir token em storage nem expô-lo em props, logs ou query string.

## Armadilhas

- Usar `status === "anonymous"` sem tratar `loading` provoca redirecionamento indevido durante o
  bootstrap.
- Código que roda no servidor (Server Component, `proxy.ts`) não tem acesso à sessão: ela existe só
  no navegador. Decisão de papel no servidor não é possível com este desenho; fica no backend.
- O interceptor só renova quando já havia token. Requisição anônima que recebe 401 não dispara refresh.
- Falha transitória no refresh (5xx, rede) não derruba a sessão local; apenas 401 do refresh derruba.
- Ao testar, o store é estado de módulo: resetar com `clearSession()` entre casos
  (ver `auth-service.test.ts`).

## Testes

- `features/auth/services/auth-service.test.ts`: bootstrap, refresh, deduplicação, logout.
- `lib/axios.test.ts`: injeção de Bearer e retry em 401.
- `infrastructure/storage/return-to-storage.test.ts`: validação do caminho de retorno.
- `core/routes/match-route.test.ts`: `canAccess` e hierarquia de papéis.
