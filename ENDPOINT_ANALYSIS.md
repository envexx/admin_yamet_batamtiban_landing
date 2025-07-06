# 🔍 Analisis Endpoint Frontend vs Backend

## 📊 **Ringkasan Ketidaksesuaian**

Setelah menganalisis dokumentasi API backend dan implementasi frontend, ditemukan beberapa **ketidaksesuaian endpoint** yang menyebabkan error 500 di Postman.

## ❌ **Endpoint yang TIDAK ADA di Backend tapi Digunakan di Frontend**

### 1. **Family CRUD Endpoints**
```javascript
// ❌ TIDAK TERSEDIA di backend
POST /patients/:id/family     // Create family
PUT /patients/:id/family      // Update family  
DELETE /patients/:id/family   // Delete family
```

### 2. **Assessment CRUD Endpoints**
```javascript
// ❌ TIDAK TERSEDIA di backend
POST /patients/:id/assessments                    // Create assessment
PUT /patients/:id/assessments/:assessmentId       // Update assessment
DELETE /patients/:id/assessments/:assessmentId    // Delete assessment
```

### 3. **Program CRUD Endpoints**
```javascript
// ❌ TIDAK TERSEDIA di backend
POST /patients/:id/programs                    // Create program
PUT /patients/:id/programs/:programId          // Update program
DELETE /patients/:id/programs/:programId       // Delete program
```

## ✅ **Endpoint yang SUDAH SESUAI**

```javascript
// ✅ TERSEDIA di backend
GET /patients/:id/family       // Get family data
GET /patients/:id/assessments  // Get assessments data
GET /patients/:id/programs     // Get programs data
```

## 🛠️ **Solusi yang Sudah Diterapkan**

### 1. **Update API Service (`src/services/api.ts`)**
- ✅ Menghapus semua fungsi CRUD untuk family, assessment, dan program
- ✅ Hanya menyisakan fungsi GET yang tersedia di backend
- ✅ Menambahkan komentar penjelasan

### 2. **Update Komponen Frontend**
- ✅ **PatientList**: Modal family/assessment/program sekarang read-only
- ✅ **PatientWizardForm**: Hanya menyimpan data patient, tidak family/assessment/program
- ✅ **PatientCreateWizard**: Hanya menyimpan data patient
- ✅ **PatientDetail**: CRUD operations diganti dengan alert

### 3. **User Experience**
- ✅ Menampilkan pesan warning bahwa fitur edit tidak tersedia
- ✅ Data tetap ditampilkan dalam mode read-only
- ✅ Alert memberitahu user untuk hubungi administrator

## 🚨 **Rekomendasi untuk Backend Team**

### **PRIORITAS TINGGI: Implementasi CRUD Endpoints**

#### 1. **Family Endpoints**
```javascript
// Perlu diimplementasikan di backend
POST /patients/:id/family
PUT /patients/:id/family  
DELETE /patients/:id/family
```

#### 2. **Assessment Endpoints**
```javascript
// Perlu diimplementasikan di backend
POST /patients/:id/assessments
PUT /patients/:id/assessments/:assessmentId
DELETE /patients/:id/assessments/:assessmentId
```

#### 3. **Program Endpoints**
```javascript
// Perlu diimplementasikan di backend
POST /patients/:id/programs
PUT /patients/:id/programs/:programId
DELETE /patients/:id/programs/:programId
```

### **Data Models yang Diperlukan**

#### Family Model
```javascript
{
  id: number,
  pasien_id: number,
  nama_ayah: string,
  tanggal_lahir_ayah: string,
  pendidikan_ayah: string,
  pekerjaan_ayah: string,
  telepon_ayah: string,
  nama_ibu: string,
  tanggal_lahir_ibu: string,
  pendidikan_ibu: string,
  pekerjaan_ibu: string,
  telepon_ibu: string
}
```

#### Assessment Model
```javascript
{
  id: number,
  pasien_id: number,
  jenis_assessment: "INITIAL" | "RE_EVAL_1" | "RE_EVAL_2" | "RE_EVAL_3" | "RE_EVAL_4",
  tanggal_assessment: string,
  diagnosis: string,
  url_video?: string,
  url_dokumen?: string
}
```

