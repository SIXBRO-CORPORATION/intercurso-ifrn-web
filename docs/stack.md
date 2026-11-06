# Stack

Bibliotecas efetivamente instaladas (`app/package.json`) e onde cada uma é usada. Biblioteca nova só
entra com necessidade clara e deve ser registrada aqui.

## Resumo

| Biblioteca | Versão | Função | Onde |
| --- | --- | --- | --- |
| Next.js | 16.2 | framework, App Router, `proxy.ts` | `app/app/`, `app/proxy.ts` |
| React | 19.2 | UI | tudo |
| TypeScript | 5 (`strict`) | tipagem | tudo |
| Tailwind CSS | 4 | estilo por tokens em CSS | `app/app/globals.css` |
| shadcn + `radix-ui` | CLI 4 | primitivos de UI | `src/shared/components/ui/` |
| class-variance-authority | 0.7 | variantes de componente | `ui/` |
| `cn`, clsx, tailwind-merge | — | merge de classes (`cn` via `@/lib/utils`) | UI |
| tw-animate-css | — | animações dos primitivos | `globals.css` |
| lucide-react | 1.x | ícones | UI |
| axios | 1.x | HTTP | `src/lib/axios.ts`, `repositories/` |
| @tanstack/react-query | 5 | cache e estado de servidor | `hooks/` das features, `lib/query-provider.tsx` |
| zod | 4 | validação de API e formulários | `schemas/` |
| react-hook-form + @hookform/resolvers | 7 / 6 | formulários | `components/` das features |
| date-fns | 4 | datas | utils |
| react-day-picker | 10 | calendário | `ui/calendar`, `ui/date-picker` |
| Vitest | 3 | testes | `*.test.ts(x)` |
| Testing Library (`react`, `dom`, `user-event`) | — | testes de componente | `*.test.tsx` |
| jsdom | 26 | ambiente DOM dos testes | projeto `components` |
| ESLint (`eslint-config-next`) | 9 | lint | `eslint.config.mjs` |
| Husky + lint-staged | — | pré-commit | `.husky/`, `package.json` |

Não instalados (não presumir existência): MSW, Playwright, Redux/Zustand, Jest.

## Uso por tema

### HTTP — axios

- `api` (`@/lib/axios`): `baseURL` de `NEXT_PUBLIC_API_URL`, Bearer automático e renovação em 401.
  Usada **somente** em `repositories/` e no cliente realtime.
- `authHttp`: cookies + `validateStatus: () => true`; exclusiva de `features/auth/services`.
- `/api/*` é reescrito para o backend em `next.config.ts` (`NEXT_API_URL`, padrão
  `http://localhost:8000`; no Docker, `http://api:8000`).

### Cache — TanStack Query

Estado de servidor vive no cache; não duplicar em `useState`/Context. Padrões globais:
`retry: false`, `staleTime: 30_000`, `refetchOnWindowFocus: false`. Chaves de query definidas nos
hooks da feature. Ver `ARCHITECTURE.md`.

### Validação — Zod 4

- Toda resposta da API passa por `schema.parse` no repositório.
- Envelope padrão: `envelopeSchema(data)` (`@/shared/schemas/envelope-schema`).
- Formulários: schema em `schemas/` da feature com `react-hook-form` + `zodResolver`
  (ex.: `match-filters-schema.ts`).
- Tipos de domínio derivam do schema (`z.infer`).

### Datas

`date-fns` para formatação; helpers de ISO em `src/lib/iso-date.ts`. Evitar `moment`/`dayjs`.

### Realtime

Sem biblioteca: `EventSource` nativo encapsulado em `infrastructure/realtime`. Ver `REALTIME.md`.

### Testes — Vitest

Config em `app/vitest.config.ts` (a `vitest.config.mts` é redundante e não é usada). Projetos `unit`
(node, `src/**/*.test.ts`) e `components` (jsdom, `src/**/*.test.tsx`, setup em `src/tests/setup.ts`).
Convenções em `CONVENTIONS.md`.

### Next.js 16

Diferenças relevantes frente a versões anteriores: `proxy.ts` substitui `middleware.ts`; `params` e
`searchParams` são `Promise`. Documentação do framework instalado em
`app/node_modules/next/dist/docs/` — prevalece sobre conhecimento prévio.

## Variáveis de ambiente

| Variável | Onde | Função |
| --- | --- | --- |
| `NEXT_API_URL` | `next.config.ts` (servidor) | destino do rewrite de `/api/*` |
| `NEXT_PUBLIC_API_URL` | `src/lib/axios.ts` (cliente) | `baseURL` do axios |

Não ler `process.env` fora desses pontos; configuração de ambiente nova vai para `src/config/`.
