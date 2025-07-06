# Dokumentasi Perbaikan AnakEditForm

## Ringkasan
Dokumen ini menjelaskan perbaikan dan peningkatan yang dilakukan pada komponen `AnakEditForm.tsx` untuk mengatasi masalah error 400 (Bad Request) dan memastikan form edit memiliki fungsionalitas yang lengkap seperti form add.

## Masalah yang Diatasi

### 1. Error 400 (Bad Request)
**Penyebab:**
- Field date (`mulai_terapi`, `selesai_terapi`, `mulai_cuti`) mengirim nilai `null` ke backend
- Backend mengharapkan string tetapi menerima null
- Data yang dikirim terlalu kompleks dan mengandung field yang tidak diperlukan

**Solusi:**
```typescript
// Sebelum
mulai_terapi: anakData.mulai_terapi,
selesai_terapi: anakData.selesai_terapi,
mulai_cuti: anakData.mulai_cuti,

// Sesudah
mulai_terapi: anakData.mulai_terapi || '',
selesai_terapi: anakData.selesai_terapi || '',
mulai_cuti: anakData.mulai_cuti || '',
```

### 2. Struktur Form Tidak Lengkap
**Penyebab:**
- Form edit hanya memiliki section Lampiran
- Section lain seperti Data Anak, Data Orang Tua, dll. tidak ada

**Solusi:**
Menambahkan semua section yang ada di form add:
- Data Anak
- Data Orang Tua (Ayah & Ibu)
- Survey Awal
- Riwayat Kehamilan
- Riwayat Kelahiran
- Imunisasi
- Setelah Lahir
- Perkembangan Anak
- Perilaku Oral Motor
- Pola Makan
- Perkembangan Sosial
- Pola Tidur
- Penyakit Diderita
- Hubungan Keluarga
- Riwayat Pendidikan
- Pemeriksaan Sebelumnya
- Terapi Sebelumnya
- Lampiran

### 3. Struktur Data Orang Tua Tidak Konsisten
**Penyebab:**
- Form edit memiliki section terpisah untuk "Data Ayah" dan "Data Ibu"
- Form add memiliki satu section "Data Orang Tua" dengan sub-section

**Solusi:**
Menggabungkan data ayah dan ibu dalam satu section dengan layout yang konsisten:
```typescript
{/* Data Orang Tua */}
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
  <h2 className="text-xl font-semibold mb-4">Data Orang Tua</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Ayah */}
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-2">Ayah</h3>
      {/* Form fields untuk ayah */}
    </div>
    {/* Ibu */}
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-2">Ibu</h3>
      {/* Form fields untuk ibu */}
    </div>
  </div>
</div>
```

## Perbaikan Teknis

### 1. Data Cleaning
**Sebelum:**
```typescript
const { user_created, created_at, updated_at, deleted_at, ...cleanData } = anakData;
```

**Sesudah:**
```typescript
const essentialData = {
  nomor_anak: anakData.nomor_anak,
  full_name: anakData.full_name,
  // ... field lainnya
  mulai_terapi: anakData.mulai_terapi || '',
  selesai_terapi: anakData.selesai_terapi || '',
  mulai_cuti: anakData.mulai_cuti || '',
  // ... nested objects
};
```

### 2. Error Handling
Menambahkan logging yang lebih detail untuk debugging:
```typescript
} catch (err: any) {
  console.error('Error updating anak:', err);
  console.error('Error response:', err.response?.data);
  setError(err.response?.data?.message || err.message || 'Gagal menyimpan data');
}
```

### 3. Lampiran Management
Memperbaiki fungsi upload dan delete lampiran:
- Menambahkan loading state untuk setiap file
- Update UI immediately setelah upload/delete
- Refresh data dari server setelah perubahan
- Error handling yang lebih baik

## Fitur yang Ditambahkan

### 1. Form Sections Lengkap
Semua section dari form add telah ditambahkan ke form edit dengan:
- Input binding yang benar
- Nested state handling
- Dynamic tables untuk boolean fields
- File upload functionality

### 2. UI/UX Improvements
- Error display yang lebih informatif
- Loading states untuk semua operasi
- Consistent styling dengan form add
- Responsive layout

### 3. Data Validation
- Konversi null ke empty string untuk date fields
- Proper type handling untuk nested objects
- Validation sebelum submit

## Struktur File

