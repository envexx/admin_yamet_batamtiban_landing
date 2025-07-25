// API Response Types
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  errors?: { path?: string[]; message: string }[];
  pagination?: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Authentication Types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'MANAJER' | 'TERAPIS' | 'ORANGTUA';
}

export interface CreateAdminData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'ADMIN' | 'MANAJER' | 'TERAPIS' | 'ORANGTUA';
}

export interface UpdateUserData {
  userId: number;
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  role?: 'SUPERADMIN' | 'ADMIN' | 'MANAJER' | 'TERAPIS' | 'ORANGTUA';
  status?: 'active' | 'inactive' | 'pending';
}

// Role interface for new schema
export interface Role {
  id: number;
  name: string;
}

// User Types - Updated for new backend schema
export interface User {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  role_id: number;
  role: Role;
  peran: string;
  status: 'active' | 'inactive' | 'pending';
  created_by: number | null;
  creator?: {
    id: number;
    name: string;
    role: { name: string };
  };
  address?: string;
  created_at: string;
  updated_at?: string;
}

export interface UserForm {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role?: 'SUPERADMIN' | 'ADMIN' | 'MANAJER' | 'TERAPIS' | 'ORANGTUA';
  status?: 'active' | 'inactive' | 'pending';
}

// Hybrid Database Types - MongoDB Data Structures

// Survey and Complaints (MongoDB)
export interface SurveyData {
  _id?: string;
  anak_id: number;
  survey_singkat?: {
    mengetahui_yamet_dari?: string;
    dijelaskan_mekanisme?: boolean;
    bersedia_assessment_online?: boolean;
    tanggal_survey?: string;
  };
  keluhan_orang_tua?: Array<{
    keluhan?: string;
    tingkat_kekhawatiran?: 'rendah' | 'sedang' | 'tinggi';
    tanggal_keluhan?: string;
  }>;
  tindakan_yang_dilakukan?: Array<{
    tindakan?: string;
    hasil?: string;
    tanggal_tindakan?: string;
  }>;
  kendala_yang_dihadapi?: Array<{
    kendala?: string;
    dampak?: string;
    solusi_dicoba?: string;
  }>;
  keluhan_guru?: Array<{
    keluhan?: string;
    mata_pelajaran?: string;
    frekuensi?: string;
    tanggal_laporan?: string;
  }>;
  created_at?: string;
  updated_at?: string;
}

// Medical History (MongoDB)
export interface RiwayatMedisData {
  _id?: string;
  anak_id: number;
  riwayat_kehamilan?: {
    usia_ibu_saat_hamil?: number;
    usia_ayah_saat_hamil?: number;
    kondisi_kehamilan?: {
      mual_muntah?: boolean;
      asupan_gizi_memadai?: boolean;
      perawatan_kehamilan?: boolean;
      kehamilan_diinginkan?: boolean;
      berat_bayi_normal?: boolean;
      komplikasi?: {
        diabetes?: boolean;
        hipertensi?: boolean;
        asma?: boolean;
        tbc?: boolean;
        infeksi_virus?: boolean;
        kecelakaan_trauma?: boolean;
        pendarahan_flek?: boolean;
        masalah_pernapasan?: boolean;
      };
      lifestyle?: {
        merokok?: boolean;
        tinggal_sekitar_perokok?: boolean;
        konsumsi_alkohol?: boolean;
        konsumsi_obat?: boolean;
      };
    };
    catatan_tambahan?: string;
  };
  riwayat_kelahiran?: {
    jenis_kelahiran?: 'normal' | 'caesar';
    alasan_sc?: string;
    forcep_vacuum_dipacu?: boolean;
    premature?: boolean;
    usia_kelahiran_bulan?: number;
    bagian_keluar_dulu?: 'kepala' | 'kaki';
    sungsang?: boolean;
    kondisi_bayi?: {
      kuning?: boolean;
      detak_jantung?: string;
      apgar_score?: string;
    };
    proses_kelahiran?: {
      lama_waktu_melahirkan?: string;
      dibantu_oleh?: 'dokter' | 'bidan' | 'dukun_bayi';
      tempat_bersalin?: string;
      hal_spesifik?: string;
    };
  };
  riwayat_setelah_lahir?: {
    asi_sampai_bulan?: number;
    riwayat_kecelakaan?: Array<{
      jenis?: 'jatuh' | 'lainnya';
      usia?: string;
      detail?: string;
      penanganan?: string;
    }>;
    riwayat_sakit?: Array<{
      jenis_sakit?: string;
      usia?: string;
      gejala?: string;
      penanganan?: string;
      komplikasi?: string;
    }>;
  };
  riwayat_imunisasi?: Array<{
    jenis_imunisasi?: string;
    usia_recommended?: string;
    status?: 'sudah' | 'belum' | 'terlambat';
    tanggal_imunisasi?: string;
    tempat_imunisasi?: string;
    reaksi?: string;
  }>;
  riwayat_penyakit?: Array<{
    nama_penyakit?: string;
    bagian_tubuh?: string;
    usia_saat_sakit?: string;
    gejala?: string;
    pengobatan?: string;
    status?: 'sembuh' | 'kronis' | 'kambuh-kambuhan';
  }>;
  created_at?: string;
  updated_at?: string;
}

