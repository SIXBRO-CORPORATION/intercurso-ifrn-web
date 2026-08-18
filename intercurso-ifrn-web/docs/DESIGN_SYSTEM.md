# Design System — Copa IFRN

Documentação fiel do estilo aplicado na interface. Toda a definição visual vive em
`src/styles.css` (Tailwind CSS v4, configuração CSS-first — **não existe `tailwind.config.js`**).
Componentes nunca usam cores literais (`text-white`, `bg-[#...]`); usam apenas tokens semânticos.

---

## 1. Conceito

- **Identidade**: institucional IFRN — verde como base de autoridade, vermelho como cor de ação
  competitiva (perigo/destaque/eventos), branco/papel como superfície de leitura.
- **Tom**: painel operacional esportivo. Tipografia condensada e pesada nos títulos, corpo neutro
  legível, dados e rotas de API em monoespaçada.
- **Regra de contraste**: vermelho nunca é usado como cor de fundo extensa; ele aparece em
  botões destrutivos, marcadores (`eyebrow`, contadores) e na borda-guia das seções.

---

## 2. Tipografia

Carregada via `<link>` no `head()` de `src/routes/__root.tsx` (Google Fonts), nunca via `@import`
de URL no CSS.

| Token | Família | Uso |
|---|---|---|
| `--font-display` | **Archivo** 600/700/800/900 | `h1`–`h4`, logotipo, numerais de etapa, `eyebrow` |
| `--font-sans` | **Barlow** 400/500/600/700 | corpo, botões, formulários (aplicado em `body`) |
| `--font-mono` | **JetBrains Mono** 400/600 | rotas de API, respostas JSON, rodapé técnico |

Ajustes base (`@layer base`):

```css
body      { font-family: var(--font-sans); -webkit-font-smoothing: antialiased; }
h1..h4    { font-family: var(--font-display); letter-spacing: -0.02em; }
```

Escala usada nas telas:

| Elemento | Classes |
|---|---|
| Título hero | `text-5xl font-extrabold leading-[1.05] md:text-6xl` |
| Título de página | `text-4xl font-extrabold md:text-5xl` |
| Título de seção | `text-xl font-bold` (`text-2xl` no painel) |
| Título de card | `text-base font-semibold` / `text-lg font-bold` |
| Texto de apoio | `text-sm text-muted-foreground` |
| Rótulo de campo | `text-xs font-semibold uppercase tracking-wide text-muted-foreground` |
| Código/rotas | `font-mono text-[11px]` |

---

## 3. Cores (oklch)

Definidas em `:root` e mapeadas em `@theme inline` (`--color-<nome>: var(--<nome>)`), o que gera as
utilitárias `bg-*`, `text-*`, `border-*`.

### Tema claro (`:root`)

| Token | Valor oklch | Papel |
|---|---|---|
| `--background` | `oklch(0.985 0.005 140)` | fundo geral, branco levemente esverdeado |
| `--foreground` | `oklch(0.19 0.03 155)` | texto principal |
| `--card` / `--popover` | `oklch(1 0 0)` | superfícies brancas puras |
| `--card-foreground` / `--popover-foreground` | `oklch(0.19 0.03 155)` | texto sobre superfícies |
| `--primary` | `oklch(0.46 0.12 155)` | **verde institucional** |
| `--primary-foreground` | `oklch(0.99 0.005 140)` | texto sobre verde |
| `--primary-deep` | `oklch(0.3 0.09 155)` | verde escuro (header, gradientes, PATCH) |
| `--secondary` | `oklch(0.95 0.02 150)` | verde muito claro (botão secundário, blocos JSON) |
| `--secondary-foreground` | `oklch(0.3 0.09 155)` | texto sobre verde claro |
| `--muted` | `oklch(0.955 0.01 150)` | fundo de código/rotas |
| `--muted-foreground` | `oklch(0.48 0.02 155)` | texto secundário |
| `--accent` / `--destructive` | `oklch(0.55 0.21 27)` | **vermelho competição** (ações destrutivas, marcadores) |
| `--accent-foreground` / `--destructive-foreground` | `oklch(0.99 0.01 40)` | texto sobre vermelho |
| `--border` / `--input` | `oklch(0.9 0.015 150)` | bordas e campos |
| `--ring` | `oklch(0.46 0.12 155)` | anel de foco (verde) |
| `--chart-1..5` | `0.46 0.12 155` · `0.55 0.21 27` · `0.65 0.12 150` · `0.75 0.15 80` · `0.3 0.09 155` | gráficos |
| `--sidebar` | `oklch(0.3 0.09 155)` | sidebar verde escura; `--sidebar-primary` é o vermelho |

> `--accent` **é igual** a `--destructive` por decisão de identidade: o vermelho é sempre sinal de
> ação forte, nunca decoração neutra.

### Tema escuro (`.dark`)

Fundo `oklch(0.17 0.03 155)`, superfícies `oklch(0.22 0.035 155)`, verde clareado para
`oklch(0.66 0.14 152)` e vermelho para `oklch(0.63 0.2 27)`; bordas em `oklch(1 0 0 / 12%)` e
inputs em `oklch(1 0 0 / 16%)`. Não há alternador de tema na interface.

---

## 4. Raio, sombras e gradientes

```css
--radius: 0.375rem;   /* base — cantos discretos, ar de painel técnico */
```

Derivados em `@theme inline`: `--radius-sm` (=`radius-4px`), `-md` (−2px), `-lg` (=radius),
`-xl` (+4px), `-2xl` (+8px), `-3xl` (+12px), `-4xl` (+16px).

