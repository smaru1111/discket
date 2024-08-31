# ビルドステージ
FROM node:18-alpine AS builder
ENV NODE_ENV=development
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY prisma ./
RUN yarn run prisma generate
COPY . .
RUN yarn build && rm -rf node_modules

# ランナーステージ
FROM node:18-alpine AS runner
ENV NODE_ENV=development
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package.json yarn.lock ./
COPY prisma ./prisma
COPY start.sh ./
RUN yarn install --production && chmod +x ./start.sh
CMD ["./start.sh"]