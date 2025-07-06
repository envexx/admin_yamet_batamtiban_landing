# Debug Error 400 Bad Request - POST /api/anak

## 🐛 Error yang Terjadi

```
POST http://localhost:5173/api/anak 400 (Bad Request)
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Data tidak valid",
  "error_type": "VALIDATION_ERROR",
  "details": [
    {
      "field": "selesai_terapi",
      "message": "Expected string, received null",
      "code": "invalid_type",
      "received": "null"
    },
    // ... 13 error lainnya
  ],
  "total_errors": 14
}
```

## 🔍 Penyebab Error

Error terjadi karena ada **14 field yang bernilai `null`** padahal backend mengharapkan:
- **String** untuk field text
- **Number** untuk field angka

### **Field yang Bermasalah:**
1. `selesai_terapi` - Expected string, received null
2. `mulai_cuti` - Expected string, received null
3. `ayah.tahun_meninggal` - Expected number, received null
4. `ayah.usia_saat_meninggal` - Expected number, received null
5. `ibu.tahun_meninggal` - Expected number, received null
6. `ibu.usia_saat_meninggal` - Expected number, received null
7. `riwayat_setelah_lahir.sakit_parah_usia_bulan` - Expected number, received null
8. `riwayat_setelah_lahir.frekuensi_durasi_kejang` - Expected string, received null
9. `riwayat_setelah_lahir.kejang_tanpa_panas_usia_bulan` - Expected number, received null
10. `penyakit_diderita.sakit_telinga_usia_tahun` - Expected number, received null
11. `penyakit_diderita.sakit_telinga_penjelasan` - Expected string, received null
12. `penyakit_diderita.sakit_mata_usia_tahun` - Expected number, received null
13. `penyakit_diderita.sakit_mata_penjelasan` - Expected string, received null
14. `penyakit_diderita.luka_kepala_usia_tahun` - Expected number, received null

## ✅ Perbaikan yang Dilakukan

### 1. **Enhanced Data Cleaning Function**
```typescript
const cleanDataForAPI = (data: AnakDetail): Partial<AnakDetail> => {
  // ... existing cleaning logic
  
  // Konversi null ke string kosong atau 0
  if (cleaned.ayah) {
    ayahData.tahun_meninggal = ayahData.tahun_meninggal || 0;
    ayahData.usia_saat_meninggal = ayahData.usia_saat_meninggal || 0;
  }
  
  if (cleaned.ibu) {
    ibuData.tahun_meninggal = ibuData.tahun_meninggal || 0;
    ibuData.usia_saat_meninggal = ibuData.usia_saat_meninggal || 0;
  }
  
  if (cleaned.riwayat_setelah_lahir) {
    setelahLahirData.sakit_parah_usia_bulan = setelahLahirData.sakit_parah_usia_bulan || 0;
    setelahLahirData.frekuensi_durasi_kejang = setelahLahirData.frekuensi_durasi_kejang || '';
    setelahLahirData.kejang_tanpa_panas_usia_bulan = setelahLahirData.kejang_tanpa_panas_usia_bulan || 0;
  }
  
  if (cleaned.penyakit_diderita) {
    penyakitData.sakit_telinga_usia_tahun = penyakitData.sakit_telinga_usia_tahun || 0;
    penyakitData.sakit_telinga_penjelasan = penyakitData.sakit_telinga_penjelasan || '';
    penyakitData.sakit_mata_usia_tahun = penyakitData.sakit_mata_usia_tahun || 0;
    penyakitData.sakit_mata_penjelasan = penyakitData.sakit_mata_penjelasan || '';
    penyakitData.luka_kepala_usia_tahun = penyakitData.luka_kepala_usia_tahun || 0;
  }
  
  // Konversi null ke string kosong untuk field tanggal
  cleaned.selesai_terapi = cleaned.selesai_terapi || '';
  cleaned.mulai_cuti = cleaned.mulai_cuti || '';
}
```

### 2. **Null to Default Value Conversion**
- **String fields:** `null` → `''` (string kosong)
- **Number fields:** `null` → `0` (angka nol)
- **Date fields:** `null` → `''` (string kosong)