```
src/components/Patients/AnakEditForm.tsx
├── State Management
│   ├── anakData (AnakDetail)
│   ├── loading (boolean)
│   ├── error (string | null)
│   ├── selectedFileNames (object)
│   └── lampiranLoading (object)
├── Event Handlers
│   ├── handleChange (nested state updates)
│   ├── handleSubmit (data validation & submission)
│   ├── handleLampiranChange (file upload)
│   └── handleLampiranDelete (file deletion)
└── Form Sections
    ├── Data Anak
    ├── Data Orang Tua
    ├── Survey Awal
    ├── Riwayat Kehamilan
    ├── Riwayat Kelahiran
    ├── Imunisasi
    ├── Setelah Lahir
    ├── Perkembangan Anak
    ├── Perilaku Oral Motor
    ├── Pola Makan
    ├── Perkembangan Sosial
    ├── Pola Tidur
    ├── Penyakit Diderita
    ├── Hubungan Keluarga
    ├── Riwayat Pendidikan
    ├── Pemeriksaan Sebelumnya
    ├── Terapi Sebelumnya
    └── Lampiran
```

## Testing

### Test Cases
1. **Edit Data Dasar**: Mengubah nama, tanggal lahir, dll.
2. **Edit Data Orang Tua**: Mengubah data ayah dan ibu
3. **Edit Survey Awal**: Mengubah checkbox dan array fields
4. **Upload Lampiran**: Upload file baru
5. **Delete Lampiran**: Hapus file yang ada
6. **Submit Form**: Simpan semua perubahan

### Expected Results
- Tidak ada error 400
- Data tersimpan dengan benar
- UI update sesuai perubahan
- Navigasi kembali ke list setelah save

## Dependencies

### Required Types
```typescript
import { AnakDetail } from '../../types';
```

### Required Components
```typescript
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';
```

### Required Services
```typescript
import { anakAPI } from '../../services/api';
```

## Kesimpulan

Perbaikan AnakEditForm telah berhasil:
1. ✅ Mengatasi error 400 dengan proper data validation
2. ✅ Menambahkan semua section yang diperlukan
3. ✅ Menyeragamkan struktur dengan form add
4. ✅ Memperbaiki UX dengan loading states dan error handling
5. ✅ Memastikan konsistensi data dengan backend

Form edit sekarang memiliki fungsionalitas yang lengkap dan dapat digunakan untuk mengedit semua data anak dengan aman dan efisien. 

# Dokumentasi Data Form Edit Anak

## Endpoint
```
PUT /anak/{id}
```

## Struktur Data yang Dikirim

### 1. Data Dasar Anak
```typescript
{
  nomor_anak: string,
  full_name: string,
  nick_name: string,
  birth_date: string, // format: "YYYY-MM-DD"
  birth_place: string,
  kewarganegaraan: string,
  agama: string,
  anak_ke: number,
  sekolah_kelas: string,
  status: "AKTIF" | "NONAKTIF",
  tanggal_pemeriksaan: string, // format: "YYYY-MM-DD"
  mulai_terapi: string, // format: "YYYY-MM-DD" atau empty string
  selesai_terapi: string, // format: "YYYY-MM-DD" atau empty string
  mulai_cuti: string, // format: "YYYY-MM-DD" atau empty string
}
```

### 2. Data Ayah
```typescript
ayah: {
  nama: string,
  tempat_lahir: string,
  tanggal_lahir: string, // format: "YYYY-MM-DD"
  usia: number,
  agama: string,
  alamat_rumah: string,
  anak_ke: number,
  pernikahan_ke: number,
  usia_saat_menikah: number,
  pendidikan_terakhir: string,
  pekerjaan_saat_ini: string,
  telepon: string,
  email: string,
  tahun_meninggal: number | null,
  usia_saat_meninggal: number | null
}
```

### 3. Data Ibu
```typescript
ibu: {
  nama: string,
  tempat_lahir: string,
  tanggal_lahir: string, // format: "YYYY-MM-DD"
  usia: number,
  agama: string,
  alamat_rumah: string,
  anak_ke: number,
  pernikahan_ke: number,
  usia_saat_menikah: number,
  pendidikan_terakhir: string,
  pekerjaan_saat_ini: string,
  telepon: string,
  email: string,
  tahun_meninggal: number | null,
  usia_saat_meninggal: number | null
}
```

### 4. Survey Awal
```typescript
survey_awal: {
  mengetahui_yamet_dari: string,
  penjelasan_mekanisme: boolean,
  bersedia_online: boolean,
  keluhan_orang_tua: string[],
  tindakan_orang_tua: string[],
  kendala: string[]
}
```

