import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnakDetail } from '../../types';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';
import { anakAPI } from '../../services/api';
import { useModalAlert } from '../UI/ModalAlertContext';
import { WithContext as ReactTagInput, Tag } from 'react-tag-input';

function formatDateInput(dateString?: string | null) {
  if (!dateString) return '';

  // Coba parse sebagai ISO date string terlebih dahulu
  let d = new Date(dateString);

  // Jika gagal, coba parse format lain
  if (isNaN(d.getTime())) {
    // Coba format DD-MM-YY atau DD-MM-YYYY
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1; // Month is 0-indexed
      const year = parseInt(parts[2]);

      // Jika tahun 2 digit, asumsikan 20xx
      const fullYear = year < 100 ? 2000 + year : year;

      if (!isNaN(day) && !isNaN(month) && !isNaN(fullYear)) {
        d = new Date(fullYear, month, day);
      }
    }
  }

  // Jika masih gagal, return empty string
  if (isNaN(d.getTime())) return '';

  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

// Fungsi untuk memisahkan tanggal menjadi komponen
export function parseDateComponents(dateString?: string | null) {
  if (!dateString) return { day: '', month: '', year: '' };

  // Coba parse sebagai ISO date string terlebih dahulu
  let d = new Date(dateString);

  // Jika gagal, coba parse format lain
  if (isNaN(d.getTime())) {
    // Coba format DD-MM-YY atau DD-MM-YYYY
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1; // Month is 0-indexed
      const year = parseInt(parts[2]);

      // Jika tahun 2 digit, asumsikan 20xx
      const fullYear = year < 100 ? 2000 + year : year;

      if (!isNaN(day) && !isNaN(month) && !isNaN(fullYear)) {
        d = new Date(fullYear, month, day);
      }
    }
  }

  // Jika masih gagal, return empty
  if (isNaN(d.getTime())) return { day: '', month: '', year: '' };

  return {
    day: String(d.getDate()).padStart(2, '0'),
    month: String(d.getMonth() + 1).padStart(2, '0'),
    year: String(d.getFullYear())
  };
}

// Fungsi untuk menggabungkan komponen tanggal
export function combineDateComponents(day: string, month: string, year: string) {
  if (!day || !month || !year) return '';

  // Pastikan format yang benar
  const dayNum = parseInt(day);
  const monthNum = parseInt(month);
  const yearNum = parseInt(year);

  // Validasi tanggal
  if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) return '';
  if (dayNum < 1 || dayNum > 31) return '';
  if (monthNum < 1 || monthNum > 12) return '';
  if (yearNum < 1900 || yearNum > 2100) return '';

  // Buat tanggal dan validasi
  const date = new Date(yearNum, monthNum - 1, dayNum);
  if (isNaN(date.getTime())) return '';

  // Pastikan tanggal yang dibuat sama dengan input (untuk menghindari rollover)
  if (date.getDate() !== dayNum || date.getMonth() !== monthNum - 1 || date.getFullYear() !== yearNum) {
    return '';
  }

  return date.toISOString().split('T')[0];
}

const defaultAnakDetail: AnakDetail = {
  id: 0,
  nomor_anak: '',
  full_name: '',
  nick_name: '',
  birth_date: '',
  birth_place: '',
  kewarganegaraan: '',
  agama: '',
  anak_ke: 0,
  sekolah_kelas: '',
  tanggal_pemeriksaan: '',
  status: '',
  mulai_terapi: '',
  selesai_terapi: '',
  mulai_cuti: '',
  jenis_kelamin: undefined,
  created_by: 0,
  updated_by: null,
  deleted_by: null,
  created_at: '',
  updated_at: '',
  deleted_at: null,
  user_created: { id: 0, name: '' },
  ayah: {
    id: 0,
    anak_id_ayah: 0,
    anak_id_ibu: null,
    nama: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    usia: 0,
    agama: '',
    alamat_rumah: '',
    anak_ke: 0,
    pernikahan_ke: 0,
    usia_saat_menikah: 0,
    pendidikan_terakhir: '',
    pekerjaan_saat_ini: '',
    telepon: '',
    email: '',
    tahun_meninggal: null,
    usia_saat_meninggal: null,
    kewarganegaraan: '',
  },
  ibu: {
    id: 0,
    anak_id_ayah: 0,
    anak_id_ibu: 0,
    nama: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    usia: 0,
    agama: '',
    alamat_rumah: '',
    anak_ke: 0,
    pernikahan_ke: 0,
    usia_saat_menikah: 0,
    pendidikan_terakhir: '',
    pekerjaan_saat_ini: '',
    telepon: '',
    email: '',
    tahun_meninggal: 0,
    usia_saat_meninggal: 0,
    kewarganegaraan: '',
  },
  survey_awal: {
    id: 0,
    anak_id: 0,
    mengetahui_yamet_dari: '',
    penjelasan_mekanisme: false,
    bersedia_online: false,
    keluhan_orang_tua: [],
    tindakan_orang_tua: [],
    kendala: [],
  },
  riwayat_kehamilan: {
    id: 0,
    anak_id: 0,
    usia_ibu_saat_hamil: 0,
    usia_ayah_saat_hamil: 0,
    mual_sulit_makan: false,
    asupan_gizi_memadai: false,
    perawatan_kehamilan: false,
    kehamilan_diinginkan: false,
    berat_bayi_semester_normal: false,
    diabetes: false,
    hipertensi: false,
    asma: false,
    tbc: false,
    merokok: false,
    sekitar_perokok_berat: false,
    konsumsi_alkohol: false,
    konsumsi_obat_obatan: false,
    infeksi_virus: false,
    kecelakaan_trauma: false,
    pendarahan_flek: false,
    masalah_pernafasan: false,
  },
  riwayat_kelahiran: {
    id: 0,
    anak_id: 0,
    jenis_kelahiran: '',
    alasan_sc: '',
    bantuan_kelahiran: [],
    is_premature: false,
    usia_kelahiran_bulan: 0,
    posisi_bayi_saat_lahir: '',
    is_sungsang: false,
    is_kuning: false,
    detak_jantung_anak: '',
    apgar_score: '',
    lama_persalinan: '',
    penolong_persalinan: '',
    tempat_bersalin: '',
    cerita_spesifik_kelahiran: '',
    berat_badan_bayi: null,
    panjang_badan_bayi: null,
  },
  riwayat_imunisasi: {
    id: 0,
    anak_id: 0,
    bgc: false,
    hep_b1: false,
    hep_b2: false,
    hep_b3: false,
    dpt_1: false,
    dpt_2: false,
    dpt_3: false,
    dpt_booster_1: false,
    polio_1: false,
    polio_2: false,
    polio_3: false,
    polio_4: false,
    polio_booster_1: false,
    campak_1: false,
    campak_2: false,
    hib_1: false,
    hib_2: false,
    hib_3: false,
    hib_4: false,
    mmr_1: false,
  },
  riwayat_setelah_lahir: {
    id: 0,
    anak_id: 0,
    asi_sampai_usia_bulan: 0,
    pernah_jatuh: false,
    jatuh_usia_bulan: null,
    jatuh_ketinggian_cm: null,
    pernah_sakit_parah: false,
    sakit_parah_usia_bulan: null,
    pernah_panas_tinggi: false,
    panas_tinggi_usia_bulan: null,
    disertai_kejang: false,
    frekuensi_durasi_kejang: '',
    pernah_kejang_tanpa_panas: false,
    kejang_tanpa_panas_usia_bulan: null,
    sakit_karena_virus: false,
    sakit_virus_usia_bulan: null,
    sakit_virus_jenis: '',
    frekuensi_durasi_kejang_tanpa_panas: '',
  },
  perkembangan_anak: {
    id: 0,
    anak_id: 0,
    tengkurap_ya: false,
    tengkurap_usia: '',
    berguling_ya: false,
    berguling_usia: '',
    duduk_ya: false,
    duduk_usia: '',
    merayap_ya: false,
    merayap_usia: '',
    merangkak_ya: false,
    merangkak_usia: '',
    jongkok_ya: false,
    jongkok_usia: '',
    transisi_berdiri_ya: false,
    transisi_berdiri_usia: '',
    berdiri_tanpa_pegangan_ya: false,
    berdiri_tanpa_pegangan_usia: '',
    berlari_ya: false,
    berlari_usia: '',
    melompat_ya: false,
    melompat_usia: '',
    reflek_vokalisasi_ya: false,
    reflek_vokalisasi_usia: '',
    bubbling_ya: false,
    bubbling_usia: '',
    lalling_ya: false,
    lalling_usia: '',
    echolalia_ya: false,
    echolalia_usia: '',
    true_speech_ya: false,
    true_speech_usia: '',
    mengucapkan_1_kata_ya: false,
    mengucapkan_1_kata_usia: '',
    ungkap_keinginan_2_kata_ya: false,
    ungkap_keinginan_2_kata_usia: '',
    bercerita_ya: false,
    bercerita_usia: '',
    tertarik_lingkungan_luar_ya: false,
    tertarik_lingkungan_luar_usia: '',
    digendong_siapapun_ya: false,
    digendong_siapapun_usia: '',
    interaksi_timbal_balik_ya: false,
    interaksi_timbal_balik_usia: '',
    komunikasi_ekspresi_ibu_ya: false,
    komunikasi_ekspresi_ibu_usia: '',
    ekspresi_emosi_ya: false,
    ekspresi_emosi_usia: '',
    berjalan_tanpa_pegangan_ya: false,
    berjalan_tanpa_pegangan_usia: '',
  },
  perilaku_oral_motor: {
    id: 0,
    anak_id: 0,
    mengeces: false,
    makan_makanan_keras: false,
    makan_makanan_berkuah: false,
    pilih_pilih_makanan: false,
    makan_di_emut: false,
    mengunyah_saat_makan: false,
    makan_langsung_telan: false,
  },
  pola_makan: {
    id: 0,
    anak_id: 0,
    pola_teratur: '',
    ada_pantangan_makanan: false,
    pantangan_makanan: '',
    keterangan_lainnya: '',
  },
  perkembangan_sosial: {
    id: 0,
    anak_id: 0,
    perilaku_bertemu_orang_baru: '',
    perilaku_bertemu_teman_sebaya: '',
    perilaku_bertemu_orang_lebih_tua: '',
    bermain_dengan_banyak_anak: '',
    keterangan_lainnya: '',
  },
  pola_tidur: {
    id: 0,
    anak_id: 0,
    jam_tidur_teratur: false,
    sering_terbangun: false,
    jam_tidur_malam: '',
    jam_bangun_pagi: '',
  },
  penyakit_diderita: {
    id: 0,
    anak_id: 0,
    sakit_telinga: false,
    sakit_telinga_usia_tahun: null,
    sakit_telinga_penjelasan: null,
    sakit_mata: false,
    sakit_mata_usia_tahun: null,
    sakit_mata_penjelasan: null,
    luka_kepala: false,
    luka_kepala_usia_tahun: null,
    penyakit_lainnya: '',
  } as any,
  hubungan_keluarga: {
    id: 0,
    anak_id: 0,
    tinggal_dengan: [],
    tinggal_dengan_lainnya: '',
    hubungan_ayah_ibu: '',
    hubungan_ayah_anak: '',
    hubungan_ibu_anak: '',
    hubungan_saudara_dengan_anak: '',
    hubungan_nenek_kakek_dengan_anak: '',
    hubungan_saudara_ortu_dengan_anak: '',
    hubungan_pengasuh_dengan_anak: '',
  },
  riwayat_pendidikan: {
    id: 0,
    anak_id: 0,
    mulai_sekolah_formal_usia: '',
    mulai_sekolah_informal_usia: '',
    sekolah_formal_diikuti: '',
    sekolah_informal_diikuti: '',
    bimbingan_belajar: false,
    belajar_membaca_sendiri: false,
    belajar_dibacakan_ortu: false,
    nilai_rata_rata_sekolah: '',
    nilai_tertinggi_mapel: '',
    nilai_tertinggi_nilai: '',
    nilai_terendah_mapel: '',
    nilai_terendah_nilai: '',
    keluhan_guru: [],
  },
  pemeriksaan_sebelumnya: [],
  terapi_sebelumnya: [],
  lampiran: {
    id: 0,
    anak_id: 0,
    hasil_eeg_url: '',
    hasil_bera_url: '',
    hasil_ct_scan_url: '',
    program_terapi_3bln_url: '',
    hasil_psikologis_psikiatris_url: '',
    perjanjian: null,
    keterangan_tambahan: '',
  },
};

// Komponen reusable untuk dropdown tanggal
interface DateDropdownProps {
  day: string;
  month: string;
  year: string;
  onChange: (component: 'day' | 'month' | 'year', value: string) => void;
  minYear?: number;
  maxYear?: number;
  label?: string;
  required?: boolean;
  className?: string;
}

const DateDropdown: React.FC<DateDropdownProps> = ({
  day,
  month,
  year,
  onChange,
  minYear = 1950,
  maxYear = new Date().getFullYear(),
  label,
  required = false,
  className = '',
}) => (
  <div className={`grid grid-cols-3 gap-2 ${className}`}>
    <select
      value={day}
      onChange={e => onChange('day', e.target.value)}
      className="w-full px-2 py-1 border rounded"
      required={required}
    >
      <option value="">Tanggal</option>
      {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
        <option key={d} value={String(d).padStart(2, '0')}>{d}</option>
      ))}
    </select>
    <select
      value={month}
      onChange={e => onChange('month', e.target.value)}
      className="w-full px-2 py-1 border rounded"
      required={required}
    >
      <option value="">Bulan</option>
      {[
        { value: '01', label: 'Januari' },
        { value: '02', label: 'Februari' },
        { value: '03', label: 'Maret' },
        { value: '04', label: 'April' },
        { value: '05', label: 'Mei' },
        { value: '06', label: 'Juni' },
        { value: '07', label: 'Juli' },
        { value: '08', label: 'Agustus' },
        { value: '09', label: 'September' },
        { value: '10', label: 'Oktober' },
        { value: '11', label: 'November' },
        { value: '12', label: 'Desember' },
      ].map(m => (
        <option key={m.value} value={m.value}>{m.label}</option>
      ))}
    </select>
    <select
      value={year}
      onChange={e => onChange('year', e.target.value)}
      className="w-full px-2 py-1 border rounded"
      required={required}
    >
      <option value="">Tahun</option>
      {Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i).map(y => (
        <option key={y} value={String(y)}>{y}</option>
      ))}
    </select>
  </div>
);

