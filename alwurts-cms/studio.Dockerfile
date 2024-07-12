FROM node:18.17.1-alpine

WORKDIR /app

COPY  ./package.json ./

RUN npm install -g \
  pg \
  postgres \
  drizzle-kit \
  drizzle-orm
  
RUN npm install drizzle-orm

COPY ./drizzle.config.ts ./
COPY ./src/database/schema ./src/database/schema