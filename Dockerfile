FROM node:20.5.1
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm run deps && npm i
COPY . .
EXPOSE 8080
RUN npx prisma generate
RUN npx prisma db push
RUN npm start