export { DateDropdown };

// Fungsi untuk membersihkan data sebelum dikirim ke backend
function cleanDataForAPI(data: typeof defaultAnakDetail) {
  // Helper konversi string ke number/0/null
  const toNumber = (val: any, fallback: number | undefined = undefined) => {
    if (typeof val === 'string' && val.trim() === '') return fallback;
    if (val === null || val === undefined) return fallback;
    const num = Number(val);
    return isNaN(num) ? fallback : num;
  };
  // Hapus id dan anak_id_ayah/anak_id_ibu dari ayah/ibu
  const { id, ayah, ibu, ...rest } = data;
  const cleanAyah = { ...ayah };
  const cleanIbu = { ...ibu };
  delete (cleanAyah as any)['id'];
  delete (cleanAyah as any)['anak_id_ayah'];
  delete (cleanAyah as any)['anak_id_ibu'];
  delete (cleanIbu as any)['id'];
  delete (cleanIbu as any)['anak_id_ayah'];
  delete (cleanIbu as any)['anak_id_ibu'];
  return {
    ...rest,
    anak_ke: data.anak_ke === undefined || data.anak_ke === null ? undefined : toNumber(data.anak_ke, undefined),
    status: data.status || undefined,
    ayah: {
      ...cleanAyah,
      anak_ke: data.ayah.anak_ke === undefined || data.ayah.anak_ke === null ? undefined : toNumber(data.ayah.anak_ke, undefined),
      pernikahan_ke: data.ayah.pernikahan_ke === undefined || data.ayah.pernikahan_ke === null ? undefined : toNumber(data.ayah.pernikahan_ke, undefined),
      usia_saat_menikah: data.ayah.usia_saat_menikah === undefined || data.ayah.usia_saat_menikah === null ? undefined : toNumber(data.ayah.usia_saat_menikah, undefined),
      usia: data.ayah.usia === undefined || data.ayah.usia === null ? undefined : toNumber(data.ayah.usia, undefined),
      tahun_meninggal: data.ayah.tahun_meninggal === undefined || data.ayah.tahun_meninggal === null ? undefined : toNumber(data.ayah.tahun_meninggal, undefined),
      usia_saat_meninggal: data.ayah.usia_saat_meninggal === undefined || data.ayah.usia_saat_meninggal === null ? undefined : toNumber(data.ayah.usia_saat_meninggal, undefined),
    },
    ibu: {
      ...cleanIbu,
      anak_ke: data.ibu.anak_ke === undefined || data.ibu.anak_ke === null ? undefined : toNumber(data.ibu.anak_ke, undefined),
      pernikahan_ke: data.ibu.pernikahan_ke === undefined || data.ibu.pernikahan_ke === null ? undefined : toNumber(data.ibu.pernikahan_ke, undefined),
      usia_saat_menikah: data.ibu.usia_saat_menikah === undefined || data.ibu.usia_saat_menikah === null ? undefined : toNumber(data.ibu.usia_saat_menikah, undefined),
      usia: data.ibu.usia === undefined || data.ibu.usia === null ? undefined : toNumber(data.ibu.usia, undefined),
      tahun_meninggal: data.ibu.tahun_meninggal === undefined || data.ibu.tahun_meninggal === null ? undefined : toNumber(data.ibu.tahun_meninggal, undefined),
      usia_saat_meninggal: data.ibu.usia_saat_meninggal === undefined || data.ibu.usia_saat_meninggal === null ? undefined : toNumber(data.ibu.usia_saat_meninggal, undefined),
    },
    riwayat_kehamilan: {
      ...data.riwayat_kehamilan,
      usia_ibu_saat_hamil: data.riwayat_kehamilan.usia_ibu_saat_hamil === undefined || data.riwayat_kehamilan.usia_ibu_saat_hamil === null ? undefined : toNumber(data.riwayat_kehamilan.usia_ibu_saat_hamil, undefined),
      usia_ayah_saat_hamil: data.riwayat_kehamilan.usia_ayah_saat_hamil === undefined || data.riwayat_kehamilan.usia_ayah_saat_hamil === null ? undefined : toNumber(data.riwayat_kehamilan.usia_ayah_saat_hamil, undefined),
    },
    riwayat_kelahiran: {
      ...data.riwayat_kelahiran,
      usia_kelahiran_bulan: data.riwayat_kelahiran.usia_kelahiran_bulan === undefined || data.riwayat_kelahiran.usia_kelahiran_bulan === null ? undefined : toNumber(data.riwayat_kelahiran.usia_kelahiran_bulan, undefined),
      berat_badan_bayi: data.riwayat_kelahiran.berat_badan_bayi === undefined || data.riwayat_kelahiran.berat_badan_bayi === null ? undefined : toNumber(data.riwayat_kelahiran.berat_badan_bayi, undefined),
      panjang_badan_bayi: data.riwayat_kelahiran.panjang_badan_bayi === undefined || data.riwayat_kelahiran.panjang_badan_bayi === null ? undefined : toNumber(data.riwayat_kelahiran.panjang_badan_bayi, undefined),
    },
    riwayat_setelah_lahir: {
      ...data.riwayat_setelah_lahir,
      asi_sampai_usia_bulan: data.riwayat_setelah_lahir.asi_sampai_usia_bulan === undefined || data.riwayat_setelah_lahir.asi_sampai_usia_bulan === null ? undefined : toNumber(data.riwayat_setelah_lahir.asi_sampai_usia_bulan, undefined),
      jatuh_usia_bulan: data.riwayat_setelah_lahir.jatuh_usia_bulan === undefined || data.riwayat_setelah_lahir.jatuh_usia_bulan === null ? undefined : toNumber(data.riwayat_setelah_lahir.jatuh_usia_bulan, undefined),
      jatuh_ketinggian_cm: data.riwayat_setelah_lahir.jatuh_ketinggian_cm === undefined || data.riwayat_setelah_lahir.jatuh_ketinggian_cm === null ? undefined : toNumber(data.riwayat_setelah_lahir.jatuh_ketinggian_cm, undefined),
      sakit_parah_usia_bulan: data.riwayat_setelah_lahir.sakit_parah_usia_bulan === undefined || data.riwayat_setelah_lahir.sakit_parah_usia_bulan === null ? undefined : toNumber(data.riwayat_setelah_lahir.sakit_parah_usia_bulan, undefined),
      panas_tinggi_usia_bulan: data.riwayat_setelah_lahir.panas_tinggi_usia_bulan === undefined || data.riwayat_setelah_lahir.panas_tinggi_usia_bulan === null ? undefined : toNumber(data.riwayat_setelah_lahir.panas_tinggi_usia_bulan, undefined),
      kejang_tanpa_panas_usia_bulan: data.riwayat_setelah_lahir.kejang_tanpa_panas_usia_bulan === undefined || data.riwayat_setelah_lahir.kejang_tanpa_panas_usia_bulan === null ? undefined : toNumber(data.riwayat_setelah_lahir.kejang_tanpa_panas_usia_bulan, undefined),
      sakit_virus_usia_bulan: data.riwayat_setelah_lahir.sakit_virus_usia_bulan === undefined || data.riwayat_setelah_lahir.sakit_virus_usia_bulan === null ? undefined : toNumber(data.riwayat_setelah_lahir.sakit_virus_usia_bulan, undefined),
    },
    penyakit_diderita: {
      ...data.penyakit_diderita,
      sakit_telinga_usia_tahun: data.penyakit_diderita.sakit_telinga_usia_tahun === undefined || data.penyakit_diderita.sakit_telinga_usia_tahun === null ? undefined : toNumber(data.penyakit_diderita.sakit_telinga_usia_tahun, undefined),
      sakit_mata_usia_tahun: data.penyakit_diderita.sakit_mata_usia_tahun === undefined || data.penyakit_diderita.sakit_mata_usia_tahun === null ? undefined : toNumber(data.penyakit_diderita.sakit_mata_usia_tahun, undefined),
      luka_kepala_usia_tahun: data.penyakit_diderita.luka_kepala_usia_tahun === undefined || data.penyakit_diderita.luka_kepala_usia_tahun === null ? undefined : toNumber(data.penyakit_diderita.luka_kepala_usia_tahun, undefined),
    },
    riwayat_pendidikan: {
      ...data.riwayat_pendidikan,
      // Tidak ada field number di default, tambahkan jika ada
    },
    // Tambahkan konversi lain jika ada field number lain di struktur Anda
  };
}

