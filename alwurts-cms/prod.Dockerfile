FROM node:20.9.0-alpine AS base

# Step 1. Rebuild the source code only when needed
FROM base AS builder

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json ./
# Omit --production flag for TypeScript devDependencies
RUN npm ci

COPY src ./src
COPY public ./public
COPY next.config.mjs .
COPY tsconfig.json .
COPY tailwind.config.ts .
COPY postcss.config.mjs .

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
ARG POSTGRES_DB
ENV POSTGRES_DB=${POSTGRES_DB}
ARG POSTGRES_USER
ENV POSTGRES_USER=${POSTGRES_USER}
ARG POSTGRES_PASSWORD
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
ARG AUTH_TRUST_HOST
ENV AUTH_TRUST_HOST=${AUTH_TRUST_HOST}
ARG AUTH_URL
ENV AUTH_URL=${AUTH_URL}
ARG AUTH_SECRET
ENV AUTH_SECRET=${AUTH_SECRET}
ARG AUTH_GOOGLE_ID
ENV AUTH_GOOGLE_ID=${AUTH_GOOGLE_ID}
ARG AUTH_GOOGLE_SECRET
ENV AUTH_GOOGLE_SECRET=${AUTH_GOOGLE_SECRET}
ARG AUTH_DRIZZLE_URL
ENV AUTH_DRIZZLE_URL=${AUTH_DRIZZLE_URL}


# Next.js collects completely anonymous telemetry data about general usage. Learn more here: https://nextjs.org/telemetry
# Uncomment the following line to disable telemetry at build time
ENV NEXT_TELEMETRY_DISABLED 1

# Build Next.js based on the preferred package manager
RUN npm run build

# Note: It is not necessary to add an intermediate step that does a full copy of `node_modules` here

# Step 2. Production image, copy all the files and run next
FROM base AS runner

WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Environment variables must be present at build time
# https://github.com/vercel/next.js/discussions/14030
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
ARG POSTGRES_DB
ENV POSTGRES_DB=${POSTGRES_DB}
ARG POSTGRES_USER
ENV POSTGRES_USER=${POSTGRES_USER}
ARG POSTGRES_PASSWORD
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
ARG AUTH_TRUST_HOST
ENV AUTH_TRUST_HOST=${AUTH_TRUST_HOST}
ARG AUTH_URL
ENV AUTH_URL=${AUTH_URL}
ARG AUTH_SECRET
ENV AUTH_SECRET=${AUTH_SECRET}
ARG AUTH_GOOGLE_ID
ENV AUTH_GOOGLE_ID=${AUTH_GOOGLE_ID}
ARG AUTH_GOOGLE_SECRET
ENV AUTH_GOOGLE_SECRET=${AUTH_GOOGLE_SECRET}
ARG AUTH_DRIZZLE_URL
ENV AUTH_DRIZZLE_URL=${AUTH_DRIZZLE_URL}


# Uncomment the following line to disable telemetry at run time
ENV NEXT_TELEMETRY_DISABLED 1

# Note: Don't expose ports here, Compose will handle that for us

CMD ["node", "server.js"]