// Behavior and Habits (MongoDB)
export interface PerilakuData {
  _id?: string;
  anak_id: number;
  perilaku_sehari_hari?: {
    pola_tidur?: {
      jam_tidur_malam?: string;
      jam_bangun_pagi?: string;
      kualitas_tidur?: 'baik' | 'sedang' | 'buruk';
      gangguan_tidur?: string[];
    };
    pola_makan?: {
      nafsu_makan?: 'baik' | 'sedang' | 'buruk';
      makanan_favorit?: string[];
      makanan_tidak_suka?: string[];
      alergi_makanan?: string[];
    };
    aktivitas_fisik?: {
      tingkat_aktivitas?: 'tinggi' | 'sedang' | 'rendah';
      olahraga_favorit?: string[];
      waktu_bermain?: string;
    };
  };
  perilaku_sosial?: {
    interaksi_dengan_teman?: 'baik' | 'sedang' | 'buruk';
    interaksi_dengan_keluarga?: 'baik' | 'sedang' | 'buruk';
    kemampuan_berbagi?: 'baik' | 'sedang' | 'buruk';
    kemampuan_kerjasama?: 'baik' | 'sedang' | 'buruk';
    perilaku_agresif?: boolean;
    detail_perilaku_agresif?: string;
  };
  kebiasaan_khusus?: {
    kebiasaan_berulang?: string[];
    ketergantungan_objet?: string[];
    ritual_sebelum_tidur?: string;
    ritual_lainnya?: string[];
  };
  emosi_dan_perasaan?: {
    suasana_hati_umum?: 'ceria' | 'tenang' | 'murung' | 'mudah_marah';
    cara_mengekspresikan_emosi?: string;
    pemicu_stres?: string[];
    cara_menenangkan_diri?: string[];
  };
  created_at?: string;
  updated_at?: string;
}