#### Program Model
```javascript
{
  id: number,
  pasien_id: number,
  fase_program: "INITIAL" | "AFTER_RE_EVAL_1" | "AFTER_RE_EVAL_2" | "AFTER_RE_EVAL_3" | "AFTER_RE_EVAL_4",
  sesi_bt: number,
  sesi_ot: number,
  sesi_tw: number,
  sesi_cbt: number,
  sesi_akb: number,
  sesi_si: number,
  sesi_ft: number,
  sesi_bg: number,
  sesi_ns: number,
  sesi_ht: number,
  total_sesi: number
}
```

## 📋 **Status Saat Ini**

### ✅ **Yang Sudah Bekerja**
- Login/Register ✅
- Dashboard statistics ✅
- Patient CRUD (basic) ✅
- Excel upload/download ✅
- GET family/assessment/program data ✅

### ❌ **Yang Belum Bekerja**
- Family CRUD operations ❌
- Assessment CRUD operations ❌
- Program CRUD operations ❌

### 🔄 **Yang Sudah Diperbaiki**
- Frontend tidak lagi memanggil endpoint yang tidak ada ✅
- User mendapat feedback yang jelas ✅
- Data tetap dapat ditampilkan (read-only) ✅

## 🎯 **Langkah Selanjutnya**

1. **Backend Team**: Implementasikan CRUD endpoints yang hilang
2. **Frontend Team**: Aktifkan kembali fungsi CRUD setelah backend siap
3. **Testing**: Test semua endpoint dengan Postman
4. **Documentation**: Update dokumentasi API

## 📞 **Kontak**

Jika ada pertanyaan atau perlu bantuan implementasi, silakan hubungi tim backend untuk koordinasi lebih lanjut.

---

**Last Updated:** January 2024  
**Status:** Frontend sudah disesuaikan dengan endpoint yang tersedia  
**Next Action:** Implementasi CRUD endpoints di backend 

# Endpoint Analysis

## Existing Endpoints

