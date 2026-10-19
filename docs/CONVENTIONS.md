# Convenções de desenvolvimento

## Nomenclatura

- Pastas e arquivos: `kebab-case` (`team-card.tsx`, `use-team-filters.ts`).
- Componentes e tipos exportados: `PascalCase`.
- Funções, hooks, variáveis e propriedades: `camelCase`.
- Hooks começam com `use`; schemas terminam com `Schema`; tipos terminam com `Type`
  somente quando o nome não for autoexplicativo.
- Uma feature deve ter nome de domínio no plural quando representar uma coleção
  (`teams`, `matches`) e singular quando representar um fluxo/identidade (`auth`, `profile`).
- Features de domínio devem acompanhar os bounded contexts do backend: `auth`, `users`, `season`,
  `modality`, `team`, `bracket` e `match`.

## Onde colocar cada código

| Código | Local |
| --- | --- |
| Rota, layout, metadata ou Route Handler | `app/` |
| UI reutilizável e sem negócio | `src/shared/components/` |
| UI específica de um domínio | `src/features/<feature>/components/` |
| Hook compartilhado | `src/shared/hooks/` |
| Hook de uma feature | `src/features/<feature>/hooks/` |
| Requisição, SDK, browser API ou storage | `src/infrastructure/` |
| SSE, WebSocket e eventos externos | `src/infrastructure/realtime/` |
| Cookies e Web Storage | `src/infrastructure/storage/` |
| Caso de uso e orquestração | `src/features/<feature>/services/` |
| Modelo/regra do domínio | `src/features/<feature>/models/` |
| Constantes exclusivas do domínio | `src/features/<feature>/constants/` |
| Context/provider exclusivo da feature | `src/features/<feature>/contexts/` |
| Validação | `src/features/<feature>/schemas/` ou `src/shared/schemas/` |
| Configuração de biblioteca | `src/lib/` |
| Contratos HTTP e realtime | `src/core/http/` e `src/core/realtime/` |
| Estado/provider transversal | `src/core/` |

## Componentes React

- Tipar props com `type` ou `interface` próximo ao componente.
- Preferir componentes controlados quando o estado precisar ser lido pelo pai.
- Tratar explicitamente loading, erro, vazio e sucesso em telas que consomem dados.
- Usar Server Components por padrão; adicionar `"use client"` somente quando houver estado,
  efeito, evento de browser ou API client-only.
- Acessibilidade é parte do contrato: labels, foco visível, teclado, semântica e mensagens de
  erro devem existir desde a primeira versão.

## Estilos e design system

- Usar tokens semânticos definidos em `app/globals.css`; evitar hex e cores literais em JSX.
- Componentes do shadcn/ui ficam em `src/shared/components/ui` e podem ser adaptados ao design
  do produto.
- Variantes visuais devem ser explícitas e compostas com `className`; não duplicar componentes
  para diferenças apenas de aparência.

## Imports e dependências

- Usar `@/` em vez de caminhos relativos longos.
- Respeitar a direção definida em `docs/ARCHITECTURE.md`.
- Não importar um arquivo interno de outra feature. Expor um `index.ts` somente quando houver um
  contrato público estável.
- Validar dados externos na borda antes de transformá-los em modelos internos.
- Clientes realtime devem ser agnósticos de UI: não importam componentes, páginas ou contexts
  de features.
- Eventos devem ser tipados e validados antes de alcançar componentes; a feature é responsável
  por decidir como atualizar sua UI ou invalidar seu cache.
- `core` não importa `fetch`, `axios`, `EventSource`, `WebSocket`, `localStorage` ou SDKs.
- `infrastructure` implementa ports e pode depender de APIs externas; não contém regras de
  apresentação ou domínio específico.
- Repositórios, contratos e persistência ficam dentro da feature que os utiliza.
- Não criar uma camada global de repositórios sem uma necessidade concreta compartilhada.

## Testes

- O teste fica no mesmo diretório do arquivo testado.
- Use `arquivo.test.ts` para TypeScript e `arquivo.test.tsx` para componentes React.
- Não mova testes unitários para uma pasta global; `src/tests` fica reservado para setup, mocks
  compartilhados e testes que atravessam mais de uma feature.
- Nomeie o teste pelo comportamento (`create-team.test.ts`), não por uma camada genérica.

## Commits e revisão

- Commits no imperativo e com escopo curto: `feat(teams): add standings card`.
- Uma mudança deve manter `npm run lint` e `npm run build` funcionando.
- Toda nova feature deve documentar decisões não óbvias e cobrir os estados principais da UI.