// Development Details (MongoDB)
export interface PerkembanganData {
  _id?: string;
  anak_id: number;
  perkembangan_fisik?: {
    tinggi_badan?: number;
    berat_badan?: number;
    lingkar_kepala?: number;
    tanggal_pengukuran?: string;
    catatan_pertumbuhan?: string;
  };
  perkembangan_motor?: {
    motor_kasar?: {
      duduk?: { usia?: string; status?: 'sudah' | 'belum' };
      merangkak?: { usia?: string; status?: 'sudah' | 'belum' };
      berjalan?: { usia?: string; status?: 'sudah' | 'belum' };
      berlari?: { usia?: string; status?: 'sudah' | 'belum' };
      melompat?: { usia?: string; status?: 'sudah' | 'belum' };
    };
    motor_halus?: {
      memegang_objet?: { usia?: string; status?: 'sudah' | 'belum' };
      menulis?: { usia?: string; status?: 'sudah' | 'belum' };
      menggambar?: { usia?: string; status?: 'sudah' | 'belum' };
      menggunting?: { usia?: string; status?: 'sudah' | 'belum' };
    };
  };
  perkembangan_bahasa?: {
    bahasa_reseptif?: {
      memahami_perintah?: { usia?: string; status?: 'sudah' | 'belum' };
      mengenali_nama?: { usia?: string; status?: 'sudah' | 'belum' };
      memahami_cerita?: { usia?: string; status?: 'sudah' | 'belum' };
    };
    bahasa_ekspresif?: {
      mengucapkan_kata?: { usia?: string; status?: 'sudah' | 'belum' };
      mengucapkan_kalimat?: { usia?: string; status?: 'sudah' | 'belum' };
      bercerita?: { usia?: string; status?: 'sudah' | 'belum' };
    };
  };
  perkembangan_kognitif?: {
    kemampuan_berhitung?: { usia?: string; status?: 'sudah' | 'belum' };
    kemampuan_membaca?: { usia?: string; status?: 'sudah' | 'belum' };
    kemampuan_memecahkan_masalah?: { usia?: string; status?: 'sudah' | 'belum' };
    kemampuan_konsentrasi?: { usia?: string; status?: 'sudah' | 'belum' };
  };
  perkembangan_sosial?: {
    kemampuan_bermain?: { usia?: string; status?: 'sudah' | 'belum' };
    kemampuan_berbagi?: { usia?: string; status?: 'sudah' | 'belum' };
    kemampuan_mengikuti_aturan?: { usia?: string; status?: 'sudah' | 'belum' };
    kemampuan_empati?: { usia?: string; status?: 'sudah' | 'belum' };
  };
  created_at?: string;
  updated_at?: string;
}

// Documents and Attachments (MongoDB)
export interface DokumenData {
  _id?: string;
  anak_id: number;
  dokumen?: Array<{
    _id?: string;
    nama_dokumen?: string;
    jenis_dokumen?: 'foto' | 'surat_dokter' | 'hasil_lab' | 'rapor_sekolah' | 'lainnya';
    file_url?: string;
    file_size?: number;
    tanggal_upload?: string;
    deskripsi?: string;
  }>;
  created_at?: string;
  updated_at?: string;
}

// Complete Anak Data (Hybrid)
export interface AnakCompleteData {
  // SQL Data
  anak: Anak;
  orang_tua?: any[];
  pemeriksaan?: any[];
  riwayat_terapi?: any[];
  riwayat_pendidikan?: any[];
  milestone_perkembangan?: any[];
  
  // MongoDB Data (Optional)
  survey_dan_keluhan?: SurveyData;
  riwayat_medis_detail?: RiwayatMedisData;
  perilaku_dan_kebiasaan?: PerilakuData;
  perkembangan_detail?: PerkembanganData;
  dokumen_dan_lampiran?: DokumenData;
}

// Dashboard Data (Optimized)
export interface AnakDashboardData {
  anak: Anak;
  orang_tua?: any[];
  pemeriksaan_terbaru?: any[]; // 5 terbaru
  terapi_aktif?: any[]; // 3 aktif
  milestone_terbaru?: any[]; // 10 terbaru
  survey_terbaru?: SurveyData;
  riwayat_medis_summary?: {
    riwayat_kehamilan?: any;
    riwayat_kelahiran?: any;
    total_imunisasi?: number;
    total_penyakit?: number;
  };
}

// =====================
// ANAK DETAIL (NESTED)
// =====================

export interface UserCreated {
  id: number;
  name: string;
}

export interface Ayah {
  id: number;
  anak_id_ayah: number;
  anak_id_ibu: number | null;
  nama: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  usia: number;
  agama: string;
  alamat_rumah: string;
  anak_ke: number;
  pernikahan_ke: number;
  usia_saat_menikah: number;
  pendidikan_terakhir: string;
  pekerjaan_saat_ini: string;
  telepon: string;
  email: string;
  tahun_meninggal: number | null;
  usia_saat_meninggal: number | null;
  kewarganegaraan?: string | null;
}

