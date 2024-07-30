# Build stage
FROM node:14-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm ci
RUN npm run build
RUN npx prisma generate

# Production stage
FROM node:14-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
RUN npm ci --only=production
EXPOSE 3000
CMD ["npm", "start"]
