# syntax=docker/dockerfile:1
# Contexto de build = raiz do repositório; o projeto Next fica em app/.
FROM node:22-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Dependências (camada reaproveitada enquanto package*.json não mudar)
FROM base AS deps
COPY app/package.json app/package-lock.json ./
RUN npm ci

# ---- dev: hot reload (docker compose watch sincroniza o código) ----
FROM deps AS dev
COPY app/ .
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]

# ---- build de produção ----
FROM deps AS build
COPY app/ .
# O destino do proxy /api/* é fixado no build.
ARG NEXT_API_URL
ENV NEXT_API_URL=$NEXT_API_URL
RUN npm run build

# ---- prod: imagem final mínima (standalone) ----
FROM base AS prod
ENV NODE_ENV=production HOSTNAME=0.0.0.0 PORT=3000
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]