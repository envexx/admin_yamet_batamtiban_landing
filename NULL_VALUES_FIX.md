# Null Values Fix - Backend Schema Compliance

## 🐛 Masalah yang Ditemukan

Backend mengharapkan `null` untuk field yang tidak diisi, bukan string kosong atau angka 0:

### **String Empty vs Null**
```typescript
// ❌ Sebelum (Error)
selesai_terapi: "" (string kosong) - seharusnya null
mulai_cuti: "" (string kosong) - seharusnya null
frekuensi_durasi_kejang: "" (string kosong) - seharusnya null
sakit_telinga_penjelasan: "" (string kosong) - seharusnya null
sakit_mata_penjelasan: "" (string kosong) - seharusnya null
tinggal_dengan_lainnya: "" (string kosong) - seharusnya null
```

### **Number 0 vs Null**
```typescript
// ❌ Sebelum (Error)
tahun_meninggal: 0 - seharusnya null
usia_saat_meninggal: 0 - seharusnya null
sakit_parah_usia_bulan: 0 - seharusnya null
kejang_tanpa_panas_usia_bulan: 0 - seharusnya null
sakit_telinga_usia_tahun: 0 - seharusnya null
sakit_mata_usia_tahun: 0 - seharusnya null
luka_kepala_usia_tahun: 0 - seharusnya null
```

## ✅ Perbaikan yang Dilakukan

### **Enhanced Data Cleaning Function**

```typescript
const cleanDataForAPI = (data: AnakDetail): Partial<AnakDetail> => {
  // ... existing cleaning logic
  
  // Ayah - Konversi 0 ke null
  if (cleaned.ayah) {
    ayahData.tahun_meninggal = ayahData.tahun_meninggal === 0 ? null : ayahData.tahun_meninggal;
    ayahData.usia_saat_meninggal = ayahData.usia_saat_meninggal === 0 ? null : ayahData.usia_saat_meninggal;
  }
  
  // Ibu - Konversi 0 ke null
  if (cleaned.ibu) {
    ibuData.tahun_meninggal = ibuData.tahun_meninggal === 0 ? null : ibuData.tahun_meninggal;
    ibuData.usia_saat_meninggal = ibuData.usia_saat_meninggal === 0 ? null : ibuData.usia_saat_meninggal;
  }
  
  // Riwayat Setelah Lahir - Konversi string kosong dan 0 ke null
  if (cleaned.riwayat_setelah_lahir) {
    setelahLahirData.sakit_parah_usia_bulan = setelahLahirData.sakit_parah_usia_bulan === 0 ? null : setelahLahirData.sakit_parah_usia_bulan;
    setelahLahirData.frekuensi_durasi_kejang = setelahLahirData.frekuensi_durasi_kejang === '' ? null : setelahLahirData.frekuensi_durasi_kejang;
    setelahLahirData.kejang_tanpa_panas_usia_bulan = setelahLahirData.kejang_tanpa_panas_usia_bulan === 0 ? null : setelahLahirData.kejang_tanpa_panas_usia_bulan;
  }
  
  // Penyakit Diderita - Konversi string kosong dan 0 ke null
  if (cleaned.penyakit_diderita) {
    penyakitData.sakit_telinga_usia_tahun = penyakitData.sakit_telinga_usia_tahun === 0 ? null : penyakitData.sakit_telinga_usia_tahun;
    penyakitData.sakit_telinga_penjelasan = penyakitData.sakit_telinga_penjelasan === '' ? null : penyakitData.sakit_telinga_penjelasan;
    penyakitData.sakit_mata_usia_tahun = penyakitData.sakit_mata_usia_tahun === 0 ? null : penyakitData.sakit_mata_usia_tahun;
    penyakitData.sakit_mata_penjelasan = penyakitData.sakit_mata_penjelasan === '' ? null : penyakitData.sakit_mata_penjelasan;
    penyakitData.luka_kepala_usia_tahun = penyakitData.luka_kepala_usia_tahun === 0 ? null : penyakitData.luka_kepala_usia_tahun;
  }
  
  // Hubungan Keluarga - Konversi string kosong ke null
  if (cleaned.hubungan_keluarga) {
    hubunganData.tinggal_dengan_lainnya = hubunganData.tinggal_dengan_lainnya === '' ? null : hubunganData.tinggal_dengan_lainnya;
  }
  
  // Field Tanggal - Konversi string kosong ke null
  if (cleaned.selesai_terapi === '') {
    (cleaned as any).selesai_terapi = null;
  }
  if (cleaned.mulai_cuti === '') {
    (cleaned as any).mulai_cuti = null;
  }
  
  return cleaned;
};
```

