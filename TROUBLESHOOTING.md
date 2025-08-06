# Troubleshooting Data Fetching Issues

## Overview
Dokumen ini membantu mengatasi masalah data fetching pada aplikasi YAMET Admin.

## 🔧 Konfigurasi Environment

### Development Environment
- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:3000`
- **Proxy**: `/api` → `http://localhost:3000`

### Production Environment
- **Frontend**: `https://admin.yametbatamtiban.id`
- **Backend**: `https://api.yametbatamtiban.id/api/`

## 🚨 Masalah Umum

### 1. Data Tidak Terfetch
**Gejala:**
- Loading spinner berputar terus
- Error "Terjadi kesalahan saat mengambil data"
- Tabel kosong tanpa data

**Penyebab:**
- Backend server tidak berjalan
- Port tidak sesuai (development: 3000, production: 3001)
- Token JWT tidak valid atau expired
- CORS issues

**Solusi:**
1. Pastikan backend server berjalan:
   ```bash
   # Development
   npm run dev  # atau yarn dev
   
   # Production
   npm start
   ```

2. Cek port yang digunakan:
   - Development: `http://localhost:3000`
   - Production: `http://localhost:3001`

3. Cek token JWT:
   ```javascript
   // Di browser console
   console.log('Token:', localStorage.getItem('token'));
   ```

4. Cek network requests di browser DevTools

### 2. Error 401 Unauthorized
**Gejala:**
- Error "Token tidak valid"
- Redirect ke halaman login

**Solusi:**
1. Logout dan login ulang
2. Cek token di localStorage
3. Pastikan backend menerima token dengan benar

### 3. Error 500 Internal Server Error
**Gejala:**
- Error "Terjadi kesalahan server"
- Data tidak dapat diambil

**Solusi:**
1. Cek log backend server
2. Pastikan database terhubung
3. Cek konfigurasi environment variables

## 🔍 Debug Tools

### 1. Browser DevTools
1. Buka Developer Tools (F12)
2. Tab Network
3. Filter by "Fetch/XHR"
4. Cek request/response untuk API calls

### 2. Console Logs
Aplikasi sudah menambahkan debug logs:
```javascript
// Di browser console akan muncul:
[DEBUG] Fetching conversion data with params: {...}
[DEBUG] Conversion API response: {...}
[DEBUG] Conversion API Error: {...}
```

### 3. Debug Panel
Di development mode, ada debug panel yang menampilkan:
- API Base URL
- Current Page
- Search Term
- Data Count
- Total Records
- Token Status

## 📋 Checklist Troubleshooting

### Sebelum Melapor Bug:
- [ ] Backend server berjalan
- [ ] Port sesuai (3000 untuk dev, 3001 untuk prod)
- [ ] Token JWT valid
- [ ] Network requests berhasil
- [ ] Console tidak ada error
- [ ] Database terhubung

### Untuk Developer:
- [ ] Cek log backend
- [ ] Cek environment variables
- [ ] Cek database connection
- [ ] Cek API endpoints
- [ ] Cek CORS configuration

## 🛠️ Perbaikan yang Telah Dilakukan

### 1. Enhanced Error Handling
- Menambahkan try-catch di semua API calls
- Logging yang lebih detail
- Error messages yang lebih informatif

### 2. Response Structure Fix
- Menyesuaikan dengan struktur response API
- Menambahkan property `success` di ApiResponse
- Better handling untuk success/error responses

### 3. Debug Information
- Debug panel di development mode
- Console logs untuk troubleshooting
- Network request monitoring

### 4. Proxy Configuration
- Development: `localhost:3000`
- Production: `localhost:3001`
- Auto-detection berdasarkan hostname

## 📞 Support

Jika masalah masih berlanjut:
1. Cek log backend server
2. Screenshot error di browser
3. Copy console logs
4. Hubungi tim backend

## 🔄 Testing API Endpoints

### Test Conversion API:
```bash
# GET /api/conversion
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3000/api/conversion

# POST /api/conversion
curl -X POST \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"jumlah_anak_keluar": 10, "jumlah_leads": 50, "jumlah_conversi": 8, "bulan": "January", "tahun": 2024}' \
     http://localhost:3000/api/conversion
```

### Test Notifikasi API:
```bash
# GET /api/notifikasi/user
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3000/api/notifikasi/user
``` 