### 5. Riwayat Kehamilan
```typescript
riwayat_kehamilan: {
  usia_ibu_saat_hamil: number,
  usia_ayah_saat_hamil: number,
  mual_sulit_makan: boolean,
  asupan_gizi_memadai: boolean,
  perawatan_kehamilan: boolean,
  kehamilan_diinginkan: boolean,
  berat_bayi_semester_normal: boolean,
  diabetes: boolean,
  hipertensi: boolean,
  asma: boolean,
  tbc: boolean,
  merokok: boolean,
  sekitar_perokok_berat: boolean,
  konsumsi_alkohol: boolean,
  konsumsi_obat_obatan: boolean,
  infeksi_virus: boolean,
  kecelakaan_trauma: boolean,
  pendarahan_flek: boolean,
  masalah_pernafasan: boolean
}
```

### 6. Riwayat Kelahiran
```typescript
riwayat_kelahiran: {
  jenis_kelahiran: string,
  alasan_sc: string,
  bantuan_kelahiran: string[],
  is_premature: boolean,
  usia_kelahiran_bulan: number,
  posisi_bayi_saat_lahir: string,
  is_sungsang: boolean,
  is_kuning: boolean,
  detak_jantung_anak: string,
  apgar_score: string,
  lama_persalinan: string,
  penolong_persalinan: string,
  tempat_bersalin: string,
  cerita_spesifik_kelahiran: string
}
```

### 7. Riwayat Imunisasi
```typescript
riwayat_imunisasi: {
  bgc: boolean,
  hep_b1: boolean,
  hep_b2: boolean,
  hep_b3: boolean,
  dpt_1: boolean,
  dpt_2: boolean,
  dpt_3: boolean,
  dpt_booster_1: boolean,
  polio_1: boolean,
  polio_2: boolean,
  polio_3: boolean,
  polio_4: boolean,
  polio_booster_1: boolean,
  campak_1: boolean,
  campak_2: boolean,
  hib_1: boolean,
  hib_2: boolean,
  hib_3: boolean,
  hib_4: boolean,
  mmr_1: boolean
}
```

### 8. Riwayat Setelah Lahir
```typescript
riwayat_setelah_lahir: {
  asi_sampai_usia_bulan: number,
  pernah_jatuh: boolean,
  jatuh_usia_bulan: number | null,
  jatuh_ketinggian_cm: number | null,
  pernah_sakit_parah: boolean,
  sakit_parah_usia_bulan: number | null,
  pernah_panas_tinggi: boolean,
  panas_tinggi_usia_bulan: number | null,
  disertai_kejang: boolean,
  frekuensi_durasi_kejang: number | null,
  pernah_kejang_tanpa_panas: boolean,
  kejang_tanpa_panas_usia_bulan: number | null,
  sakit_karena_virus: boolean,
  sakit_virus_usia_bulan: number | null,
  sakit_virus_jenis: string | null
}
```

### 9. Perkembangan Anak
```typescript
perkembangan_anak: {
  tengkurap_ya: boolean,
  tengkurap_usia: string,
  berguling_ya: boolean,
  berguling_usia: string,
  duduk_ya: boolean,
  duduk_usia: string,
  merayap_ya: boolean,
  merayap_usia: string,
  merangkak_ya: boolean,
  merangkak_usia: string,
  jongkok_ya: boolean,
  jongkok_usia: string,
  transisi_berdiri_ya: boolean,
  transisi_berdiri_usia: string,
  berdiri_tanpa_pegangan_ya: boolean,
  berdiri_tanpa_pegangan_usia: string,
  berlari_ya: boolean,
  berlari_usia: string,
  melompat_ya: boolean,
  melompat_usia: string,
  reflek_vokalisasi_ya: boolean,
  reflek_vokalisasi_usia: string,
  bubbling_ya: boolean,
  bubbling_usia: string,
  babbling_ya: boolean,
  babbling_usia: string,
  kata_pertama_ya: boolean,
  kata_pertama_usia: string,
  kalimat_pertama_ya: boolean,
  kalimat_pertama_usia: string,
  ekspresi_emosi_ya: boolean,
  ekspresi_emosi_usia: string
}
```

### 10. Perilaku Oral Motor
```typescript
perilaku_oral_motor: {
  mengeces: boolean,
  makan_makanan_keras: boolean,
  makan_makanan_berkuah: boolean,
  pilih_pilih_makanan: boolean,
  makan_di_emut: boolean,
  mengunyah_saat_makan: boolean,
  makan_langsung_telan: boolean
}
```

### 11. Pola Makan
```typescript
pola_makan: {
  pola_teratur: string,
  ada_pantangan_makanan: boolean,
  pantangan_makanan: string,
  keterangan_lainnya: string
}
```

### 12. Perkembangan Sosial
```typescript
perkembangan_sosial: {
  perilaku_bertemu_orang_baru: string,
  perilaku_bertemu_teman_sebaya: string,
  perilaku_bertemu_orang_lebih_tua: string,
  bermain_dengan_banyak_anak: string,
  keterangan_lainnya: string
}
```

