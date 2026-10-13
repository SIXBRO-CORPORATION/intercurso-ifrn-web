# Arquitetura — Intercurso IFRN Web

## Objetivo

O projeto usa **Component-Driven Development** na apresentação, **Feature-Sliced Design**
para organizar o domínio e o App Router do Next.js para composição de rotas. A regra principal
é manter cada responsabilidade próxima do código que a utiliza, expondo apenas contratos
necessários para outras camadas.

## Estrutura

```text
app/                         # Next.js App Router: rotas, layouts, metadata e endpoints
├── (public)/                # grupo de rotas públicas
├── (auth)/                  # grupo de autenticação
├── (dashboard)/             # grupo autenticado
└── api/                     # Route Handlers (quando necessário)
src/
├── core/                    # regras transversais e estado global
│   ├── auth/
│   ├── http/
│   ├── realtime/
│   └── errors/
├── features/                # fatias verticais por caso de uso/domínio
│   └── _template/           # esqueleto para criar novas features
├── infrastructure/          # detalhes externos e implementações técnicas
│   ├── http/
│   ├── realtime/
│   └── storage/
├── shared/                  # código agnóstico de domínio, reutilizado
│   ├── components/          # componentes visuais compartilhados
│   │   └── ui/              # componentes instalados/customizados do shadcn/ui
│   ├── hooks/
│   ├── models/
│   ├── schemas/
│   ├── types/
│   └── utils/
├── assets/                  # recursos importados pelo código
├── config/                  # configuração de ambiente e runtime
├── constants/               # constantes globais
├── lib/                     # bootstrap/configuração de bibliotecas
├── styles/                  # tokens e estilos compartilhados
└── tests/                   # setup, mocks e testes cross-feature
```

## Anatomia de uma feature

Cada feature pode ter somente as pastas que realmente precisar:

```text
src/features/teams/
├── components/              # UI que conhece o domínio de teams
├── contexts/                # estado/contexto React exclusivo da feature
├── hooks/                   # hooks de interação/cache da feature
├── models/                  # entidades e regras do domínio
├── repositories/            # contratos de dados específicos da feature
├── schemas/                 # validação de entrada/saída
├── services/                # casos de uso e orquestração
├── types/                   # tipos públicos da feature
└── utils/                   # helpers exclusivos da feature
```

Os domínios esperados seguem o backend: `auth`, `users`, `season`, `modality`, `team`, `bracket`
e `match`. Uma feature representa um domínio/capacidade vertical, não uma camada técnica.
Por exemplo, uma operação de criação de equipe pode envolver `components`, `schemas`, `services`,
`repositories` e `types` dentro de `features/team`.

### `constants` dentro de uma feature

`src/features/<feature>/constants` contém valores estáveis, nomeados e exclusivos daquele
domínio. Exemplos: limites de membros de uma equipe, labels de status de partida, opções de
filtro de uma modalidade e chaves de query da feature.

Use `src/constants` somente quando o valor for realmente global e compartilhado por vários
domínios. Não coloque ali regras de negócio executáveis, dados vindos da API, secrets ou
configuração de ambiente. Valores configuráveis por ambiente pertencem a `src/config`.

### `contexts` dentro de uma feature

`src/features/<feature>/contexts` contém React Contexts usados apenas por aquela feature, como
filtros de uma tela, wizard de criação ou estado de seleção de uma chave. O Context deve expor
um provider e um hook tipado, tratar uso fora do provider explicitamente e ficar em um Client
Component quando depender de estado/eventos.

Não use um context de feature para cache de servidor (prefira TanStack Query) nem para estado
global sem uma necessidade clara. Se duas features precisam
do mesmo contexto, ele deve ser reavaliado como código compartilhado ou movido para `core`.

### Realtime

O backend expõe eventos em tempo real, portanto a arquitetura do frontend separa:

```text
src/infrastructure/realtime/       # conexão, transporte e ciclo de vida técnico
src/features/match/hooks/           # consumo de eventos na feature de partidas
src/features/match/contexts/        # estado visual compartilhado, se necessário
src/features/match/services/        # transformação e aplicação da regra de negócio
```

Por exemplo, `src/infrastructure/realtime/season-events-client.ts` pode abrir uma conexão SSE
e devolver eventos tipados. Ele não deve atualizar diretamente componentes, conhecer a tela ou
decidir regras de partida. A feature consumidora interpreta o evento.

