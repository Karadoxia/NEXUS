FROM node:20-alpine
WORKDIR /app

# Install all deps (including dev — needed for next build / TypeScript)
COPY package*.json ./
RUN npm ci

# Copy source then generate Prisma client (needs schema.prisma)
COPY . .
RUN npx prisma generate

# Provide placeholder env vars for services that throw at import time when
# their key is missing. No real connections are made during the build —
# actual values are injected at container runtime via docker-compose.
ARG DATABASE_URL=postgresql://build:build@placeholder:5432/build
ARG RESEND_API_KEY=re_placeholder_build_key
ENV DATABASE_URL=$DATABASE_URL
ENV RESEND_API_KEY=$RESEND_API_KEY

# Build Next.js
RUN npm run build

# Remove dev dependencies to shrink the final image
RUN npm prune --omit=dev

EXPOSE 3030
CMD ["npm", "start"]
