# API Configuration Documentation

## Overview
Sistem ini menggunakan konfigurasi API yang berbeda untuk environment development dan production.

## Environment Configuration

### Production Environment
- **Frontend URL**: `https://admin.yametbatamtiban.id`
- **API URL**: `https://api.yametbatamtiban.id`
- **Domain**: `admin.yametbatamtiban.id`

### Development Environment
- **Frontend URL**: `http://localhost:5173` (atau port yang digunakan)
- **API URL**: `/api` (proxy ke backend local)
- **Domain**: `localhost` atau `127.0.0.1`

## File Konfigurasi

### `src/config/api.ts`
File ini berisi konfigurasi API untuk berbagai environment:

```typescript
export const API_CONFIG = {
  PRODUCTION_API_URL: 'https://api.yametbatamtiban.id',
  DEVELOPMENT_API_URL: '/api',
  PRODUCTION_FRONTEND_URL: 'https://admin.yametbatamtiban.id',
  DEVELOPMENT_FRONTEND_URL: 'http://localhost:5173',
  
  getApiBaseURL: (): string => {
    if (window.location.hostname === 'admin.yametbatamtiban.id') {
      return API_CONFIG.PRODUCTION_API_URL;
    }
    return API_CONFIG.DEVELOPMENT_API_URL;
  },
  
  isProduction: (): boolean => {
    return window.location.hostname === 'admin.yametbatamtiban.id';
  },
  
  isDevelopment: (): boolean => {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  }
};
```

### `src/services/api.ts`
File ini menggunakan konfigurasi dari `API_CONFIG`:

```typescript
import API_CONFIG from '../config/api';

const api = axios.create({
  baseURL: API_CONFIG.getApiBaseURL(),
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});
```

## Cara Kerja

1. **Auto-Detection**: Sistem secara otomatis mendeteksi environment berdasarkan hostname
2. **Production**: Ketika diakses dari `admin.yametbatamtiban.id`, API akan menggunakan `https://api.yametbatamtiban.id`
3. **Development**: Ketika diakses dari `localhost`, API akan menggunakan `/api` (proxy ke backend local)

## Deployment

### Frontend Production
- Deploy ke domain: `admin.yametbatamtiban.id`
- Build dengan: `npm run build`
- Upload hasil build ke server

### Backend Production
- Deploy ke domain: `api.yametbatamtiban.id`
- Pastikan CORS dikonfigurasi untuk menerima request dari `admin.yametbatamtiban.id`

## CORS Configuration (Backend)

Backend harus dikonfigurasi untuk menerima request dari frontend production:

```javascript
// Contoh konfigurasi CORS untuk backend
app.use(cors({
  origin: [
    'https://admin.yametbatamtiban.id',
    'http://localhost:5173' // untuk development
  ],
  credentials: true
}));
```

## Testing

### Development Testing
1. Jalankan backend di local
2. Jalankan frontend dengan `npm run dev`
3. Frontend akan menggunakan `/api` yang di-proxy ke backend local

### Production Testing
1. Deploy backend ke `api.yametbatamtiban.id`
2. Deploy frontend ke `admin.yametbatamtiban.id`
3. Frontend akan otomatis menggunakan API production

## Troubleshooting

### Jika API tidak terhubung di production:
1. Periksa apakah backend sudah deploy ke `api.yametbatamtiban.id`
2. Periksa konfigurasi CORS di backend
3. Periksa SSL certificate untuk HTTPS

### Jika API tidak terhubung di development:
1. Periksa apakah backend berjalan di local
2. Periksa konfigurasi proxy di `vite.config.ts`
3. Periksa apakah port backend sesuai dengan proxy configuration 