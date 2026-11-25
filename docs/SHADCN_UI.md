# UI: shadcn/ui, tokens e design system

Regras para criar e estilizar componentes. Estrutura de pastas em `ARCHITECTURE.md`.

## Resumo operacional

- Tailwind CSS 4 com tokens em CSS (`app/app/globals.css`). **Não existe** `tailwind.config.js`; não
  criar.
- Cores, raios, sombras e tipografia vêm de tokens semânticos. Proibido hex, `rgb()` e classes de
  paleta crua (`bg-green-600`, `text-neutral-500`) em JSX novo.
- Primitivos shadcn ficam em `src/shared/components/ui/` e são código do projeto (editáveis). Não
  recebem entidades de domínio.
- `cn` (merge de classes) vem de `@/lib/utils`.
- Referência visual das telas: <https://claude.ai/artifact/BGjB6wgKdurEECsmVbVmPw#web>.

## Estado do shadcn neste projeto

`app/components.json`:

| Campo | Valor |
| --- | --- |
| `style` | `radix-nova` |
| `rsc` | `true` |
| `tailwind.config` | vazio (Tailwind 4) |
| `tailwind.css` | `app/globals.css` |
| `tailwind.cssVariables` | `true`, `baseColor: neutral` |
| `iconLibrary` | `lucide` |
| `aliases.components` / `ui` | `@/shared/components` / `@/shared/components/ui` |
| `aliases.lib` / `hooks` | `@/lib` / `@/shared/hooks` |
| `aliases.utils` | `@/shared/utils/cn` — **caminho inexistente** |

Divergências conhecidas (atenção ao usar a CLI):

- O helper `cn` real é `export { cn } from "cn"` em `src/lib/utils.ts` (pacote npm `cn`). Os
  primitivos de `ui/` e vários componentes importam `cn` diretamente de `"cn"`; código novo usa
  `@/lib/utils`. Componentes gerados pela CLI trazem `@/shared/utils/cn`: corrigir o import para
  `@/lib/utils` (ou ajustar `aliases.utils` no `components.json` para `@/lib/utils`).
- Os primitivos existentes foram **adaptados** ao design do produto (botão pill, variantes
  próprias). Não regenerar por cima com `shadcn add --overwrite`.
- `Slot` vem de `radix-ui` (`import { Slot } from "radix-ui"`).

### Primitivos presentes em `ui/`

`alert`, `avatar`, `badge`, `button`, `calendar`, `card` (`Card`, `CardHeader`), `chip`,
`date-picker`, `dialog`, `empty`, `field-class` (classes comuns de campo), `popover`, `skeleton`,
`tabs`. Verificar a pasta antes de adicionar algo para evitar duplicação.

Variantes existentes:

| Componente | Variantes |
| --- | --- |
| `Button` `variant` | `default`, `secondary` (contorno), `ghost`, `danger`, `danger-ghost` |
| `Button` `size` | `default` (h-9), `sm`, `lg`, `icon`, `icon-sm` |
| `Badge` `variant` | `neutral`, `success`, `warning`, `danger`, `live` |
| `Alert` `variant` | `default`, `destructive`, `success`, `warning` |
| `Avatar` `tone` / `size` | `crest`, `brand` / `xs`, `sm`, `default`, `lg` |
| `TabsList` `variant` | `underline` (padrão), `pill` |

`Button` aceita `asChild` (renderiza o filho, p.ex. `<Link>` ou `<a>`).

## Tokens (`app/app/globals.css`)

O tema é único e **escuro**. Blocos: `:root` (valores), `@theme inline` (mapeia variáveis para
utilitários Tailwind), `@theme` (raios e sombras) e `@utility` para a escala tipográfica.

### Cores semânticas

Camadas, da mais funda à mais elevada: `bg-chrome` (barras e menus) → `bg-background` (página) →
`bg-card` → `bg-muted` (hover) → `bg-selected`.

