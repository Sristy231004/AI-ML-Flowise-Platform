FROM node:18-alpine
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package*.json ./
RUN npm ci
COPY . .
# Copy schema file explicitly
COPY schema.prisma ./prisma/schema.prisma
# Generate Prisma client
RUN npx prisma generate
RUN npm run build
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080
CMD ["npm", "start"]