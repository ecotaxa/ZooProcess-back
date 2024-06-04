ARG NODE_VERSION

FROM node:${NODE_VERSION}

RUN mkdir /app
WORKDIR /app
# COPY package*.json ./
COPY ["package.json", "package-lock.json", "./"]
COPY .env ./.env
COPY prisma ./prisma/

RUN npm run deps && npm i
RUN npm i -g prisma

COPY . .

RUN npx prisma generate --schema ./prisma/schema.prisma
RUN npx prisma db push


EXPOSE 8080
RUN npm start

