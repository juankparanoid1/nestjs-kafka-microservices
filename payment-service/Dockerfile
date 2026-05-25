# ===== Build Stage =====
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


# ===== Runtime Stage =====
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

#only prod dependencies
RUN npm install --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 8080

CMD ["node", "dist/main"]