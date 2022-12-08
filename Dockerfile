FROM node:16-alpine
WORKDIR /app/server
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