export interface Ibu {
  id: number;
  anak_id_ayah: number | null;
  anak_id_ibu: number | null;
  nama: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  usia: number;
  agama: string;
  alamat_rumah: string;
  anak_ke: number;
  pernikahan_ke: number;
  usia_saat_menikah: number;
  pendidikan_terakhir: string;
  pekerjaan_saat_ini: string;
  telepon: string;
  email: string;
  tahun_meninggal: number | null;
  usia_saat_meninggal: number | null;
  kewarganegaraan?: string | null;
}

export interface SurveyAwal {
  id: number;
  anak_id: number;
  mengetahui_yamet_dari: string;
  penjelasan_mekanisme: boolean;
  bersedia_online: boolean;
  keluhan_orang_tua: string[];
  tindakan_orang_tua: string[];
  kendala: string[];
}

export interface RiwayatKehamilan {
  id: number;
  anak_id: number;
  usia_ibu_saat_hamil: number;
  usia_ayah_saat_hamil: number;
  mual_sulit_makan: boolean;
  asupan_gizi_memadai: boolean;
  perawatan_kehamilan: boolean;
  kehamilan_diinginkan: boolean;
  berat_bayi_semester_normal: boolean;
  diabetes: boolean;
  hipertensi: boolean;
  asma: boolean;
  tbc: boolean;
  merokok: boolean;
  sekitar_perokok_berat: boolean;
  konsumsi_alkohol: boolean;
  konsumsi_obat_obatan: boolean;
  infeksi_virus: boolean;
  kecelakaan_trauma: boolean;
  pendarahan_flek: boolean;
  masalah_pernafasan: boolean;
}

export interface RiwayatKelahiran {
  id: number;
  anak_id: number;
  jenis_kelahiran: string;
  alasan_sc: string | null;
  bantuan_kelahiran: string[];
  is_premature: boolean;
  usia_kelahiran_bulan: number;
  posisi_bayi_saat_lahir: string;
  is_sungsang: boolean;
  is_kuning: boolean;
  detak_jantung_anak: string;
  apgar_score: string;
  lama_persalinan: string;
  penolong_persalinan: string;
  tempat_bersalin: string;
  cerita_spesifik_kelahiran: string;
  berat_badan_bayi: number | null;
  panjang_badan_bayi: number | null;
}

export interface RiwayatImunisasi {
  id: number;
  anak_id: number;
  bgc: boolean;
  hep_b1: boolean;
  hep_b2: boolean;
  hep_b3: boolean;
  dpt_1: boolean;
  dpt_2: boolean;
  dpt_3: boolean;
  dpt_booster_1: boolean;
  polio_1: boolean;
  polio_2: boolean;
  polio_3: boolean;
  polio_4: boolean;
  polio_booster_1: boolean;
  campak_1: boolean;
  campak_2: boolean;
  hib_1: boolean;
  hib_2: boolean;
  hib_3: boolean;
  hib_4: boolean;
  mmr_1: boolean;
}

export interface RiwayatSetelahLahir {
  id: number;
  anak_id: number;
  asi_sampai_usia_bulan: number;
  pernah_jatuh: boolean;
  jatuh_usia_bulan: number | null;
  jatuh_ketinggian_cm: number | null;
  pernah_sakit_parah: boolean;
  sakit_parah_usia_bulan: number | null;
  pernah_panas_tinggi: boolean;
  panas_tinggi_usia_bulan: number | null;
  disertai_kejang: boolean;
  frekuensi_durasi_kejang: string | null;
  pernah_kejang_tanpa_panas: boolean;
  kejang_tanpa_panas_usia_bulan: number | null;
  sakit_karena_virus: boolean;
  sakit_virus_usia_bulan: number | null;
  sakit_virus_jenis: string | null;
  frekuensi_durasi_kejang_tanpa_panas: string | null;
}

