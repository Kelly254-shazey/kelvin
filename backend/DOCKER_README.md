# Docker Setup for Kellyflo Portfolio Backend

This directory contains the Docker configuration for the Spring Boot backend.

## Quick Start

### Build the Docker Image

```bash
# From the backend directory
docker build -t kellyflo-backend:latest .

# Or from the root directory
docker build -f backend/Dockerfile -t kellyflo-backend:latest .
```

### Run as a Container

```bash
docker run -d \
  -p 8080:8080 \
  --name kellyflo-backend \
  -e JWT_SECRET="your-secret-key" \
  -e SMTP_USERNAME="your-email@gmail.com" \
  -e SMTP_PASSWORD="your-app-password" \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/uploads:/app/uploads \
  kellyflo-backend:latest
```

### Using Docker Compose (Recommended)

From the root directory:

```bash
# Create .env file from .env.example
cp .env.example .env

# Edit .env with your configuration
# Then run:
docker-compose up -d

# Check logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

## Environment Variables

All environment variables from `application.properties` are supported. Key ones:

| Variable | Default | Description |
|---|---|---|
| `SERVER_PORT` | 8080 | Server port |
| `JWT_SECRET` | System property | JWT signing secret (required) |
| `SMTP_HOST` | smtp.gmail.com | Email SMTP host |
| `SMTP_USERNAME` | - | Email account username |
| `SMTP_PASSWORD` | - | Email account password |
| `APP_ADMIN_USERNAME` | admin | Initial admin username |
| `APP_ADMIN_PASSWORD` | Admin@12345 | Initial admin password |
| `CORS_ALLOWED_ORIGINS` | http://localhost:5173 | CORS allowed origins |

## Volumes

- `/app/data` - H2 database files
- `/app/uploads` - User uploaded files (resume, CV, etc)

## Health Check

The container includes a health check that verifies the API is responding:

```bash
docker ps --format "table {{.Names}}\t{{.Status}}"
```

## Accessing the Application

- **API Base**: http://localhost:8080
- **H2 Console**: http://localhost:8080/h2-console
- **Health Check**: http://localhost:8080/api/public/content

## Building Guidelines

### Multi-Stage Build Benefits

- **Stage 1**: Uses Maven image to compile (larger, has build tools)
- **Stage 2**: Uses minimal JRE Alpine image (much smaller, production-ready)

### Image Size Reduction

- Final image size: ~200-300MB (compressed)
- Uses Alpine Linux for minimal footprint
- Only includes JRE, not full JDK

## Troubleshooting

### Container exits immediately
Check logs:
```bash
docker logs kellyflo-backend
```

### Database permission issues
Ensure volumes have correct permissions:
```bash
docker exec kellyflo-backend ls -la /app/data
docker exec kellyflo-backend ls -la /app/uploads
```

### Port already in use
Change the port mapping:
```bash
docker run -p 8888:8080 ... kellyflo-backend:latest
```

Then access at `http://localhost:8888`

## Production Deployment

For production, consider:

1. Use a proper database (PostgreSQL, MySQL) instead of H2
2. Set `JWT_SECRET` to a strong random value
3. Configure proper SMTP credentials
4. Use environment-specific `.env` files
5. Enable HTTPS/TLS
6. Set resource limits (memory, CPU)
7. Use logging aggregation
8. Set up monitoring/alerting

## Kubernetes Deployment

Example deployment configuration available in `k8s-deployment.yaml` (if created)
