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
- Referência visual das telas: `docs/visual-guidelines/` (PNGs).

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
- Os primitivos existentes foram **adaptados** ao design do produto (botão pill com gradiente,
  variantes próprias). Não regenerar por cima com `shadcn add --overwrite`.
- `Slot` vem de `radix-ui` (`import { Slot } from "radix-ui"`).

### Primitivos presentes em `ui/`

`alert`, `avatar`, `badge`, `button`, `calendar`, `card`, `chip`, `date-picker`, `dialog`, `empty`,
`field-class` (classes comuns de campo), `popover`, `progress`, `skeleton`. Verificar a pasta antes de
adicionar algo para evitar duplicação.

Variantes existentes (cva):

| Componente | Variantes |
| --- | --- |
| `Button` `variant` | `default`, `outline`, `soft`, `neutral`, `danger`, `danger-soft`, `warning`, `dark`, `ghost`, `link` |
| `Button` `size` | `default` (h-12), `lg`, `sm`, `icon`, `icon-sm`, `icon-lg` |
| `Badge` `variant` | `neutral`, `success`, `danger`, `warning`, `dark` |
| `Alert` `variant` | `default`, `destructive`, `success`, `warning` |

`Button` aceita `asChild` (renderiza o filho, p.ex. `<Link>` ou `<a>`).

## Tokens (`app/app/globals.css`)

Três blocos: `:root` (valores), `@theme inline` (mapeia variáveis para utilitários Tailwind) e
`@theme` (raios e sombras), além de `@utility` para a escala tipográfica.

### Cores semânticas

| Uso | Utilitários |
| --- | --- |
| Fundo da página / texto base | `bg-background`, `text-foreground` (`text-ink`) |
| Superfície / cartão | `bg-card` (`bg-surface`), `text-card-foreground` |
| Ação primária | `bg-primary`, `text-primary-foreground`, `text-primary-dark`, `bg-action`, `hover:bg-action-hover` |
| Tons suaves da marca | `bg-primary-soft`, `bg-primary-muted`, `bg-secondary`, `bg-accent` |
| Texto secundário / apagado | `text-muted-foreground`, `text-text-secondary`, `text-faint` |
| Campo / fundo neutro | `bg-field` (`bg-muted`) |
| Borda / input / foco | `border-border`, `border-input`, `ring-ring` |
| Erro | `text-destructive` (`text-danger`), `bg-danger-soft` |
| Aviso | `bg-warning`, `bg-warning-soft`, `text-warning-text` |
| Marca (legado, mapeado para os tokens acima) | `brand-50/100/200/500/600/700/800/900` |

- Verde da marca: `--primary` (`#2f9e41`); versão escura `--primary-dark`.
- Escala `brand-*` existe por compatibilidade (login). Preferir os tokens semânticos em código novo.
- Para nova cor: definir a variável em `:root`, mapear em `@theme inline` (`--color-<nome>`) e usar o
  utilitário. Nunca colocar o valor direto no componente.
- Modo escuro: há apenas `@custom-variant dark`; o tema é claro. Não depender de `dark:`.

### Raios, sombras, medidas

- Raios: `rounded-xs/sm/md/lg/xl/2xl` (0,5 → 1,875rem); `--radius` base 1rem.
- Sombras: `shadow-sm/md/lg`, `shadow-card`, `shadow-sheet`, `shadow-primary`.
- Medidas: `--sidebar-width`, `--topbar-height`, `--navbar-height`, `--container-public`.

### Tipografia

Fonte Poppins (variável `--font-poppins`, carregada em `app/layout.tsx`, pesos 400/500/700).
Escala por utilitários próprios, em vez de combinar `text-*`/`font-*`:

`type-large-title`, `type-title`, `type-heading`, `type-section`, `type-body-lg`, `type-body`,
`type-body-sm`, `type-label`, `type-caption`, `type-overline`, `type-button`, `type-score`,
`type-timer`, `type-display`, `type-h1`…`type-h4`.

Títulos de página: `PageHeader` (`@/shared/components/page-header`) usa `type-large-title`.

### Foco

`focus-visible:ring-3 focus-visible:ring-ring/40` nos primitivos, ou o utilitário `focus-ring`.
Elemento interativo novo mantém foco visível.

## Componentes compartilhados (`src/shared/components/`)

`back-button`, `live-dot`, `page-header`, `request-states` (`GridSkeleton`, `ErrorState`,
`EmptyState`), `reveal-item`. Entram aqui apenas componentes sem domínio usados por duas ou mais
features. Componente com regra de domínio fica em `features/<f>/components`.

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
- Responsivo mobile-first (breakpoints `sm:`/`md:`/`lg:`); o painel alterna barra superior e sidebar
  em `md`.
- Texto de interface em pt-BR.

## Referência visual

`docs/visual-guidelines/` contém imagens de referência (não são código):

| Pasta | Conteúdo |
| --- | --- |
| `00_design-system` | fundamentos, componentes, padrões, ícones e responsivo |
| `01_site-publico-e-aluno` | telas `W01`–`W13` (login, jogos, partida ao vivo, chaves, equipes, convite, perfil) |
| `02_painel-monitor` | telas `M01`–`M17` (painel, temporada, modalidades, equipes, chaveamento, console da partida) |
| `03_visao-geral` | mapas gerais das duas áreas |

Consultar a imagem correspondente (`Read` em PNG) somente ao implementar ou ajustar aquela tela.