```css
--gradient-pitch: linear-gradient(135deg, var(--primary-deep), var(--primary));
--gradient-heat:  linear-gradient(120deg, var(--primary-deep) 0%, var(--primary) 55%, var(--accent) 130%);

--shadow-card: 0 1px 0 0 color-mix(in oklab, var(--primary) 8%, transparent),
               0 12px 32px -22px color-mix(in oklab, var(--primary-deep) 60%, transparent);
--shadow-lift: 0 18px 40px -24px color-mix(in oklab, var(--primary-deep) 70%, transparent);
```

- `gradient-pitch` → cabeçalho fixo.
- `gradient-heat` → hero da home (verde escuro → verde → vermelho na quina, o "jogo de cores").
- `shadow-card` → repouso; `shadow-lift` → hover de cards e links.

---

## 5. Utilitárias customizadas (`@utility`)

| Utilitária | Definição | Onde é usada |
|---|---|---|
| `surface` | `bg-card` + `1px solid var(--color-border)` + `--radius-xl` + `--shadow-card` | todo card de ação, cards de área |
| `gradient-pitch` | aplica `--gradient-pitch` | `SiteHeader` |
| `gradient-heat` | aplica `--gradient-heat` | hero da home |
| `field-lines` | `repeating-linear-gradient` 90°, faixa de 1px a cada 64px em branco 6% | sobreposta ao header e ao hero (marcação de campo) |
| `eyebrow` | Archivo 700, `0.6875rem`, `letter-spacing .18em`, caixa alta | rótulos acima dos títulos |
| `page-shell` | `margin-inline:auto; max-width:80rem; padding-inline:1.5rem` | header, footer, hero, seções da home |
| `page-body` | `page-shell` + `padding-block:2.5rem` + `flex column` + `gap:3rem` | corpo das páginas Times/Temporada/Chaveamento/Mesa |

---

## 6. Componentes de estilo

### `src/components/page-header.tsx`
- `PageHeader`: faixa branca (`bg-card`) com borda inferior; `eyebrow` em vermelho, título
  `text-4xl md:text-5xl`, descrição `text-muted-foreground`, slot `aside` à direita.
- `SectionTitle`: título com **barra vermelha à esquerda** (`border-l-4 border-accent pl-3`) e nota
  em `text-sm text-muted-foreground`.

### `src/components/method-tag.tsx`
Etiqueta monoespaçada `text-[10px] font-bold tracking-widest`, cor por verbo:

| Método | Estilo |
|---|---|
| `GET` | `bg-secondary text-secondary-foreground` (verde claro) |
| `POST` | `bg-primary text-primary-foreground` (verde) |
| `PATCH` | `bg-primary-deep text-primary-foreground` (verde escuro) |
| `DELETE` | `bg-destructive text-destructive-foreground` (vermelho) |

### `src/components/action-form.tsx`
- `ActionCard`: `surface p-5`, hover → `shadow-lift`; cabeçalho com título + `MethodTag`; rota em
  `bg-muted font-mono text-[11px]`; grade de campos `grid-cols-2 gap-3` (`half` ocupa 1 coluna);
  botão `default` (verde) ou `destructive` (vermelho) conforme `tone`; resposta em
  `bg-secondary font-mono text-[11px]` com `max-h-44 overflow-auto`.
- `ActionGrid`: `grid gap-5 md:grid-cols-2 xl:grid-cols-3`.

### `src/components/site-header.tsx`
`sticky top-0 z-40`, `gradient-pitch field-lines`, texto `text-primary-foreground`. Links de nav em
`text-primary-foreground/75`, estado ativo `bg-primary-foreground/15`. Botão de login/logout usa
`variant="destructive"` (vermelho) para contrastar com o verde. Menu móvel abaixo de `md`.

### `src/routes/index.tsx`
Hero em `gradient-heat field-lines` com grade `lg:grid-cols-[1.3fr_1fr]`; cartão de status em
`bg-primary-foreground/10` + `backdrop-blur` + borda `primary-foreground/20`. Cards de área em
`surface` com `hover:-translate-y-1`. Faixa de etapas com numerais `font-display text-4xl
font-black text-primary/25`.

---

## 7. Espaçamento e grade

- Largura máxima de conteúdo: **80rem (1280px)**; respiro lateral fixo **24px** (`page-shell`).
- Distância entre seções: **48px** (`gap-3rem` do `page-body`); padding vertical de página: **40px**.
- Grade de cards: 1 coluna (mobile) → 2 (`md`) → 3 (`xl`); áreas da home vão a 4 colunas em `xl`.
- Gap padrão entre cards: **20px** (`gap-5`); entre campos de formulário: **12px** (`gap-3`).

---

## 8. Movimento

Somente transições curtas de CSS, sem biblioteca de animação:
`transition-shadow` nos cards de ação, `transition-all hover:-translate-y-1` nos cards de área,
`transition-colors` nos links do menu. Feedback de requisição via `sonner` (`<Toaster position="top-right" richColors />`).

---

## 9. Regras de manutenção

1. Nova cor → declarar em `:root` **e** `.dark`, registrar em `@theme inline` como `--color-<nome>`.
2. Nada de `text-white`, `bg-black` ou hex em `className`: usar tokens.
3. Padrão visual repetido → virar `@utility` em `src/styles.css`, não classe copiada.
4. Toda cor em **oklch**.
5. Fontes novas entram por `<link>` no `head()` do `__root.tsx` e viram token `--font-*`.
