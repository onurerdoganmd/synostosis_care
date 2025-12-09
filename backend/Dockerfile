# Backend Dockerfile
# Multi-stage build for production-ready Node.js backend

# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Stage 2: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Stage 3: Production
FROM node:18-alpine AS runner
WORKDIR /app

# Set NODE_ENV
ENV NODE_ENV=production

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copy dependencies
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# Copy data directory for JSON storage
COPY --chown=nodejs:nodejs ./data ./data

# Create prisma directory if needed
RUN mkdir -p ./prisma

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "dist/index.js"]
