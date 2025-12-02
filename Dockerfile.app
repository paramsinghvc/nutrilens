# Dockerfile.app

# Step 1: Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --frozen-lockfile
COPY . .
RUN npm run build

# Step 2: Production image
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev --frozen-lockfile
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 8087
CMD ["npm", "start"]