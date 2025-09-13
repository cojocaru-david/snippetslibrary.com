# Multi-stage Dockerfile for Next.js application
# Base image with Node.js
FROM node:20-alpine AS base

# Install system dependencies
RUN apk add --no-cache libc6-compat curl

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies (including drizzle-kit for migrations)
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; \
    else echo "Lockfile not found." && exit 1; \
    fi

# Development dependencies for build
FROM base AS builder
WORKDIR /app

# Install all dependencies including devDependencies for build
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; \
    else echo "Lockfile not found." && exit 1; \
    fi

# Copy .env file
COPY .env ./

COPY . .

# Environment variables for build time
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Debug: Print environment variables
RUN echo "GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID" && \
    echo "GITHUB_CLIENT_SECRET=$GITHUB_CLIENT_SECRET" && \
    echo "AUTH_SECRET=$AUTH_SECRET"

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

COPY .env.example .env  

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user to run the application
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the public folder
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy node_modules for migration dependencies
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy package.json for migration scripts
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/drizzle ./drizzle
COPY --from=builder --chown=nextjs:nodejs /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/src/db ./src/db

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"] 