Use:

- `src/infrastructure/realtime` para SSE, WebSocket, reconexão, heartbeat, autenticação do
  canal, cancelamento e normalização do envelope técnico;
- `src/features/<feature>/hooks` para assinar o canal e expor loading, conexão e erro à UI;
- `src/features/<feature>/services` para aplicar o evento ao modelo ou invalidar cache;
- `src/core/realtime` somente para políticas realmente globais, como um provider de conexão,
  registry de canais ou telemetria transversal.

Não coloque todo realtime em `core`: o transporte é infraestrutura e o significado do evento
pertence à feature que o consome.

### Correspondência com o backend

| Backend | Frontend |
| --- | --- |
| `domain/<domínio>` | `src/features/<domínio>/models`, `types`, `schemas` |
| `business/<domínio>` | `src/features/<domínio>/services` |
| `persistence/` | repositórios dentro da própria feature |
| `core/realtime` | `src/infrastructure/realtime` + hooks/contexts da feature consumidora |
| `web/controllers` e `web/models` | `app/` + `features/<domínio>/components` |
| `core/` | `src/core/` |
| `security/` | `src/core/auth` + `src/infrastructure` |

## Core e infraestrutura

O princípio é:

```text
core define o que a aplicação precisa
infrastructure define como isso é executado
features definem por que e quando isso é usado
```

### Responsabilidades recomendadas

| Área | Responsabilidade |
| --- | --- |
| `core/auth`, `core/http`, `core/realtime`, `core/errors` | regras e contratos globais |
| `infrastructure/http` | cliente HTTP e configuração de transporte |
| `infrastructure/realtime` | SSE, WebSocket, reconexão e heartbeat |
| `infrastructure/storage` | cookies, localStorage e sessionStorage |

Repositórios e persistência ficam dentro da própria feature. Não criar uma camada global de
repositórios em `infrastructure` enquanto não houver uma necessidade concreta compartilhada.

Uma página em `app/` deve ser fina: buscar parâmetros, compor providers e renderizar componentes
da feature. Regra de negócio não deve ser criada dentro de `page.tsx`, `layout.tsx` ou
`route.ts`.

## Dependência entre camadas

```text
app → features → infrastructure
  ↘ shared ← core
```

- `shared` não importa features, `app` ou detalhes de infraestrutura.
- Uma feature pode usar `shared`, `core` e contratos de `infrastructure`, mas outra feature não
  deve importar arquivos internos dela. Compartilhe um contrato em `shared` ou extraia um domínio.
- `infrastructure` contém integrações técnicas; o domínio não deve depender de SDKs diretamente.
- `infrastructure/realtime` contém somente o transporte e a integração externa de eventos, como
  conexão SSE/WebSocket, reconexão, parsing do evento e encerramento da conexão.
- `core` pode ser usado por todas as camadas, mas não deve virar um depósito de componentes de
  uma feature.
- Imports usam o alias `@/` configurado no `tsconfig.json`; prefira imports por arquivo explícito.

## Component-Driven Development

1. Comece pelo contrato visual (props, estados de loading/erro/vazio e acessibilidade).
2. Crie componentes pequenos e composáveis em `shared/components` quando forem agnósticos.
3. Coloque composição com regra de negócio em `features/<nome>/components`.
4. Os componentes de `shared/components/ui` devem permanecer genéricos; não recebem entidades
   de uma feature.
5. Estados e variações importantes devem ser testáveis sem depender de uma página inteira.

## Testes

Testes ficam colocalizados com o arquivo testado, usando o sufixo `.test`:

```text
src/features/team/services/create-team.ts
src/features/team/services/create-team.test.ts

src/shared/components/team-card.tsx
src/shared/components/team-card.test.tsx
```

Use testes unitários para funções, schemas, services e hooks; testes de componente para
interações e acessibilidade; e reserve `src/tests` para setup, mocks compartilhados e cenários
cross-feature. Não crie uma pasta `tests` dentro de cada feature apenas para agrupar testes.

## Rotas e páginas

Os grupos em `app/` são apenas uma convenção inicial. Adicione uma pasta de rota quando existir
uma tela real e remova o `.gitkeep` correspondente. O `app/page.tsx` atual continua sendo a rota
raiz até que a home seja movida para um grupo de rotas.
