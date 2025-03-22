# Stage 1: Builder (Install dependencies and build the application)
FROM node:18-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN sed -i 's/"include": \["src\/\*\*\/\*"\]/"include": \["src\/\*\*\/\*"\], "exclude": \["tests\/\*\*\/\*", "node_modules"\]/' tsconfig.json

RUN npm run build

# Stage 2: Production (Minimal image for deployment)
FROM node:18-alpine

WORKDIR /app

ARG ENV_FILE=.env.production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY swagger.json ./swagger.json
COPY ${ENV_FILE} ./.env

RUN npm ci --omit=dev && npm cache clean --force

EXPOSE 3000

CMD ["node", "dist/server.js"]