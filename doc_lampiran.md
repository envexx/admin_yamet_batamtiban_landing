# Dokumentasi Endpoint Lampiran (Download File)

## Tujuan
Agar file lampiran yang diunduh dari frontend **benar-benar file asli** (PDF, gambar, dsb), bukan file HTML/error page. Dokumen ini menjelaskan **spesifikasi response** yang diharapkan frontend dari backend.

---

## 1. Endpoint Download Lampiran

- **Contoh:**
  - `GET /api/lampiran/:id`
  - `GET /uploads/:filename`

---

## 2. Response Sukses (File Ditemukan)

- **Status:** `200 OK`
- **Body:** Binary file (bukan JSON/HTML)
- **Headers Wajib:**
  - `Content-Type`: tipe file yang sesuai (misal: `application/pdf`, `image/jpeg`, `application/png`, dll)
  - `Content-Disposition`: 
    - Untuk download otomatis:
      ```
      Content-Disposition: attachment; filename="namafile_asli.pdf"
      ```
    - Untuk preview di browser (opsional):
      ```
      Content-Disposition: inline; filename="namafile_asli.pdf"
      ```

### Contoh Response Header
```
HTTP/1.1 200 OK
Content-Type: application/pdf
Content-Disposition: attachment; filename="laporan_terapi.pdf"
Content-Length: 123456
```
- **Body:** (isi file PDF asli, bukan HTML/error page)

---

## 3. Response Gagal (File Tidak Ditemukan/Unauthorized)

- **Status:** `404 Not Found` atau `401 Unauthorized`
- **Body:** JSON error (bukan HTML)
- **Headers:**
  - `Content-Type: application/json`

### Contoh Response Error
```json
{
  "status": "error",
  "message": "File tidak ditemukan"
}
```

---

## 4. Catatan Penting
- **JANGAN** mengembalikan HTML error page (misal: error 404/500 dalam bentuk HTML) untuk endpoint download file.
- **JANGAN** mengembalikan file sebagai string base64 di JSON (kecuali untuk preview inline, tapi untuk download gunakan binary).
- **JANGAN** mengubah nama file tanpa alasan.

---

## 5. Contoh Implementasi (Node.js/Express)
```js
// Contoh endpoint download file di Express
app.get('/api/lampiran/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ status: 'error', message: 'File tidak ditemukan' });
  }
  res.download(filePath, req.params.filename); // otomatis set Content-Type & Content-Disposition
});
```

---

## 6. Cara Frontend Mengunduh File
- Jika backend sudah sesuai spesifikasi di atas, frontend cukup pakai:
  ```jsx
  <a href={url} download>Unduh Lampiran</a>
  ```
- Jika butuh otentikasi (token), gunakan fetch/axios dan handle sebagai blob:
  ```js
  fetch(url, { headers: { Authorization: 'Bearer ...' } })
    .then(res => res.blob())
    .then(blob => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'namafile.pdf';
      link.click();
    });
  ```

---

## 7. Ringkasan
- Endpoint download file **WAJIB** mengirim file asli (binary) dengan header yang benar.
- Jika error, kembalikan JSON, **bukan HTML**.
- Dengan spesifikasi ini, file yang diunduh dari frontend akan sama persis dengan file yang diupload. 