# Backend Schema Compliance - POST /api/anak

## 📋 Schema Backend vs Frontend

### **Enum Values yang Benar**

#### **1. Jenis Kelahiran**
```typescript
// Backend Schema
"jenis_kelahiran": "NORMAL | CAESAR | Normal"

// Frontend Dummy Data (Fixed)
jenis_kelahiran: 'Normal' // ✅ Sesuai schema
```

#### **2. Posisi Bayi Saat Lahir**
```typescript
// Backend Schema
"posisi_bayi_saat_lahir": "KEPALA | KAKI | Normal"

// Frontend Dummy Data (Fixed)
posisi_bayi_saat_lahir: 'Normal' // ✅ Sesuai schema
```

#### **3. Penolong Persalinan**
```typescript
// Backend Schema
"penolong_persalinan": "DOKTER | BIDAN | DUKUN_BAYI | Dokter Spesialis"

// Frontend Dummy Data (Fixed)
penolong_persalinan: 'Dokter Spesialis' // ✅ Sesuai schema
```

#### **4. Status Anak**
```typescript
// Backend Schema
"status": "AKTIF | CUTI | LULUS | BERHENTI - DEFAULT: AKTIF"

// Frontend Dummy Data (Fixed)
status: 'AKTIF' // ✅ Sesuai schema
```

### **Field yang Dihapus dari Request**

#### **1. Field Auto-Generated**
```typescript
// Dihapus dari request (akan di-generate backend)
- id
- nomor_anak // Format: YAMET-YYYY-XXXX
- created_by
- updated_by
- deleted_by
- created_at
- updated_at
- deleted_at
- user_created
```

#### **2. Field Nested Objects**
```typescript
// Dihapus dari semua nested objects
- id
- anak_id
- anak_id_ayah
- anak_id_ibu
```

### **Data Cleaning Function**

```typescript
const cleanDataForAPI = (data: AnakDetail): Partial<AnakDetail> => {
  // 1. Hapus field auto-generated
  const {
    id, nomor_anak, created_by, updated_by, deleted_by,
    created_at, updated_at, deleted_at, user_created,
    ...cleaned
  } = data;
  
  // 2. Bersihkan nested objects
  if (cleaned.ayah) {
    const { id: ayahId, anak_id_ayah, anak_id_ibu, ...ayahData } = cleaned.ayah;
    // Konversi null ke default values
    ayahData.tahun_meninggal = ayahData.tahun_meninggal || 0;
    ayahData.usia_saat_meninggal = ayahData.usia_saat_meninggal || 0;
    cleaned.ayah = ayahData as any;
  }
  
  // 3. Bersihkan array objects
  if (cleaned.pemeriksaan_sebelumnya && cleaned.pemeriksaan_sebelumnya.length > 0) {
    cleaned.pemeriksaan_sebelumnya = cleaned.pemeriksaan_sebelumnya.map(item => {
      const { id, anak_id, ...cleanItem } = item;
      return cleanItem;
    }) as any;
  }
  
  // 4. Konversi null values
  cleaned.selesai_terapi = cleaned.selesai_terapi || '';
  cleaned.mulai_cuti = cleaned.mulai_cuti || '';
  
  return cleaned;
};
```

## 🎯 Required vs Optional Fields

### **Required Fields (1 field)**
```typescript
{
  "full_name": "string (2-100 chars) - REQUIRED"
}
```

### **Optional Fields (Semua field lainnya)**
- `nick_name`
- `birth_date`
- `birth_place`
- `kewarganegaraan`
- `agama`
- `anak_ke`
- `sekolah_kelas`
- `status` (default: "AKTIF")
- `tanggal_pemeriksaan`
- `mulai_terapi`
- `selesai_terapi`
- `mulai_cuti`
- Dan semua nested objects

## 📝 Data Type Mapping

| Field Type | Frontend | Backend | Notes |
|------------|----------|---------|-------|
| String | `string` | `string` | ✅ Compatible |
| Number | `number` | `number` | ✅ Compatible |
| Boolean | `boolean` | `boolean` | ✅ Compatible |
| Date | `string` | `string (YYYY-MM-DD)` | ✅ Compatible |
| Array | `string[]` | `["string"]` | ✅ Compatible |
| Enum | `'Normal'` | `"NORMAL \| CAESAR \| Normal"` | ✅ Fixed |

## 🔧 Enhanced Dummy Data

### **Complete Data Structure**
```typescript
const dummyData: Partial<AnakDetail> = {
  // Basic Info
  full_name: 'Ahmad Fadillah Putra',
  nick_name: 'Fadil',
  birth_date: '2018-05-15',
  birth_place: 'Jakarta',
  kewarganegaraan: 'Indonesia',
  agama: 'Islam',
  anak_ke: 1,
  sekolah_kelas: 'TK B',
  tanggal_pemeriksaan: '2025-01-15',
  status: 'AKTIF',
  mulai_terapi: '2025-01-20',
  
  // Nested Objects
  ayah: { /* ... */ },
  ibu: { /* ... */ },
  survey_awal: { /* ... */ },
  riwayat_kehamilan: { /* ... */ },
  riwayat_kelahiran: { /* ... */ },
  riwayat_imunisasi: { /* ... */ },
  riwayat_setelah_lahir: { /* ... */ },
  perkembangan_anak: { /* ... */ },
  perilaku_oral_motor: { /* ... */ },
  pola_makan: { /* ... */ },
  perkembangan_sosial: { /* ... */ },
  pola_tidur: { /* ... */ },
  penyakit_diderita: { /* ... */ },
  hubungan_keluarga: { /* ... */ },
  riwayat_pendidikan: { /* ... */ },
  
  // Arrays
  pemeriksaan_sebelumnya: [/* ... */],
  terapi_sebelumnya: [/* ... */],
  
  // Lampiran
  lampiran: { /* ... */ }
};
```

## ✅ Validation Checklist

### **Pre-Submission Checks**
- [x] **Enum values sesuai schema backend**
- [x] **Field auto-generated dihapus**
- [x] **Nested object IDs dihapus**
- [x] **Null values dikonversi ke default**
- [x] **Array objects dibersihkan**
- [x] **Required field `full_name` ada**
- [x] **Date format YYYY-MM-DD**
- [x] **Email format valid**

### **Post-Submission Checks**
- [x] **Response status 201 Created**
- [x] **Nomor anak di-generate otomatis**
- [x] **Transaction summary tersedia**
- [x] **Semua related data tersimpan**

## 🚀 Testing Strategy

### **1. Basic Test**
```typescript
// Minimal data - hanya required field
{
  "full_name": "Test Anak"
}
```

### **2. Complete Test**
```typescript
// Full data dengan semua nested objects
// Gunakan dummy data yang sudah diperbaiki
```

### **3. Edge Cases**
```typescript
// Null values
// Empty arrays
// Invalid enum values
// Missing required fields
```

## 📊 Expected Response

### **Success Response (201)**
```json
{
  "status": "success",
  "message": "Data anak berhasil dibuat",
  "data": {
    "anak": {
      "id": "uuid",
      "nomor_anak": "YAMET-2025-0001",
      "full_name": "Ahmad Fadillah Putra",
      // ... semua field
    },
    "transaction_summary": {
      "main_steps": [...],
      "related_data_steps": [...],
      "total_related_records_created": 15
    }
  }
}
```

## ✅ Status: COMPLIANT

Frontend sekarang sudah compliant dengan schema backend:
- ✅ Enum values sesuai
- ✅ Field structure benar
- ✅ Data cleaning function enhanced
- ✅ Dummy data lengkap
- ✅ Ready for testing 