### 13. Pola Tidur
```typescript
pola_tidur: {
  jam_tidur_teratur: boolean,
  sering_terbangun: boolean,
  jam_tidur_malam: string,
  jam_bangun_pagi: string
}
```

### 14. Penyakit Diderita
```typescript
penyakit_diderita: {
  sakit_telinga: boolean,
  sakit_telinga_usia_tahun: number | null,
  sakit_telinga_penjelasan: string | null,
  sakit_mata: boolean,
  sakit_mata_usia_tahun: number | null,
  sakit_mata_penjelasan: string | null,
  luka_kepala: boolean,
  luka_kepala_usia_tahun: number | null,
  penyakit_lainnya: string | null
}
```

### 15. Hubungan Keluarga
```typescript
hubungan_keluarga: {
  tinggal_dengan: string[],
  tinggal_dengan_lainnya: string,
  hubungan_ayah_ibu: string,
  hubungan_ayah_anak: string,
  hubungan_ibu_anak: string,
  hubungan_saudara_dengan_anak: string,
  hubungan_nenek_kakek_dengan_anak: string,
  hubungan_saudara_ortu_dengan_anak: string,
  hubungan_pengasuh_dengan_anak: string
}
```

### 16. Riwayat Pendidikan
```typescript
riwayat_pendidikan: {
  mulai_sekolah_formal_usia: string,
  mulai_sekolah_informal_usia: string,
  sekolah_formal_diikuti: string,
  sekolah_informal_diikuti: string,
  bimbingan_belajar: boolean,
  bimbingan_belajar_jenis: string,
  bimbingan_belajar_usia: string,
  pernah_tinggal_kelas: boolean,
  tinggal_kelas_berapa_kali: number,
  keluhan_guru: string[]
}
```

### 17. Pemeriksaan Sebelumnya
```typescript
pemeriksaan_sebelumnya: Array<{
  tanggal_pemeriksaan: string,
  tempat_pemeriksaan: string,
  hasil_pemeriksaan: string,
  tindakan_yang_dilakukan: string
}>
```

### 18. Terapi Sebelumnya
```typescript
terapi_sebelumnya: Array<{
  jenis_terapi: string,
  tempat_terapi: string,
  lama_terapi: string,
  hasil_terapi: string
}>
```

### 19. Lampiran
```typescript
lampiran: {
  hasil_eeg_url: string,
  hasil_bera_url: string,
  hasil_ct_scan_url: string,
  program_terapi_3bln_url: string,
  hasil_psikologis_psikiatris_url: string,
  keterangan_tambahan: string
}
```

## Catatan Penting

1. **Date Fields**: Semua field tanggal menggunakan format "YYYY-MM-DD"
2. **Null Handling**: Field yang bisa null dikonversi ke empty string jika null
3. **Boolean Fields**: Menggunakan true/false untuk checkbox
4. **Array Fields**: Menggunakan array of strings untuk multiple choice
5. **Nested Objects**: Semua data tersimpan dalam struktur nested sesuai schema

## Contoh Request Body Lengkap
```json
{
  "nomor_anak": "ANAK001",
  "full_name": "Ahmad Fadillah",
  "nick_name": "Ahmad",
  "birth_date": "2018-05-15",
  "birth_place": "Jakarta",
  "kewarganegaraan": "Indonesia",
  "agama": "Islam",
  "anak_ke": 1,
  "sekolah_kelas": "TK A",
  "status": "AKTIF",
  "tanggal_pemeriksaan": "2024-01-15",
  "mulai_terapi": "2024-01-20",
  "selesai_terapi": "",
  "mulai_cuti": "",
  "ayah": { /* data ayah */ },
  "ibu": { /* data ibu */ },
  "survey_awal": { /* data survey */ },
  "riwayat_kehamilan": { /* data kehamilan */ },
  "riwayat_kelahiran": { /* data kelahiran */ },
  "riwayat_imunisasi": { /* data imunisasi */ },
  "riwayat_setelah_lahir": { /* data setelah lahir */ },
  "perkembangan_anak": { /* data perkembangan */ },
  "perilaku_oral_motor": { /* data oral motor */ },
  "pola_makan": { /* data pola makan */ },
  "perkembangan_sosial": { /* data sosial */ },
  "pola_tidur": { /* data tidur */ },
  "penyakit_diderita": { /* data penyakit */ },
  "hubungan_keluarga": { /* data keluarga */ },
  "riwayat_pendidikan": { /* data pendidikan */ },
  "pemeriksaan_sebelumnya": [],
  "terapi_sebelumnya": [],
  "lampiran": { /* data lampiran */ }
}
``` 