# Docker Setup for Craniosynostosis Care

This guide explains how to run the Craniosynostosis Patient Tracking System using Docker.

## Prerequisites

- Docker Engine 20.10 or later
- Docker Compose 2.0 or later
- At least 2GB of available RAM
- Ports 3000 and 5000 available on your host machine

## Quick Start

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd synostosis_care
   ```

2. **Set up environment variables** (optional):
   ```bash
   cp .env.example .env
   # Edit .env and update JWT secrets for production
   ```

3. **Build and start the containers**:
   ```bash
   docker-compose up --build
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health check: http://localhost:5000/health

5. **Login credentials** (demo):
   - Click "Login as Admin (Demo)" on the login page
   - This uses a hardcoded token for Phase 3 development

## Docker Architecture

The application consists of two services:

### Backend Service (`synostosis-backend`)
- **Base Image**: Node.js 18 Alpine
- **Port**: 5000
- **Function**: REST API server with JWT authentication
- **Data**: Patient data stored in `./backend/data/` (persisted as volume)
- **Health Check**: GET /health endpoint

### Frontend Service (`synostosis-frontend`)
- **Base Image**: Nginx Alpine
- **Port**: 3000 (mapped from container port 80)
- **Function**: Serves the React SPA
- **Features**: Client-side routing, API calls to backend

## Detailed Commands

### Building Images

Build both services:
```bash
docker-compose build
```

Build specific service:
```bash
docker-compose build backend
docker-compose build frontend
```

### Running Containers

**Start in foreground** (see logs):
```bash
docker-compose up
```

**Start in background** (detached):
```bash
docker-compose up -d
```

**Start with build**:
```bash
docker-compose up --build
```

### Stopping Containers

**Stop running containers**:
```bash
docker-compose stop
```

**Stop and remove containers**:
```bash
docker-compose down
```

**Stop and remove containers + volumes**:
```bash
docker-compose down -v
```

### Viewing Logs

**All services**:
```bash
docker-compose logs
```

**Follow logs** (tail -f):
```bash
docker-compose logs -f
```

**Specific service**:
```bash
docker-compose logs backend
docker-compose logs frontend
```

**Last 50 lines**:
```bash
docker-compose logs --tail=50
```

### Checking Status

**List running containers**:
```bash
docker-compose ps
```

**Health check status**:
```bash
docker-compose ps
# Look for "healthy" status in STATE column
```

### Accessing Container Shell

**Backend container**:
```bash
docker exec -it synostosis-backend sh
```

**Frontend container**:
```bash
docker exec -it synostosis-frontend sh
```

## Environment Variables

### Docker Compose (.env file in root)

Create a `.env` file in the project root:

```env
# JWT Secrets (REQUIRED for production)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production

# Optional overrides
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### Backend Environment Variables

Configured in `docker-compose.yml`:
- `NODE_ENV`: production
- `PORT`: 5000
- `JWT_SECRET`: From .env file
- `JWT_REFRESH_SECRET`: From .env file
- `JWT_EXPIRES_IN`: Token expiration time
- `JWT_REFRESH_EXPIRES_IN`: Refresh token expiration

### Frontend Build Arguments

- `VITE_API_URL`: Backend API URL (default: http://localhost:5000/api/v1)

To customize the API URL:
```bash
docker-compose build --build-arg VITE_API_URL=http://your-api-url frontend
```

## Data Persistence

Patient data is stored in `./backend/data/patients.json` and persisted through a Docker volume mount. This ensures data survives container restarts.

**Backup data**:
```bash
cp backend/data/patients.json backend/data/patients.backup.json
```

**Restore data**:
```bash
cp backend/data/patients.backup.json backend/data/patients.json
docker-compose restart backend
```

## Troubleshooting

### Port Already in Use

If ports 3000 or 5000 are already in use, modify `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "5001:5000"  # Use port 5001 instead
  frontend:
    ports:
      - "3001:80"    # Use port 3001 instead
```

Then update the frontend build arg:
```yaml
frontend:
  build:
    args:
      - VITE_API_URL=http://localhost:5001/api/v1
