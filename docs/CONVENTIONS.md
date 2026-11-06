# Convenções de desenvolvimento

Nomenclatura, idioma, componentes, imports, testes e commits. Estrutura de pastas e camadas em
`ARCHITECTURE.md`; estilo visual em `SHADCN_UI.md`.

## Resumo operacional

- Arquivos e pastas em `kebab-case`; componentes em `PascalCase`; funções e variáveis em `camelCase`.
- Interface, mensagens de erro e caminhos de URL em português do Brasil. Identificadores de código,
  chaves de rotas e commits em inglês.
- Server Component por padrão; `"use client"` só quando necessário.
- Teste colocalizado ao lado do arquivo (`.test.ts` em node, `.test.tsx` em jsdom).
- Uma alteração só termina com `lint`, `typecheck`, `test` e `build` sem erro.

## Idioma

| Item | Idioma | Exemplo |
| --- | --- | --- |
| Texto de interface, `aria-label`, `metadata.title` | pt-BR | `"Tentar novamente"` |
| Mensagens de erro exibidas ao usuário | pt-BR | `"Não foi possível entrar com o SUAP."` |
| Caminhos de URL | pt-BR | `/partidas/gerenciar` |
| Identificadores, nomes de arquivo, chaves de `ROUTES` | inglês | `manageMatches`, `match-card.tsx` |
| Mensagem de commit | inglês | `feat(match): finish match from the monitor console` |
| Comentários | pt-BR, só quando explicam o porquê | — |

`metadata.title` segue `"<Tela> | Intercurso IFRN"`.

## Nomenclatura

- Pastas e arquivos: `kebab-case` (`team-card.tsx`, `use-team-filters.ts`).
- Componentes e tipos exportados: `PascalCase`. Funções, hooks, variáveis, propriedades: `camelCase`.
- Hooks começam com `use`. Schemas Zod terminam com `Schema` (`modalitySchema`). Constantes de valor
  fixo em `UPPER_SNAKE_CASE` (`MATCH_EVENT_NAMES`, `PAGE_SIZE`).
- Sufixos de arquivo: `*-view.tsx` (tela que consome dados), `*-list.tsx`, `*-card.tsx`,
  `*-dialog.tsx`, `use-*.ts`, `*-repository.ts`, `*-schema.ts`, `*-error.ts` (tradução de erro da
  API em texto).
- Nome de feature acompanha o domínio do backend e fica no singular: `auth`, `users`, `season`,
  `modality`, `team`, `bracket`, `match`.
- Campos vindos da API mantêm o `snake_case` do backend dentro dos schemas; a conversão para outro
  formato só ocorre quando há ganho claro, num `util` da feature.
- Estilo de código predominante: sem ponto e vírgula, aspas duplas, 2 espaços. Em arquivo existente,
  seguir o estilo dele; não reformatar arquivos inteiros numa alteração funcional.

## Onde colocar cada código

| Código | Local |
| --- | --- |
| Página, layout, metadata, Route Handler | `app/app/` |
| Entrada de rota, papel mínimo, `href` | `src/core/routes/route-registry.ts` |
| Constante de endpoint | `src/core/config/endpoints/index.ts` |
| Chamada HTTP | `src/features/<f>/repositories/` |
| Validação / tipo de dado da API | `src/features/<f>/schemas/` |
| Hook de dados | `src/features/<f>/hooks/` |
| UI de um domínio | `src/features/<f>/components/` |
| UI genérica reutilizável | `src/shared/components/` |
| Primitivo shadcn | `src/shared/components/ui/` |
| Função pura do domínio | `src/features/<f>/utils/` |
| Rótulos, opções, limites do domínio | `src/features/<f>/constants/` |
| Estado de UI compartilhado numa feature | `src/features/<f>/contexts/` |
| Transporte (SSE) e `sessionStorage` | `src/infrastructure/` |
| Configuração de biblioteca (axios, QueryClient, `cn`) | `src/lib/` |
| Setup e fixtures de teste compartilhadas | `src/tests/` |

## Componentes React

- Props tipadas com `type` ou `interface` próximo ao componente.
- Server Component por padrão. `"use client"` somente com estado, efeito, evento de browser ou
  hook de TanStack Query/`useAuth`.
- Telas que consomem dados tratam carregamento, erro, vazio e sucesso com
  `@/shared/components/request-states` (`GridSkeleton`, `ErrorState`, `EmptyState`).
- Estado lido pelo pai: componente controlado.
- `page.tsx`/`layout.tsx` finos: sem regra de negócio, sem HTTP.
- `params` e `searchParams` são `Promise` (Next 16): `await` em Server Component, `use()` em Client
  Component.