export interface PerkembanganAnak {
  id: number;
  anak_id: number;
  tengkurap_ya: boolean;
  tengkurap_usia: string;
  berguling_ya: boolean;
  berguling_usia: string;
  duduk_ya: boolean;
  duduk_usia: string;
  merayap_ya: boolean;
  merayap_usia: string;
  merangkak_ya: boolean;
  merangkak_usia: string;
  jongkok_ya: boolean;
  jongkok_usia: string;
  transisi_berdiri_ya: boolean;
  transisi_berdiri_usia: string;
  berdiri_tanpa_pegangan_ya: boolean;
  berdiri_tanpa_pegangan_usia: string;
  berlari_ya: boolean;
  berlari_usia: string;
  melompat_ya: boolean;
  melompat_usia: string;
  reflek_vokalisasi_ya: boolean;
  reflek_vokalisasi_usia: string;
  bubbling_ya: boolean;
  bubbling_usia: string;
  lalling_ya: boolean;
  lalling_usia: string;
  echolalia_ya: boolean;
  echolalia_usia: string;
  true_speech_ya: boolean;
  true_speech_usia: string;
  ungkap_keinginan_2_kata_ya: boolean;
  ungkap_keinginan_2_kata_usia: string;
  bercerita_ya: boolean;
  bercerita_usia: string;
  tertarik_lingkungan_luar_ya: boolean;
  tertarik_lingkungan_luar_usia: string;
  digendong_siapapun_ya: boolean;
  digendong_siapapun_usia: string;
  interaksi_timbal_balik_ya: boolean;
  interaksi_timbal_balik_usia: string;
  komunikasi_ekspresi_ibu_ya: boolean;
  komunikasi_ekspresi_ibu_usia: string;
  ekspresi_emosi_ya: boolean;
  ekspresi_emosi_usia: string;
  berjalan_tanpa_pegangan_ya: boolean;
  berjalan_tanpa_pegangan_usia: string;
  mengucapkan_1_kata_ya: boolean | null;
  mengucapkan_1_kata_usia: string | null;
}

export interface PerilakuOralMotor {
  id: number;
  anak_id: number;
  mengeces: boolean;
  makan_makanan_keras: boolean;
  makan_makanan_berkuah: boolean;
  pilih_pilih_makanan: boolean;
  makan_di_emut: boolean;
  mengunyah_saat_makan: boolean;
  makan_langsung_telan: boolean;
}

export interface PolaMakan {
  id: number;
  anak_id: number;
  pola_teratur: string;
  ada_pantangan_makanan: boolean;
  pantangan_makanan: string;
  keterangan_lainnya: string;
}

export interface PerkembanganSosial {
  id: number;
  anak_id: number;
  perilaku_bertemu_orang_baru: string;
  perilaku_bertemu_teman_sebaya: string;
  perilaku_bertemu_orang_lebih_tua: string;
  perilaku_bertemu_orang_lebih_muda: string;
  bermain_dengan_banyak_anak: string;
  keterangan_lainnya: string;
}

export interface PolaTidur {
  id: number;
  anak_id: number;
  jam_tidur_teratur: boolean;
  sering_terbangun: boolean;
  jam_tidur_malam: string;
  jam_bangun_pagi: string;
}

export interface PenyakitDiderita {
  id: number;
  anak_id: number;
  sakit_telinga: boolean;
  sakit_telinga_usia_tahun: number | null;
  sakit_telinga_penjelasan: string | null;
  sakit_mata: boolean;
  sakit_mata_usia_tahun: number | null;
  sakit_mata_penjelasan: string | null;
  luka_kepala: boolean;
  luka_kepala_usia_tahun: number | null;
  penyakit_lainnya: string;
}

export interface HubunganKeluarga {
  id: number;
  anak_id: number;
  tinggal_dengan: string[];
  tinggal_dengan_lainnya: string;
  hubungan_ayah_ibu: string;
  hubungan_ayah_anak: string;
  hubungan_ibu_anak: string;
  hubungan_saudara_dengan_anak: string;
  hubungan_nenek_kakek_dengan_anak: string;
  hubungan_saudara_ortu_dengan_anak: string;
  hubungan_pengasuh_dengan_anak: string;
}

export interface RiwayatPendidikan {
  id: number;
  anak_id: number;
  mulai_sekolah_formal_usia: string;
  mulai_sekolah_informal_usia: string;
  sekolah_formal_diikuti: string;
  sekolah_informal_diikuti: string;
  bimbingan_belajar: boolean;
  belajar_membaca_sendiri: boolean;
  belajar_dibacakan_ortu: boolean;
  nilai_rata_rata_sekolah: string;
  nilai_tertinggi_mapel: string;
  nilai_tertinggi_nilai: string;
  nilai_terendah_mapel: string;
  nilai_terendah_nilai: string;
  keluhan_guru: string[];
}