```

### CORS Errors

If you see CORS errors in the browser console:

1. Check backend logs: `docker-compose logs backend`
2. Ensure the frontend URL is in the allowed origins
3. Update `backend/.env` CORS_ORIGIN to include your frontend URL

### Container Won't Start

**Check logs**:
```bash
docker-compose logs backend
docker-compose logs frontend
```

**Rebuild from scratch**:
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Data Not Persisting

Ensure the data directory exists:
```bash
mkdir -p backend/data
```

Check volume mounts:
```bash
docker-compose config
```

### Health Check Failing

**Check backend health**:
```bash
curl http://localhost:5000/health
```

**Check frontend health**:
```bash
curl http://localhost:3000/health
```

If backend is unhealthy, check logs and ensure port 5000 is accessible inside the container.

## Development vs Production

### Development Mode

For development, you might want to run the containers with live reload:

1. Use volume mounts for source code
2. Run `npm run dev` instead of production builds
3. This is NOT configured in the current setup

### Production Mode

The current Docker setup is optimized for production:

- ✅ Multi-stage builds for smaller images
- ✅ Non-root users for security
- ✅ Health checks for monitoring
- ✅ Optimized Nginx configuration
- ✅ Gzip compression enabled
- ✅ Security headers configured

**For production deployment**:
1. Update JWT secrets in `.env`
2. Configure proper CORS origins
3. Consider using Docker secrets for sensitive data
4. Set up HTTPS/TLS (reverse proxy like Traefik or Nginx)
5. Configure backup strategy for data volume

## Updating the Application

### Update and Rebuild

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up --build -d
```

### Zero-downtime Update

```bash
# Build new images
docker-compose build

# Start new containers without stopping old ones
docker-compose up -d --no-deps --build backend
docker-compose up -d --no-deps --build frontend
```

## Performance Optimization

### Image Size

Current optimizations:
- Multi-stage builds
- Alpine Linux base images
- Production-only dependencies
- .dockerignore files exclude unnecessary files

### Container Resources

Limit container resources in `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          memory: 256M
```

## Security Considerations

### Current Security Features

1. **Non-root user**: Backend runs as user `nodejs` (UID 1001)
2. **Health checks**: Automatic container health monitoring
3. **Security headers**: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection
4. **JWT authentication**: Token-based auth with refresh tokens
5. **CORS protection**: Only allowed origins can access API

### Production Security Checklist

- [ ] Change default JWT secrets in `.env`
- [ ] Use Docker secrets instead of environment variables
- [ ] Enable HTTPS/TLS
- [ ] Set up firewall rules
- [ ] Regular security updates (base images)
- [ ] Implement rate limiting
- [ ] Set up monitoring and logging
- [ ] Regular backups of data volume
- [ ] Consider using Docker Bench for Security

## Monitoring

### Container Stats

```bash
docker stats synostosis-backend synostosis-frontend
```

### Health Status

```bash
docker inspect --format='{{.State.Health.Status}}' synostosis-backend
docker inspect --format='{{.State.Health.Status}}' synostosis-frontend
```

### Logs Analysis

```bash
# Follow all logs
docker-compose logs -f

# Filter by level
docker-compose logs | grep ERROR
docker-compose logs | grep WARN
```

## Cleanup

### Remove All Containers and Images

```bash
# Stop and remove containers
docker-compose down

# Remove images
docker-compose down --rmi all

# Remove volumes (WARNING: deletes data)
docker-compose down -v --rmi all
```

### Remove Unused Docker Resources

```bash
# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Remove everything unused (careful!)
docker system prune -a
```

## Support

For issues related to:
- **Docker setup**: Check this guide and Docker logs
- **Application bugs**: Check application logs and GitHub issues
- **API errors**: Check backend logs with `docker-compose logs backend`
- **Frontend errors**: Check browser console and frontend logs

## Next Steps

After successfully running the application with Docker:

1. **Phase 4**: Implement Diagnosis Management (surgery types, etc.)
2. **Phase 5**: Add Surgical Planning features
3. **Phase 6**: Complete Surgery Recording
4. Continue with remaining phases per STEPWISE_IMPLEMENTATION_PLAN.md
