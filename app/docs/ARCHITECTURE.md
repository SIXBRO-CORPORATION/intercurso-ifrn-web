# Arquitetura do Projeto — Intercurso IFRN Web

Este documento descreve a organização de pastas em `src/`, o propósito de cada camada e as convenções adotadas no projeto.

## Stack

- **Framework:** Next.js (roteamento via file-based routing — não há pasta `routes/`)
- **Linguagem:** TypeScript

## Visão geral da estrutura

```
src/
├── assets/
├── components/
├── config/
├── constants/
├── contexts/
├── core/
├── features/
├── infrastructure/
├── lib/
├── shared/
│   ├── hooks/
│   ├── models/
│   ├── repositories/
│   ├── schemas/
│   ├── storage/
│   ├── types/
│   └── utils/
├── styles/
└── tests/
```

## Descrição das camadas

### `assets/`
Arquivos estáticos: imagens, ícones, fontes, SVGs e outros recursos consumidos pela aplicação.

### `components/`
Componentes de UI reutilizáveis e agnósticos de regra de negócio (botões, inputs, modais, cards). Não devem conter lógica de features específicas.

### `config/`
Configurações globais da aplicação: variáveis de ambiente tipadas, flags de feature, constantes de configuração de build/runtime.

### `constants/`
Valores fixos usados em múltiplos pontos da aplicação (enums, strings, valores numéricos fixos) que não se encaixam como configuração.

### `contexts/`
Providers e Context API globais (ex: `ThemeContext`, `AuthContext`). Usado para estado compartilhado entre a árvore de componentes sem prop drilling.

### `core/`
### `core/`
Núcleo da aplicação — concentra funcionalidades centrais e transversais que sustentam o funcionamento do sistema, mas que não pertencem a nenhuma feature específica.

Essa camada reúne responsabilidades como autenticação, gerenciamento da sessão do usuário, permissões, eventos globais da aplicação e outros serviços compartilhados por toda a aplicação.

Sugestão de subestrutura:

```text
core/
├── auth/         # autenticação, gerenciamento de tokens e sessão
├── permissions/  # regras de autorização e controle de acesso
```

### `features/`
Organização por domínio/funcionalidade (feature-based architecture). Cada feature encapsula sua própria lógica, espelhando parte da estrutura de `shared/`:
```
features/
└── auth/
    ├── components/
    ├── hooks/
    ├── services/
    └── types/
```
Isso mantém o código de cada funcionalidade coeso e fácil de localizar, remover ou isolar.

### `infrastructure/`
Toda comunicação com o mundo externo à aplicação:
- Chamadas de API (REST/GraphQL)
- WebSocket
- Browser APIs (localStorage, geolocation, notifications, etc.)
- Integrações com serviços externos
- Analytics
- Monitoramento (ex: Sentry, logging)

### `lib/`
Configuração e inicialização de bibliotecas de terceiros (ex: instância do Axios, QueryClient do React Query, configuração do Zod, etc.). Diferente de `infrastructure/`, aqui fica a **configuração** da lib; em `infrastructure/` fica o **uso** dela para comunicação externa.

### `shared/`
Código compartilhado entre múltiplas features, sem pertencer a nenhuma específica:

| Subpasta | Propósito |
|---|---|
| `hooks/` | Hooks customizados reutilizáveis (ex: `useDebounce`, `useMediaQuery`) |
| `models/` | Entidades e modelos de domínio |
| `repositories/` | Abstrações de acesso a dados (padrão repository) |
| `schemas/` | Schemas de validação (ex: Zod, Yup) |
| `storage/` | Abstrações de persistência local (localStorage, cookies, IndexedDB) |
| `types/` | Tipos e interfaces TypeScript compartilhados |
| `utils/` | Funções utilitárias puras (formatação, cálculos, helpers) |

### `styles/`
Estilos globais, temas, variáveis CSS/SCSS, configuração de design tokens.

### `tests/`
Testes que não são colocalizados com o código (ex: testes de integração, e2e, mocks e fixtures globais).

## Convenções gerais

- **Roteamento:** definido automaticamente pelo Next.js via estrutura de arquivos (`app/` ou `pages/`), não há pasta `routes/` dedicada.
- **Estado global:** priorizar Context API (`contexts/`) e React Query/SWR para estado de servidor. Uma lib de estado global (Redux/Zustand) só deve ser introduzida se a complexidade do estado compartilhado justificar.
- **Separação de responsabilidade:**
    - `components/` = UI pura, sem regra de negócio.
    - `features/` = regra de negócio e UI específica de domínio.
    - `infrastructure/` = comunicação externa.
    - `shared/` = código genérico reaproveitável entre features.