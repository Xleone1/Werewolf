# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /app

# Alpine ships OpenSSL 3.x, but Prisma's engine detection at `prisma generate` time falls back to
# openssl-1.1.x when the openssl binary isn't present in the build stage - producing a client whose
# query engine doesn't match the runtime (`linux-musl-arm64-openssl-3.0.x`) and crashing the app on
# startup. Installing it in `base` keeps every stage (deps/build/prod-deps/runtime) consistent and
# works on both x86_64 and arm64 without hardcoding an architecture in `binaryTargets`.
RUN apk add --no-cache openssl

# ---- deps: install all dependencies (needed to compile TS + generate Prisma client)
FROM base AS deps
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci

# ---- build: compile TypeScript and generate the Prisma client
FROM deps AS build
COPY tsconfig.json ./
COPY src ./src
RUN npx prisma generate
RUN npm run build

# ---- prod-deps: production-only node_modules (smaller final image)
FROM base AS prod-deps
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci --omit=dev
RUN npx prisma generate

# ---- runtime: minimal final image
FROM base AS runtime
RUN apk add --no-cache openssl
ENV NODE_ENV=production
RUN addgroup -S werewolf && adduser -S werewolf -G werewolf

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY prisma ./prisma
COPY locales ./locales
COPY assets ./assets
COPY package.json ./
COPY docker-entrypoint.sh ./
RUN chmod +x ./docker-entrypoint.sh && chown -R werewolf:werewolf /app

EXPOSE 4000

USER werewolf

ENTRYPOINT ["./docker-entrypoint.sh"]
