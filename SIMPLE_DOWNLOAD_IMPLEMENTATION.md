# Implementasi Download File Lampiran (Sederhana)

Dokumentasi implementasi download file lampiran yang sederhana sesuai dengan dokumentasi backend baru.

## Endpoint yang Digunakan

### GET `/api/lampiran/{filename}`

Endpoint sederhana untuk download file lampiran dari folder `public/uploads/lampiran/`.

#### Parameter
- `filename` (string): Nama file yang akan diunduh

#### Response
- **Success (200)**: File akan langsung diunduh
- **Error (400)**: Nama file tidak valid
- **Error (404)**: File tidak ditemukan
- **Error (500)**: Kesalahan server

#### Headers Response
```
Content-Type: <mime_type>
Content-Disposition: attachment; filename="original_filename"
Content-Length: <file_size>
```

## Implementasi di Frontend

### 1. Fungsi Download Sederhana

```typescript
// Fungsi download file lampiran sederhana
function downloadLampiran(filename: string) {
  // Menggunakan endpoint sederhana sesuai dokumentasi baru
  const downloadUrl = `/api/lampiran/${filename}`;
  
  // Method 1: Menggunakan window.open (lebih sederhana)
  window.open(downloadUrl, '_blank');
  
  // Method 2: Menggunakan fetch (alternatif)
  // fetch(downloadUrl)
  //   .then(response => {
  //     if (response.ok) {
  //       return response.blob();
  //     }
  //     throw new Error('Gagal mengunduh file');
  //   })
  //   .then(blob => {
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = filename.replace(/^\d+-/, ''); // Remove timestamp
  //     document.body.appendChild(a);
  //     a.click();
  //     window.URL.revokeObjectURL(url);
  //     document.body.removeChild(a);
  //   })
  //   .catch(error => {
  //     console.error('Error downloading file:', error);
  //     alert('Gagal mengunduh file');
  //   });
}

// Fungsi untuk mendapatkan filename dari URL
function getFileNameFromUrl(url: string): string {
  try {
    return url.split('/').pop() || 'lampiran';
  } catch {
    return 'lampiran';
  }
}
```

### 2. Penggunaan di Komponen

```tsx
// Di PatientDetail.tsx
{[
  { name: 'Hasil EEG', available: !!anak.lampiran?.hasil_eeg_url, url: anak.lampiran?.hasil_eeg_url },
  { name: 'Hasil BERA', available: !!anak.lampiran?.hasil_bera_url, url: anak.lampiran?.hasil_bera_url },
  { name: 'Hasil CT Scan', available: !!anak.lampiran?.hasil_ct_scan_url, url: anak.lampiran?.hasil_ct_scan_url },
  { name: 'Program Terapi 3 Bulan', available: !!anak.lampiran?.program_terapi_3bln_url, url: anak.lampiran?.program_terapi_3bln_url },
  { name: 'Hasil Psikologis/Psikiatris', available: !!anak.lampiran?.hasil_psikologis_psikiatris_url, url: anak.lampiran?.hasil_psikologis_psikiatris_url },
].map((doc, idx) => (
  <div key={idx} className={`border rounded-lg p-4 ${doc.available ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
    <div className="flex items-center justify-between">
      <span className={`text-sm font-medium ${doc.available ? 'text-green-800' : 'text-gray-600'}`}>{doc.name}</span>
      {doc.available && doc.url && (
        <button
          type="button"
          onClick={() => downloadLampiran(getFileNameFromUrl(doc.url || ''))}
          className="p-1 text-green-600 hover:text-green-800"
          title="Unduh lampiran"
        >
          <Download className="w-4 h-4" />
        </button>
      )}
    </div>
  </div>
))}
```

## Contoh URL

```
GET /api/lampiran/1750826996400-Hasil_EEG.pdf
GET /api/lampiran/1751639954552-Hasil_BERA.png
GET /api/lampiran/1750826996400-Laporan_Medis.docx
```

## Struktur File

File disimpan di: `public/uploads/lampiran/{timestamp}-{original_filename}`

Contoh:
- `1750826996400-Hasil_EEG.pdf`
- `1751639954552-Hasil_BERA.png`
- `1750826996400-Laporan_Medis.docx`

## Tipe File yang Didukung

- PDF: `application/pdf`
- Images: `image/png`, `image/jpeg`, `image/gif`
- Documents: `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- Spreadsheets: `application/vnd.ms-excel`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Text: `text/plain`
- Dan lainnya sesuai MIME type detection

## Keunggulan Implementasi Sederhana

### 1. Tidak Memerlukan Dependencies Tambahan
- Tidak perlu install `file-saver` atau package lain
- Menggunakan API browser native

### 2. Implementasi Mudah
- Hanya perlu fungsi sederhana
- Tidak perlu state management kompleks
- Tidak perlu error handling yang rumit

### 3. Performa Baik
- `window.open()` langsung membuka file di tab baru
- Tidak perlu download blob ke memory
- Browser menangani download secara otomatis

### 4. Kompatibilitas Tinggi
- Bekerja di semua browser modern
- Tidak ada masalah CORS jika file di folder public
- Mendukung semua tipe file

## Alternatif Implementasi

### 1. Menggunakan Link HTML
```html
<a href="/api/lampiran/1750826996400-Hasil_EEG.pdf" download>
  Download Hasil EEG
</a>
```

### 2. Menggunakan Fetch dengan Blob
```javascript
const downloadFile = async (filename) => {
  const response = await fetch(`/api/lampiran/${filename}`);
  if (response.ok) {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.replace(/^\d+-/, ''); // Remove timestamp
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
};
```

### 3. Menggunakan window.open (Recommended)
```javascript
const downloadFile = (filename) => {
  window.open(`/api/lampiran/${filename}`, '_blank');
};
```

## Error Handling

Implementasi sederhana ini mengandalkan browser untuk menangani error:

- **404 Not Found**: Browser akan menampilkan halaman error
- **400 Bad Request**: Browser akan menampilkan halaman error
- **500 Server Error**: Browser akan menampilkan halaman error

Jika ingin error handling yang lebih baik, gunakan method fetch dengan try-catch.

## Security Considerations

1. **Filename Validation**: Backend harus memvalidasi filename untuk mencegah directory traversal
2. **File Type Validation**: Backend harus memvalidasi tipe file yang diizinkan
3. **Access Control**: Backend harus mengatur siapa yang bisa mengakses file

## Testing

### 1. Test Download Success
- File berhasil diunduh dengan nama yang benar
- File dapat dibuka dengan aplikasi yang sesuai

### 2. Test Error Cases
- File tidak ditemukan (404)
- Nama file tidak valid (400)
- Server error (500)

### 3. Test Different File Types
- PDF files
- Image files (PNG, JPG, GIF)
- Document files (DOC, DOCX)
- Spreadsheet files (XLS, XLSX)

## Kesimpulan

Implementasi download file yang sederhana ini sangat cocok untuk kebutuhan dasar download file lampiran. Implementasi ini:

- ✅ Mudah diimplementasikan
- ✅ Tidak memerlukan dependencies tambahan
- ✅ Performa baik
- ✅ Kompatibilitas tinggi
- ✅ Sesuai dengan dokumentasi backend

Implementasi ini dapat digunakan sebagai fondasi untuk fungsi download yang lebih kompleks di masa depan jika diperlukan. 