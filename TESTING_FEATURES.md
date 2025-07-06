# Fitur Testing - Form Tambah Anak

## ✅ Fitur yang Telah Diimplementasikan

### 1. Auto-Generate Nomor Anak
- **Fungsi:** Otomatis generate nomor anak dengan format `YAMET-2025-0001`
- **Trigger:** Saat form dibuka
- **Format:** `YAMET-YYYY-XXXX` (4 digit)
- **Reset Tahunan:** Setiap tahun baru dimulai dari 0001

### 2. Tombol Generate Nomor
- **Lokasi:** Di sebelah field "Nomor Anak"
- **Fungsi:** Generate ulang nomor anak
- **Status:** Loading saat generating

### 3. Data Dummy untuk Testing
- **Data Lengkap:** Semua field telah diisi dengan data dummy yang realistis
- **Contoh Data:**
  - Nama: Ahmad Fadillah Putra
  - Tanggal Lahir: 2018-05-15
  - Orang Tua: Ahmad Supriyadi & Siti Nurhaliza
  - Riwayat lengkap (kehamilan, kelahiran, imunisasi, dll)

### 4. Tombol Testing (Akan Ditambahkan)
- **📝 Isi Data Dummy:** Mengisi form dengan data lengkap
- **🗑️ Kosongkan Form:** Mengosongkan semua field
- **Lokasi:** Di bagian atas form

## 🔧 Cara Penggunaan untuk Testing

### Testing POST Request
1. **Buka form tambah anak**
2. **Klik tombol "📝 Isi Data Dummy"** (akan ditambahkan)
3. **Form akan terisi otomatis** dengan data lengkap
4. **Klik "Simpan"** untuk test POST request
5. **Atau edit data** sesuai kebutuhan sebelum simpan

### Testing Auto-Generate Nomor
1. **Buka form tambah anak**
2. **Nomor akan otomatis di-generate** (YAMET-2025-0001)
3. **Klik tombol "Generate"** untuk generate ulang
4. **Nomor akan increment** sesuai urutan

### Testing Form Validation
1. **Klik "🗑️ Kosongkan Form"** untuk mengosongkan
2. **Coba submit tanpa data** untuk test validation
3. **Isi data sebagian** untuk test partial validation

## 📊 Data Dummy yang Tersedia

### Data Anak
- Nama: Ahmad Fadillah Putra
- Panggilan: Fadil
- Tanggal Lahir: 15 Mei 2018
- Tempat Lahir: Jakarta
- Kewarganegaraan: Indonesia
- Agama: Islam
- Sekolah: TK B

### Data Orang Tua
- **Ayah:** Ahmad Supriyadi (40 tahun, Karyawan Swasta)
- **Ibu:** Siti Nurhaliza (37 tahun, Guru)
- **Alamat:** Jl. Sudirman No. 123, Jakarta Pusat

### Riwayat Medis
- **Kehamilan:** Normal, usia ibu 30 tahun
- **Kelahiran:** Normal, 9 bulan, APGAR 9/10
- **Imunisasi:** Lengkap (BCG, DPT, Polio, Campak, dll)
- **Penyakit:** Alergi makanan laut dan debu

### Perkembangan
- **Motor:** Normal (tengkurap 3 bulan, duduk 6 bulan, berjalan 12 bulan)
- **Bahasa:** Normal (bicara 18 bulan, bercerita 36 bulan)
- **Sosial:** Aktif dan ramah

## 🎯 Manfaat untuk Testing

1. **Cepat Testing:** Tidak perlu input manual semua data
2. **Data Realistis:** Data dummy mirip data asli
3. **Lengkap:** Semua field terisi untuk test POST
4. **Fleksibel:** Bisa edit sebelum submit
5. **Reset Mudah:** Tombol kosongkan form

## 🚀 Status: READY FOR TESTING

Fitur testing sudah siap digunakan. Anda bisa:
- Test POST request dengan data lengkap
- Test auto-generate nomor anak
- Test form validation
- Test edit data sebelum submit 