## 🎯 Hasil Perbaikan

### **Sebelum (Error):**
```json
{
  "selesai_terapi": "",
  "mulai_cuti": "",
  "ayah": {
    "tahun_meninggal": 0,
    "usia_saat_meninggal": 0
  },
  "riwayat_setelah_lahir": {
    "sakit_parah_usia_bulan": 0,
    "frekuensi_durasi_kejang": "",
    "kejang_tanpa_panas_usia_bulan": 0
  },
  "penyakit_diderita": {
    "sakit_telinga_usia_tahun": 0,
    "sakit_telinga_penjelasan": "",
    "sakit_mata_usia_tahun": 0,
    "sakit_mata_penjelasan": "",
    "luka_kepala_usia_tahun": 0
  },
  "hubungan_keluarga": {
    "tinggal_dengan_lainnya": ""
  }
}
```

### **Sesudah (Fixed):**
```json
{
  "selesai_terapi": null,
  "mulai_cuti": null,
  "ayah": {
    "tahun_meninggal": null,
    "usia_saat_meninggal": null
  },
  "riwayat_setelah_lahir": {
    "sakit_parah_usia_bulan": null,
    "frekuensi_durasi_kejang": null,
    "kejang_tanpa_panas_usia_bulan": null
  },
  "penyakit_diderita": {
    "sakit_telinga_usia_tahun": null,
    "sakit_telinga_penjelasan": null,
    "sakit_mata_usia_tahun": null,
    "sakit_mata_penjelasan": null,
    "luka_kepala_usia_tahun": null
  },
  "hubungan_keluarga": {
    "tinggal_dengan_lainnya": null
  }
}
```

## 📝 Field Mapping

| Field | Type | Conversion Rule | Notes |
|-------|------|----------------|-------|
| `selesai_terapi` | string | `""` → `null` | Tanggal optional |
| `mulai_cuti` | string | `""` → `null` | Tanggal optional |
| `ayah.tahun_meninggal` | number | `0` → `null` | Tahun meninggal optional |
| `ayah.usia_saat_meninggal` | number | `0` → `null` | Usia meninggal optional |
| `ibu.tahun_meninggal` | number | `0` → `null` | Tahun meninggal optional |
| `ibu.usia_saat_meninggal` | number | `0` → `null` | Usia meninggal optional |
| `riwayat_setelah_lahir.sakit_parah_usia_bulan` | number | `0` → `null` | Usia bulan optional |
| `riwayat_setelah_lahir.frekuensi_durasi_kejang` | string | `""` → `null` | Penjelasan optional |
| `riwayat_setelah_lahir.kejang_tanpa_panas_usia_bulan` | number | `0` → `null` | Usia bulan optional |
| `penyakit_diderita.sakit_telinga_usia_tahun` | number | `0` → `null` | Usia tahun optional |
| `penyakit_diderita.sakit_telinga_penjelasan` | string | `""` → `null` | Penjelasan optional |
| `penyakit_diderita.sakit_mata_usia_tahun` | number | `0` → `null` | Usia tahun optional |
| `penyakit_diderita.sakit_mata_penjelasan` | string | `""` → `null` | Penjelasan optional |
| `penyakit_diderita.luka_kepala_usia_tahun` | number | `0` → `null` | Usia tahun optional |
| `hubungan_keluarga.tinggal_dengan_lainnya` | string | `""` → `null` | Penjelasan optional |

## 🚀 Testing Steps

1. **Klik tombol "📝 Isi Data Dummy"**
2. **Submit form**
3. **Cek console untuk log data yang dikirim**
4. **Periksa bahwa field kosong dikirim sebagai `null`**

## ⚠️ Linter Issues

Ada beberapa linter error yang perlu diperbaiki:
- Type assertion untuk field yang bisa null
- React component return type
- TypeScript strict mode compatibility

## ✅ Status: PARTIALLY FIXED

Perbaikan null values telah dilakukan:
- ✅ Logic conversion sudah benar
- ✅ Field mapping lengkap
- ⚠️ Linter errors perlu diperbaiki
- ✅ Ready for testing

## 🔧 Next Steps

1. **Test dengan data dummy**
2. **Periksa response dari backend**
3. **Fix linter errors jika diperlukan**
4. **Update documentation jika ada perubahan** 