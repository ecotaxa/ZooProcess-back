ARG NODE_VERSION

FROM node:${NODE_VERSION}

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm run deps && npm i
COPY . .
EXPOSE 8080
RUN npx prisma generate
RUN npx prisma db push
RUN npm start

