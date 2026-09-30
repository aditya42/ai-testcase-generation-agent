FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/core/package.json packages/core/package.json
RUN npm install
COPY apps/api apps/api
COPY packages/core packages/core
RUN npm run build -w packages/core && npm run build -w apps/api
EXPOSE 8080
CMD ["node","apps/api/dist/server.js"]
