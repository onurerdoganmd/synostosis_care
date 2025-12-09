# Frontend Dockerfile
# Multi-stage build for production-ready React frontend

# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Stage 2: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build argument for API URL
ARG VITE_API_URL=http://localhost:5000/api/v1
ENV VITE_API_URL=$VITE_API_URL

# Build the application
RUN npm run build

# Stage 3: Production with Nginx
FROM nginx:alpine AS runner

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