| Uso | Utilitários |
| --- | --- |
| Texto | `text-foreground`, `text-text-secondary`, `text-muted-foreground` |
| Superfícies auxiliares | `bg-sunken` (bloco dentro de cartão), `bg-popover` (diálogo), `bg-field` (campo) |
| Marca / ação primária | `bg-primary`, `text-primary-foreground`, `hover:bg-primary-hover`, `bg-primary-soft`, `text-primary-text` |
| Ao vivo | `text-live`, `bg-live` |
| Erro | `bg-destructive`, `bg-danger-soft`, `text-danger-text` |
| Aviso | `bg-warning`, `bg-warning-soft`, `text-warning-text` |
| Súmula | `bg-card-yellow`, `bg-card-red`, `bg-crest` (escudo) |
| Borda / foco / fundo de diálogo | `border-border`, `border-border-strong`, `border-input`, `ring-ring`, `bg-overlay` |

- Verde somente em ação primária, estado ativo e indicadores; nunca como fundo de área.
- Para nova cor: definir a variável em `:root`, mapear em `@theme inline` (`--color-<nome>`) e usar o
  utilitário. Nunca colocar o valor direto no componente.

### Raios, sombras

- Raios: `rounded-xs` (4px), `sm` (6px), `md` (8px), `lg` (12px, cartões); botões são `rounded-full`.
- Sombras: `shadow-toast`, `shadow-sheet` (diálogo e popover).

### Tipografia

Fonte Poppins (variável `--font-poppins`, carregada em `app/layout.tsx`, pesos 400/500/600/700). O
`body` já usa `type-body`. Escala por utilitários próprios:

`type-score`, `type-h1`, `type-h2`, `type-h3`, `type-body`, `type-small`, `type-overline`.

Título da tela: definido em `PAGES` (`features/shell/constants/nav.ts`) e renderizado pelo `AppShell`;
a tela não repete o `h1`.

### Foco

`focus-visible:ring-3 focus-visible:ring-ring` nos primitivos (anel claro). Elemento interativo novo
mantém foco visível; dentro de listas com borda recortada, usar também `focus-visible:ring-inset`.

## Componentes compartilhados (`src/shared/components/`)

`live-dot`, `request-states` (`ListSkeleton`, `ErrorState`, `EmptyState`). Entram aqui apenas
componentes sem domínio usados por duas ou mais features. Componente com regra de domínio fica em
`features/<f>/components`.

## Adicionar um primitivo

```bash
cd app
npx shadcn@latest add <componente>
```

1. Conferir se já existe em `ui/` ou se `shared/components` resolve.
2. A CLI cria o arquivo em `src/shared/components/ui/`. Corrigir o import de `cn` (ver acima).
3. Trocar cores/raios padrão por tokens do projeto; alinhar variantes às existentes (pill, estados
   `disabled`, foco).
4. Manter genérico: sem props de domínio. Variante nova entra no `cva` do próprio primitivo.
5. Garantir acessibilidade: foco, estados `disabled`/erro/carregando, `aria-*` herdados do Radix.
6. Componente que depende de `radix-ui` usa o pacote único `radix-ui`.
7. Rodar `lint`, `typecheck`, `test` e `build`.

## Regras de uso

- Não editar `node_modules` nem depender de componente remoto em runtime.
- Não copiar um primitivo para dentro de uma feature; reutilizar ou estender o de `ui/`.
- Diferença só de aparência: variante ou `className`, não componente duplicado.
- Ícones: `lucide-react`, com `aria-hidden` quando decorativos; traço global em `svg.lucide`
  (`stroke-width: 2.2`).
- Responsivo mobile-first (breakpoints `sm:`/`md:`/`lg:`). Em `md` o `AppShell` troca a barra
  inferior pelo cabeçalho (visitante e aluno) ou pelo menu lateral (monitor).
- Texto de interface em pt-BR.

## Referência visual

O design vigente é o protótipo navegável em <https://claude.ai/artifact/BGjB6wgKdurEECsmVbVmPw#web> (não é código do projeto).
Consultar somente a tela que está sendo implementada ou ajustada.
