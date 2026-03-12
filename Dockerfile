FROM node:20-alpine AS base

WORKDIR /app

COPY package.json tsconfig.json ./
COPY src ./src

RUN npm install

RUN npm run build

FROM node:20-alpine AS runtime

WORKDIR /app

COPY --from=base /app/dist ./dist
COPY package.json ./

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]