export interface PemeriksaanSebelumnya {
  id: number;
  anak_id: number;
  tempat: string;
  usia: string;
  diagnosa: string;
}

export interface TerapiSebelumnya {
  id: number;
  anak_id: number;
  jenis_terapi: string;
  frekuensi: string;
  lama_terapi: string;
  tempat: string;
}

export interface Lampiran {
  id: number;
  anak_id: number;
  hasil_eeg_url: string | null;
  hasil_bera_url: string | null;
  hasil_ct_scan_url: string | null;
  program_terapi_3bln_url: string | null;
  hasil_psikologis_psikiatris_url: string | null;
  perjanjian: string | null;
  keterangan_tambahan: string | null;
}

export interface AnakDetail {
  [key: string]: any;
  id: number;
  nomor_anak: string;
  full_name: string;
  nick_name: string;
  birth_date: string;
  birth_place: string;
  kewarganegaraan: string;
  agama: string;
  anak_ke: number;
  sekolah_kelas: string;
  tanggal_pemeriksaan: string;
  status: string;
  mulai_terapi: string | null;
  selesai_terapi: string | null;
  mulai_cuti: string | null;
  jenis_kelamin?: 'laki_laki' | 'perempuan';
  created_by: number;
  updated_by: number | null;
  deleted_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user_created: UserCreated;
  ayah: Ayah;
  ibu: Ibu;
  survey_awal: SurveyAwal;
  riwayat_kehamilan: RiwayatKehamilan;
  riwayat_kelahiran: RiwayatKelahiran;
  riwayat_imunisasi: RiwayatImunisasi;
  riwayat_setelah_lahir: RiwayatSetelahLahir;
  perkembangan_anak: PerkembanganAnak;
  perilaku_oral_motor: PerilakuOralMotor;
  pola_makan: PolaMakan;
  perkembangan_sosial: PerkembanganSosial;
  pola_tidur: PolaTidur;
  penyakit_diderita: PenyakitDiderita;
  hubungan_keluarga: HubunganKeluarga;
  riwayat_pendidikan: RiwayatPendidikan;
  pemeriksaan_sebelumnya: PemeriksaanSebelumnya[];
  terapi_sebelumnya: TerapiSebelumnya[];
  lampiran: Lampiran;
}

// Anak Types (SQL - Updated to match backend structure)
export interface Anak {
  id_anak: string; // UUID from backend
  nama_anak: string;
  nama_panggilan?: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  usia_tahun?: number;
  usia_bulan?: number;
  jenis_kelamin?: 'laki_laki' | 'perempuan';
  kewarganegaraan?: string;
  agama?: string;
  alamat_rumah?: string;
  anak_ke?: number;
  sekolah_kelas?: string;
  status_aktif?: boolean;
  created_at: string;
  updated_at?: string;
  orang_tua?: OrangTua[];
}

// Orang Tua interface to match backend structure
export interface OrangTua {
  id_orang_tua: string;
  tipe_orang_tua: 'ayah' | 'ibu' | 'wali';
  nama_lengkap: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  usia?: number;
  agama?: string;
  pendidikan_terakhir?: string;
  pekerjaan_saat_ini?: string;
  no_telepon?: string;
  email?: string;
  status_hidup?: boolean;
}

export interface AnakForm {
  nama_anak: string;
  nama_panggilan?: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  usia_tahun?: number;
  usia_bulan?: number;
  jenis_kelamin?: 'laki_laki' | 'perempuan';
  kewarganegaraan?: string;
  agama?: string;
  alamat_rumah?: string;
  anak_ke?: number;
  sekolah_kelas?: string;
  status_aktif?: boolean;
}

// Assessment Types
export interface Assessment {
  id: number;
  anak_id: number;
  assessment_date: string;
  assessment_type: string;
  assessment_result?: string;
  notes?: string;
  created_by?: number;
  created_at: string;
  user_created?: UserCreated;
}