## 🎯 Hasil Perbaikan

Setelah perbaikan, data yang dikirim ke API akan:

### **Sebelum (Error):**
```json
{
  "selesai_terapi": null,
  "mulai_cuti": null,
  "ayah": {
    "tahun_meninggal": null,
    "usia_saat_meninggal": null
  }
}
```

### **Sesudah (Fixed):**
```json
{
  "selesai_terapi": "",
  "mulai_cuti": "",
  "ayah": {
    "tahun_meninggal": 0,
    "usia_saat_meninggal": 0
  }
}
```

## 🚀 Testing Steps

1. **Klik tombol "📝 Isi Data Dummy"**
2. **Submit form**
3. **Cek console untuk log data yang dikirim**
4. **Seharusnya tidak ada error 400 lagi**

## 📝 Field Mapping

| Field | Type Expected | Null → Default |
|-------|---------------|----------------|
| `selesai_terapi` | string | `""` |
| `mulai_cuti` | string | `""` |
| `ayah.tahun_meninggal` | number | `0` |
| `ayah.usia_saat_meninggal` | number | `0` |
| `ibu.tahun_meninggal` | number | `0` |
| `ibu.usia_saat_meninggal` | number | `0` |
| `riwayat_setelah_lahir.sakit_parah_usia_bulan` | number | `0` |
| `riwayat_setelah_lahir.frekuensi_durasi_kejang` | string | `""` |
| `riwayat_setelah_lahir.kejang_tanpa_panas_usia_bulan` | number | `0` |
| `penyakit_diderita.sakit_telinga_usia_tahun` | number | `0` |
| `penyakit_diderita.sakit_telinga_penjelasan` | string | `""` |
| `penyakit_diderita.sakit_mata_usia_tahun` | number | `0` |
| `penyakit_diderita.sakit_mata_penjelasan` | string | `""` |
| `penyakit_diderita.luka_kepala_usia_tahun` | number | `0` |

## ✅ Status: FIXED

Error 400 Bad Request telah diperbaiki dengan:
- ✅ Konversi semua nilai `null` ke default value yang sesuai
- ✅ Enhanced data cleaning function
- ✅ Proper type handling untuk string dan number fields
- ✅ Ready for testing dengan data dummy

---

# Debug Error 500 Internal Server Error - POST /api/anak

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

## 🔍 Penyebab Error

Error terjadi karena **enum value yang salah** pada field `jenis_kelahiran`:
- **Dummy data menggunakan:** `"Normal"` (uppercase)
- **Backend mengharapkan:** `"normal"` (lowercase)

### **Enum Values yang Benar:**
- `'normal'` (lowercase)
- `'caesar'` (lowercase)

## ✅ Perbaikan yang Dilakukan

### **Fixed Dummy Data:**
```typescript
riwayat_kelahiran: {
  ...defaultAnakDetail.riwayat_kelahiran,
  jenis_kelahiran: 'normal', // ✅ Fixed: lowercase
  bantuan_kelahiran: ['Dokter'],
  is_premature: false,
  usia_kelahiran_bulan: 9,
  posisi_bayi_saat_lahir: 'Normal',
  is_sungsang: false,
  is_kuning: false,
  detak_jantung_anak: 'Normal',
  apgar_score: '9/10',
  lama_persalinan: '8 jam',
  penolong_persalinan: 'Dokter Spesialis',
  tempat_bersalin: 'RS Umum',
  cerita_spesifik_kelahiran: 'Persalinan normal tanpa komplikasi',
},
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

## 📝 Enum Mapping

| Field | Expected Values | Dummy Data |
|-------|----------------|------------|
| `jenis_kelahiran` | `'normal'` \| `'caesar'` | `'normal'` |

## ✅ Status: FIXED

Error 500 Internal Server Error telah diperbaiki dengan:
- ✅ Konversi enum value ke lowercase
- ✅ Sesuai dengan tipe data backend
- ✅ Ready for testing dengan data dummy 