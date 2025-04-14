# backend/Dockerfile

# ---- Base Node ----
FROM node:18-alpine AS base
WORKDIR /app
# Install pnpm globally
RUN npm install -g pnpm

# ---- Dependencies ----
FROM base AS deps
# Copy only package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false # Install all deps including dev for build/prisma
# Generate Prisma Client (needs schema)
COPY prisma ./prisma
RUN pnpm exec prisma generate

# ---- Build ----
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build TypeScript code
RUN pnpm build

# ---- Production ----
FROM node:18-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
# Install pnpm globally again for production image
RUN npm install -g pnpm
# Copy production dependencies only
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=true 
# Copy Prisma Client and schema (needed at runtime)
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma
# Copy built application code
COPY --from=build /app/build ./build
# Copy production node_modules (smaller than dev)
COPY --from=deps /app/node_modules ./node_modules 

EXPOSE 3000 

# Default command to run the application
# Note: Migrations should ideally be run separately or via an entrypoint script
CMD [ "node", "build/index.js" ]