### Auth Endpoints
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/update` - Update user profile
- `GET /api/auth/users` - Get all users
- `POST /api/auth/toggle-active` - Toggle user status
- `PUT /api/auth/users/:id` - Update user

### Dashboard Endpoints
- `GET /api/dashboard/stats` - Get dashboard statistics

### Anak Endpoints
- `GET /api/anak` - Get all anak with pagination and filters
- `GET /api/anak/:id` - Get anak by ID
- `POST /api/anak` - Create new anak
- `PUT /api/anak/:id` - Update anak
- `DELETE /api/anak/:id` - Delete anak
- `GET /api/anak/:id/complete` - Get complete anak data
- `GET /api/anak/:id/dashboard` - Get anak dashboard data

### Survey Endpoints (MongoDB)
- `GET /api/anak/:id/survey` - Get survey data
- `POST /api/anak/:id/survey` - Create survey data
- `PUT /api/anak/:id/survey` - Update survey data

### Medical History Endpoints (MongoDB)
- `GET /api/anak/:id/riwayat-medis` - Get medical history
- `POST /api/anak/:id/riwayat-medis` - Create medical history
- `PUT /api/anak/:id/riwayat-medis` - Update medical history

### Assessment Endpoints
- `GET /api/assessment` - Get all assessments
- `GET /api/assessment/:id` - Get assessment by ID
- `POST /api/assessment` - Create assessment
- `PUT /api/assessment/:id` - Update assessment
- `DELETE /api/assessment/:id` - Delete assessment

### Program Terapi Endpoints
- `GET /api/program-terapi` - Get all program terapi
- `GET /api/program-terapi/:id` - Get program terapi by ID
- `POST /api/program-terapi` - Create program terapi
- `PUT /api/program-terapi/:id` - Update program terapi
- `DELETE /api/program-terapi/:id` - Delete program terapi

## New Endpoints Needed

### Auto-Generate Nomor Anak
**Implementation:** Menggunakan endpoint `/api/anak` yang sudah ada

**Logic:**
1. Ambil semua data anak dari endpoint `/api/anak` dengan sorting berdasarkan `nomor_anak` DESC
2. Cari nomor anak terakhir dengan format `YAMET-YYYY-XXXX` untuk tahun saat ini
3. Extract nomor urut dari nomor terakhir
4. Increment nomor urut
5. Generate nomor baru dengan format `YAMET-YYYY-XXXX`

**Frontend Implementation:**
```typescript
// Di src/services/api.ts
getNextNumber: async (): Promise<ApiResponse<{ nextNumber: string }>> => {
  try {
    // Ambil semua anak untuk mencari nomor terakhir
    const response = await api.get('/anak', {
      params: {
        page: 1,
        limit: 1000,
        sortBy: 'nomor_anak',
        sortOrder: 'DESC'
      }
    });
    
    if (response.data.status === 'success' && response.data.data) {
      const anakList = response.data.data;
      const currentYear = new Date().getFullYear();
      
      // Cari nomor anak terakhir dengan format YAMET-YYYY-XXXX atau YAMET-YYYY-XXXXX
      let lastNumber = 0;
      const yametPattern4Digit = new RegExp(`^YAMET-${currentYear}-(\\d{4})$`);
      const yametPattern5Digit = new RegExp(`^YAMET-${currentYear}-(\\d{5})$`);
      
      for (const anak of anakList) {
        if (anak.nomor_anak) {
          // Cek format 4 digit dulu
          if (yametPattern4Digit.test(anak.nomor_anak)) {
            const match = anak.nomor_anak.match(yametPattern4Digit);
            if (match) {
              const number = parseInt(match[1], 10);
              if (number > lastNumber) {
                lastNumber = number;
              }
            }
          }
          // Cek format 5 digit juga
          else if (yametPattern5Digit.test(anak.nomor_anak)) {
            const match = anak.nomor_anak.match(yametPattern5Digit);
            if (match) {
              const number = parseInt(match[1], 10);
              if (number > lastNumber) {
                lastNumber = number;
              }
            }
          }
        }
      }
      
      // Generate nomor berikutnya dengan format 4 digit
      const nextNumber = lastNumber + 1;
      const nextNumberString = `YAMET-${currentYear}-${nextNumber.toString().padStart(4, '0')}`;
      
      return {
        status: 'success',
        message: 'Next number generated successfully',
        data: { nextNumber: nextNumberString }
      };
    }
    
    // Fallback jika tidak ada data
    const currentYear = new Date().getFullYear();
    return {
      status: 'success',
      message: 'Next number generated successfully',
      data: { nextNumber: `YAMET-${currentYear}-0001` }
    };
    
  } catch (error) {
    // Fallback jika terjadi error
    const currentYear = new Date().getFullYear();
    return {
      status: 'success',
      message: 'Next number generated successfully',
      data: { nextNumber: `YAMET-${currentYear}-0001` }
    };
  }
}
```

**Format Nomor:**
- Format: `YAMET-YYYY-XXXX` (contoh: YAMET-2025-0001, YAMET-2025-0002, etc.)
- YYYY: Tahun saat ini
- XXXX: Nomor urut 4 digit dengan leading zeros
- Reset ke 0001 setiap tahun baru

**Compatibility:**
- Mendukung format lama: `YAMET-YYYY-XXXXX` (5 digit)
- Generate format baru: `YAMET-YYYY-XXXX` (4 digit)
- Contoh: Jika ada `YAMET-2025-00001` dan `YAMET-2025-00002`, next number = `YAMET-2025-0003`

**Request:**
```http
GET /api/anak/next-number
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "message": "Next number generated successfully",
  "data": {
    "nextNumber": "YAMET-2024-0001"
  }
}
```

**Logic:**
1. Query database untuk mendapatkan nomor anak terakhir dengan format YAMET-YYYY-XXXX
2. Extract nomor urut dari nomor terakhir
3. Increment nomor urut
4. Generate nomor baru dengan format YAMET-YYYY-XXXX
5. Return nomor baru

**Database Query Example:**
```sql
-- Get last nomor_anak with YAMET format
SELECT nomor_anak 
FROM anak 
WHERE nomor_anak LIKE 'YAMET-%' 
ORDER BY nomor_anak DESC 
LIMIT 1;

-- If no existing number, start with YAMET-2024-0001
-- If exists, extract number and increment
```

**Implementation Notes:**
- Format: YAMET-YYYY-XXXX (YAMET-2024-0001, YAMET-2024-0002, etc.)
- Year should be current year
- Number should be 4 digits with leading zeros
- Handle case when no existing numbers (start with 0001)
- Handle year change (reset to 0001 for new year)
</rewritten_file> 