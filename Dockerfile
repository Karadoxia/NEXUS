FROM node:20-alpine
WORKDIR /app

# Install all deps (including dev — needed for next build / TypeScript)
COPY package*.json ./
RUN npm ci

# Copy source then generate Prisma client (needs schema.prisma)
COPY . .
RUN npx prisma generate

# Provide a placeholder DATABASE_URL so Prisma doesn't throw at import time
# during Next.js static-generation ("collect page data"). No actual DB
# connection is made during the build — the real value is injected at runtime.
ARG DATABASE_URL=postgresql://build:build@placeholder:5432/build
ENV DATABASE_URL=$DATABASE_URL

# Build Next.js
RUN npm run build

# Remove dev dependencies to shrink the final image
RUN npm prune --omit=dev

EXPOSE 3030
CMD ["npm", "start"]
