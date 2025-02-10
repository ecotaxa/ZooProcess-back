FROM node:21-alpine

WORKDIR /app

COPY package*.json ./

# RUN npm ci --only=production
# RUN npm ci 
# RUN npm install -g prisma
RUN npm install -g prisma && npx prisma init

COPY . .

#RUN npx prisma migrate deploy 
RUN npx prisma migrate dev

EXPOSE 8081

CMD ["npm", "start"]

