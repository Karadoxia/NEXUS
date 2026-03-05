FROM node:20-alpine
WORKDIR /app

# Install all deps (including dev — needed for next build / TypeScript)
COPY package*.json ./
RUN npm ci

# Provide placeholder env vars for services that throw at import time when
# their key is missing. No real connections are made during the build —
# actual values are injected at container runtime via docker-compose.
ARG DATABASE_URL=postgresql://build:build@placeholder:5432/build
ARG HR_DATABASE_URL=postgresql://build:build@placeholder:5432/build_hr
ARG AI_DATABASE_URL=postgresql://build:build@placeholder:5432/build_ai
ARG INFRA_DATABASE_URL=postgresql://build:build@placeholder:5432/build_infra
ARG RESEND_API_KEY=re_placeholder_build_key
ENV DATABASE_URL=$DATABASE_URL
ENV HR_DATABASE_URL=$HR_DATABASE_URL
ENV AI_DATABASE_URL=$AI_DATABASE_URL
ENV INFRA_DATABASE_URL=$INFRA_DATABASE_URL
ENV RESEND_API_KEY=$RESEND_API_KEY

# Copy source then generate Prisma client for main schema
COPY . .
RUN npx prisma generate --schema=prisma/schema.prisma

# Build Next.js
RUN npm run build

# Remove dev dependencies to shrink the final image
RUN npm prune --omit=dev

EXPOSE 3030
CMD ["npm", "start"]
