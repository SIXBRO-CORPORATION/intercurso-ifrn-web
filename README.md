# Intercurso IFRN Web

Frontend do Intercurso IFRN, feito com Next.js (App Router), TypeScript e Tailwind CSS.

## Como rodar

> **Lembre-se de rodar o Docker do backend antes.**
> O compose do backend cria a rede `intercurso` e o serviço `api`, dos quais o frontend depende. Sem ele, o frontend não sobe e as chamadas a `/api/*` falham.
>
> Backend: [intercurso-ifrn-backend](https://github.com/SIXBRO-CORPORATION/intercurso-ifrn-backend)

1. Suba o backend seguindo o README dele.
2. No diretório raiz deste repositório:

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

3. Acesse http://localhost:3000.

O código de `app/` é montado dentro do container, então o hot reload funciona ao salvar os arquivos. Depois de reiniciar a máquina, o container volta sozinho junto com o Docker.

## Comandos úteis

```bash
docker compose -f docker-compose.dev.yml logs -f web
docker compose -f docker-compose.dev.yml restart web
docker compose -f docker-compose.dev.yml down
```

Ao mudar `package.json` ou `package-lock.json`, reconstrua renovando os volumes:

```bash
docker compose -f docker-compose.dev.yml up -d --build -V
```

Ao mudar `next.config.ts`, rode o `restart web` acima.

## Usando WSL

Mantenha o clone do repositório dentro do filesystem do WSL (`~/...`), não em `/mnt/c/...`. Fora dele o hot reload não funciona. No Docker Desktop, habilite a sua distro em Settings → Resources → WSL Integration.

## Branches

- `develop`: desenvolvimento.
- `main`: produção (deploy pela Vercel).

Todo PR para `develop` ou `main` roda lint, typecheck, testes e build no GitHub Actions.