const AnakAddForm: React.FC = () => {
  const navigate = useNavigate();
  const [anakData, setAnakData] = useState<AnakDetail>(defaultAnakDetail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatingNumber, setGeneratingNumber] = useState(false);
  // State untuk file lampiran
  const [lampiranFiles, setLampiranFiles] = useState<{ [key: string]: File | null }>({
    hasil_eeg_url: null,
    hasil_bera_url: null,
    hasil_ct_scan_url: null,
    program_terapi_3bln_url: null,
    hasil_psikologis_psikiatris_url: null,
    perjanjian: null,
  });

  // State untuk komponen tanggal anak
  const [birthDateComponents, setBirthDateComponents] = useState(() =>
    parseDateComponents(anakData.birth_date)
  );

  // State untuk komponen tanggal ayah
  const [ayahDateComponents, setAyahDateComponents] = useState(() =>
    parseDateComponents(anakData.ayah.tanggal_lahir)
  );

  // State untuk komponen tanggal ibu
  const [ibuDateComponents, setIbuDateComponents] = useState(() =>
    parseDateComponents(anakData.ibu.tanggal_lahir)
  );

  // State untuk komponen tanggal lain
  const [pemeriksaanDateComponents, setPemeriksaanDateComponents] = useState(() =>
    parseDateComponents(anakData.tanggal_pemeriksaan)
  );

  const [mulaiTerapiDateComponents, setMulaiTerapiDateComponents] = useState(() =>
    parseDateComponents(anakData.mulai_terapi)
  );

  const [selesaiTerapiDateComponents, setSelesaiTerapiDateComponents] = useState(() =>
    parseDateComponents(anakData.selesai_terapi)
  );

  const [mulaiCutiDateComponents, setMulaiCutiDateComponents] = useState(() =>
    parseDateComponents(anakData.mulai_cuti)
  );

  const { showAlert } = useModalAlert();

  // State tambahan untuk tag input
  const [keluhanOrtuTags, setKeluhanOrtuTags] = useState<{ id: string, text: string, className: string }[]>(() => (anakData.survey_awal.keluhan_orang_tua || []).map((t, i) => ({ id: String(i), text: t, className: '' })));
  const [tindakanOrtuTags, setTindakanOrtuTags] = useState<{ id: string, text: string, className: string }[]>(() => (anakData.survey_awal.tindakan_orang_tua || []).map((t, i) => ({ id: String(i), text: t, className: '' })));
  const [kendalaTags, setKendalaTags] = useState<{ id: string, text: string, className: string }[]>(() => (anakData.survey_awal.kendala || []).map((t, i) => ({ id: String(i), text: t, className: '' })));

  // State untuk tag input array
  const [pantanganMakananTags, setPantanganMakananTags] = useState<{ id: string, text: string }[]>([]);
  const [keluhanGuruTags, setKeluhanGuruTags] = useState<{ id: string, text: string }[]>([]);
  const [tinggalDenganTags, setTinggalDenganTags] = useState<{ id: string, text: string }[]>([]);

  // Tambahkan state untuk setiap field tag Perkembangan Sosial
  const [perilakuOrangBaruTags, setPerilakuOrangBaruTags] = useState<{ id: string, text: string }[]>([]);
  const [perilakuTemanSebayaTags, setPerilakuTemanSebayaTags] = useState<{ id: string, text: string }[]>([]);
  const [perilakuOrangLebihTuaTags, setPerilakuOrangLebihTuaTags] = useState<{ id: string, text: string }[]>([]);
  const [bermainDenganBanyakAnakTags, setBermainDenganBanyakAnakTags] = useState<{ id: string, text: string }[]>([]);
  const [perkembanganSosialKeteranganTags, setPerkembanganSosialKeteranganTags] = useState<{ id: string, text: string }[]>([]);

  // Fungsi untuk menghitung usia berdasarkan tanggal lahir
  const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  // Handler untuk komponen tanggal anak
  const handleDateComponentChange = (component: 'day' | 'month' | 'year', value: string) => {
    setBirthDateComponents(prev => {
      const newComponents = { ...prev, [component]: value };
      const combinedDate = combineDateComponents(newComponents.day, newComponents.month, newComponents.year);

      // Update anakData dengan tanggal yang digabungkan
      setAnakData(prevData => ({
        ...prevData,
        birth_date: combinedDate
      }));

      return newComponents;
    });
  };

  // Handler untuk komponen tanggal ayah
  const handleAyahDateComponentChange = (component: 'day' | 'month' | 'year', value: string) => {
    setAyahDateComponents(prev => {
      const newComponents = { ...prev, [component]: value };
      const combinedDate = combineDateComponents(newComponents.day, newComponents.month, newComponents.year);

      // Update anakData dengan tanggal yang digabungkan
      setAnakData(prevData => ({
        ...prevData,
        ayah: {
          ...prevData.ayah,
          tanggal_lahir: combinedDate,
          usia: calculateAge(combinedDate)
        }
      }));

      return newComponents;
    });
  };

  // Handler untuk komponen tanggal ibu
  const handleIbuDateComponentChange = (component: 'day' | 'month' | 'year', value: string) => {
    setIbuDateComponents(prev => {
      const newComponents = { ...prev, [component]: value };
      const combinedDate = combineDateComponents(newComponents.day, newComponents.month, newComponents.year);
      setAnakData(prevData => ({
        ...prevData,
        ibu: {
          ...prevData.ibu,
          tanggal_lahir: combinedDate,
          usia: calculateAge(combinedDate)
        }
      }));
      return newComponents;
    });
  };

  // Handler untuk tanggal pemeriksaan
  const handlePemeriksaanDateComponentChange = (component: 'day' | 'month' | 'year', value: string) => {
    setPemeriksaanDateComponents(prev => {
      const newComponents = { ...prev, [component]: value };
      const combinedDate = combineDateComponents(newComponents.day, newComponents.month, newComponents.year);
      setAnakData(prevData => ({ ...prevData, tanggal_pemeriksaan: combinedDate }));
      return newComponents;
    });
  };

  // Handler untuk mulai terapi
  const handleMulaiTerapiDateComponentChange = (component: 'day' | 'month' | 'year', value: string) => {
    setMulaiTerapiDateComponents(prev => {
      const newComponents = { ...prev, [component]: value };
      const combinedDate = combineDateComponents(newComponents.day, newComponents.month, newComponents.year);
      setAnakData(prevData => ({ ...prevData, mulai_terapi: combinedDate }));
      return newComponents;
    });
  };

  // Handler untuk selesai terapi
  const handleSelesaiTerapiDateComponentChange = (component: 'day' | 'month' | 'year', value: string) => {
    setSelesaiTerapiDateComponents(prev => {
      const newComponents = { ...prev, [component]: value };
      const combinedDate = combineDateComponents(newComponents.day, newComponents.month, newComponents.year);
      setAnakData(prevData => ({ ...prevData, selesai_terapi: combinedDate }));
      return newComponents;
    });
  };

  // Handler untuk mulai cuti
  const handleMulaiCutiDateComponentChange = (component: 'day' | 'month' | 'year', value: string) => {
    setMulaiCutiDateComponents(prev => {
      const newComponents = { ...prev, [component]: value };
      const combinedDate = combineDateComponents(newComponents.day, newComponents.month, newComponents.year);
      setAnakData(prevData => ({ ...prevData, mulai_cuti: combinedDate }));
      return newComponents;
    });
  };

  // Auto-generate nomor anak saat form dibuka
  useEffect(() => {
    generateNextNumber();
  }, []);

  const generateNextNumber = async () => {
    try {
      setGeneratingNumber(true);

      const response = await anakAPI.getNextNumber();

      if (response.status === 'success' && response.data && (response.data as any).nextNumber) {
        const nextNumber = (response.data as any).nextNumber;

        setAnakData(prev => ({
          ...prev,
          nomor_anak: nextNumber
        }));
      } else {
        // Fallback
        const currentYear = new Date().getFullYear();
        const fallbackNumber = `YAMET-${currentYear}-0001`;
        setAnakData(prev => ({
          ...prev,
          nomor_anak: fallbackNumber
        }));
      }
    } catch (err: any) {
      console.error('Error generating number:', err);
      // Jika gagal, set default format
      const currentYear = new Date().getFullYear();
      const fallbackNumber = `YAMET-${currentYear}-0001`;
      setAnakData(prev => ({
        ...prev,
        nomor_anak: fallbackNumber
      }));
    } finally {
      setGeneratingNumber(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, type, value } = e.target;
    const keys = name.split('.');
    // Daftar field array survey_awal
    const arrayFields = [
      'survey_awal.keluhan_orang_tua',
      'survey_awal.tindakan_orang_tua',
      'survey_awal.kendala',
      'riwayat_kelahiran.bantuan_kelahiran'
    ];
    setAnakData(prev => {
      let newData = { ...prev };
      if (arrayFields.includes(name)) {
        // Untuk field array, split koma dan trim, JANGAN filter string kosong
        const [parent, child] = keys;
        const parentObj = (prev as any)[parent] && typeof (prev as any)[parent] === 'object' ? (prev as any)[parent] : {};
        (newData as any)[parent] = {
          ...parentObj,
          [child]: value.split(',').map((v: string) => v.trim()),
        };
      } else if (keys.length === 1) {
        (newData as any)[name] = type === 'checkbox' && 'checked' in e.target ? (e.target as HTMLInputElement).checked : value;
      } else if (keys.length === 2) {
        const [parent, child] = keys;
        const parentObj = (prev as any)[parent] && typeof (prev as any)[parent] === 'object' ? (prev as any)[parent] : {};
        (newData as any)[parent] = {
          ...parentObj,
          [child]: type === 'checkbox' && 'checked' in e.target ? (e.target as HTMLInputElement).checked : value,
        };
        // Hitung usia otomatis ketika tanggal lahir ayah atau ibu berubah
        if ((parent === 'ayah' || parent === 'ibu') && child === 'tanggal_lahir') {
          const calculatedAge = calculateAge(value);
          (newData as any)[parent] = {
            ...((newData as any)[parent]),
            usia: calculatedAge,
            anak_id_ibu: (parent === 'ayah') ? ((newData as any)[parent].anak_id_ibu ?? 0) : (newData as any)[parent].anak_id_ibu,
            anak_id_ayah: (parent === 'ibu') ? ((newData as any)[parent].anak_id_ayah ?? 0) : (newData as any)[parent].anak_id_ayah,
          };
        }
      } else if (keys.length === 3) {
        const [parent, child, grandchild] = keys;
        const parentObj = (prev as any)[parent] && typeof (prev as any)[parent] === 'object' ? (prev as any)[parent] : {};
        const childObj = parentObj[child] && typeof parentObj[child] === 'object' ? parentObj[child] : {};
        (newData as any)[parent] = {
          ...parentObj,
          [child]: {
            ...childObj,
            [grandchild]: type === 'checkbox' && 'checked' in e.target ? (e.target as HTMLInputElement).checked : value,
          },
        };
      }
      return newData;
    });
  };

  // State untuk menyimpan id anak setelah submit
  const [createdAnakId, setCreatedAnakId] = useState<number | null>(null);

  // Refactor handleLampiranChange agar upload langsung jika sudah ada anakId
  const handleLampiranChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    const file = files && files.length > 0 ? files[0] : null;
    setLampiranFiles(prev => ({ ...prev, [name]: file }));
    // Jika sudah ada anakId (setelah submit), upload langsung
    const anakId = createdAnakId;
    if (anakId && file) {
      const formData = new FormData();
      formData.append(name, file);
      try {
        await anakAPI.uploadLampiran(anakId, formData);
        showAlert({ type: 'success', title: 'Lampiran', message: `File ${file.name} berhasil diupload!` });
      } catch (err: any) {
        showAlert({ type: 'error', title: 'Lampiran', message: `Gagal upload file ${file.name}` });
      }
    }
  };

  // Tambahkan state untuk input tag
  const [keluhanInput, setKeluhanInput] = useState('');
  const [tindakanInput, setTindakanInput] = useState('');
  const [kendalaInput, setKendalaInput] = useState('');

  // Handler baru untuk tag input custom
  const addKeluhanTag = () => {
    const val = keluhanInput.trim();
    if (val && !keluhanOrtuTags.some(t => t.text === val)) {
      const newTags = [...keluhanOrtuTags, { id: String(Date.now()), text: val, className: '' }];
      setKeluhanOrtuTags(newTags);
      setKeluhanInput('');
      setAnakData(prev => ({
        ...prev,
        survey_awal: {
          ...prev.survey_awal,
          keluhan_orang_tua: newTags.map(t => t.text)
        }
      }));
    }
  };
  const addTindakanTag = () => {
    const val = tindakanInput.trim();
    if (val && !tindakanOrtuTags.some(t => t.text === val)) {
      const newTags = [...tindakanOrtuTags, { id: String(Date.now()), text: val, className: '' }];
      setTindakanOrtuTags(newTags);
      setTindakanInput('');
      setAnakData(prev => ({
        ...prev,
        survey_awal: {
          ...prev.survey_awal,
          tindakan_orang_tua: newTags.map(t => t.text)
        }
      }));
    }
  };
  const addKendalaTag = () => {
    const val = kendalaInput.trim();
    if (val && !kendalaTags.some(t => t.text === val)) {
      const newTags = [...kendalaTags, { id: String(Date.now()), text: val, className: '' }];
      setKendalaTags(newTags);
      setKendalaInput('');
      setAnakData(prev => ({
        ...prev,
        survey_awal: {
          ...prev.survey_awal,
          kendala: newTags.map(t => t.text)
        }
      }));
    }
  };
  const removeKeluhanTag = (index: number) => {
    const newTags = keluhanOrtuTags.filter((_, i) => i !== index);
    setKeluhanOrtuTags(newTags);
    setAnakData(prev => ({
      ...prev,
      survey_awal: {
        ...prev.survey_awal,
        keluhan_orang_tua: newTags.map(t => t.text)
      }
    }));
  };
  const removeTindakanTag = (index: number) => {
    const newTags = tindakanOrtuTags.filter((_, i) => i !== index);
    setTindakanOrtuTags(newTags);
    setAnakData(prev => ({
      ...prev,
      survey_awal: {
        ...prev.survey_awal,
        tindakan_orang_tua: newTags.map(t => t.text)
      }
    }));
  };
  const removeKendalaTag = (index: number) => {
    const newTags = kendalaTags.filter((_, i) => i !== index);
    setKendalaTags(newTags);
    setAnakData(prev => ({
      ...prev,
      survey_awal: {
        ...prev.survey_awal,
        kendala: newTags.map(t => t.text)
      }
    }));
  };
  const handleKeluhanKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeluhanTag();
    }
  };
  const handleTindakanKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTindakanTag();
    }
  };
  const handleKendalaKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKendalaTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Bersihkan data sebelum dikirim
      const cleanedData = cleanDataForAPI(anakData);
      // Log data yang dikirim ke backend
      console.log('[FRONTEND] Data yang dikirim ke backend:', cleanedData);
      // 1. Buat data anak
      const res = await anakAPI.create(cleanedData);
      const anakId = res.data?.id;
      setCreatedAnakId(anakId || null);
      // 2. Upload lampiran jika ada file (langsung, sama seperti Edit Form)
      if (anakId) {
        for (const [key, file] of Object.entries(lampiranFiles)) {
          if (file) {
        const formData = new FormData();
            formData.append(key, file);
            try {
          await anakAPI.uploadLampiran(anakId, formData);
              showAlert({ type: 'success', title: 'Lampiran', message: `File ${file.name} berhasil diupload!` });
            } catch (err: any) {
              showAlert({ type: 'error', title: 'Lampiran', message: `Gagal upload file ${file.name}` });
        }
      }
        }
      }
      navigate('/anak');
      showAlert({ type: 'success', title: 'Berhasil', message: 'Data berhasil ditambahkan!' });
    } catch (err: any) {
      console.error('Error detail:', err);
      console.error('Error response:', err.response?.data);

      // Tampilkan error yang lebih detail
      let errorMessage = 'Gagal menyimpan data';

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      showAlert({
        type: 'error',
        title: 'Error',
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  // Handler
  const handlePantanganMakananChange = (tags: { id: string, text: string }[]) => setPantanganMakananTags(tags);
  const handleKeluhanGuruChange = (tags: { id: string, text: string }[]) => setKeluhanGuruTags(tags);
  const handleTinggalDenganChange = (tags: { id: string, text: string }[]) => setTinggalDenganTags(tags);

  // Handler untuk setiap tag input Perkembangan Sosial
  const handlePerilakuOrangBaruChange = (tags: { id: string, text: string }[]) => {
    setPerilakuOrangBaruTags(tags);
    setAnakData(prev => ({
      ...prev,
      perkembangan_sosial: {
        ...prev.perkembangan_sosial,
        perilaku_bertemu_orang_baru: tags.map(t => t.text).join(', ')
      }
    }));
  };
  const handlePerilakuTemanSebayaChange = (tags: { id: string, text: string }[]) => {
    setPerilakuTemanSebayaTags(tags);
    setAnakData(prev => ({
      ...prev,
      perkembangan_sosial: {
        ...prev.perkembangan_sosial,
        perilaku_bertemu_teman_sebaya: tags.map(t => t.text).join(', ')
      }
    }));
  };
  const handlePerilakuOrangLebihTuaChange = (tags: { id: string, text: string }[]) => {
    setPerilakuOrangLebihTuaTags(tags);
    setAnakData(prev => ({
      ...prev,
      perkembangan_sosial: {
        ...prev.perkembangan_sosial,
        perilaku_bertemu_orang_lebih_tua: tags.map(t => t.text).join(', ')
      }
    }));
  };
  const handleBermainDenganBanyakAnakChange = (tags: { id: string, text: string }[]) => {
    setBermainDenganBanyakAnakTags(tags);
    setAnakData(prev => ({
      ...prev,
      perkembangan_sosial: {
        ...prev.perkembangan_sosial,
        bermain_dengan_banyak_anak: tags.map(t => t.text).join(', ')
      }
    }));
  };
  const handlePerkembanganSosialKeteranganChange = (tags: { id: string, text: string }[]) => {
    setPerkembanganSosialKeteranganTags(tags);
    setAnakData(prev => ({
      ...prev,
      perkembangan_sosial: {
        ...prev.perkembangan_sosial,
        keterangan_lainnya: tags.map(t => t.text).join(', ')
      }
    }));
  };

  const topFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const main = document.querySelector('main');
    if (main) main.scrollTop = 0;
    if (topFormRef.current) {
      topFormRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }, []);

  const [activeTab, setActiveTab] = useState(0);
  const tabLabels = [
    'Data Anak & Orang Tua',
    'Riwayat Kehamilan & Kelahiran',
    'Imunisasi, Setelah Lahir, Perkembangan',
    'Pola Makan, Tidur, Penyakit, Keluarga, Pendidikan',
  ];

  // Tambahkan state untuk input tag custom
  const [pantanganMakananInput, setPantanganMakananInput] = useState('');
  const [tinggalDenganInput, setTinggalDenganInput] = useState('');
  const [keluhanGuruInput, setKeluhanGuruInput] = useState('');
  const [perilakuOrangBaruInput, setPerilakuOrangBaruInput] = useState('');
  const [perilakuTemanSebayaInput, setPerilakuTemanSebayaInput] = useState('');
  const [perilakuOrangLebihTuaInput, setPerilakuOrangLebihTuaInput] = useState('');
  const [bermainDenganBanyakAnakInput, setBermainDenganBanyakAnakInput] = useState('');
  const [perkembanganSosialKeteranganInput, setPerkembanganSosialKeteranganInput] = useState('');

  // Handler custom untuk seluruh tag input di atas
  const addPantanganMakananTag = () => {
    const val = pantanganMakananInput.trim();
    if (val && !pantanganMakananTags.some(t => t.text === val)) {
      const newTags = [...pantanganMakananTags, { id: String(Date.now()), text: val }];
      setPantanganMakananTags(newTags);
      setPantanganMakananInput('');
      setAnakData(prev => ({
        ...prev,
        pola_makan: {
          ...prev.pola_makan,
          pantangan_makanan: newTags.map(t => t.text).join(', ')
        }
      }));
    }
  };
  const removePantanganMakananTag = (index: number) => {
    const newTags = pantanganMakananTags.filter((_, i) => i !== index);
    setPantanganMakananTags(newTags);
    setAnakData(prev => ({
      ...prev,
      pola_makan: {
        ...prev.pola_makan,
        pantangan_makanan: newTags.map(t => t.text).join(', ')
      }
    }));
  };
  const handlePantanganMakananKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPantanganMakananTag();
    }
  };
  const addTinggalDenganTag = () => {
    const val = tinggalDenganInput.trim();
    if (val && !tinggalDenganTags.some(t => t.text === val)) {
      const newTags = [...tinggalDenganTags, { id: String(Date.now()), text: val }];
      setTinggalDenganTags(newTags);
      setTinggalDenganInput('');
      setAnakData(prev => ({
        ...prev,
        hubungan_keluarga: {
          ...prev.hubungan_keluarga,
          tinggal_dengan: newTags.map(t => t.text)
        }
      }));
    }
  };
  const removeTinggalDenganTag = (index: number) => {
    const newTags = tinggalDenganTags.filter((_, i) => i !== index);
    setTinggalDenganTags(newTags);
    setAnakData(prev => ({
      ...prev,
      hubungan_keluarga: {
        ...prev.hubungan_keluarga,
        tinggal_dengan: newTags.map(t => t.text)
      }
    }));
  };
  const handleTinggalDenganKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTinggalDenganTag();
    }
  };
  const addKeluhanGuruTag = () => {
    const val = keluhanGuruInput.trim();
    if (val && !keluhanGuruTags.some(t => t.text === val)) {
      const newTags = [...keluhanGuruTags, { id: String(Date.now()), text: val }];
      setKeluhanGuruTags(newTags);
      setKeluhanGuruInput('');
      setAnakData(prev => ({
        ...prev,
        riwayat_pendidikan: {
          ...prev.riwayat_pendidikan,
          keluhan_guru: newTags.map(t => t.text)
        }
      }));
    }
  };
  const removeKeluhanGuruTag = (index: number) => {
    const newTags = keluhanGuruTags.filter((_, i) => i !== index);
    setKeluhanGuruTags(newTags);
    setAnakData(prev => ({
      ...prev,
      riwayat_pendidikan: {
        ...prev.riwayat_pendidikan,
        keluhan_guru: newTags.map(t => t.text)
      }
    }));
  };
  const handleKeluhanGuruKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeluhanGuruTag();
    }
  };
  // Perkembangan Sosial
  const addPerilakuOrangBaruTag = () => {
    const val = perilakuOrangBaruInput.trim();
    if (val && !perilakuOrangBaruTags.some(t => t.text === val)) {
      const newTags = [...perilakuOrangBaruTags, { id: String(Date.now()), text: val }];
      setPerilakuOrangBaruTags(newTags);
      setPerilakuOrangBaruInput('');
      setAnakData(prev => ({
        ...prev,
        perkembangan_sosial: {
          ...prev.perkembangan_sosial,
          perilaku_bertemu_orang_baru: newTags.map(t => t.text).join(', ')
        }
      }));
    }
  };
  const removePerilakuOrangBaruTag = (index: number) => {
    const newTags = perilakuOrangBaruTags.filter((_, i) => i !== index);
    setPerilakuOrangBaruTags(newTags);
    setAnakData(prev => ({
      ...prev,
      perkembangan_sosial: {
        ...prev.perkembangan_sosial,
        perilaku_bertemu_orang_baru: newTags.map(t => t.text).join(', ')
      }
    }));
  };
  const handlePerilakuOrangBaruKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPerilakuOrangBaruTag();
    }
  };
  const addPerilakuTemanSebayaTag = () => {
    const val = perilakuTemanSebayaInput.trim();
    if (val && !perilakuTemanSebayaTags.some(t => t.text === val)) {
      const newTags = [...perilakuTemanSebayaTags, { id: String(Date.now()), text: val }];
      setPerilakuTemanSebayaTags(newTags);
      setPerilakuTemanSebayaInput('');
      setAnakData(prev => ({
        ...prev,
        perkembangan_sosial: {
          ...prev.perkembangan_sosial,
          perilaku_bertemu_teman_sebaya: newTags.map(t => t.text).join(', ')
        }
      }));
    }
  };
  const removePerilakuTemanSebayaTag = (index: number) => {
    const newTags = perilakuTemanSebayaTags.filter((_, i) => i !== index);
    setPerilakuTemanSebayaTags(newTags);
    setAnakData(prev => ({
      ...prev,
      perkembangan_sosial: {
        ...prev.perkembangan_sosial,
        perilaku_bertemu_teman_sebaya: newTags.map(t => t.text).join(', ')
      }
    }));
  };
  const handlePerilakuTemanSebayaKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPerilakuTemanSebayaTag();
    }
  };
  const addPerilakuOrangLebihTuaTag = () => {
    const val = perilakuOrangLebihTuaInput.trim();
    if (val && !perilakuOrangLebihTuaTags.some(t => t.text === val)) {
      const newTags = [...perilakuOrangLebihTuaTags, { id: String(Date.now()), text: val }];
      setPerilakuOrangLebihTuaTags(newTags);
      setPerilakuOrangLebihTuaInput('');
      setAnakData(prev => ({
        ...prev,
        perkembangan_sosial: {
          ...prev.perkembangan_sosial,
          perilaku_bertemu_orang_lebih_tua: newTags.map(t => t.text).join(', ')
        }
      }));
    }
  };
  const removePerilakuOrangLebihTuaTag = (index: number) => {
    const newTags = perilakuOrangLebihTuaTags.filter((_, i) => i !== index);
    setPerilakuOrangLebihTuaTags(newTags);
    setAnakData(prev => ({
      ...prev,
      perkembangan_sosial: {
        ...prev.perkembangan_sosial,
        perilaku_bertemu_orang_lebih_tua: newTags.map(t => t.text).join(', ')
      }
    }));
  };
  const handlePerilakuOrangLebihTuaKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPerilakuOrangLebihTuaTag();
    }
  };
  const addBermainDenganBanyakAnakTag = () => {
    const val = bermainDenganBanyakAnakInput.trim();
    if (val && !bermainDenganBanyakAnakTags.some(t => t.text === val)) {
      const newTags = [...bermainDenganBanyakAnakTags, { id: String(Date.now()), text: val }];
      setBermainDenganBanyakAnakTags(newTags);
      setBermainDenganBanyakAnakInput('');
      setAnakData(prev => ({
        ...prev,
        perkembangan_sosial: {
          ...prev.perkembangan_sosial,
          bermain_dengan_banyak_anak: newTags.map(t => t.text).join(', ')
        }
      }));
    }
  };
  const removeBermainDenganBanyakAnakTag = (index: number) => {
    const newTags = bermainDenganBanyakAnakTags.filter((_, i) => i !== index);
    setBermainDenganBanyakAnakTags(newTags);
    setAnakData(prev => ({
      ...prev,
      perkembangan_sosial: {
        ...prev.perkembangan_sosial,
        bermain_dengan_banyak_anak: newTags.map(t => t.text).join(', ')
      }
    }));
  };
  const handleBermainDenganBanyakAnakKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addBermainDenganBanyakAnakTag();
    }
  };
  const addPerkembanganSosialKeteranganTag = () => {
    const val = perkembanganSosialKeteranganInput.trim();
    if (val && !perkembanganSosialKeteranganTags.some(t => t.text === val)) {
      const newTags = [...perkembanganSosialKeteranganTags, { id: String(Date.now()), text: val }];
      setPerkembanganSosialKeteranganTags(newTags);
      setPerkembanganSosialKeteranganInput('');
      setAnakData(prev => ({
        ...prev,
        perkembangan_sosial: {
          ...prev.perkembangan_sosial,
          keterangan_lainnya: newTags.map(t => t.text).join(', ')
        }
      }));
    }
  };
  const removePerkembanganSosialKeteranganTag = (index: number) => {
    const newTags = perkembanganSosialKeteranganTags.filter((_, i) => i !== index);
    setPerkembanganSosialKeteranganTags(newTags);
    setAnakData(prev => ({
      ...prev,
      perkembangan_sosial: {
        ...prev.perkembangan_sosial,
        keterangan_lainnya: newTags.map(t => t.text).join(', ')
      }
    }));
  };
  const handlePerkembanganSosialKeteranganKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPerkembanganSosialKeteranganTag();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Tambah Data Anak</h1>
            </div>
            <div className="mt-2 sm:mt-0">
              <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
                Kembali
              </Button>
            </div>
          </div>
          {/* Tab Navigator */}
          <div className="mb-6">
            <div className="flex border-b">
              {tabLabels.map((tab, idx) => (
                <button
                  key={tab}
                  className={`px-4 py-2 -mb-px border-b-2 font-medium text-sm focus:outline-none transition-colors ${
                    activeTab === idx ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-blue-600'
                  }`}
                  onClick={() => setActiveTab(idx)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8 pb-8 pr-2">
          {/* Tab 1: Data Anak, Data Orang Tua, Survey Awal */}
          {activeTab === 0 && (
            <>
              {/* Data Anak */}
              <div ref={topFormRef} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 space-y-6 mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Data Anak</h2>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Nama Lengkap</label>
                    <input type="text" name="full_name" value={anakData.full_name} onChange={handleChange} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm md:text-base" placeholder="Masukkan nama lengkap..." />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Nama Panggilan</label>
                    <input type="text" name="nick_name" value={anakData.nick_name} onChange={handleChange} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm md:text-base" placeholder="Masukkan nama panggilan..." />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Tanggal Lahir</label>
                    <DateDropdown
                      day={birthDateComponents.day}
                      month={birthDateComponents.month}
                      year={birthDateComponents.year}
                      onChange={handleDateComponentChange}
                      label="Tanggal Lahir"
                      required={true}
                    />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Tempat Lahir</label>
                    <input type="text" name="birth_place" value={anakData.birth_place} onChange={handleChange} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm md:text-base" placeholder="Masukkan tempat lahir..." />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Jenis Kelamin</label>
                    <select name="jenis_kelamin" value={anakData.jenis_kelamin || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded">
                      <option value="">Pilih jenis kelamin</option>
                      <option value="LAKI_LAKI">Laki-laki</option>
                      <option value="PEREMPUAN">Perempuan</option>
                    </select>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Kewarganegaraan</label>
                    <select name="kewarganegaraan" value={anakData.kewarganegaraan} onChange={handleChange} className="w-full px-2 py-1 border rounded">
                      <option value="">Pilih kewarganegaraan</option>
                      <option value="Indonesia">Indonesia</option>
                      <option value="WNA">WNA</option>
                    </select>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Agama</label>
                    <select name="agama" value={anakData.agama} onChange={handleChange} className="w-full px-2 py-1 border rounded">
                      <option value="">Pilih agama</option>
                      <option value="Islam">Islam</option>
                      <option value="Kristen">Kristen</option>
                      <option value="Katolik">Katolik</option>
                      <option value="Hindu">Hindu</option>
                      <option value="Buddha">Buddha</option>
                      <option value="Konghucu">Konghucu</option>
                    </select>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Anak Ke</label>
                    <input type="number" name="anak_ke" value={anakData.anak_ke} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Sekolah/Kelas</label>
                    <input type="text" name="sekolah_kelas" value={anakData.sekolah_kelas} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Status</label>
                    <select name="status" value={anakData.status} onChange={handleChange} className="w-full px-2 py-1 border rounded">
                      <option value="AKTIF">AKTIF</option>
                      <option value="CUTI">CUTI</option>
                      <option value="LULUS">LULUS</option>
                      <option value="BERHENTI">BERHENTI</option>
                    </select>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Tanggal Pemeriksaan</label>
                    <DateDropdown
                      day={pemeriksaanDateComponents.day}
                      month={pemeriksaanDateComponents.month}
                      year={pemeriksaanDateComponents.year}
                      onChange={handlePemeriksaanDateComponentChange}
                      label="Tanggal Pemeriksaan"
                    />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Mulai Terapi</label>
                    <DateDropdown
                      day={mulaiTerapiDateComponents.day}
                      month={mulaiTerapiDateComponents.month}
                      year={mulaiTerapiDateComponents.year}
                      onChange={handleMulaiTerapiDateComponentChange}
                      label="Mulai Terapi"
                    />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Selesai Terapi</label>
                    <DateDropdown
                      day={selesaiTerapiDateComponents.day}
                      month={selesaiTerapiDateComponents.month}
                      year={selesaiTerapiDateComponents.year}
                      onChange={handleSelesaiTerapiDateComponentChange}
                      label="Selesai Terapi"
                    />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Mulai Cuti</label>
                    <DateDropdown
                      day={mulaiCutiDateComponents.day}
                      month={mulaiCutiDateComponents.month}
                      year={mulaiCutiDateComponents.year}
                      onChange={handleMulaiCutiDateComponentChange}
                      label="Mulai Cuti"
                    />
                  </div>
                </div>
              </div>
              {/* Data Orang Tua */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 space-y-6 mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Data Orang Tua</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Ayah */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4 border border-gray-200">
                    <h3 className="font-semibold text-lg text-gray-700 mb-2">Ayah</h3>
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Nama Lengkap</label>
                        <input type="text" name="ayah.nama" value={anakData.ayah.nama} onChange={handleChange} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm md:text-base" placeholder="Masukkan nama ayah..." />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Tempat Lahir</label>
                        <input type="text" name="ayah.tempat_lahir" value={anakData.ayah.tempat_lahir} onChange={handleChange} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm md:text-base" placeholder="Masukkan tempat lahir ayah..." />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Tanggal Lahir</label>
                        <DateDropdown
                          day={ayahDateComponents.day}
                          month={ayahDateComponents.month}
                          year={ayahDateComponents.year}
                          onChange={handleAyahDateComponentChange}
                          label="Tanggal Lahir"
                          required={true}
                        />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Usia</label>
                        <input type="number" name="ayah.usia" value={anakData.ayah.usia} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Agama</label>
                        <select name="ayah.agama" value={anakData.ayah.agama} onChange={handleChange} className="w-full px-2 py-1 border rounded">
                          <option value="">Pilih agama</option>
                          <option value="Islam">Islam</option>
                          <option value="Kristen">Kristen</option>
                          <option value="Katolik">Katolik</option>
                          <option value="Hindu">Hindu</option>
                          <option value="Buddha">Buddha</option>
                          <option value="Konghucu">Konghucu</option>
                        </select>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Kewarganegaraan</label>
                        <select name="ayah.kewarganegaraan" value={anakData.ayah.kewarganegaraan || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded">
                          <option value="">Pilih kewarganegaraan</option>
                          <option value="Indonesia">Indonesia</option>
                          <option value="WNA">WNA</option>
                        </select>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Alamat Rumah</label>
                        <input type="text" name="ayah.alamat_rumah" value={anakData.ayah.alamat_rumah} onChange={handleChange} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm md:text-base" placeholder="Masukkan alamat rumah..." />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Anak Ke</label>
                        <input type="number" name="ayah.anak_ke" value={anakData.ayah.anak_ke} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Pernikahan Ke</label>
                        <input type="number" name="ayah.pernikahan_ke" value={anakData.ayah.pernikahan_ke} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Usia Saat Menikah</label>
                        <input type="number" name="ayah.usia_saat_menikah" value={anakData.ayah.usia_saat_menikah || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Pendidikan Terakhir</label>
                        <select name="ayah.pendidikan_terakhir" value={anakData.ayah.pendidikan_terakhir} onChange={handleChange} className="w-full px-2 py-1 border rounded">
                          <option value="">Pilih Pendidikan</option>
                          <option value="Tidak Sekolah">Tidak Sekolah</option>
                          <option value="SD">SD</option>
                          <option value="SMP">SMP</option>
                          <option value="SMA/SMK">SMA/SMK</option>
                          <option value="D1/D2/D3">D1/D2/D3</option>
                          <option value="S1">S1</option>
                          <option value="S2">S2</option>
                          <option value="S3">S3</option>
                        </select>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Pekerjaan Saat Ini</label>
                        <input type="text" name="ayah.pekerjaan_saat_ini" value={anakData.ayah.pekerjaan_saat_ini} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Telepon</label>
                        <input type="text" name="ayah.telepon" value={anakData.ayah.telepon} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Email</label>
                        <input type="email" name="ayah.email" value={anakData.ayah.email} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Tahun Meninggal</label>
                        <input type="number" name="ayah.tahun_meninggal" value={anakData.ayah.tahun_meninggal || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                      </div>
                      <div className="pl-[200px] mb-2">
                        <span className="text-xs italic text-gray-500">*jika telah meninggal</span>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Usia Saat Meninggal</label>
                        <input type="number" name="ayah.usia_saat_meninggal" value={anakData.ayah.usia_saat_meninggal || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                      </div>
                      <div className="pl-[200px] mb-2">
                        <span className="text-xs italic text-gray-500">*jika telah meninggal</span>
                      </div>
                    </div>
                  </div>
                  {/* Ibu */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4 border border-gray-200">
                    <h3 className="font-semibold text-lg text-gray-700 mb-2">Ibu</h3>
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Nama Lengkap</label>
                        <input type="text" name="ibu.nama" value={anakData.ibu.nama} onChange={handleChange} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm md:text-base" placeholder="Masukkan nama ibu..." />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Tempat Lahir</label>
                        <input type="text" name="ibu.tempat_lahir" value={anakData.ibu.tempat_lahir} onChange={handleChange} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm md:text-base" placeholder="Masukkan tempat lahir ibu..." />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Tanggal Lahir</label>
                        <DateDropdown
                          day={ibuDateComponents.day}
                          month={ibuDateComponents.month}
                          year={ibuDateComponents.year}
                          onChange={handleIbuDateComponentChange}
                          label="Tanggal Lahir"
                          required={true}
                        />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Usia</label>
                        <input type="number" name="ibu.usia" value={anakData.ibu.usia} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Agama</label>
                        <select name="ibu.agama" value={anakData.ibu.agama} onChange={handleChange} className="w-full px-2 py-1 border rounded">
                          <option value="">Pilih agama</option>
                          <option value="Islam">Islam</option>
                          <option value="Kristen">Kristen</option>
                          <option value="Katolik">Katolik</option>
                          <option value="Hindu">Hindu</option>
                          <option value="Buddha">Buddha</option>
                          <option value="Konghucu">Konghucu</option>
                        </select>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Kewarganegaraan</label>
                        <select name="ibu.kewarganegaraan" value={anakData.ibu.kewarganegaraan || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded">
                          <option value="">Pilih kewarganegaraan</option>
                          <option value="Indonesia">Indonesia</option>
                          <option value="WNA">WNA</option>
                        </select>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Alamat Rumah</label>
                        <input type="text" name="ibu.alamat_rumah" value={anakData.ibu.alamat_rumah} onChange={handleChange} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm md:text-base" placeholder="Masukkan alamat rumah..." />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Anak Ke</label>
                        <input type="number" name="ibu.anak_ke" value={anakData.ibu.anak_ke} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Pernikahan Ke</label>
                        <input type="number" name="ibu.pernikahan_ke" value={anakData.ibu.pernikahan_ke} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Usia Saat Menikah</label>
                        <input type="number" name="ibu.usia_saat_menikah" value={anakData.ibu.usia_saat_menikah || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Pendidikan Terakhir</label>
                        <select name="ibu.pendidikan_terakhir" value={anakData.ibu.pendidikan_terakhir} onChange={handleChange} className="w-full px-2 py-1 border rounded">
                          <option value="">Pilih Pendidikan</option>
                          <option value="Tidak Sekolah">Tidak Sekolah</option>
                          <option value="SD">SD</option>
                          <option value="SMP">SMP</option>
                          <option value="SMA/SMK">SMA/SMK</option>
                          <option value="D1/D2/D3">D1/D2/D3</option>
                          <option value="S1">S1</option>
                          <option value="S2">S2</option>
                          <option value="S3">S3</option>
                        </select>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Pekerjaan Saat Ini</label>
                        <input type="text" name="ibu.pekerjaan_saat_ini" value={anakData.ibu.pekerjaan_saat_ini} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Telepon</label>
                        <input type="text" name="ibu.telepon" value={anakData.ibu.telepon} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Email</label>
                        <input type="email" name="ibu.email" value={anakData.ibu.email} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Tahun Meninggal</label>
                        <input type="number" name="ibu.tahun_meninggal" value={anakData.ibu.tahun_meninggal || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                      </div>
                      <div className="pl-[200px] mb-2">
                        <span className="text-xs italic text-gray-500">*jika telah meninggal</span>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                        <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[200px] flex-shrink-0">Usia Saat Meninggal</label>
                        <input type="number" name="ibu.usia_saat_meninggal" value={anakData.ibu.usia_saat_meninggal || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                      </div>
                      <div className="pl-[200px] mb-2">
                        <span className="text-xs italic text-gray-500">*jika telah meninggal</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Survey Awal */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 space-y-6 mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Survey Awal</h2>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Mengetahui Yamet Dari</label>
                    <input type="text" name="survey_awal.mengetahui_yamet_dari" value={anakData.survey_awal.mengetahui_yamet_dari} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm md:text-base" placeholder="Masukkan sumber informasi..." />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Penjelasan Mekanisme</label>
                    <div className="flex items-center">
                      <input type="checkbox" name="survey_awal.penjelasan_mekanisme" checked={anakData.survey_awal.penjelasan_mekanisme} onChange={handleChange} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors duration-200" />
                      <span className="ml-2 text-sm text-gray-600">Ya</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Bersedia Online</label>
                    <div className="flex items-center">
                      <input type="checkbox" name="survey_awal.bersedia_online" checked={anakData.survey_awal.bersedia_online} onChange={handleChange} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors duration-200" />
                      <span className="ml-2 text-sm text-gray-600">Ya</span>
                    </div>
                  </div>
                  {/* Keluhan Orang Tua */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-800">
                      Keluhan Orang Tua
                    </label>
                    {keluhanOrtuTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {keluhanOrtuTags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-800 text-sm font-medium rounded-full hover:bg-blue-100 transition-colors duration-200"
                          >
                            {tag.text}
                            <button
                              onClick={() => removeKeluhanTag(index)}
                              className="ml-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                              type="button"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="relative">
                      <input
                        type="text"
                        value={keluhanInput}
                        onChange={e => setKeluhanInput(e.target.value)}
                        onKeyPress={handleKeluhanKeyPress}
                        placeholder="Tambah keluhan dan tekan Enter atau klik tombol +"
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm placeholder-gray-400 bg-white shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={addKeluhanTag}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      </button>
                    </div>
                  </div>
                  {/* Tindakan Orang Tua */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-800">
                      Tindakan Orang Tua
                    </label>
                    {tindakanOrtuTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {tindakanOrtuTags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-800 text-sm font-medium rounded-full hover:bg-blue-100 transition-colors duration-200"
                          >
                            {tag.text}
                            <button
                              onClick={() => removeTindakanTag(index)}
                              className="ml-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                              type="button"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="relative">
                      <input
                        type="text"
                        value={tindakanInput}
                        onChange={e => setTindakanInput(e.target.value)}
                        onKeyPress={handleTindakanKeyPress}
                        placeholder="Tambah tindakan dan tekan Enter atau klik tombol +"
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm placeholder-gray-400 bg-white shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={addTindakanTag}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      </button>
                    </div>
                  </div>
                  {/* Kendala */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-800">
                      Kendala
                    </label>
                    {kendalaTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {kendalaTags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-800 text-sm font-medium rounded-full hover:bg-blue-100 transition-colors duration-200"
                          >
                            {tag.text}
                            <button
                              onClick={() => removeKendalaTag(index)}
                              className="ml-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                              type="button"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="relative">
                      <input
                        type="text"
                        value={kendalaInput}
                        onChange={e => setKendalaInput(e.target.value)}
                        onKeyPress={handleKendalaKeyPress}
                        placeholder="Tambah kendala dan tekan Enter atau klik tombol +"
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm placeholder-gray-400 bg-white shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={addKendalaTag}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {/* Tab 2: Riwayat Kehamilan, Riwayat Kelahiran */}
          {activeTab === 1 && (
            <>
              {/* Riwayat Kehamilan */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 space-y-6 mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">Riwayat Kehamilan</h2>
                <p className="text-xs italic text-gray-500 mb-5">centang jika ya, biarkan jika tidak</p>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Usia Ibu Saat Hamil</label>
                    <input type="number" name="riwayat_kehamilan.usia_ibu_saat_hamil" value={anakData.riwayat_kehamilan.usia_ibu_saat_hamil} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm md:text-base" placeholder="Masukkan usia ibu..." />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Usia Ayah Saat Hamil</label>
                    <input type="number" name="riwayat_kehamilan.usia_ayah_saat_hamil" value={anakData.riwayat_kehamilan.usia_ayah_saat_hamil} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm md:text-base" placeholder="Masukkan usia ayah..." />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Mual/Sulit Makan</label>
                    <div className="flex items-center">
                      <input type="checkbox" name="riwayat_kehamilan.mual_sulit_makan" checked={anakData.riwayat_kehamilan.mual_sulit_makan} onChange={handleChange} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors duration-200" />
                      <span className="ml-2 text-sm text-gray-600">Ya</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Asupan Gizi Memadai</label>
                    <div className="flex items-center">
                      <input type="checkbox" name="riwayat_kehamilan.asupan_gizi_memadai" checked={anakData.riwayat_kehamilan.asupan_gizi_memadai} onChange={handleChange} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors duration-200" />
                      <span className="ml-2 text-sm text-gray-600">Ya</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Perawatan Kehamilan</label>
                    <div className="flex items-center">
                      <input type="checkbox" name="riwayat_kehamilan.perawatan_kehamilan" checked={anakData.riwayat_kehamilan.perawatan_kehamilan} onChange={handleChange} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors duration-200" />
                      <span className="ml-2 text-sm text-gray-600">Ya</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Kehamilan Diinginkan</label>
                    <div className="flex items-center">
                      <input type="checkbox" name="riwayat_kehamilan.kehamilan_diinginkan" checked={anakData.riwayat_kehamilan.kehamilan_diinginkan} onChange={handleChange} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors duration-200" />
                      <span className="ml-2 text-sm text-gray-600">Ya</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Berat Bayi Semester Normal</label>
                    <div className="flex items-center">
                      <input type="checkbox" name="riwayat_kehamilan.berat_bayi_semester_normal" checked={anakData.riwayat_kehamilan.berat_bayi_semester_normal} onChange={handleChange} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors duration-200" />
                      <span className="ml-2 text-sm text-gray-600">Ya</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Diabetes</label>
                    <div className="flex items-center">
                      <input type="checkbox" name="riwayat_kehamilan.diabetes" checked={anakData.riwayat_kehamilan.diabetes} onChange={handleChange} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors duration-200" />
                      <span className="ml-2 text-sm text-gray-600">Ya</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Hipertensi</label>
                    <div className="flex items-center">
                      <input type="checkbox" name="riwayat_kehamilan.hipertensi" checked={anakData.riwayat_kehamilan.hipertensi} onChange={handleChange} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors duration-200" />
                      <span className="ml-2 text-sm text-gray-600">Ya</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Asma</label>
                    <div className="flex items-center">
                      <input type="checkbox" name="riwayat_kehamilan.asma" checked={anakData.riwayat_kehamilan.asma} onChange={handleChange} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors duration-200" />
                      <span className="ml-2 text-sm text-gray-600">Ya</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">TBC</label>
                    <div className="flex items-center">
                      <input type="checkbox" name="riwayat_kehamilan.tbc" checked={anakData.riwayat_kehamilan.tbc} onChange={handleChange} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors duration-200" />
                      <span className="ml-2 text-sm text-gray-600">Ya</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Merokok</label>
                    <div className="flex items-center">
                      <input type="checkbox" name="riwayat_kehamilan.merokok" checked={anakData.riwayat_kehamilan.merokok} onChange={handleChange} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors duration-200" />
                      <span className="ml-2 text-sm text-gray-600">Ya</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Sekitar Perokok Berat</label>
                    <div className="flex items-center">
                      <input type="checkbox" name="riwayat_kehamilan.sekitar_perokok_berat" checked={anakData.riwayat_kehamilan.sekitar_perokok_berat} onChange={handleChange} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors duration-200" />
                      <span className="ml-2 text-sm text-gray-600">Ya</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Konsumsi Alkohol</label>
                    <div className="flex items-center">
                      <input type="checkbox" name="riwayat_kehamilan.konsumsi_alkohol" checked={anakData.riwayat_kehamilan.konsumsi_alkohol} onChange={handleChange} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors duration-200" />
                      <span className="ml-2 text-sm text-gray-600">Ya</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Konsumsi Obat-obatan</label>
                    <div className="flex items-center">
                      <input type="checkbox" name="riwayat_kehamilan.konsumsi_obat_obatan" checked={anakData.riwayat_kehamilan.konsumsi_obat_obatan} onChange={handleChange} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors duration-200" />
                      <span className="ml-2 text-sm text-gray-600">Ya</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Infeksi Virus</label>
                    <div className="flex items-center">
                      <input type="checkbox" name="riwayat_kehamilan.infeksi_virus" checked={anakData.riwayat_kehamilan.infeksi_virus} onChange={handleChange} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors duration-200" />
                      <span className="ml-2 text-sm text-gray-600">Ya</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Kecelakaan/Trauma</label>
                    <div className="flex items-center">
                      <input type="checkbox" name="riwayat_kehamilan.kecelakaan_trauma" checked={anakData.riwayat_kehamilan.kecelakaan_trauma} onChange={handleChange} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors duration-200" />
                      <span className="ml-2 text-sm text-gray-600">Ya</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Pendarahan/Flek</label>
                    <div className="flex items-center">
                      <input type="checkbox" name="riwayat_kehamilan.pendarahan_flek" checked={anakData.riwayat_kehamilan.pendarahan_flek} onChange={handleChange} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors duration-200" />
                      <span className="ml-2 text-sm text-gray-600">Ya</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Masalah Pernafasan</label>
                    <div className="flex items-center">
                      <input type="checkbox" name="riwayat_kehamilan.masalah_pernafasan" checked={anakData.riwayat_kehamilan.masalah_pernafasan} onChange={handleChange} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors duration-200" />
                      <span className="ml-2 text-sm text-gray-600">Ya</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Riwayat Kelahiran */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 space-y-6 mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Riwayat Kelahiran</h2>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Jenis Kelahiran</label>
                    <select
                      name="riwayat_kelahiran.jenis_kelahiran"
                      value={anakData.riwayat_kelahiran.jenis_kelahiran}
                      onChange={handleChange}
                      className="w-full px-2 py-1 border rounded"
                    >
                      <option value="">Pilih Jenis Kelahiran</option>
                      <option value="NORMAL">NORMAL</option>
                      <option value="CAESAR">CAESAR</option>
                    </select>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Alasan SC (jika SC)</label>
                    <input type="text" name="riwayat_kelahiran.alasan_sc" value={anakData.riwayat_kelahiran.alasan_sc || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm md:text-base" placeholder="Alasan SC (jika ada)" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Prematur</label>
                    <div className="flex items-center">
                      <input type="checkbox" name="riwayat_kelahiran.is_premature" checked={anakData.riwayat_kelahiran.is_premature} onChange={handleChange} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors duration-200" />
                      <span className="ml-2 text-sm text-gray-600">Ya</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Usia Kelahiran (bulan)</label>
                    <input type="number" name="riwayat_kelahiran.usia_kelahiran_bulan" value={anakData.riwayat_kelahiran.usia_kelahiran_bulan} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm md:text-base" placeholder="Usia kehamilan saat lahir (bulan)" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Posisi Bayi Saat Lahir</label>
                    <select
                      name="riwayat_kelahiran.posisi_bayi_saat_lahir"
                      value={anakData.riwayat_kelahiran.posisi_bayi_saat_lahir}
                      onChange={handleChange}
                      className="w-full px-2 py-1 border rounded"
                    >
                      <option value="">Pilih Posisi</option>
                      <option value="KEPALA">KEPALA</option>
                      <option value="KAKI">KAKI</option>
                    </select>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Sungsang</label>
                    <div className="flex items-center">
                      <input type="checkbox" name="riwayat_kelahiran.is_sungsang" checked={anakData.riwayat_kelahiran.is_sungsang} onChange={handleChange} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors duration-200" />
                      <span className="ml-2 text-sm text-gray-600">Ya</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Kuning</label>
                    <div className="flex items-center">
                      <input type="checkbox" name="riwayat_kelahiran.is_kuning" checked={anakData.riwayat_kelahiran.is_kuning} onChange={handleChange} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors duration-200" />
                      <span className="ml-2 text-sm text-gray-600">Ya</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Detak Jantung Anak</label>
                    <input type="text" name="riwayat_kelahiran.detak_jantung_anak" value={anakData.riwayat_kelahiran.detak_jantung_anak} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm md:text-base" placeholder="Detak jantung anak saat lahir" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Apgar Score</label>
                    <input type="text" name="riwayat_kelahiran.apgar_score" value={anakData.riwayat_kelahiran.apgar_score} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm md:text-base" placeholder="Apgar score" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Lama Persalinan</label>
                    <input type="text" name="riwayat_kelahiran.lama_persalinan" value={anakData.riwayat_kelahiran.lama_persalinan} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm md:text-base" placeholder="Lama persalinan (jam/menit)" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Penolong Persalinan</label>
                    <select
                      name="riwayat_kelahiran.penolong_persalinan"
                      value={anakData.riwayat_kelahiran.penolong_persalinan}
                      onChange={handleChange}
                      className="w-full px-2 py-1 border rounded"
                    >
                      <option value="">Pilih Penolong</option>
                      <option value="DOKTER">DOKTER</option>
                      <option value="BIDAN">BIDAN</option>
                      <option value="DUKUN_BAYI">DUKUN BAYI</option>
                    </select>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Tempat Bersalin</label>
                    <input type="text" name="riwayat_kelahiran.tempat_bersalin" value={anakData.riwayat_kelahiran.tempat_bersalin} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm md:text-base" placeholder="RS/RSIA/Puskesmas/Rumah" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-sm md:text-base font-medium text-gray-700">Cerita Spesifik Kelahiran</label>
                    <textarea name="riwayat_kelahiran.cerita_spesifik_kelahiran" value={anakData.riwayat_kelahiran.cerita_spesifik_kelahiran} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm md:text-base" placeholder="Ceritakan jika ada hal khusus saat kelahiran..." rows={3} />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Berat Badan Bayi (kg)</label>
                    <input type="number" name="riwayat_kelahiran.berat_badan_bayi" value={anakData.riwayat_kelahiran.berat_badan_bayi || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" step="0.01" min="0" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Panjang Badan Bayi (cm)</label>
                    <input type="number" name="riwayat_kelahiran.panjang_badan_bayi" value={anakData.riwayat_kelahiran.panjang_badan_bayi || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" step="0.1" min="0" />
                  </div>
                </div>
              </div>
            </>
          )}
          {/* Tab 3: Imunisasi, Setelah Lahir, Perkembangan Anak, Perilaku Oral Motor, Perkembangan Sosial */}
          {activeTab === 2 && (
            <>
              {/* Imunisasi */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 space-y-6 mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">Imunisasi</h2>
                <p className="text-xs italic text-gray-500 mb-5">centang jika ya, biarkan jika tidak</p>
                <div className="space-y-4">
                  {[
                    { label: 'BCG', name: 'riwayat_imunisasi.bgc' },
                    { label: 'Hepatitis B1', name: 'riwayat_imunisasi.hep_b1' },
                    { label: 'Hepatitis B2', name: 'riwayat_imunisasi.hep_b2' },
                    { label: 'Hepatitis B3', name: 'riwayat_imunisasi.hep_b3' },
                    { label: 'DPT 1', name: 'riwayat_imunisasi.dpt_1' },
                    { label: 'DPT 2', name: 'riwayat_imunisasi.dpt_2' },
                    { label: 'DPT 3', name: 'riwayat_imunisasi.dpt_3' },
                    { label: 'DPT Booster 1', name: 'riwayat_imunisasi.dpt_booster_1' },
                    { label: 'Polio 1', name: 'riwayat_imunisasi.polio_1' },
                    { label: 'Polio 2', name: 'riwayat_imunisasi.polio_2' },
                    { label: 'Polio 3', name: 'riwayat_imunisasi.polio_3' },
                    { label: 'Polio 4', name: 'riwayat_imunisasi.polio_4' },
                    { label: 'Polio Booster 1', name: 'riwayat_imunisasi.polio_booster_1' },
                    { label: 'Campak 1', name: 'riwayat_imunisasi.campak_1' },
                    { label: 'Campak 2', name: 'riwayat_imunisasi.campak_2' },
                    { label: 'HIB 1', name: 'riwayat_imunisasi.hib_1' },
                    { label: 'HIB 2', name: 'riwayat_imunisasi.hib_2' },
                    { label: 'HIB 3', name: 'riwayat_imunisasi.hib_3' },
                    { label: 'HIB 4', name: 'riwayat_imunisasi.hib_4' },
                    { label: 'MMR 1', name: 'riwayat_imunisasi.mmr_1' },
                  ].map(imun => (
                    <div key={imun.name} className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                      <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">{imun.label}</label>
                      <input type="checkbox" name={imun.name} checked={!!(anakData.riwayat_imunisasi as any)[imun.name.split('.')[1]]} onChange={handleChange} className="w-5 h-5" />
                    </div>
                  ))}
                </div>
              </div>
              {/* Setelah Lahir */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 space-y-6 mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">Setelah Lahir</h2>
                <p className="text-xs italic text-gray-500 mb-5">centang jika ya, biarkan jika tidak</p>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">ASI Sampai Usia (bulan)</label>
                    <input type="number" name="riwayat_setelah_lahir.asi_sampai_usia_bulan" value={anakData.riwayat_setelah_lahir.asi_sampai_usia_bulan} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Pernah Jatuh</label>
                    <input type="checkbox" name="riwayat_setelah_lahir.pernah_jatuh" checked={anakData.riwayat_setelah_lahir.pernah_jatuh} onChange={handleChange} className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Jatuh Usia (bulan)</label>
                    <input type="number" name="riwayat_setelah_lahir.jatuh_usia_bulan" value={anakData.riwayat_setelah_lahir.jatuh_usia_bulan || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Jatuh Ketinggian (cm)</label>
                    <input type="number" name="riwayat_setelah_lahir.jatuh_ketinggian_cm" value={anakData.riwayat_setelah_lahir.jatuh_ketinggian_cm || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Pernah Sakit Parah</label>
                    <input type="checkbox" name="riwayat_setelah_lahir.pernah_sakit_parah" checked={anakData.riwayat_setelah_lahir.pernah_sakit_parah} onChange={handleChange} className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Sakit Parah Usia (bulan)</label>
                    <input type="number" name="riwayat_setelah_lahir.sakit_parah_usia_bulan" value={anakData.riwayat_setelah_lahir.sakit_parah_usia_bulan || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Pernah Panas Tinggi</label>
                    <input type="checkbox" name="riwayat_setelah_lahir.pernah_panas_tinggi" checked={anakData.riwayat_setelah_lahir.pernah_panas_tinggi} onChange={handleChange} className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Panas Tinggi Usia (bulan)</label>
                    <input type="number" name="riwayat_setelah_lahir.panas_tinggi_usia_bulan" value={anakData.riwayat_setelah_lahir.panas_tinggi_usia_bulan || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Disertai Kejang</label>
                    <input type="checkbox" name="riwayat_setelah_lahir.disertai_kejang" checked={anakData.riwayat_setelah_lahir.disertai_kejang} onChange={handleChange} className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Frekuensi/Durasi Kejang</label>
                    <input type="text" name="riwayat_setelah_lahir.frekuensi_durasi_kejang" value={anakData.riwayat_setelah_lahir.frekuensi_durasi_kejang || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Pernah Kejang Tanpa Panas</label>
                    <input type="checkbox" name="riwayat_setelah_lahir.pernah_kejang_tanpa_panas" checked={anakData.riwayat_setelah_lahir.pernah_kejang_tanpa_panas} onChange={handleChange} className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Kejang Tanpa Panas Usia (bulan)</label>
                    <input type="number" name="riwayat_setelah_lahir.kejang_tanpa_panas_usia_bulan" value={anakData.riwayat_setelah_lahir.kejang_tanpa_panas_usia_bulan || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Frekuensi/Durasi Kejang Tanpa Panas</label>
                    <input type="text" name="riwayat_setelah_lahir.frekuensi_durasi_kejang_tanpa_panas" value={anakData.riwayat_setelah_lahir.frekuensi_durasi_kejang_tanpa_panas || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Pernah Sakit Karena Virus</label>
                    <input type="checkbox" name="riwayat_setelah_lahir.sakit_karena_virus" checked={anakData.riwayat_setelah_lahir.sakit_karena_virus} onChange={handleChange} className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Sakit Virus Usia (bulan)</label>
                    <input type="number" name="riwayat_setelah_lahir.sakit_virus_usia_bulan" value={anakData.riwayat_setelah_lahir.sakit_virus_usia_bulan || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Sakit Virus Jenis</label>
                    <input type="text" name="riwayat_setelah_lahir.sakit_virus_jenis" value={anakData.riwayat_setelah_lahir.sakit_virus_jenis || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                </div>
              </div>
              {/* Perkembangan Anak */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 space-y-6 mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">Perkembangan Anak</h2>
                <p className="text-xs italic text-gray-500 mb-5">centang jika ya, biarkan jika tidak</p>
                <div className="space-y-4">
                  {[
                    { label: 'Tengkurap', name: 'perkembangan_anak.tengkurap_ya', type: 'checkbox' },
                    { label: 'Tengkurap Usia', name: 'perkembangan_anak.tengkurap_usia', type: 'text' },
                    { label: 'Berguling', name: 'perkembangan_anak.berguling_ya', type: 'checkbox' },
                    { label: 'Berguling Usia', name: 'perkembangan_anak.berguling_usia', type: 'text' },
                    { label: 'Duduk', name: 'perkembangan_anak.duduk_ya', type: 'checkbox' },
                    { label: 'Duduk Usia', name: 'perkembangan_anak.duduk_usia', type: 'text' },
                    { label: 'Merayap', name: 'perkembangan_anak.merayap_ya', type: 'checkbox' },
                    { label: 'Merayap Usia', name: 'perkembangan_anak.merayap_usia', type: 'text' },
                    { label: 'Merangkak', name: 'perkembangan_anak.merangkak_ya', type: 'checkbox' },
                    { label: 'Merangkak Usia', name: 'perkembangan_anak.merangkak_usia', type: 'text' },
                    { label: 'Jongkok', name: 'perkembangan_anak.jongkok_ya', type: 'checkbox' },
                    { label: 'Jongkok Usia', name: 'perkembangan_anak.jongkok_usia', type: 'text' },
                    { label: 'Transisi Berdiri', name: 'perkembangan_anak.transisi_berdiri_ya', type: 'checkbox' },
                    { label: 'Transisi Berdiri Usia', name: 'perkembangan_anak.transisi_berdiri_usia', type: 'text' },
                    { label: 'Berdiri Tanpa Pegangan', name: 'perkembangan_anak.berdiri_tanpa_pegangan_ya', type: 'checkbox' },
                    { label: 'Berdiri Tanpa Pegangan Usia', name: 'perkembangan_anak.berdiri_tanpa_pegangan_usia', type: 'text' },
                    { label: 'Berlari', name: 'perkembangan_anak.berlari_ya', type: 'checkbox' },
                    { label: 'Berlari Usia', name: 'perkembangan_anak.berlari_usia', type: 'text' },
                    { label: 'Melompat', name: 'perkembangan_anak.melompat_ya', type: 'checkbox' },
                    { label: 'Melompat Usia', name: 'perkembangan_anak.melompat_usia', type: 'text' },
                    { label: 'Reflek Vokalisasi', name: 'perkembangan_anak.reflek_vokalisasi_ya', type: 'checkbox' },
                    { label: 'Reflek Vokalisasi Usia', name: 'perkembangan_anak.reflek_vokalisasi_usia', type: 'text' },
                    { label: 'Bubbling', name: 'perkembangan_anak.bubbling_ya', type: 'checkbox' },
                    { label: 'Bubbling Usia', name: 'perkembangan_anak.bubbling_usia', type: 'text' },
                    { label: 'Lalling', name: 'perkembangan_anak.lalling_ya', type: 'checkbox' },
                    { label: 'Lalling Usia', name: 'perkembangan_anak.lalling_usia', type: 'text' },
                    { label: 'Echolalia', name: 'perkembangan_anak.echolalia_ya', type: 'checkbox' },
                    { label: 'Echolalia Usia', name: 'perkembangan_anak.echolalia_usia', type: 'text' },
                    { label: 'True Speech', name: 'perkembangan_anak.true_speech_ya', type: 'checkbox' },
                    { label: 'True Speech Usia', name: 'perkembangan_anak.true_speech_usia', type: 'text' },
                    { label: 'Mengucapkan 1 Kata', name: 'perkembangan_anak.mengucapkan_1_kata_ya', type: 'checkbox' },
                    { label: 'Mengucapkan 1 Kata Usia', name: 'perkembangan_anak.mengucapkan_1_kata_usia', type: 'text' },
                    { label: 'Ungkap Keinginan 2 Kata', name: 'perkembangan_anak.ungkap_keinginan_2_kata_ya', type: 'checkbox' },
                    { label: 'Ungkap Keinginan 2 Kata Usia', name: 'perkembangan_anak.ungkap_keinginan_2_kata_usia', type: 'text' },
                    { label: 'Bercerita', name: 'perkembangan_anak.bercerita_ya', type: 'checkbox' },
                    { label: 'Bercerita Usia', name: 'perkembangan_anak.bercerita_usia', type: 'text' },
                    { label: 'Tertarik Lingkungan Luar', name: 'perkembangan_anak.tertarik_lingkungan_luar_ya', type: 'checkbox' },
                    { label: 'Tertarik Lingkungan Luar Usia', name: 'perkembangan_anak.tertarik_lingkungan_luar_usia', type: 'text' },
                    { label: 'Mampu Digendong Siapapun', name: 'perkembangan_anak.digendong_siapapun_ya', type: 'checkbox' },
                    { label: 'Digendong Siapapun Usia', name: 'perkembangan_anak.digendong_siapapun_usia', type: 'text' },
                    { label: 'Mampu Interaksi Timbal Balik', name: 'perkembangan_anak.interaksi_timbal_balik_ya', type: 'checkbox' },
                    { label: 'Interaksi Timbal Balik Usia', name: 'perkembangan_anak.interaksi_timbal_balik_usia', type: 'text' },
                    { label: 'Mampu Komunikasi Ekspresi Ibu', name: 'perkembangan_anak.komunikasi_ekspresi_ibu_ya', type: 'checkbox' },
                    { label: 'Komunikasi Ekspresi Ibu Usia', name: 'perkembangan_anak.komunikasi_ekspresi_ibu_usia', type: 'text' },
                    { label: 'Mampu Mengekspresikan Emosi Tersenyum, Senang,Marah', name: 'perkembangan_anak.ekspresi_emosi_ya', type: 'checkbox' },
                    { label: 'Ekspresi Emosi Usia', name: 'perkembangan_anak.ekspresi_emosi_usia', type: 'text' },
                    { label: 'Berjalan Tanpa Pegangan', name: 'perkembangan_anak.berjalan_tanpa_pegangan_ya', type: 'checkbox' },
                    { label: 'Berjalan Tanpa Pegangan Usia', name: 'perkembangan_anak.berjalan_tanpa_pegangan_usia', type: 'text' },
                  ].map(field => (
                    <div key={field.name} className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                      <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">{field.label}</label>
                      {field.type === 'checkbox' ? (
                        <input type="checkbox" name={field.name} checked={!!(anakData.perkembangan_anak as any)[field.name.split('.')[1]]} onChange={handleChange} className="w-5 h-5" />
                      ) : (
                        <input type="text" name={field.name} value={(anakData.perkembangan_anak as any)[field.name.split('.')[1]] || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {/* Perilaku Oral Motor */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 space-y-6 mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Perilaku Oral Motor</h2>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Mengeces</label>
                    <div className="flex items-center">
                      <input type="checkbox" name="perilaku_oral_motor.mengeces" checked={anakData.perilaku_oral_motor.mengeces} onChange={handleChange} className="w-5 h-5" />
                      <span className="ml-2 text-sm text-gray-600">Ya</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Makan Makanan Keras</label>
                    <div className="flex items-center">
                      <input type="checkbox" name="perilaku_oral_motor.makan_makanan_keras" checked={anakData.perilaku_oral_motor.makan_makanan_keras} onChange={handleChange} className="w-5 h-5" />
                      <span className="ml-2 text-sm text-gray-600">Ya</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Makan Makanan Berkuah</label>
                    <div className="flex items-center">
                      <input type="checkbox" name="perilaku_oral_motor.makan_makanan_berkuah" checked={anakData.perilaku_oral_motor.makan_makanan_berkuah} onChange={handleChange} className="w-5 h-5" />
                      <span className="ml-2 text-sm text-gray-600">Ya</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Pilih Pilih Makanan</label>
                    <div className="flex items-center">
                      <input type="checkbox" name="perilaku_oral_motor.pilih_pilih_makanan" checked={anakData.perilaku_oral_motor.pilih_pilih_makanan} onChange={handleChange} className="w-5 h-5" />
                      <span className="ml-2 text-sm text-gray-600">Ya</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Makan Di Emut</label>
                    <div className="flex items-center">
                      <input type="checkbox" name="perilaku_oral_motor.makan_di_emut" checked={anakData.perilaku_oral_motor.makan_di_emut} onChange={handleChange} className="w-5 h-5" />
                      <span className="ml-2 text-sm text-gray-600">Ya</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Mengunyah Saat Makan</label>
                    <div className="flex items-center">
                      <input type="checkbox" name="perilaku_oral_motor.mengunyah_saat_makan" checked={anakData.perilaku_oral_motor.mengunyah_saat_makan} onChange={handleChange} className="w-5 h-5" />
                      <span className="ml-2 text-sm text-gray-600">Ya</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Makan Langsung Telan</label>
                    <div className="flex items-center">
                      <input type="checkbox" name="perilaku_oral_motor.makan_langsung_telan" checked={anakData.perilaku_oral_motor.makan_langsung_telan} onChange={handleChange} className="w-5 h-5" />
                      <span className="ml-2 text-sm text-gray-600">Ya</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Perkembangan Sosial */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 space-y-6 mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Perkembangan Sosial</h2>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Perilaku Bertemu Orang Baru</label>
                    <div className="w-full">
                      {perilakuOrangBaruTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {perilakuOrangBaruTags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-800 text-sm font-medium rounded-full hover:bg-blue-100 transition-colors duration-200"
                            >
                              {tag.text}
                              <button
                                onClick={() => removePerilakuOrangBaruTag(index)}
                                className="ml-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                type="button"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="relative">
                        <input
                          type="text"
                          value={perilakuOrangBaruInput}
                          onChange={e => setPerilakuOrangBaruInput(e.target.value)}
                          onKeyPress={handlePerilakuOrangBaruKeyPress}
                          placeholder="Tambah perilaku bertemu orang baru dan tekan Enter atau klik tombol +"
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm placeholder-gray-400 bg-white shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={addPerilakuOrangBaruTag}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Perilaku Bertemu Teman Sebaya</label>
                    <div className="w-full">
                      {perilakuTemanSebayaTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {perilakuTemanSebayaTags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-800 text-sm font-medium rounded-full hover:bg-blue-100 transition-colors duration-200"
                            >
                              {tag.text}
                              <button
                                onClick={() => removePerilakuTemanSebayaTag(index)}
                                className="ml-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                type="button"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="relative">
                        <input
                          type="text"
                          value={perilakuTemanSebayaInput}
                          onChange={e => setPerilakuTemanSebayaInput(e.target.value)}
                          onKeyPress={handlePerilakuTemanSebayaKeyPress}
                          placeholder="Tambah perilaku bertemu teman sebaya dan tekan Enter atau klik tombol +"
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm placeholder-gray-400 bg-white shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={addPerilakuTemanSebayaTag}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Perilaku Bertemu Orang Lebih Tua</label>
                    <div className="w-full">
                      {perilakuOrangLebihTuaTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {perilakuOrangLebihTuaTags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-800 text-sm font-medium rounded-full hover:bg-blue-100 transition-colors duration-200"
                            >
                              {tag.text}
                              <button
                                onClick={() => removePerilakuOrangLebihTuaTag(index)}
                                className="ml-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                type="button"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="relative">
                        <input
                          type="text"
                          value={perilakuOrangLebihTuaInput}
                          onChange={e => setPerilakuOrangLebihTuaInput(e.target.value)}
                          onKeyPress={handlePerilakuOrangLebihTuaKeyPress}
                          placeholder="Tambah perilaku bertemu orang lebih tua dan tekan Enter atau klik tombol +"
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm placeholder-gray-400 bg-white shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={addPerilakuOrangLebihTuaTag}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Bermain Dengan Banyak Anak</label>
                    <div className="w-full">
                      {bermainDenganBanyakAnakTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {bermainDenganBanyakAnakTags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-800 text-sm font-medium rounded-full hover:bg-blue-100 transition-colors duration-200"
                            >
                              {tag.text}
                              <button
                                onClick={() => removeBermainDenganBanyakAnakTag(index)}
                                className="ml-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                type="button"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="relative">
                        <input
                          type="text"
                          value={bermainDenganBanyakAnakInput}
                          onChange={e => setBermainDenganBanyakAnakInput(e.target.value)}
                          onKeyPress={handleBermainDenganBanyakAnakKeyPress}
                          placeholder="Tambah bermain dengan banyak anak dan tekan Enter atau klik tombol +"
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm placeholder-gray-400 bg-white shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={addBermainDenganBanyakAnakTag}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Keterangan Lainnya</label>
                    <div className="w-full">
                      {perkembanganSosialKeteranganTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {perkembanganSosialKeteranganTags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-800 text-sm font-medium rounded-full hover:bg-blue-100 transition-colors duration-200"
                            >
                              {tag.text}
                              <button
                                onClick={() => removePerkembanganSosialKeteranganTag(index)}
                                className="ml-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                type="button"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="relative">
                        <input
                          type="text"
                          value={perkembanganSosialKeteranganInput}
                          onChange={e => setPerkembanganSosialKeteranganInput(e.target.value)}
                          onKeyPress={handlePerkembanganSosialKeteranganKeyPress}
                          placeholder="Tambah keterangan lainnya dan tekan Enter atau klik tombol +"
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm placeholder-gray-400 bg-white shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={addPerkembanganSosialKeteranganTag}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {/* Tab 4: Pola Makan, Pola Tidur, Penyakit Diderita, Hubungan Keluarga, Pendidikan, Lampiran */}
          {activeTab === 3 && (
            <>
              {/* Pola Makan */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 space-y-6 mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Pola Makan</h2>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Pola Teratur</label>
                    <select name="pola_makan.pola_teratur" value={anakData.pola_makan.pola_teratur || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded">
                      <option value="">Pilih</option>
                      <option value="Iya">Iya</option>
                      <option value="Tidak">Tidak</option>
                    </select>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Ada Pantangan Makanan</label>
                    <input type="checkbox" name="pola_makan.ada_pantangan_makanan" checked={anakData.pola_makan.ada_pantangan_makanan} onChange={handleChange} className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Pantangan Makanan</label>
                    <div className="w-full">
                      {pantanganMakananTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {pantanganMakananTags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-800 text-sm font-medium rounded-full hover:bg-blue-100 transition-colors duration-200"
                            >
                              {tag.text}
                              <button
                                onClick={() => removePantanganMakananTag(index)}
                                className="ml-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                type="button"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="relative">
                        <input
                          type="text"
                          value={pantanganMakananInput}
                          onChange={e => setPantanganMakananInput(e.target.value)}
                          onKeyPress={handlePantanganMakananKeyPress}
                          placeholder="Tambah pantangan makanan dan tekan Enter atau klik tombol +"
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm placeholder-gray-400 bg-white shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={addPantanganMakananTag}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Keterangan Lainnya</label>
                    <input type="text" name="pola_makan.keterangan_lainnya" value={anakData.pola_makan.keterangan_lainnya || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                </div>
              </div>
              {/* Pola Tidur */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 space-y-6 mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Pola Tidur</h2>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Jam Tidur Teratur</label>
                    <input type="checkbox" name="pola_tidur.jam_tidur_teratur" checked={anakData.pola_tidur.jam_tidur_teratur} onChange={handleChange} className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Sering Terbangun</label>
                    <input type="checkbox" name="pola_tidur.sering_terbangun" checked={anakData.pola_tidur.sering_terbangun} onChange={handleChange} className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Jam Tidur Malam</label>
                    <input type="time" name="pola_tidur.jam_tidur_malam" value={anakData.pola_tidur.jam_tidur_malam || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Jam Bangun Pagi</label>
                    <input type="time" name="pola_tidur.jam_bangun_pagi" value={anakData.pola_tidur.jam_bangun_pagi || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                </div>
              </div>
              {/* Penyakit Diderita */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 space-y-6 mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Penyakit Diderita</h2>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Sakit Telinga</label>
                    <input type="checkbox" name="penyakit_diderita.sakit_telinga" checked={anakData.penyakit_diderita.sakit_telinga} onChange={handleChange} className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Sakit Telinga Usia (tahun)</label>
                    <input type="number" name="penyakit_diderita.sakit_telinga_usia_tahun" value={anakData.penyakit_diderita.sakit_telinga_usia_tahun || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Sakit Telinga Penjelasan</label>
                    <input type="text" name="penyakit_diderita.sakit_telinga_penjelasan" value={anakData.penyakit_diderita.sakit_telinga_penjelasan || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Sakit Mata</label>
                    <input type="checkbox" name="penyakit_diderita.sakit_mata" checked={anakData.penyakit_diderita.sakit_mata} onChange={handleChange} className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Sakit Mata Usia (tahun)</label>
                    <input type="number" name="penyakit_diderita.sakit_mata_usia_tahun" value={anakData.penyakit_diderita.sakit_mata_usia_tahun || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Sakit Mata Penjelasan</label>
                    <input type="text" name="penyakit_diderita.sakit_mata_penjelasan" value={anakData.penyakit_diderita.sakit_mata_penjelasan || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Luka Kepala</label>
                    <input type="checkbox" name="penyakit_diderita.luka_kepala" checked={anakData.penyakit_diderita.luka_kepala} onChange={handleChange} className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Luka Kepala Usia (tahun)</label>
                    <input type="number" name="penyakit_diderita.luka_kepala_usia_tahun" value={anakData.penyakit_diderita.luka_kepala_usia_tahun || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Penyakit Lainnya</label>
                    <input type="text" name="penyakit_diderita.penyakit_lainnya" value={anakData.penyakit_diderita.penyakit_lainnya || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                </div>
              </div>
              {/* Hubungan Keluarga */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 space-y-6 mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Hubungan Keluarga</h2>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Tinggal Dengan</label>
                    <div className="w-full">
                      {tinggalDenganTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {tinggalDenganTags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-800 text-sm font-medium rounded-full hover:bg-blue-100 transition-colors duration-200"
                            >
                              {tag.text}
                              <button
                                onClick={() => removeTinggalDenganTag(index)}
                                className="ml-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                type="button"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="relative">
                        <input
                          type="text"
                          value={tinggalDenganInput}
                          onChange={e => setTinggalDenganInput(e.target.value)}
                          onKeyPress={handleTinggalDenganKeyPress}
                          placeholder="Tambah tinggal dengan dan tekan Enter atau klik tombol +"
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm placeholder-gray-400 bg-white shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={addTinggalDenganTag}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Tinggal Dengan Lainnya</label>
                    <input type="text" name="hubungan_keluarga.tinggal_dengan_lainnya" value={anakData.hubungan_keluarga.tinggal_dengan_lainnya || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Hubungan Ayah-Ibu</label>
                    <input type="text" name="hubungan_keluarga.hubungan_ayah_ibu" value={anakData.hubungan_keluarga.hubungan_ayah_ibu || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Hubungan Ayah-Anak</label>
                    <input type="text" name="hubungan_keluarga.hubungan_ayah_anak" value={anakData.hubungan_keluarga.hubungan_ayah_anak || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Hubungan Ibu-Anak</label>
                    <input type="text" name="hubungan_keluarga.hubungan_ibu_anak" value={anakData.hubungan_keluarga.hubungan_ibu_anak || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Hubungan Saudara dengan Anak</label>
                    <input type="text" name="hubungan_keluarga.hubungan_saudara_dengan_anak" value={anakData.hubungan_keluarga.hubungan_saudara_dengan_anak || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                </div>
              </div>
              {/* Pendidikan */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 space-y-6 mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Pendidikan</h2>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Mulai Sekolah Formal Usia</label>
                    <input type="text" name="riwayat_pendidikan.mulai_sekolah_formal_usia" value={anakData.riwayat_pendidikan.mulai_sekolah_formal_usia || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Mulai Sekolah Informal Usia</label>
                    <input type="text" name="riwayat_pendidikan.mulai_sekolah_informal_usia" value={anakData.riwayat_pendidikan.mulai_sekolah_informal_usia || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Sekolah Formal Diikuti</label>
                    <input type="text" name="riwayat_pendidikan.sekolah_formal_diikuti" value={anakData.riwayat_pendidikan.sekolah_formal_diikuti || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Sekolah Informal Diikuti</label>
                    <input type="text" name="riwayat_pendidikan.sekolah_informal_diikuti" value={anakData.riwayat_pendidikan.sekolah_informal_diikuti || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Bimbingan Belajar</label>
                    <input type="checkbox" name="riwayat_pendidikan.bimbingan_belajar" checked={anakData.riwayat_pendidikan.bimbingan_belajar} onChange={handleChange} className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Belajar Membaca Sendiri</label>
                    <input type="checkbox" name="riwayat_pendidikan.belajar_membaca_sendiri" checked={anakData.riwayat_pendidikan.belajar_membaca_sendiri} onChange={handleChange} className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Belajar Dibacakan Ortu</label>
                    <input type="checkbox" name="riwayat_pendidikan.belajar_dibacakan_ortu" checked={anakData.riwayat_pendidikan.belajar_dibacakan_ortu} onChange={handleChange} className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Nilai Rata-rata Sekolah</label>
                    <input type="text" name="riwayat_pendidikan.nilai_rata_rata_sekolah" value={anakData.riwayat_pendidikan.nilai_rata_rata_sekolah || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Nilai Tertinggi Mapel</label>
                    <input type="text" name="riwayat_pendidikan.nilai_tertinggi_mapel" value={anakData.riwayat_pendidikan.nilai_tertinggi_mapel || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Nilai Tertinggi Nilai</label>
                    <input type="text" name="riwayat_pendidikan.nilai_tertinggi_nilai" value={anakData.riwayat_pendidikan.nilai_tertinggi_nilai || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Nilai Terendah Mapel</label>
                    <input type="text" name="riwayat_pendidikan.nilai_terendah_mapel" value={anakData.riwayat_pendidikan.nilai_terendah_mapel || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Nilai Terendah Nilai</label>
                    <input type="text" name="riwayat_pendidikan.nilai_terendah_nilai" value={anakData.riwayat_pendidikan.nilai_terendah_nilai || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Keluhan Guru</label>
                    <div className="w-full">
                      {keluhanGuruTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {keluhanGuruTags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-800 text-sm font-medium rounded-full hover:bg-blue-100 transition-colors duration-200"
                            >
                              {tag.text}
                              <button
                                onClick={() => removeKeluhanGuruTag(index)}
                                className="ml-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                type="button"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="relative">
                        <input
                          type="text"
                          value={keluhanGuruInput}
                          onChange={e => setKeluhanGuruInput(e.target.value)}
                          onKeyPress={handleKeluhanGuruKeyPress}
                          placeholder="Tambah keluhan guru dan tekan Enter atau klik tombol +"
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm placeholder-gray-400 bg-white shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={addKeluhanGuruTag}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Lampiran */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Lampiran</h2>
                <p className="text-xs italic text-gray-500 mb-5">Dokumen pendukung dan hasil pemeriksaan</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {[
                    { label: 'Hasil EEG', name: 'hasil_eeg_url' },
                    { label: 'Hasil BERA', name: 'hasil_bera_url' },
                    { label: 'Hasil CT Scan', name: 'hasil_ct_scan_url' },
                    { label: 'Program Terapi 3 Bulan', name: 'program_terapi_3bln_url' },
                    { label: 'Hasil Psikologis/Psikiatris', name: 'hasil_psikologis_psikiatris_url' },
                    { label: 'Perjanjian', name: 'perjanjian' },
                  ].map(({ label, name }) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <div className="w-full">
                        <div className="relative flex w-full border overflow-hidden border-gray-200 shadow-2xs rounded-lg text-sm focus:outline-hidden focus:z-10 focus:border-blue-500 disabled:opacity-50 disabled:pointer-events-none">
                          <span className="h-full py-3 px-4 bg-gray-100 text-nowrap">Choose File</span>
                          <span className="group grow flex overflow-hidden h-full py-3 px-4">
                            <span className={lampiranFiles[name] ? '' : 'hidden'}>
                              <span className="flex items-center w-full">
                                <span className="grow-0 overflow-hidden truncate">
                                  {lampiranFiles[name]?.name || 'No Chosen File'}
                                </span>
                              </span>
                            </span>
                            <span className={lampiranFiles[name] ? 'hidden' : ''}>No Chosen File</span>
                          </span>
                          <input
                            type="file"
                            name={name}
                            accept="application/pdf,image/*"
                            onChange={handleLampiranChange}
                            className="absolute top-0 left-0 size-full opacity-0 cursor-pointer"
                          />
                        </div>
                        {lampiranFiles[name] && (
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              type="button"
                              className="text-xs text-red-600 border border-red-200 rounded px-2 py-1 hover:bg-red-50"
                              onClick={() => setLampiranFiles(files => ({ ...files, [name]: null }))}
                            >
                              Hapus
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 md:col-span-2">
                    <label className="text-sm md:text-base font-medium text-gray-700 min-w-0 md:min-w-[220px] flex-shrink-0">Keterangan Tambahan</label>
                    <input type="text" name="lampiran.keterangan_tambahan" value={anakData.lampiran.keterangan_tambahan || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
                  </div>
                </div>
              </div>
              {/* Submit Button */}
              <div className="flex justify-end">
                <Button type="submit" variant="primary" size="lg">
                  Simpan Data Anak
                </Button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default AnakAddForm;