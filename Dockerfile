FROM node:14-alpine

WORKDIR /app

COPY package*.json ./
COPY .next ./.next
COPY public ./public

RUN npm ci --only=production

EXPOSE 3000

CMD ["npm", "start"]
