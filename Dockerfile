FROM node:20.16-alpine

WORKDIR /app

COPY package*.json ./

# RUN npm ci --only=production
RUN npm ci 

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
