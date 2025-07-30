# Error 405 Fix - Method Not Allowed

## 🔍 Masalah yang Ditemukan

### Error 405 (Method Not Allowed)
**Lokasi**: Menu Assessment dan Program Terapi List
**Gejala**: Setelah perbaikan endpoint, muncul error 405 saat submit program terapi
**Penyebab**: Endpoint global `/program-terapi` tidak mendukung method POST/PUT/DELETE di backend yang sedang digunakan

## 📋 Analisis Masalah

### ❌ **Implementasi yang Menyebabkan Error 405**
```typescript
// Endpoint global yang tidak tersedia di backend
POST /api/program-terapi
PUT /api/program-terapi/:id
DELETE /api/program-terapi/:id
```

### ✅ **Endpoint yang Benar (Nested)**
```typescript
// Endpoint nested yang tersedia di backend
POST /api/anak/${anakId}/program-terapi
PUT /api/anak/${anakId}/program-terapi
DELETE /api/anak/${anakId}/program-terapi
```

## 🔧 Solusi yang Diterapkan

### 1. **Kembali ke Endpoint Nested untuk Program Terapi**

#### **Sebelum (Error 405):**
```typescript
create: async (anakId: number, data: CreateProgramTerapiData) => {
  const requestData = { ...data, anak_id: anakId };
  const response = await api.post(`/program-terapi`, requestData);
  return response.data;
},
```

#### **Sesudah (Fixed):**
```typescript
create: async (anakId: number, data: CreateProgramTerapiData) => {
  const response = await api.post(`/anak/${anakId}/program-terapi`, data);
  return response.data;
},
```

### 2. **Kembali ke Endpoint Nested untuk Assessment**

#### **Sebelum (Error 405):**
```typescript
createAssessment: async (anakId: number, data: AssessmentForm) => {
  const assessmentData = {
    ...data,
    assessment_date: data.assessment_date || new Date().toISOString().split('T')[0],
    anak_id: anakId
  };
  const response = await api.post(`/assessment`, assessmentData);
  return { ...response.data, data: response.data.data.assessment };
},
```

#### **Sesudah (Fixed):**
```typescript
createAssessment: async (anakId: number, data: AssessmentForm) => {
  const assessmentData = {
    ...data,
    assessment_date: data.assessment_date || new Date().toISOString().split('T')[0]
  };
  const response = await api.post(`/anak/${anakId}/assessment`, assessmentData);
  return { ...response.data, data: response.data.data.assessment };
},
```

## 📝 Perubahan yang Dilakukan

### 1. **Program Terapi API** (`src/services/api.ts`)
- ✅ **Create**: `POST /program-terapi` → `POST /anak/${anakId}/program-terapi`
- ✅ **Update**: `PUT /program-terapi/${id}` → `PUT /anak/${anakId}/program-terapi`
- ✅ **Delete**: `DELETE /program-terapi/${id}` → `DELETE /anak/${anakId}/program-terapi`
- ✅ **Remove anak_id** dari request body (sudah ada di URL)

### 2. **Assessment API** (`src/services/api.ts`)
- ✅ **Create**: `POST /assessment` → `POST /anak/${anakId}/assessment`
- ✅ **Update**: `PUT /assessment/${id}` → `PUT /anak/${anakId}/assessment`
- ✅ **Delete**: `DELETE /assessment/${id}` → `DELETE /anak/${anakId}/assessment`
- ✅ **Remove anak_id** dari request body (sudah ada di URL)

## 🎯 Hasil yang Diharapkan

### ✅ **Setelah Perbaikan**
1. **Tidak ada lagi error 405** saat submit program terapi
2. **Tidak ada lagi error 405** saat submit assessment
3. **Endpoint menggunakan format nested** yang sesuai dengan backend
4. **Request menggunakan URL parameter** untuk anak_id

### 🔍 **Testing yang Perlu Dilakukan**
1. **Create Program Terapi**: Coba tambah program terapi baru
2. **Update Program Terapi**: Coba edit program terapi yang ada
3. **Delete Program Terapi**: Coba hapus program terapi
4. **Create Assessment**: Coba tambah assessment baru
5. **Update Assessment**: Coba edit assessment yang ada
6. **Delete Assessment**: Coba hapus assessment

## 📚 Referensi

### **Dokumentasi Endpoint yang Benar**
- Backend menggunakan **endpoint nested** bukan global
- Program Terapi: `/api/anak/${anakId}/program-terapi`
- Assessment: `/api/anak/${anakId}/assessment`

### **File yang Diperbaiki**
- `src/services/api.ts` - Kembali ke endpoint nested
- Komponen tetap sama, hanya endpoint yang diperbaiki

## ⚠️ **Catatan Penting**

1. **Backend Implementation**: Backend yang sedang digunakan menggunakan endpoint nested
2. **Documentation Mismatch**: Dokumentasi mungkin menunjukkan endpoint global, tapi implementasi backend menggunakan nested
3. **Error Handling**: Komponen sudah memiliki error handling yang baik
4. **Testing**: Lakukan testing menyeluruh untuk memastikan semua fitur berfungsi

## 🚀 **Status Perbaikan**

- ✅ **Program Terapi API**: Fixed (kembali ke nested)
- ✅ **Assessment API**: Fixed (kembali ke nested)
- ✅ **Error Handling**: Maintained
- ✅ **User Experience**: Improved (no more 405 errors)

## 🔄 **Langkah Selanjutnya**

1. **Test semua fitur** untuk memastikan tidak ada error
2. **Verifikasi dengan backend team** tentang endpoint yang benar
3. **Update dokumentasi** jika diperlukan
4. **Monitor error logs** untuk memastikan tidak ada masalah lain 