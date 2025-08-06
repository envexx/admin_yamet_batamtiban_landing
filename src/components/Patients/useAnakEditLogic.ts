import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnakDetail } from '../../types';
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

// Custom hook untuk logic edit anak
export const useAnakEditLogic = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [anakData, setAnakData] = useState<AnakDetail>(defaultAnakDetail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatingNumber, setGeneratingNumber] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [activeTab, setActiveTab] = useState('data-anak');
  const [lampiranFiles, setLampiranFiles] = useState<{ [key: string]: File | null }>({});

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

  // State untuk tag input
  const [keluhanOrtuTags, setKeluhanOrtuTags] = useState<Tag[]>([]);
  const [tindakanOrtuTags, setTindakanOrtuTags] = useState<Tag[]>([]);
  const [kendalaTags, setKendalaTags] = useState<Tag[]>([]);
  const [pantanganMakananTags, setPantanganMakananTags] = useState<Tag[]>([]);
  const [tinggalDenganTags, setTinggalDenganTags] = useState<Tag[]>([]);
  const [keluhanGuruTags, setKeluhanGuruTags] = useState<Tag[]>([]);
  const [perilakuOrangBaruTags, setPerilakuOrangBaruTags] = useState<Tag[]>([]);
  const [perilakuTemanSebayaTags, setPerilakuTemanSebayaTags] = useState<Tag[]>([]);
  const [perilakuOrangLebihTuaTags, setPerilakuOrangLebihTuaTags] = useState<Tag[]>([]);
  const [bermainDenganBanyakAnakTags, setBermainDenganBanyakAnakTags] = useState<Tag[]>([]);
  const [perkembanganSosialKeteranganTags, setPerkembanganSosialKeteranganTags] = useState<Tag[]>([]);

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
          tanggal_lahir: combinedDate
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
          tanggal_lahir: combinedDate
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

  // Generate nomor anak otomatis
  const generateNextNumber = async () => {
    if (generatingNumber) return;
    
    setGeneratingNumber(true);
    try {
      const response = await anakAPI.generateNumber();
      if (response.success && response.data) {
        setAnakData(prev => ({
          ...prev,
          nomor_anak: response.data.nomor_anak
        }));
      }
    } catch (error) {
      console.error('Error generating number:', error);
      showAlert('error', 'Gagal generate nomor anak');
    } finally {
      setGeneratingNumber(false);
    }
  };

  // Handler untuk perubahan input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setAnakData(prev => {
        const newData = { ...prev };
        const keys = name.split('.');
        let current: any = newData;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = checked;
        return newData;
      });
    } else {
      setAnakData(prev => {
        const newData = { ...prev };
        const keys = name.split('.');
        let current: any = newData;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        return newData;
      });
    }
  };

  // Handler untuk perubahan file lampiran
  const handleLampiranChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setLampiranFiles(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };

  // Handler untuk tag input
  const addKeluhanTag = () => {
    const newTag: Tag = { id: String(Date.now()), text: '', className: '' };
    setKeluhanOrtuTags(prev => [...prev, newTag]);
  };

  const addTindakanTag = () => {
    const newTag: Tag = { id: String(Date.now()), text: '', className: '' };
    setTindakanOrtuTags(prev => [...prev, newTag]);
  };

  const addKendalaTag = () => {
    const newTag: Tag = { id: String(Date.now()), text: '', className: '' };
    setKendalaTags(prev => [...prev, newTag]);
  };

  const removeKeluhanTag = (index: number) => {
    setKeluhanOrtuTags(prev => prev.filter((_, i) => i !== index));
  };

  const removeTindakanTag = (index: number) => {
    setTindakanOrtuTags(prev => prev.filter((_, i) => i !== index));
  };

  const removeKendalaTag = (index: number) => {
    setKendalaTags(prev => prev.filter((_, i) => i !== index));
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

  // Handler untuk submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Bersihkan data sebelum dikirim
      const cleanedData = cleanDataForAPI(anakData);
      // Log data yang dikirim ke backend
      // console.log('[FRONTEND] Data yang dikirim ke backend:', cleanedData);
      // Update data anak (PUT)
      const res = await anakAPI.update(anakData.id, cleanedData);
      // Upload lampiran jika ada file baru
      for (const [key, file] of Object.entries(lampiranFiles)) {
        if (file) {
          const formData = new FormData();
          formData.append(key, file);
          await anakAPI.uploadLampiran(anakData.id, formData);
        }
      }
      
      showAlert('success', 'Data anak berhasil diperbarui');
      navigate('/patients');
    } catch (error: unknown) {
      console.error('Error updating anak:', error);
      const errorMessage = (error as any)?.response?.data?.message || 'Terjadi kesalahan saat memperbarui data anak';
      setError(errorMessage);
      showAlert('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handler untuk tag input lainnya
  const handlePantanganMakananChange = (tags: { id: string, text: string }[]) => setPantanganMakananTags(tags);
  const handleKeluhanGuruChange = (tags: { id: string, text: string }[]) => setKeluhanGuruTags(tags);
  const handleTinggalDenganChange = (tags: { id: string, text: string }[]) => setTinggalDenganTags(tags);

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

  // Handler untuk tag input lainnya
  const addPantanganMakananTag = () => {
    const newTag: Tag = { id: String(Date.now()), text: '', className: '' };
    setPantanganMakananTags(prev => [...prev, newTag]);
  };

  const removePantanganMakananTag = (index: number) => {
    setPantanganMakananTags(prev => prev.filter((_, i) => i !== index));
  };

  const handlePantanganMakananKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPantanganMakananTag();
    }
  };

  const addTinggalDenganTag = () => {
    const newTag: Tag = { id: String(Date.now()), text: '', className: '' };
    setTinggalDenganTags(prev => [...prev, newTag]);
  };

  const removeTinggalDenganTag = (index: number) => {
    setTinggalDenganTags(prev => prev.filter((_, i) => i !== index));
  };

  const handleTinggalDenganKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTinggalDenganTag();
    }
  };

  const addKeluhanGuruTag = () => {
    const newTag: Tag = { id: String(Date.now()), text: '', className: '' };
    setKeluhanGuruTags(prev => [...prev, newTag]);
  };

  const removeKeluhanGuruTag = (index: number) => {
    setKeluhanGuruTags(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeluhanGuruKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeluhanGuruTag();
    }
  };

  const addPerilakuOrangBaruTag = () => {
    const newTag: Tag = { id: String(Date.now()), text: '', className: '' };
    setPerilakuOrangBaruTags(prev => [...prev, newTag]);
  };

  const removePerilakuOrangBaruTag = (index: number) => {
    setPerilakuOrangBaruTags(prev => prev.filter((_, i) => i !== index));
  };

  const handlePerilakuOrangBaruKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPerilakuOrangBaruTag();
    }
  };

  const addPerilakuTemanSebayaTag = () => {
    const newTag: Tag = { id: String(Date.now()), text: '', className: '' };
    setPerilakuTemanSebayaTags(prev => [...prev, newTag]);
  };

  const removePerilakuTemanSebayaTag = (index: number) => {
    setPerilakuTemanSebayaTags(prev => prev.filter((_, i) => i !== index));
  };

  const handlePerilakuTemanSebayaKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPerilakuTemanSebayaTag();
    }
  };

  const addPerilakuOrangLebihTuaTag = () => {
    const newTag: Tag = { id: String(Date.now()), text: '', className: '' };
    setPerilakuOrangLebihTuaTags(prev => [...prev, newTag]);
  };

  const removePerilakuOrangLebihTuaTag = (index: number) => {
    setPerilakuOrangLebihTuaTags(prev => prev.filter((_, i) => i !== index));
  };

  const handlePerilakuOrangLebihTuaKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPerilakuOrangLebihTuaTag();
    }
  };

  const addBermainDenganBanyakAnakTag = () => {
    const newTag: Tag = { id: String(Date.now()), text: '', className: '' };
    setBermainDenganBanyakAnakTags(prev => [...prev, newTag]);
  };

  const removeBermainDenganBanyakAnakTag = (index: number) => {
    setBermainDenganBanyakAnakTags(prev => prev.filter((_, i) => i !== index));
  };

  const handleBermainDenganBanyakAnakKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addBermainDenganBanyakAnakTag();
    }
  };

  const addPerkembanganSosialKeteranganTag = () => {
    const newTag: Tag = { id: String(Date.now()), text: '', className: '' };
    setPerkembanganSosialKeteranganTags(prev => [...prev, newTag]);
  };

  const removePerkembanganSosialKeteranganTag = (index: number) => {
    setPerkembanganSosialKeteranganTags(prev => prev.filter((_, i) => i !== index));
  };

  const handlePerkembanganSosialKeteranganKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPerkembanganSosialKeteranganTag();
    }
  };

  // Load data anak saat komponen mount
  useEffect(() => {
    const loadAnakData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await anakAPI.getById(parseInt(id));
        if (response.success && response.data) {
          setAnakData(response.data);
        } else {
          setError('Data anak tidak ditemukan');
          showAlert('error', 'Data anak tidak ditemukan');
        }
      } catch (error: any) {
        console.error('Error loading anak data:', error);
        setError(error.response?.data?.message || 'Terjadi kesalahan saat memuat data anak');
        showAlert('error', error.response?.data?.message || 'Terjadi kesalahan saat memuat data anak');
      } finally {
        setLoading(false);
      }
    };

    loadAnakData();
  }, [id, showAlert]);

  // Update komponen tanggal saat data berubah
  useEffect(() => {
    if (isFirstLoad && anakData && anakData.id) {
      setBirthDateComponents(parseDateComponents(anakData.birth_date));
      setAyahDateComponents(parseDateComponents(anakData.ayah.tanggal_lahir));
      setIbuDateComponents(parseDateComponents(anakData.ibu.tanggal_lahir));
      setPemeriksaanDateComponents(parseDateComponents(anakData.tanggal_pemeriksaan));
      setMulaiTerapiDateComponents(parseDateComponents(anakData.mulai_terapi));
      setSelesaiTerapiDateComponents(parseDateComponents(anakData.selesai_terapi));
      setMulaiCutiDateComponents(parseDateComponents(anakData.mulai_cuti));
      // Tag/tag array
      setKeluhanOrtuTags((anakData.survey_awal.keluhan_orang_tua || []).map((t, i) => ({ id: String(i), text: t, className: '' })));
      setTindakanOrtuTags((anakData.survey_awal.tindakan_orang_tua || []).map((t, i) => ({ id: String(i), text: t, className: '' })));
      setKendalaTags((anakData.survey_awal.kendala || []).map((t, i) => ({ id: String(i), text: t, className: '' })));
      setPantanganMakananTags((anakData.pola_makan.pantangan_makanan ? anakData.pola_makan.pantangan_makanan.split(', ') : []).map((t, i) => ({ id: String(i), text: t, className: '' })));
      setTinggalDenganTags((anakData.hubungan_keluarga.tinggal_dengan || []).map((t, i) => ({ id: String(i), text: t, className: '' })));
      setKeluhanGuruTags((anakData.riwayat_pendidikan.keluhan_guru || []).map((t, i) => ({ id: String(i), text: t, className: '' })));
      setPerilakuOrangBaruTags((anakData.perkembangan_sosial.perilaku_bertemu_orang_baru ? anakData.perkembangan_sosial.perilaku_bertemu_orang_baru.split(', ') : []).map((t, i) => ({ id: String(i), text: t, className: '' })));
      setPerilakuTemanSebayaTags((anakData.perkembangan_sosial.perilaku_bertemu_teman_sebaya ? anakData.perkembangan_sosial.perilaku_bertemu_teman_sebaya.split(', ') : []).map((t, i) => ({ id: String(i), text: t, className: '' })));
      setPerilakuOrangLebihTuaTags((anakData.perkembangan_sosial.perilaku_bertemu_orang_lebih_tua ? anakData.perkembangan_sosial.perilaku_bertemu_orang_lebih_tua.split(', ') : []).map((t, i) => ({ id: String(i), text: t, className: '' })));
      setBermainDenganBanyakAnakTags((anakData.perkembangan_sosial.bermain_dengan_banyak_anak ? anakData.perkembangan_sosial.bermain_dengan_banyak_anak.split(', ') : []).map((t, i) => ({ id: String(i), text: t, className: '' })));
      setPerkembanganSosialKeteranganTags((anakData.perkembangan_sosial.keterangan_lainnya ? anakData.perkembangan_sosial.keterangan_lainnya.split(', ') : []).map((t, i) => ({ id: String(i), text: t, className: '' })));
      setIsFirstLoad(false);
    }
  }, [anakData, isFirstLoad]);

  return {
    // State
    anakData,
    loading,
    error,
    generatingNumber,
    activeTab,
    lampiranFiles,
    birthDateComponents,
    ayahDateComponents,
    ibuDateComponents,
    pemeriksaanDateComponents,
    mulaiTerapiDateComponents,
    selesaiTerapiDateComponents,
    mulaiCutiDateComponents,
    keluhanOrtuTags,
    tindakanOrtuTags,
    kendalaTags,
    pantanganMakananTags,
    tinggalDenganTags,
    keluhanGuruTags,
    perilakuOrangBaruTags,
    perilakuTemanSebayaTags,
    perilakuOrangLebihTuaTags,
    bermainDenganBanyakAnakTags,
    perkembanganSosialKeteranganTags,
    
    // Setters
    setAnakData,
    setActiveTab,
    setLampiranFiles,
    setBirthDateComponents,
    setAyahDateComponents,
    setIbuDateComponents,
    setPemeriksaanDateComponents,
    setMulaiTerapiDateComponents,
    setSelesaiTerapiDateComponents,
    setMulaiCutiDateComponents,
    setKeluhanOrtuTags,
    setTindakanOrtuTags,
    setKendalaTags,
    setPantanganMakananTags,
    setTinggalDenganTags,
    setKeluhanGuruTags,
    setPerilakuOrangBaruTags,
    setPerilakuTemanSebayaTags,
    setPerilakuOrangLebihTuaTags,
    setBermainDenganBanyakAnakTags,
    setPerkembanganSosialKeteranganTags,
    
    // Handlers
    handleChange,
    handleLampiranChange,
    handleDateComponentChange,
    handleAyahDateComponentChange,
    handleIbuDateComponentChange,
    handlePemeriksaanDateComponentChange,
    handleMulaiTerapiDateComponentChange,
    handleSelesaiTerapiDateComponentChange,
    handleMulaiCutiDateComponentChange,
    handleSubmit,
    generateNextNumber,
    
    // Tag handlers
    addKeluhanTag,
    addTindakanTag,
    addKendalaTag,
    removeKeluhanTag,
    removeTindakanTag,
    removeKendalaTag,
    handleKeluhanKeyPress,
    handleTindakanKeyPress,
    handleKendalaKeyPress,
    
    // Tag handlers lainnya
    handlePantanganMakananChange,
    handleKeluhanGuruChange,
    handleTinggalDenganChange,
    handlePerilakuOrangBaruChange,
    handlePerilakuTemanSebayaChange,
    handlePerilakuOrangLebihTuaChange,
    handleBermainDenganBanyakAnakChange,
    handlePerkembanganSosialKeteranganChange,
    
    addPantanganMakananTag,
    removePantanganMakananTag,
    handlePantanganMakananKeyPress,
    addTinggalDenganTag,
    removeTinggalDenganTag,
    handleTinggalDenganKeyPress,
    addKeluhanGuruTag,
    removeKeluhanGuruTag,
    handleKeluhanGuruKeyPress,
    addPerilakuOrangBaruTag,
    removePerilakuOrangBaruTag,
    handlePerilakuOrangBaruKeyPress,
    addPerilakuTemanSebayaTag,
    removePerilakuTemanSebayaTag,
    handlePerilakuTemanSebayaKeyPress,
    addPerilakuOrangLebihTuaTag,
    removePerilakuOrangLebihTuaTag,
    handlePerilakuOrangLebihTuaKeyPress,
    addBermainDenganBanyakAnakTag,
    removeBermainDenganBanyakAnakTag,
    handleBermainDenganBanyakAnakKeyPress,
    addPerkembanganSosialKeteranganTag,
    removePerkembanganSosialKeteranganTag,
    handlePerkembanganSosialKeteranganKeyPress,
  };
};














