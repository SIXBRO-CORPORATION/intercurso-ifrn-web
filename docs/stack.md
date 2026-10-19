# Stack Tecnológica — Intercurso IFRN Web

Este documento lista as bibliotecas escolhidas para o projeto, o motivo da escolha e onde cada uma se encaixa na arquitetura (ver `ARCHITECTURE.md`).

## Base

| Tecnologia | Função |
|---|---|
| **Next.js** | Framework React, roteamento via file-based routing |
| **TypeScript** | Tipagem estática |

## Requisições HTTP e cache

### axios
Cliente HTTP usado para todas as chamadas à API. Configuração centralizada (instância, interceptors de erro/token) fica em `src/lib/`, o uso efetivo para comunicação externa fica em `src/infrastructure/`.

### react-query (TanStack Query)
Gerencia cache, loading, revalidação e sincronização de dados assíncronos vindos da API. Evita a necessidade de estado global manual para dados de servidor (ex: Redux) — resolve cache, refetch automático, invalidação e deduplicação de requisições.

**Onde usar:** hooks de features (`src/features/*/hooks`) ou `src/shared/hooks`, encapsulando chamadas do `axios`/`src/infrastructure`.

## Validação

### zod
Biblioteca de validação e definição de schemas com inferência de tipos TypeScript. Usada para:
- Validar dados vindos da API antes de consumir
- Validar formulários (junto com `react-hook-form`)
- Validar variáveis de ambiente

**Onde usar:** `src/shared/schemas/`.

## Formulários

### react-hook-form
Gerenciamento de formulários com alta performance (evita re-render em cada tecla) e baixo boilerplate. Integrado ao Zod via `@hookform/resolvers/zod`, reaproveitando os mesmos schemas de validação.

**Onde usar:** dentro de cada feature (`src/features/*/components`), com schemas vindos de `src/shared/schemas`.

## Datas

### date-fns
Manipulação e formatação de datas de forma modular (importa só as funções usadas, ao invés de uma lib monolítica como moment.js).

**Onde usar:** `src/shared/utils/` para helpers de formatação reutilizados entre features.

## Ícones

### lucide-icons (lucide-react)
Biblioteca de ícones SVG, leve e com boa cobertura. Padrão usado também pelo shadcn/ui, caso essa lib de componentes seja adotada futuramente.

**Onde usar:** diretamente em `src/shared/components/` e nos componentes de `src/features/`.

## Testes

### Vitest
Test runner para testes unitários e de integração. Substituto mais rápido do Jest, com boa integração nativa ao ecossistema Vite/Next.

**Onde usar:** colocalizado com o código (`Componente.test.tsx` ao lado de `Componente.tsx`) ou em `tests/` para testes que não são colocalizados (ex: testes de integração cross-feature).

### Playwright
Testes end-to-end (e2e), simulando interação real do usuário no navegador.

**Onde usar:** `tests/e2e/`.

### MSW (Mock Service Worker)
Intercepta requisições HTTP (axios/fetch) e devolve respostas mockadas, tanto em testes quanto em desenvolvimento local. Permite testar componentes que dependem de API sem precisar de backend real rodando.

**Onde usar:**
- `tests/mocks/handlers.ts` — definição dos mocks de rota
- `tests/mocks/server.ts` — setup do servidor mock (Node, para Vitest)
- `tests/mocks/browser.ts` — setup do worker mock (browser, para Playwright/dev)

**Fluxo de testes:**
```
Vitest (unitário/integração) → MSW (Node) → simula resposta da API
Playwright (e2e)             → MSW (browser) → simula resposta da API
```

## Resumo por camada da arquitetura

| Camada | Libs relacionadas |
|---|---|
| `src/infrastructure/` | axios, react-query (chamadas reais à API) |
| `lib/` | configuração do axios (instância), configuração do QueryClient |
| `src/shared/schemas/` | zod |
| `src/shared/utils/` | date-fns |
| `features/*/components` | react-hook-form, lucide-react |
| `tests/` | vitest, playwright, msw |
