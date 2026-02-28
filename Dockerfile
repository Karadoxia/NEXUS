FROM node:20-alpine
WORKDIR /app

# Install all deps (including dev — needed for next build / TypeScript)
COPY package*.json ./
RUN npm ci

# Copy source then generate Prisma client (needs schema.prisma)
COPY . .
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Remove dev dependencies to shrink the final image
RUN npm prune --omit=dev

EXPOSE 3030
CMD ["npm", "start"]
