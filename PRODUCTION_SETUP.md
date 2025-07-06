# Production Setup Guide

## Overview
Panduan lengkap untuk deploy aplikasi ke production environment dengan domain:
- **Frontend**: `admin.yametbatamtiban.id`
- **Backend**: `api.yametbatamtiban.id`

## Prerequisites

### Domain Setup
1. Pastikan domain sudah terdaftar dan dikonfigurasi:
   - `admin.yametbatamtiban.id` (untuk frontend)
   - `api.yametbatamtiban.id` (untuk backend)

### SSL Certificate
1. Pastikan SSL certificate sudah terpasang untuk kedua domain
2. Gunakan Let's Encrypt atau provider SSL lainnya
3. Pastikan HTTPS berfungsi dengan baik

## Backend Deployment

### 1. Server Setup
```bash
# Update server
sudo apt update && sudo apt upgrade -y

# Install Node.js (versi 18 atau lebih baru)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 untuk process management
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

### 2. Backend Configuration
```bash
# Clone atau upload backend ke server
cd /var/www/
git clone <backend-repo> api.yametbatamtiban.id
cd api.yametbatamtiban.id

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env sesuai kebutuhan production
```

### 3. CORS Configuration (Backend)
Pastikan backend dikonfigurasi untuk menerima request dari frontend:

```javascript
// app.js atau index.js
const cors = require('cors');

app.use(cors({
  origin: [
    'https://admin.yametbatamtiban.id',
    'http://localhost:5173' // untuk development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 4. Nginx Configuration (Backend)
```nginx
# /etc/nginx/sites-available/api.yametbatamtiban.id
server {
    listen 80;
    server_name api.yametbatamtiban.id;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yametbatamtiban.id;

    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. Start Backend Service
```bash
# Start dengan PM2
pm2 start app.js --name "yamet-api"

# Save PM2 configuration
pm2 save
pm2 startup

# Enable Nginx site
sudo ln -s /etc/nginx/sites-available/api.yametbatamtiban.id /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Frontend Deployment

### 1. Build Frontend
```bash
# Di local development
npm run build
```

### 2. Upload to Server
```bash
# Upload hasil build ke server
scp -r dist/* user@server:/var/www/admin.yametbatamtiban.id/
```

### 3. Nginx Configuration (Frontend)
```nginx
# /etc/nginx/sites-available/admin.yametbatamtiban.id
server {
    listen 80;
    server_name admin.yametbatamtiban.id;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name admin.yametbatamtiban.id;

    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;

    root /var/www/admin.yametbatamtiban.id;
    index index.html;

    # Handle React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

### 4. Enable Frontend Site
```bash
sudo ln -s /etc/nginx/sites-available/admin.yametbatamtiban.id /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Testing Production

### 1. Test Backend API
```bash
# Test API endpoint
curl -X GET https://api.yametbatamtiban.id/health
curl -X GET https://api.yametbatamtiban.id/api/auth/profile
```

### 2. Test Frontend
1. Buka browser dan akses `https://admin.yametbatamtiban.id`
2. Test login dan semua fitur
3. Periksa console browser untuk error
4. Test API calls dari frontend

### 3. Monitor Logs
```bash
# Backend logs
pm2 logs yamet-api

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=your_production_database_url
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=https://admin.yametbatamtiban.id
```

### Frontend
Frontend menggunakan auto-detection berdasarkan hostname, jadi tidak perlu environment variables tambahan.

## Security Considerations

### 1. SSL/TLS
- Pastikan SSL certificate valid dan up-to-date
- Gunakan HSTS header
- Redirect semua HTTP ke HTTPS

### 2. CORS
- Hanya izinkan domain yang diperlukan
- Jangan gunakan `origin: '*'` di production

### 3. Environment Variables
- Jangan commit file `.env` ke repository
- Gunakan secret management untuk sensitive data

### 4. Database
- Gunakan connection pooling
- Backup database secara regular
- Monitor database performance

## Monitoring & Maintenance

### 1. PM2 Monitoring
```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs

# Restart services
pm2 restart yamet-api
```

### 2. Nginx Monitoring
```bash
# Check status
sudo systemctl status nginx

# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx
```

### 3. SSL Certificate Renewal
```bash
# Jika menggunakan Let's Encrypt
sudo certbot renew

# Reload Nginx setelah renew
sudo systemctl reload nginx
```

## Troubleshooting

### Common Issues

1. **CORS Error**
   - Periksa konfigurasi CORS di backend
   - Pastikan domain frontend sudah di-whitelist

2. **SSL Certificate Error**
   - Periksa certificate path di Nginx config
   - Pastikan certificate belum expired

3. **API Not Responding**
   - Periksa apakah backend berjalan: `pm2 status`
   - Periksa logs: `pm2 logs yamet-api`

4. **Frontend Not Loading**
   - Periksa Nginx configuration
   - Periksa file permissions di `/var/www/`

### Debug Commands
```bash
# Check backend status
pm2 status
pm2 logs yamet-api --lines 50

# Check Nginx status
sudo systemctl status nginx
sudo nginx -t

# Check SSL certificate
openssl s_client -connect api.yametbatamtiban.id:443 -servername api.yametbatamtiban.id

# Test API connectivity
curl -v https://api.yametbatamtiban.id/health
``` 