- Links internos: `<Link href={href("chave")}>` (ver `ROUTING.md`); nunca literal de caminho.
- Acessibilidade desde a primeira versão: rótulos, foco visível, teclado, semântica e mensagens
  de erro com `role="alert"`; carregamento com `role="status"`; ícone decorativo com `aria-hidden`;
  botão só com ícone com `aria-label`.
- Listas e navegação: usar elementos semânticos (`ul/li`, `nav` com `aria-label`, `aria-current`).

## Imports e dependências

- Alias `@/` para `src/` em vez de caminhos que subam pastas.
- Direção das camadas e uso de `index.ts` público: `ARCHITECTURE.md`.
- HTTP só em `repositories/` via `api` de `@/lib/axios`; nunca `fetch` cru para a API.
- Dado externo validado com Zod antes de virar modelo interno.
- `cn` vem de `@/lib/utils`.
- Eventos realtime tipados e validados antes de chegar a componentes (`REALTIME.md`).
- Dependência nova só com necessidade clara; registrar em `docs/stack.md`.

## Estilo visual

- Tokens semânticos de `app/globals.css` (`bg-primary`, `text-muted-foreground`, `border-border`…);
  sem hex nem cores literais em JSX. Detalhes em `SHADCN_UI.md`.
- Variantes explícitas e composição por `className` com `cn`; não duplicar componente por diferença
  só de aparência.

## Testes

Executar: `npm test` (Vitest, projetos `unit` e `components`).

| Sufixo | Ambiente | Para quê |
| --- | --- | --- |
| `*.test.ts` | node | schemas, repositórios, utils, realtime, rotas |
| `*.test.tsx` | jsdom (+ `src/tests/setup.ts`, limpa o DOM a cada teste) | componentes e interação |

- O teste fica **no mesmo diretório** do arquivo testado e é nomeado pelo arquivo
  (`match-filters.test.ts`). Não criar pasta `tests` por feature. `src/tests/` guarda apenas setup
  e fixtures compartilhadas (`match-fixtures.ts`, com `makeMatch`).
- Descrever comportamento: `it("pede confirmação mostrando o placar, sem finalizar ainda", …)`.
  Títulos de `describe`/`it` em pt-BR.
- Repositórios: substituir `api.defaults.adapter` por uma função que registra a requisição e devolve
  a resposta; assertar `url`, `params` e o resultado já validado
  (ver `modality-repository.test.ts`).
- Componentes: `@testing-library/react` + `user-event`; consultar por papel acessível
  (`getByRole("button", { name })`). Hooks de dados são mockados com `vi.mock` + `vi.hoisted`
  (ver `finish-match.test.tsx`).
- Tempo e APIs de browser: `vi.useFakeTimers()` e `vi.stubGlobal("EventSource", …)`
  (ver `realtime-client.test.ts`).
- Estado de módulo (sessão, `inflight`): restaurar entre casos.
- Regras novas de rota exigem atualizar `route-registry.test.ts`/`match-route.test.ts` quando
  alterarem o comportamento.
- Sem MSW nem Playwright instalados hoje.

## Qualidade e verificação

Executados dentro de `app/`:

| Comando | Função |
| --- | --- |
| `npm run lint` | ESLint (`eslint-config-next` core-web-vitals + TypeScript) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest |
| `npm run build` | build de produção (`output: "standalone"`) |

- Pré-commit (Husky): `lint-staged` roda `eslint --fix --max-warnings=0` nos staged e depois
  `typecheck`.
- CI (`.github/workflows/quality.yml`, PRs para `develop` e `main`, Node 22): `npm ci`, lint,
  typecheck, test, build.
- Ambiente normal de desenvolvimento: Docker (`README.md`).

## Commits e branches

- Formato Conventional Commits em inglês, imperativo, com escopo curto pelo domínio:
  `feat(match): finish match from the monitor console`, `fix(auth): …`, `docs: …`, `test(team): …`,
  `refactor(routes): …`.
- Uma mudança lógica por commit; o commit deixa `lint`, `typecheck`, `test` e `build` verdes.
- Branches: `develop` (desenvolvimento) e `main` (produção, deploy pela Vercel). PRs para ambas.
- Toda feature nova cobre os estados principais da UI e documenta decisões não óbvias no código ou
  no `docs/` correspondente.

## Manutenção da documentação

- Alterar rota, papel ou fluxo de sessão → atualizar `ROUTING.md`/`AUTH.md` na mesma mudança.
- Nova biblioteca → `stack.md`. Novo token ou primitivo de UI → `SHADCN_UI.md`.
- Novo canal realtime → `REALTIME.md`. Nova regra de camada → `ARCHITECTURE.md` e `AGENTS.md`.
- Pasta antes reservada que ganhou código → remover `.gitkeep` e ajustar o "Estado atual" do
  `AGENTS.md`.
