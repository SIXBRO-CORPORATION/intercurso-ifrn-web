# shadcn/ui

## O que é

shadcn/ui não é uma dependência de componentes fechada. A CLI copia componentes acessíveis e
customizáveis para o projeto. O código passa a ser nosso, permitindo ajustar tokens, variantes e
comportamento sem esperar uma release externa. O projeto usa Tailwind CSS v4 e CSS variables,
compatíveis com essa abordagem.

## Configuração deste projeto

`components.json` já está preparado para:

- componentes em `src/shared/components`;
- primitivas geradas em `src/shared/components/ui`;
- utilitário `cn` em `src/shared/utils/cn`;
- TypeScript, React Server Components e estilo `new-york`;
- ícones Lucide.

O alias `@/*` aponta para a raiz de `app`, conforme `tsconfig.json`. O CSS global usado pela CLI
é `app/globals.css`.

## Instalação e configuração

Execute dentro de `app/`:

```bash
npm install class-variance-authority clsx tailwind-merge lucide-react
npx shadcn@latest init
```

Quando a CLI perguntar, mantenha TypeScript, Tailwind CSS, CSS variables e os aliases já
registrados em `components.json`. Como este projeto usa Tailwind v4, não crie `tailwind.config.js`
sem uma necessidade específica.

O arquivo `src/shared/utils/cn.ts` pode então conter o helper padrão:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Se a CLI perguntar pelo caminho do CSS, informe `app/globals.css`; para componentes, informe
`src/shared/components`; para utilitários, `src/shared/utils`; e para hooks, `src/shared/hooks`.
Como o Tailwind está na versão 4, mantenha o campo `config` vazio e não crie
`tailwind.config.js` apenas para satisfazer a CLI.

## Adicionando componentes

```bash
npx shadcn@latest add button card dialog form input label
```

Os arquivos serão criados em `src/shared/components/ui`. Revise o código gerado, aplique os
tokens institucionais em `app/globals.css` e só então use o componente numa feature:

```tsx
import { Button } from "@/shared/components/ui/button";
```

Componentes de negócio não devem ser adicionados à pasta `ui`. Componha um componente específico
em `src/features/<feature>/components` usando os primitivos compartilhados.

## Regras de uso

1. Não editar `node_modules` nem depender de componentes remotos em runtime.
2. Não copiar manualmente o mesmo primitive para uma feature.
3. Manter `Button`, `Input`, `Dialog` e equivalentes agnósticos de domínio.
4. Preservar acessibilidade e os estados de foco, disabled, erro e loading.
5. Atualizar dependências com o gerenciador do projeto e executar lint/build depois de adicionar
   componentes.
6. Quando personalizar um componente gerado, registrar a decisão nos tokens ou na documentação
   de design system, não em estilos inline espalhados.

## Fluxo recomendado

1. Definir o token visual em `app/globals.css`.
2. Adicionar o primitive com a CLI.
3. Revisar tipos, acessibilidade e variantes.
4. Compor a UI específica dentro da feature.
5. Validar `npm run lint` e `npm run build`.

## Instalação resumida

```bash
cd app
npm install class-variance-authority clsx tailwind-merge lucide-react
npx shadcn@latest init
npx shadcn@latest add button
npm run lint
npm run build
```

O `init` configura o projeto, mas não instala todos os componentes. Cada comando `add` copia os
arquivos do componente solicitado para o repositório; revise e versione esse código junto com a
aplicação.
