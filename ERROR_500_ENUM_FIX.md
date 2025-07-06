# Error 500 - Enum Value Mismatch Fix

## 🐛 Error yang Terjadi

```
POST http://localhost:5173/api/anak 500 (Internal Server Error)
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Gagal menyimpan data anak",
  "error_type": "DATABASE_TRANSACTION_ERROR",
  "details": "\nInvalid `prisma.riwayatKelahiran.create()` invocation:\n\n{\n  data: {\n    anak_id: 3,\n    jenis_kelahiran: \"Normal\",\n                     ~~~~~~~~\n    alasan_sc: \"\",\n    bantuan_kelahiran: [\n      \"Dokter\"\n    ],\n    is_premature: false,\n    usia_kelahiran_bulan: 9,\n    posisi_bayi_saat_lahir: \"Normal\",\n    is_sungsang: false,\n    is_kuning: false,\n    detak_jantung_anak: \"Normal\",\n    apgar_score: \"9/10\",\n    lama_persalinan: \"8 jam\",\n    penolong_persalinan: \"Dokter Spesialis\",\n    tempat_bersalin: \"RS Umum\",\n    cerita_spesifik_kelahiran: \"Persalinan normal tanpa komplikasi\"\n  }\n}\n\nInvalid value for argument `jenis_kelahiran`. Expected JenisKelahiran.",
  "transaction_rolled_back": true
}
```

## 🔍 Root Cause Analysis

### **Masalah:**
- **Dummy data menggunakan:** `"Normal"` (uppercase)
- **Backend mengharapkan:** `"normal"` (lowercase)

### **Tipe Data yang Benar:**
```typescript
// Di src/types/index.ts baris 126 (MongoDB)
jenis_kelahiran?: 'normal' | 'caesar';

// Di src/types/index.ts baris 420 (SQL)
jenis_kelahiran: string; // Tapi backend tetap mengharapkan enum
```

## ✅ Perbaikan yang Dilakukan

### **1. Fixed Dummy Data**
```typescript
// Sebelum (Error)
riwayat_kelahiran: {
  jenis_kelahiran: 'Normal', // ❌ Uppercase
  // ...
}

// Sesudah (Fixed)
riwayat_kelahiran: {
  jenis_kelahiran: 'normal', // ✅ Lowercase
  // ...
}
```

### **2. Enhanced Data Cleaning**
```typescript
const cleanDataForAPI = (data: AnakDetail): Partial<AnakDetail> => {
  // ... existing cleaning logic
  
  // Konversi null ke string kosong atau 0
  if (cleaned.ayah) {
    ayahData.tahun_meninggal = ayahData.tahun_meninggal || 0;
    ayahData.usia_saat_meninggal = ayahData.usia_saat_meninggal || 0;
  }
  
  // ... rest of cleaning logic
}
```

## 🎯 Hasil Perbaikan

### **Sebelum (Error):**
```json
{
  "jenis_kelahiran": "Normal"  // ❌ Uppercase
}
```

### **Sesudah (Fixed):**
```json
{
  "jenis_kelahiran": "normal"  // ✅ Lowercase
}
```

## 📝 Enum Mapping Guide

| Field | Expected Values | Dummy Data | Notes |
|-------|----------------|------------|-------|
| `jenis_kelahiran` | `'normal'` \| `'caesar'` | `'normal'` | Lowercase required |

## 🚀 Testing Steps

1. **Klik tombol "📝 Isi Data Dummy"**
2. **Submit form**
3. **Cek console untuk log data yang dikirim**
4. **Seharusnya tidak ada error 500 lagi**

## 🔧 Prevention Tips

### **Untuk Developer:**
1. **Selalu gunakan lowercase untuk enum values**
2. **Periksa tipe data di `src/types/index.ts`**
3. **Test dengan data dummy sebelum production**

### **Untuk Future Development:**
1. **Buat constant untuk enum values**
2. **Gunakan TypeScript strict mode**
3. **Implement validation di frontend**

## ✅ Status: FIXED

Error 500 Internal Server Error telah diperbaiki dengan:
- ✅ Konversi enum value ke lowercase
- ✅ Sesuai dengan tipe data backend
- ✅ Enhanced data cleaning function
- ✅ Ready for testing dengan data dummy

## 📋 Files Modified

1. **`src/components/Patients/AnakAddForm.tsx`**
   - Fixed dummy data enum values
   - Enhanced data cleaning function

2. **`DEBUG_400_ERROR.md`**
   - Added error 500 documentation

3. **`ERROR_500_ENUM_FIX.md`** (this file)
   - Detailed error analysis and fix documentation 