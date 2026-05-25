# Deployment Guide - Ollama Proxy

Panduan untuk deploy Ollama Proxy ke production environment.

## 📦 Deployment Options

### 1. Bare Metal / VPS

#### Prasyarat
- Bun runtime installed
- Git installed
- Ollama API accessible

#### Langkah-langkah

```bash
# SSH ke server
ssh user@your-server.com

# Clone repository
git clone <repository-url>
cd ollama-proxy

# Install dependencies
bun install

# Setup environment
nano .env
# Setup OLLAMA_HOST dan API_KEY

# Jalankan server
bun run dev

# Atau gunakan process manager seperti PM2
# npm install -g pm2
# pm2 start "bun run dev" --name "ollama-proxy"
# pm2 save
```

### 2. Docker Deployment

#### Build Docker Image

```dockerfile
# Dockerfile
FROM oven/bun:latest

WORKDIR /app

# Copy files
COPY package.json .
COPY bun.lockb .
RUN bun install --frozen-lockfile

COPY src ./src
COPY tsconfig.json .

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun run health || exit 1

CMD ["bun", "run", "dev"]
```

#### Build dan Run

```bash
# Build image
docker build -t ollama-proxy:latest .

# Run container
docker run -d \
  --name ollama-proxy \
  -p 3000:3000 \
  -e OLLAMA_HOST=https://ollama.com \
  -e OLLAMA_API_KEY=your-api-key \
  ollama-proxy:latest
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  ollama-proxy:
    build: .
    container_name: ollama-proxy
    ports:
      - "3000:3000"
    environment:
      OLLAMA_HOST: https://ollama.com
      OLLAMA_API_KEY: ${OLLAMA_API_KEY}
      NODE_ENV: production
    restart: unless-stopped
    networks:
      - ollama-network

networks:
  ollama-network:
    driver: bridge
```

```bash
# Deploy dengan Docker Compose
docker-compose up -d
```

### 3. Cloud Deployment

#### Vercel (Recommended for Serverless)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Vercel akan secara otomatis detect Bun project.

#### Railway

1. Push code ke GitHub
2. Connect repo di Railway
3. Set environment variables
4. Railway akan auto-deploy

#### Heroku (Legacy)

```bash
# Create Procfile
echo "web: bun run dev" > Procfile

# Deploy
git push heroku main
```

## 🔒 Production Checklist

- [ ] `.env` dengan production values
- [ ] OLLAMA_HOST di-set ke production server
- [ ] API Key sudah di-setup dan aman
- [ ] Rate limiting diterapkan (jika perlu)
- [ ] Monitoring/Logging di-setup
- [ ] Backup strategy
- [ ] SSL/HTTPS enabled (jika exposed ke internet)

## 🚨 Security Best Practices

### 1. Environment Variables
```bash
# Jangan hardcode sensitive data
# Gunakan .env file yang tidak di-git
echo ".env" >> .gitignore
```

### 2. CORS Configuration
Jika perlu batasi CORS, edit `src/server.ts`:

```typescript
app.use("*", cors({
  origin: ["https://yourdomain.com"],
  credentials: true
}))
```

### 3. Rate Limiting
```bash
# Install rate limiter
bun add hono-rate-limiter

# Gunakan di routes
```

### 4. API Key Rotation
- Rotate API key secara berkala
- Monitor suspicious activities
- Gunakan separate keys untuk different environments

## 📊 Monitoring & Logging

### Logs Setup

```bash
# Lihat logs Docker
docker logs -f ollama-proxy

# Atau VM logs
tail -f /var/log/ollama-proxy.log
```

### Health Check Endpoint

```bash
# Test server is running
curl http://localhost:3000/health
```

## 🔄 CI/CD Setup

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Use Bun
        uses: oven-sh/setup-bun@v1
      
      - name: Install dependencies
        run: bun install
      
      - name: Run tests
        run: bun run test # jika ada
      
      - name: Deploy
        run: |
          echo "Deploy steps here"
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
```

## 🆘 Troubleshooting Production

### Server tidak bisa connect ke Ollama
- Check firewall rules
- Verify OLLAMA_HOST URL
- Check network connectivity

### High memory usage
- Monitor dengan `top` atau `htop`
- Check jika ada memory leak di services
- Restart container jika perlu

### Slow response time
- Check Ollama server performance
- Monitor network latency
- Consider caching responses

## 📝 Backup & Recovery

```bash
# Backup configuration
tar -czf ollama-proxy-backup.tar.gz ./src ./.env

# Recovery
tar -xzf ollama-proxy-backup.tar.gz
bun install
bun run dev
```

## 🚀 Scaling

Untuk high traffic:

1. **Load Balancer** - Gunakan nginx/haproxy di depan
2. **Multiple Instances** - Deploy beberapa instance
3. **Database** - Jika perlu caching
4. **CDN** - Cache responses

### Nginx Reverse Proxy Config

```nginx
upstream ollama_proxy {
    server localhost:3000;
    server localhost:3001;
    server localhost:3002;
}

server {
    listen 80;
    server_name api.example.com;
    
    location / {
        proxy_pass http://ollama_proxy;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

Last Updated: 2026-05-25