export interface AssessmentForm {
  assessment_date?: string;
  assessment_type: string;
  assessment_result?: string;
  notes?: string;
}

// Program Terapi Types
export interface ProgramTerapi {
  id: number;
  anak_id: number;
  program_name: string;
  description?: string;
  start_date: string;
  end_date: string;
  status: 'AKTIF' | 'SELESAI' | 'DIBATALKAN';
  created_by: number;
  created_at: string;
  user_created?: {
    id: number;
    name: string;
  };
  jam_per_minggu: number | null;
}

export interface ProgramTerapiForm {
  program_name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status?: 'AKTIF' | 'SELESAI' | 'DIBATALKAN';
  jam_per_minggu: number | null;
}

// Dashboard Types
export interface DashboardStats {
  total_anak: number;
  total_admin?: number;
  total_terapis?: number;
  total_manajer?: number;
  total_orangtua?: number;
  anak_keluar_bulan_lalu?: number;
  anak_keluar_bulan_ini?: number;
  anak_aktif?: number;
  growth: Array<{ period: string; count: number }>;
  period?: string;
  filter_applied?: string;
  
  // Admin Input Stats (SUPERADMIN, MANAJER)
  admin_input_stats?: AdminInputStatsDetail[];
  
  // Normalized Data (SUPERADMIN, MANAJER, ADMIN)
  normalized_data?: {
    keluhan: NormalizedData;
    sumber_informasi: NormalizedData;
  };
  
  insight?: {
    top_keluhan?: (string | { keluhan: string; count: number })[];
    age_distribution?: { '<2': number; '2-4': number; '4-6': number; '>6': number };
    referral_source?: Record<string, number>;
    therapy_success_count?: number;
    avg_therapy_duration_month?: number;
    geographic?: Record<string, number>;
  };
}

// Admin Input Stats Detail
export interface AdminInputStatsDetail {
  admin_id: number;
  admin_name: string;
  admin_email: string;
  total_input: number;
  detail: {
    anak: number;
    penilaian: number;
    program_terapi: number;
    jadwal_terapi: number;
    sesi_terapi: number;
    ebook: number;
    kursus: number;
  };
}

// Normalized Data Structure
export interface NormalizedData {
  raw_data: Array<{ [key: string]: any; count: number }>;
  normalized_data: Array<{
    original: string;
    normalized: string;
    count: number;
  }>;
  formatted: string;
  summary: {
    total_unique_keluhan?: number;
    total_normalized_keluhan?: number;
    total_unique_sumber?: number;
    total_normalized_sumber?: number;
    top_keluhan?: {
      normalized: string;
      count: number;
    };
    top_sumber?: {
      normalized: string;
      count: number;
    };
  };
}

// Filter Types
export interface AnakFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  ageMin?: number;
  ageMax?: number;
  dominantHand?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  role_id?: number;
  status?: 'active' | 'inactive' | 'pending';
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface AnakWithAssessment {
  id: number;
  full_name: string;
  penilaian: Assessment[];
}

export interface AnakWithProgramTerapi {
  id: number;
  full_name: string;
  program_terapi: ProgramTerapi[];
}

export interface ProgramTerapiResponse {
  status: string;
  message: string;
  data: ProgramTerapi[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProgramTerapiGroupedResponse {
  status: string;
  message: string;
  data: AnakWithProgramTerapi[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateProgramTerapiData {
  program_name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status?: 'AKTIF' | 'SELESAI' | 'DIBATALKAN';
  jam_per_minggu: number | null;
}

export interface UpdateProgramTerapiData {
  program_name?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status?: 'AKTIF' | 'SELESAI' | 'DIBATALKAN';
  jam_per_minggu?: number | null;
}

// Admin Stats Types
export interface AdminStats {
  period: string;
  filter_applied: string;
  total_admin: number;
  total_input_from_all_admins: number;
  admin_list: AdminInputStats[];
}

export interface AdminInputStats {
  admin_name: string;
  total_input: number;
}

export interface AdminStatsFilters {
  period?: 'all' | '1month' | '4month' | '6month' | '1year';
}