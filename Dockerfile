ARG NODE_VERSION

FROM node:${NODE_VERSION}

WORKDIR /usr/src/app
# COPY package*.json ./
COPY . .
RUN npm run deps && npm i
EXPOSE 8080
RUN npx prisma generate
RUN npx prisma db push
RUN npm start

