import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { anakAPI } from '../../services/api';
import { AnakDetail } from '../../types';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';
import { useModalAlert } from '../UI/ModalAlertContext';

const AnakEditForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [anakData, setAnakData] = useState<AnakDetail>({
    id: 0,
    nomor_anak: '',
    name: '',
    nick_name: '',
    birth_date: '',
    birth_place: '',
    kewarganegaraan: 'Indonesia',
    agama: '',
    anak_ke: 1,
    sekolah_kelas: '',
    tanggal_pemeriksaan: '',
    status: 'AKTIF',
    mulai_terapi: null,
    selesai_terapi: null,
    mulai_cuti: null,
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
    },
    ibu: {
      id: 0,
      anak_id_ayah: null,
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
      tahun_meninggal: null,
      usia_saat_meninggal: null,
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
      frekuensi_durasi_kejang: null,
      pernah_kejang_tanpa_panas: false,
      kejang_tanpa_panas_usia_bulan: null,
      sakit_karena_virus: false,
      sakit_virus_usia_bulan: null,
      sakit_virus_jenis: null,
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
    },
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
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [lampiranLoading, setLampiranLoading] = useState<{ [key: string]: boolean }>({});
  const [selectedFileNames, setSelectedFileNames] = useState<{ [key: string]: string }>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { showAlert } = useModalAlert();

  useEffect(() => {
    if (id) {
      setFetchLoading(true);
      setFetchError(null);
      anakAPI.getById(Number(id))
        .then((response) => {
          if (response.status === 'success' && response.data) {
            setAnakData(response.data);
            // Set selected file names from existing data
            const fileNames: { [key: string]: string } = {};
            if (response.data.lampiran) {
              Object.keys(response.data.lampiran).forEach(key => {
                const lampiran = response.data!.lampiran as any;
                const value = lampiran[key];
                if (typeof value === 'string' && value) {
                  fileNames[key] = value.split('/').pop() || '';
                }
              });
            }
            setSelectedFileNames(fileNames);
          } else {
            setFetchError(response.message || 'Gagal memuat data anak');
          }
        })
        .catch((err: any) => {
          setFetchError(err.message || 'Gagal memuat data anak');
        })
        .finally(() => {
          setFetchLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, type, value } = e.target;
    const keys = name.split('.');
    setAnakData(prev => {
      if (keys.length === 1) {
        return {
          ...prev,
          [name]: type === 'checkbox' && 'checked' in e.target ? (e.target as HTMLInputElement).checked : value,
        };
      } else if (keys.length === 2) {
        const [parent, child] = keys;
        const parentObj = (prev[parent as keyof typeof prev] && typeof prev[parent as keyof typeof prev] === 'object') ? prev[parent as keyof typeof prev] : {};
        return {
          ...prev,
          [parent]: {
            ...parentObj,
            [child]: type === 'checkbox' && 'checked' in e.target ? (e.target as HTMLInputElement).checked : value,
          },
        };
      } else if (keys.length === 3) {
        const [parent, child, subchild] = keys;
        const parentObj = (prev[parent as keyof typeof prev] && typeof prev[parent as keyof typeof prev] === 'object') ? prev[parent as keyof typeof prev] : {};
        const childObj = (parentObj as any)[child] && typeof (parentObj as any)[child] === 'object' ? (parentObj as any)[child] : {};
        return {
          ...prev,
          [parent]: {
            ...parentObj,
            [child]: {
              ...childObj,
              [subchild]: type === 'checkbox' && 'checked' in e.target ? (e.target as HTMLInputElement).checked : value,
            },
          },
        };
      }
      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!id) {
        setError('ID anak tidak ditemukan');
        return;
      }

      // Create a minimal data object with only essential fields
      const essentialData = {
        nomor_anak: anakData.nomor_anak,
        name: anakData.name,
        nick_name: anakData.nick_name,
        birth_date: anakData.birth_date,
        birth_place: anakData.birth_place,
        kewarganegaraan: anakData.kewarganegaraan,
        agama: anakData.agama,
        anak_ke: anakData.anak_ke,
        sekolah_kelas: anakData.sekolah_kelas,
        status: anakData.status,
        tanggal_pemeriksaan: anakData.tanggal_pemeriksaan,
        mulai_terapi: anakData.mulai_terapi || '',
        selesai_terapi: anakData.selesai_terapi || '',
        mulai_cuti: anakData.mulai_cuti || '',
        ayah: anakData.ayah,
        ibu: anakData.ibu,
        survey_awal: anakData.survey_awal,
        riwayat_kehamilan: anakData.riwayat_kehamilan,
        riwayat_kelahiran: anakData.riwayat_kelahiran,
        riwayat_imunisasi: anakData.riwayat_imunisasi,
        riwayat_setelah_lahir: anakData.riwayat_setelah_lahir,
        perkembangan_anak: anakData.perkembangan_anak,
        perilaku_oral_motor: anakData.perilaku_oral_motor,
        pola_makan: anakData.pola_makan,
        perkembangan_sosial: anakData.perkembangan_sosial,
        pola_tidur: anakData.pola_tidur,
        penyakit_diderita: anakData.penyakit_diderita,
        hubungan_keluarga: anakData.hubungan_keluarga,
        riwayat_pendidikan: anakData.riwayat_pendidikan,
        pemeriksaan_sebelumnya: anakData.pemeriksaan_sebelumnya,
        terapi_sebelumnya: anakData.terapi_sebelumnya,
        lampiran: anakData.lampiran,
      };

      console.log('Sending essential data to backend:', essentialData);

      // Update data anak ke backend
      const response = await anakAPI.update(Number(id), essentialData);
      
      if (response.status === 'success') {
        // Refresh data dari server untuk memastikan data terbaru
        const res = await anakAPI.getById(Number(id));
        if (res.status === 'success' && res.data) {
          setAnakData(res.data);
          // Update file names from server response
          const fileNames: { [key: string]: string } = {};
          if (res.data.lampiran) {
            Object.keys(res.data.lampiran).forEach(key => {
              const lampiran = res.data!.lampiran as any;
              const value = lampiran[key];
              if (typeof value === 'string' && value) {
                fileNames[key] = value.split('/').pop() || '';
              }
            });
          }
          setSelectedFileNames(fileNames);
        }
        
        // Navigate back to anak list
        navigate('/anak');
        showAlert({ type: 'success', title: 'Berhasil', message: 'Data berhasil diupdate!' });
      } else {
        setError(response.message || 'Gagal menyimpan data');
      }
    } catch (err: any) {
      console.error('Error updating anak:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || err.message || 'Gagal menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  const handleLampiranChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!id) return;
    if (files && files.length > 0) {
      const file = files[0];
      // Update selected file name immediately for UI feedback
      setSelectedFileNames(prev => ({ ...prev, [name]: file.name }));
      setLampiranLoading(l => ({ ...l, [name]: true }));
      
      const formData = new FormData();
      formData.append(name, file);
      try {
        await anakAPI.uploadLampiran(Number(id), formData);
        // Refresh data anak
        const res = await anakAPI.getById(Number(id));
        if (res.status === 'success' && res.data) {
          setAnakData(res.data);
          // Update file names from server response
          const fileNames: { [key: string]: string } = {};
          if (res.data.lampiran) {
            Object.keys(res.data.lampiran).forEach(key => {
              const lampiran = res.data!.lampiran as any;
              const value = lampiran[key];
              if (typeof value === 'string' && value) {
                fileNames[key] = value.split('/').pop() || '';
              }
            });
          }
          setSelectedFileNames(fileNames);
        }
      } catch (err) {
        console.error('Error uploading file:', err);
        // Revert file name on error
        setSelectedFileNames(prev => ({ ...prev, [name]: '' }));
      }
      setLampiranLoading(l => ({ ...l, [name]: false }));
    }
  };

  const handleLampiranDelete = async (name: string) => {
    if (!id) return;
    setLampiranLoading(l => ({ ...l, [name]: true }));
    try {
      // Kirim objek lampiran lengkap, field yang dihapus diisi null
      const lampiranPayload = { ...anakData.lampiran, [name]: null };
      await anakAPI.update(Number(id), { lampiran: lampiranPayload });
      // Refresh data anak
      const res = await anakAPI.getById(Number(id));
      if (res.status === 'success' && res.data) {
        setAnakData(res.data);
        setSelectedFileNames(prev => ({ ...prev, [name]: '' }));
        showAlert({ type: 'success', title: 'Lampiran Dihapus', message: 'File lampiran berhasil dihapus.' });
      }
    } catch (err) {
      console.error('Error deleting file:', err);
    }
    setLampiranLoading(l => ({ ...l, [name]: false }));
  };

  const handleBack = () => {
    showAlert({ type: 'success', title: 'Tersimpan', message: 'Perubahan berhasil disimpan!' });
    navigate(-1);
  };

  if (fetchLoading) {
    return <LoadingSpinner size="lg" text="Memuat data anak..." />;
  }
  if (fetchError) {
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded">
        <h2 className="font-bold mb-2">Terjadi Kesalahan</h2>
        <p>{fetchError}</p>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      <Button variant="secondary" size="sm" onClick={handleBack}>
        Kembali
      </Button>
      
      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-100 text-red-800 rounded border border-red-200">
          <h2 className="font-bold mb-2">Terjadi Kesalahan</h2>
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Data Anak */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Data Anak</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label>Nomor Anak</label>
              <input type="text" name="nomor_anak" value={anakData.nomor_anak ?? ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div>
              <label>Nama Lengkap</label>
              <input type="text" name="name" value={anakData.name ?? ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div>
              <label>Nama Panggilan</label>
              <input type="text" name="nick_name" value={anakData.nick_name ?? ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div>
              <label>Tanggal Lahir</label>
              <input type="date" name="birth_date" value={anakData.birth_date} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div>
              <label>Tempat Lahir</label>
              <input type="text" name="birth_place" value={anakData.birth_place ?? ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div>
              <label>Kewarganegaraan</label>
              <input type="text" name="kewarganegaraan" value={anakData.kewarganegaraan ?? ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div>
              <label>Agama</label>
              <input type="text" name="agama" value={anakData.agama ?? ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div>
              <label>Anak Ke</label>
              <input type="number" name="anak_ke" value={anakData.anak_ke ?? ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div>
              <label>Sekolah/Kelas</label>
              <input type="text" name="sekolah_kelas" value={anakData.sekolah_kelas || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div>
              <label>Status</label>
              <select name="status" value={anakData.status || 'AKTIF'} onChange={handleChange} className="w-full px-2 py-1 border rounded">
                <option value="AKTIF">AKTIF</option>
                <option value="NONAKTIF">NONAKTIF</option>
              </select>
            </div>
            <div>
              <label>Tanggal Pemeriksaan</label>
              <input type="date" name="tanggal_pemeriksaan" value={anakData.tanggal_pemeriksaan} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div>
              <label>Mulai Terapi</label>
              <input type="date" name="mulai_terapi" value={anakData.mulai_terapi || undefined} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div>
              <label>Selesai Terapi</label>
              <input type="date" name="selesai_terapi" value={anakData.selesai_terapi || undefined} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div>
              <label>Mulai Cuti</label>
              <input type="date" name="mulai_cuti" value={anakData.mulai_cuti || undefined} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
          </div>
        </div>
        {/* Data Orang Tua */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Data Orang Tua</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ayah */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Ayah</h3>
              <div className="space-y-2">
                <div><label>Nama Lengkap</label><input type="text" name="ayah.nama" value={anakData.ayah.nama} onChange={handleChange} className="w-full px-2 py-1 border rounded" /></div>
                <div><label>Tempat Lahir</label><input type="text" name="ayah.tempat_lahir" value={anakData.ayah.tempat_lahir} onChange={handleChange} className="w-full px-2 py-1 border rounded" /></div>
                <div><label>Tanggal Lahir</label><input type="date" name="ayah.tanggal_lahir" value={anakData.ayah.tanggal_lahir} onChange={handleChange} className="w-full px-2 py-1 border rounded" /></div>
                <div><label>Usia</label><input type="number" name="ayah.usia" value={anakData.ayah.usia} onChange={handleChange} className="w-full px-2 py-1 border rounded" /></div>
                <div><label>Agama</label><input type="text" name="ayah.agama" value={anakData.ayah.agama} onChange={handleChange} className="w-full px-2 py-1 border rounded" /></div>
                <div><label>Alamat Rumah</label><input type="text" name="ayah.alamat_rumah" value={anakData.ayah.alamat_rumah} onChange={handleChange} className="w-full px-2 py-1 border rounded" /></div>
                <div><label>Anak Ke</label><input type="number" name="ayah.anak_ke" value={anakData.ayah.anak_ke} onChange={handleChange} className="w-full px-2 py-1 border rounded" /></div>
                <div><label>Pernikahan Ke</label><input type="number" name="ayah.pernikahan_ke" value={anakData.ayah.pernikahan_ke} onChange={handleChange} className="w-full px-2 py-1 border rounded" /></div>
                <div><label>Usia Saat Menikah</label><input type="number" name="ayah.usia_saat_menikah" value={anakData.ayah.usia_saat_menikah} onChange={handleChange} className="w-full px-2 py-1 border rounded" /></div>
                <div><label>Pendidikan Terakhir</label><input type="text" name="ayah.pendidikan_terakhir" value={anakData.ayah.pendidikan_terakhir} onChange={handleChange} className="w-full px-2 py-1 border rounded" /></div>
                <div><label>Pekerjaan Saat Ini</label><input type="text" name="ayah.pekerjaan_saat_ini" value={anakData.ayah.pekerjaan_saat_ini} onChange={handleChange} className="w-full px-2 py-1 border rounded" /></div>
                <div><label>Telepon</label><input type="text" name="ayah.telepon" value={anakData.ayah.telepon} onChange={handleChange} className="w-full px-2 py-1 border rounded" /></div>
                <div><label>Email</label><input type="email" name="ayah.email" value={anakData.ayah.email} onChange={handleChange} className="w-full px-2 py-1 border rounded" /></div>
                <div><label>Tahun Meninggal</label><input type="number" name="ayah.tahun_meninggal" value={anakData.ayah.tahun_meninggal || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" /></div>
                <div><label>Usia Saat Meninggal</label><input type="number" name="ayah.usia_saat_meninggal" value={anakData.ayah.usia_saat_meninggal || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" /></div>
              </div>
            </div>
            {/* Ibu */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Ibu</h3>
              <div className="space-y-2">
                <div><label>Nama Lengkap</label><input type="text" name="ibu.nama" value={anakData.ibu.nama} onChange={handleChange} className="w-full px-2 py-1 border rounded" /></div>
                <div><label>Tempat Lahir</label><input type="text" name="ibu.tempat_lahir" value={anakData.ibu.tempat_lahir} onChange={handleChange} className="w-full px-2 py-1 border rounded" /></div>
                <div><label>Tanggal Lahir</label><input type="date" name="ibu.tanggal_lahir" value={anakData.ibu.tanggal_lahir} onChange={handleChange} className="w-full px-2 py-1 border rounded" /></div>
                <div><label>Usia</label><input type="number" name="ibu.usia" value={anakData.ibu.usia} onChange={handleChange} className="w-full px-2 py-1 border rounded" /></div>
                <div><label>Agama</label><input type="text" name="ibu.agama" value={anakData.ibu.agama} onChange={handleChange} className="w-full px-2 py-1 border rounded" /></div>
                <div><label>Alamat Rumah</label><input type="text" name="ibu.alamat_rumah" value={anakData.ibu.alamat_rumah} onChange={handleChange} className="w-full px-2 py-1 border rounded" /></div>
                <div><label>Anak Ke</label><input type="number" name="ibu.anak_ke" value={anakData.ibu.anak_ke} onChange={handleChange} className="w-full px-2 py-1 border rounded" /></div>
                <div><label>Pernikahan Ke</label><input type="number" name="ibu.pernikahan_ke" value={anakData.ibu.pernikahan_ke} onChange={handleChange} className="w-full px-2 py-1 border rounded" /></div>
                <div><label>Usia Saat Menikah</label><input type="number" name="ibu.usia_saat_menikah" value={anakData.ibu.usia_saat_menikah} onChange={handleChange} className="w-full px-2 py-1 border rounded" /></div>
                <div><label>Pendidikan Terakhir</label><input type="text" name="ibu.pendidikan_terakhir" value={anakData.ibu.pendidikan_terakhir} onChange={handleChange} className="w-full px-2 py-1 border rounded" /></div>
                <div><label>Pekerjaan Saat Ini</label><input type="text" name="ibu.pekerjaan_saat_ini" value={anakData.ibu.pekerjaan_saat_ini} onChange={handleChange} className="w-full px-2 py-1 border rounded" /></div>
                <div><label>Telepon</label><input type="text" name="ibu.telepon" value={anakData.ibu.telepon} onChange={handleChange} className="w-full px-2 py-1 border rounded" /></div>
                <div><label>Email</label><input type="email" name="ibu.email" value={anakData.ibu.email} onChange={handleChange} className="w-full px-2 py-1 border rounded" /></div>
                <div><label>Tahun Meninggal</label><input type="number" name="ibu.tahun_meninggal" value={anakData.ibu.tahun_meninggal || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" /></div>
                <div><label>Usia Saat Meninggal</label><input type="number" name="ibu.usia_saat_meninggal" value={anakData.ibu.usia_saat_meninggal || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" /></div>
              </div>
            </div>
          </div>
        </div>
        {/* Survey Awal */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Survey Awal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label>Mengetahui YAMET Dari</label>
              <input type="text" name="survey_awal.mengetahui_yamet_dari" value={anakData.survey_awal.mengetahui_yamet_dari} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="survey_awal.penjelasan_mekanisme" checked={anakData.survey_awal.penjelasan_mekanisme} onChange={handleChange} className="w-6 h-6" />
              <label>Penjelasan Mekanisme</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="survey_awal.bersedia_online" checked={anakData.survey_awal.bersedia_online} onChange={handleChange} className="w-6 h-6" />
              <label>Bersedia Online</label>
            </div>
          </div>
        </div>
        {/* Riwayat Kehamilan */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Riwayat Kehamilan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label>Usia Ibu Saat Hamil</label>
              <input type="number" name="riwayat_kehamilan.usia_ibu_saat_hamil" value={anakData.riwayat_kehamilan.usia_ibu_saat_hamil} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div>
              <label>Usia Ayah Saat Hamil</label>
              <input type="number" name="riwayat_kehamilan.usia_ayah_saat_hamil" value={anakData.riwayat_kehamilan.usia_ayah_saat_hamil} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="riwayat_kehamilan.mual_sulit_makan" checked={anakData.riwayat_kehamilan.mual_sulit_makan} onChange={handleChange} className="w-6 h-6" />
              <label>Mual/Sulit Makan</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="riwayat_kehamilan.asupan_gizi_memadai" checked={anakData.riwayat_kehamilan.asupan_gizi_memadai} onChange={handleChange} className="w-6 h-6" />
              <label>Asupan Gizi Memadai</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="riwayat_kehamilan.perawatan_kehamilan" checked={anakData.riwayat_kehamilan.perawatan_kehamilan} onChange={handleChange} className="w-6 h-6" />
              <label>Perawatan Kehamilan</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="riwayat_kehamilan.kehamilan_diinginkan" checked={anakData.riwayat_kehamilan.kehamilan_diinginkan} onChange={handleChange} className="w-6 h-6" />
              <label>Kehamilan Diinginkan</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="riwayat_kehamilan.berat_bayi_semester_normal" checked={anakData.riwayat_kehamilan.berat_bayi_semester_normal} onChange={handleChange} className="w-6 h-6" />
              <label>Berat Bayi Semester Normal</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="riwayat_kehamilan.diabetes" checked={anakData.riwayat_kehamilan.diabetes} onChange={handleChange} className="w-6 h-6" />
              <label>Diabetes</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="riwayat_kehamilan.hipertensi" checked={anakData.riwayat_kehamilan.hipertensi} onChange={handleChange} className="w-6 h-6" />
              <label>Hipertensi</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="riwayat_kehamilan.asma" checked={anakData.riwayat_kehamilan.asma} onChange={handleChange} className="w-6 h-6" />
              <label>Asma</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="riwayat_kehamilan.tbc" checked={anakData.riwayat_kehamilan.tbc} onChange={handleChange} className="w-6 h-6" />
              <label>TBC</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="riwayat_kehamilan.merokok" checked={anakData.riwayat_kehamilan.merokok} onChange={handleChange} className="w-6 h-6" />
              <label>Merokok</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="riwayat_kehamilan.sekitar_perokok_berat" checked={anakData.riwayat_kehamilan.sekitar_perokok_berat} onChange={handleChange} className="w-6 h-6" />
              <label>Sekitar Perokok Berat</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="riwayat_kehamilan.konsumsi_alkohol" checked={anakData.riwayat_kehamilan.konsumsi_alkohol} onChange={handleChange} className="w-6 h-6" />
              <label>Konsumsi Alkohol</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="riwayat_kehamilan.konsumsi_obat_obatan" checked={anakData.riwayat_kehamilan.konsumsi_obat_obatan} onChange={handleChange} className="w-6 h-6" />
              <label>Konsumsi Obat-obatan</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="riwayat_kehamilan.infeksi_virus" checked={anakData.riwayat_kehamilan.infeksi_virus} onChange={handleChange} className="w-6 h-6" />
              <label>Infeksi Virus</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="riwayat_kehamilan.kecelakaan_trauma" checked={anakData.riwayat_kehamilan.kecelakaan_trauma} onChange={handleChange} className="w-6 h-6" />
              <label>Kecelakaan/Trauma</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="riwayat_kehamilan.pendarahan_flek" checked={anakData.riwayat_kehamilan.pendarahan_flek} onChange={handleChange} className="w-6 h-6" />
              <label>Pendarahan/Flek</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="riwayat_kehamilan.masalah_pernafasan" checked={anakData.riwayat_kehamilan.masalah_pernafasan} onChange={handleChange} className="w-6 h-6" />
              <label>Masalah Pernafasan</label>
            </div>
          </div>
        </div>
        {/* Riwayat Kelahiran */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Riwayat Kelahiran</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label>Jenis Kelahiran</label>
              <input type="text" name="riwayat_kelahiran.jenis_kelahiran" value={anakData.riwayat_kelahiran.jenis_kelahiran} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div>
              <label>Alasan SC</label>
              <input type="text" name="riwayat_kelahiran.alasan_sc" value={anakData.riwayat_kelahiran.alasan_sc || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="riwayat_kelahiran.is_premature" checked={anakData.riwayat_kelahiran.is_premature} onChange={handleChange} className="w-6 h-6" />
              <label>Premature</label>
            </div>
            <div>
              <label>Usia Kelahiran (bulan)</label>
              <input type="number" name="riwayat_kelahiran.usia_kelahiran_bulan" value={anakData.riwayat_kelahiran.usia_kelahiran_bulan} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div>
              <label>Posisi Bayi Saat Lahir</label>
              <input type="text" name="riwayat_kelahiran.posisi_bayi_saat_lahir" value={anakData.riwayat_kelahiran.posisi_bayi_saat_lahir} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="riwayat_kelahiran.is_sungsang" checked={anakData.riwayat_kelahiran.is_sungsang} onChange={handleChange} className="w-6 h-6" />
              <label>Sungsang</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="riwayat_kelahiran.is_kuning" checked={anakData.riwayat_kelahiran.is_kuning} onChange={handleChange} className="w-6 h-6" />
              <label>Kuning</label>
            </div>
            <div>
              <label>Apgar Score</label>
              <input type="text" name="riwayat_kelahiran.apgar_score" value={anakData.riwayat_kelahiran.apgar_score} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
          </div>
        </div>
        {/* Imunisasi */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Imunisasi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-2">
              <input type="checkbox" name="riwayat_imunisasi.bgc" checked={anakData.riwayat_imunisasi.bgc} onChange={handleChange} className="w-6 h-6" />
              <label>BGC</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="riwayat_imunisasi.hep_b1" checked={anakData.riwayat_imunisasi.hep_b1} onChange={handleChange} className="w-6 h-6" />
              <label>Hep B1</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="riwayat_imunisasi.dpt_1" checked={anakData.riwayat_imunisasi.dpt_1} onChange={handleChange} className="w-6 h-6" />
              <label>DPT 1</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="riwayat_imunisasi.polio_1" checked={anakData.riwayat_imunisasi.polio_1} onChange={handleChange} className="w-6 h-6" />
              <label>Polio 1</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="riwayat_imunisasi.campak_1" checked={anakData.riwayat_imunisasi.campak_1} onChange={handleChange} className="w-6 h-6" />
              <label>Campak 1</label>
            </div>
          </div>
        </div>
        {/* Setelah Lahir */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Setelah Lahir</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label>ASI Sampai Usia (bulan)</label>
              <input type="number" name="riwayat_setelah_lahir.asi_sampai_usia_bulan" value={anakData.riwayat_setelah_lahir.asi_sampai_usia_bulan} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="riwayat_setelah_lahir.pernah_jatuh" checked={anakData.riwayat_setelah_lahir.pernah_jatuh} onChange={handleChange} className="w-6 h-6" />
              <label>Pernah Jatuh</label>
            </div>
            <div>
              <label>Jatuh Usia (bulan)</label>
              <input type="number" name="riwayat_setelah_lahir.jatuh_usia_bulan" value={anakData.riwayat_setelah_lahir.jatuh_usia_bulan || ''} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="riwayat_setelah_lahir.pernah_sakit_parah" checked={anakData.riwayat_setelah_lahir.pernah_sakit_parah} onChange={handleChange} className="w-6 h-6" />
              <label>Pernah Sakit Parah</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="riwayat_setelah_lahir.pernah_panas_tinggi" checked={anakData.riwayat_setelah_lahir.pernah_panas_tinggi} onChange={handleChange} className="w-6 h-6" />
              <label>Pernah Panas Tinggi</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="riwayat_setelah_lahir.disertai_kejang" checked={anakData.riwayat_setelah_lahir.disertai_kejang} onChange={handleChange} className="w-6 h-6" />
              <label>Disertai Kejang</label>
            </div>
          </div>
        </div>
        {/* Perkembangan Anak */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Perkembangan Anak</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-2">
              <input type="checkbox" name="perkembangan_anak.tengkurap_ya" checked={anakData.perkembangan_anak.tengkurap_ya} onChange={handleChange} className="w-6 h-6" />
              <label>Tengkurap</label>
            </div>
            <div>
              <label>Tengkurap Usia</label>
              <input type="text" name="perkembangan_anak.tengkurap_usia" value={anakData.perkembangan_anak.tengkurap_usia} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="perkembangan_anak.berguling_ya" checked={anakData.perkembangan_anak.berguling_ya} onChange={handleChange} className="w-6 h-6" />
              <label>Berguling</label>
            </div>
            <div>
              <label>Berguling Usia</label>
              <input type="text" name="perkembangan_anak.berguling_usia" value={anakData.perkembangan_anak.berguling_usia} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="perkembangan_anak.duduk_ya" checked={anakData.perkembangan_anak.duduk_ya} onChange={handleChange} className="w-6 h-6" />
              <label>Duduk</label>
            </div>
            <div>
              <label>Duduk Usia</label>
              <input type="text" name="perkembangan_anak.duduk_usia" value={anakData.perkembangan_anak.duduk_usia} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="perkembangan_anak.merangkak_ya" checked={anakData.perkembangan_anak.merangkak_ya} onChange={handleChange} className="w-6 h-6" />
              <label>Merangkak</label>
            </div>
            <div>
              <label>Merangkak Usia</label>
              <input type="text" name="perkembangan_anak.merangkak_usia" value={anakData.perkembangan_anak.merangkak_usia} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="perkembangan_anak.berdiri_tanpa_pegangan_ya" checked={anakData.perkembangan_anak.berdiri_tanpa_pegangan_ya} onChange={handleChange} className="w-6 h-6" />
              <label>Berdiri Tanpa Pegangan</label>
            </div>
            <div>
              <label>Berdiri Tanpa Pegangan Usia</label>
              <input type="text" name="perkembangan_anak.berdiri_tanpa_pegangan_usia" value={anakData.perkembangan_anak.berdiri_tanpa_pegangan_usia} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
          </div>
        </div>
        {/* Perilaku Oral Motor */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Perilaku Oral Motor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-2">
              <input type="checkbox" name="perilaku_oral_motor.mengeces" checked={anakData.perilaku_oral_motor.mengeces} onChange={handleChange} className="w-6 h-6" />
              <label>Mengeces</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="perilaku_oral_motor.makan_makanan_keras" checked={anakData.perilaku_oral_motor.makan_makanan_keras} onChange={handleChange} className="w-6 h-6" />
              <label>Makan Makanan Keras</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="perilaku_oral_motor.makan_makanan_berkuah" checked={anakData.perilaku_oral_motor.makan_makanan_berkuah} onChange={handleChange} className="w-6 h-6" />
              <label>Makan Makanan Berkuah</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="perilaku_oral_motor.pilih_pilih_makanan" checked={anakData.perilaku_oral_motor.pilih_pilih_makanan} onChange={handleChange} className="w-6 h-6" />
              <label>Pilih-pilih Makanan</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="perilaku_oral_motor.makan_di_emut" checked={anakData.perilaku_oral_motor.makan_di_emut} onChange={handleChange} className="w-6 h-6" />
              <label>Makan Di Emut</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="perilaku_oral_motor.mengunyah_saat_makan" checked={anakData.perilaku_oral_motor.mengunyah_saat_makan} onChange={handleChange} className="w-6 h-6" />
              <label>Mengunyah Saat Makan</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="perilaku_oral_motor.makan_langsung_telan" checked={anakData.perilaku_oral_motor.makan_langsung_telan} onChange={handleChange} className="w-6 h-6" />
              <label>Makan Langsung Telan</label>
            </div>
          </div>
        </div>
        {/* Pola Makan */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Pola Makan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label>Pola Teratur</label>
              <input type="text" name="pola_makan.pola_teratur" value={anakData.pola_makan.pola_teratur} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="pola_makan.ada_pantangan_makanan" checked={anakData.pola_makan.ada_pantangan_makanan} onChange={handleChange} className="w-6 h-6" />
              <label>Ada Pantangan Makanan</label>
            </div>
            <div>
              <label>Pantangan Makanan</label>
              <input type="text" name="pola_makan.pantangan_makanan" value={anakData.pola_makan.pantangan_makanan} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div>
              <label>Keterangan Lainnya</label>
              <textarea name="pola_makan.keterangan_lainnya" value={anakData.pola_makan.keterangan_lainnya} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
          </div>
        </div>
        {/* Perkembangan Sosial */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Perkembangan Sosial</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label>Perilaku Bertemu Orang Baru</label>
              <input type="text" name="perkembangan_sosial.perilaku_bertemu_orang_baru" value={anakData.perkembangan_sosial.perilaku_bertemu_orang_baru} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div>
              <label>Perilaku Bertemu Teman Sebaya</label>
              <input type="text" name="perkembangan_sosial.perilaku_bertemu_teman_sebaya" value={anakData.perkembangan_sosial.perilaku_bertemu_teman_sebaya} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div>
              <label>Perilaku Bertemu Orang Lebih Tua</label>
              <input type="text" name="perkembangan_sosial.perilaku_bertemu_orang_lebih_tua" value={anakData.perkembangan_sosial.perilaku_bertemu_orang_lebih_tua} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div>
              <label>Bermain dengan Banyak Anak</label>
              <input type="text" name="perkembangan_sosial.bermain_dengan_banyak_anak" value={anakData.perkembangan_sosial.bermain_dengan_banyak_anak} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div className="md:col-span-2">
              <label>Keterangan Lainnya</label>
              <textarea name="perkembangan_sosial.keterangan_lainnya" value={anakData.perkembangan_sosial.keterangan_lainnya} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
          </div>
        </div>
        {/* Pola Tidur */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Pola Tidur</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-2">
              <input type="checkbox" name="pola_tidur.jam_tidur_teratur" checked={anakData.pola_tidur.jam_tidur_teratur} onChange={handleChange} className="w-6 h-6" />
              <label>Jam Tidur Teratur</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="pola_tidur.sering_terbangun" checked={anakData.pola_tidur.sering_terbangun} onChange={handleChange} className="w-6 h-6" />
              <label>Sering Terbangun</label>
            </div>
            <div>
              <label>Jam Tidur Malam</label>
              <input type="text" name="pola_tidur.jam_tidur_malam" value={anakData.pola_tidur.jam_tidur_malam} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div>
              <label>Jam Bangun Pagi</label>
              <input type="text" name="pola_tidur.jam_bangun_pagi" value={anakData.pola_tidur.jam_bangun_pagi} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
          </div>
        </div>
        {/* Penyakit Diderita */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Penyakit Diderita</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-2">
              <input type="checkbox" name="penyakit_diderita.sakit_telinga" checked={anakData.penyakit_diderita.sakit_telinga} onChange={handleChange} className="w-6 h-6" />
              <label>Sakit Telinga</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="penyakit_diderita.sakit_mata" checked={anakData.penyakit_diderita.sakit_mata} onChange={handleChange} className="w-6 h-6" />
              <label>Sakit Mata</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="penyakit_diderita.luka_kepala" checked={anakData.penyakit_diderita.luka_kepala} onChange={handleChange} className="w-6 h-6" />
              <label>Luka Kepala</label>
            </div>
            <div>
              <label>Penyakit Lainnya</label>
              <input type="text" name="penyakit_diderita.penyakit_lainnya" value={anakData.penyakit_diderita.penyakit_lainnya} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
          </div>
        </div>
        {/* Hubungan Keluarga */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Hubungan Keluarga</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label>Tinggal Dengan (pisahkan dengan koma)</label>
              <input type="text" name="hubungan_keluarga.tinggal_dengan" value={anakData.hubungan_keluarga.tinggal_dengan.join(', ')} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div>
              <label>Tinggal Dengan Lainnya</label>
              <input type="text" name="hubungan_keluarga.tinggal_dengan_lainnya" value={anakData.hubungan_keluarga.tinggal_dengan_lainnya} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div>
              <label>Hubungan Ayah-Ibu</label>
              <input type="text" name="hubungan_keluarga.hubungan_ayah_ibu" value={anakData.hubungan_keluarga.hubungan_ayah_ibu} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div>
              <label>Hubungan Ayah-Anak</label>
              <input type="text" name="hubungan_keluarga.hubungan_ayah_anak" value={anakData.hubungan_keluarga.hubungan_ayah_anak} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div>
              <label>Hubungan Ibu-Anak</label>
              <input type="text" name="hubungan_keluarga.hubungan_ibu_anak" value={anakData.hubungan_keluarga.hubungan_ibu_anak} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div>
              <label>Hubungan Saudara dengan Anak</label>
              <input type="text" name="hubungan_keluarga.hubungan_saudara_dengan_anak" value={anakData.hubungan_keluarga.hubungan_saudara_dengan_anak} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
          </div>
        </div>
        {/* Riwayat Pendidikan */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Riwayat Pendidikan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label>Mulai Sekolah Formal Usia</label>
              <input type="text" name="riwayat_pendidikan.mulai_sekolah_formal_usia" value={anakData.riwayat_pendidikan.mulai_sekolah_formal_usia} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div>
              <label>Mulai Sekolah Informal Usia</label>
              <input type="text" name="riwayat_pendidikan.mulai_sekolah_informal_usia" value={anakData.riwayat_pendidikan.mulai_sekolah_informal_usia} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div>
              <label>Sekolah Formal Diikuti</label>
              <input type="text" name="riwayat_pendidikan.sekolah_formal_diikuti" value={anakData.riwayat_pendidikan.sekolah_formal_diikuti} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div>
              <label>Sekolah Informal Diikuti</label>
              <input type="text" name="riwayat_pendidikan.sekolah_informal_diikuti" value={anakData.riwayat_pendidikan.sekolah_informal_diikuti} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="riwayat_pendidikan.bimbingan_belajar" checked={anakData.riwayat_pendidikan.bimbingan_belajar} onChange={handleChange} />
              <label>Bimbingan Belajar</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="riwayat_pendidikan.belajar_membaca_sendiri" checked={anakData.riwayat_pendidikan.belajar_membaca_sendiri} onChange={handleChange} />
              <label>Belajar Membaca Sendiri</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="riwayat_pendidikan.belajar_dibacakan_ortu" checked={anakData.riwayat_pendidikan.belajar_dibacakan_ortu} onChange={handleChange} />
              <label>Belajar Dibacakan Ortu</label>
            </div>
            <div>
              <label>Nilai Rata-rata Sekolah</label>
              <input type="text" name="riwayat_pendidikan.nilai_rata_rata_sekolah" value={anakData.riwayat_pendidikan.nilai_rata_rata_sekolah} onChange={handleChange} className="w-full px-2 py-1 border rounded" />
            </div>
          </div>
        </div>
        {/* Pemeriksaan Sebelumnya */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Pemeriksaan Sebelumnya</h2>
          <div className="space-y-4">
            {anakData.pemeriksaan_sebelumnya.map((pemeriksaan, index) => (
              <div key={index} className="border rounded p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label>Tempat</label>
                    <input
                      type="text"
                      value={pemeriksaan.tempat}
                      onChange={(e) => {
                        const newPemeriksaan = [...anakData.pemeriksaan_sebelumnya];
                        newPemeriksaan[index].tempat = e.target.value;
                        setAnakData(prev => ({ ...prev, pemeriksaan_sebelumnya: newPemeriksaan }));
                      }}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </div>
                  <div>
                    <label>Usia</label>
                    <input
                      type="text"
                      value={pemeriksaan.usia}
                      onChange={(e) => {
                        const newPemeriksaan = [...anakData.pemeriksaan_sebelumnya];
                        newPemeriksaan[index].usia = e.target.value;
                        setAnakData(prev => ({ ...prev, pemeriksaan_sebelumnya: newPemeriksaan }));
                      }}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label>Diagnosa</label>
                    <input
                      type="text"
                      value={pemeriksaan.diagnosa}
                      onChange={(e) => {
                        const newPemeriksaan = [...anakData.pemeriksaan_sebelumnya];
                        newPemeriksaan[index].diagnosa = e.target.value;
                        setAnakData(prev => ({ ...prev, pemeriksaan_sebelumnya: newPemeriksaan }));
                      }}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newPemeriksaan = anakData.pemeriksaan_sebelumnya.filter((_, i) => i !== index);
                    setAnakData(prev => ({ ...prev, pemeriksaan_sebelumnya: newPemeriksaan }));
                  }}
                  className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm"
                >
                  Hapus
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setAnakData(prev => ({
                  ...prev,
                  pemeriksaan_sebelumnya: [
                    ...prev.pemeriksaan_sebelumnya,
                    { id: 0, anak_id: 0, tempat: '', usia: '', diagnosa: '' }
                  ]
                }));
              }}
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              Tambah Pemeriksaan
            </button>
          </div>
        </div>
        {/* Terapi Sebelumnya */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Terapi Sebelumnya</h2>
          <div className="space-y-4">
            {anakData.terapi_sebelumnya.map((terapi, index) => (
              <div key={index} className="border rounded p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label>Jenis Terapi</label>
                    <input
                      type="text"
                      value={terapi.jenis_terapi}
                      onChange={(e) => {
                        const newTerapi = [...anakData.terapi_sebelumnya];
                        newTerapi[index].jenis_terapi = e.target.value;
                        setAnakData(prev => ({ ...prev, terapi_sebelumnya: newTerapi }));
                      }}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </div>
                  <div>
                    <label>Frekuensi</label>
                    <input
                      type="text"
                      value={terapi.frekuensi}
                      onChange={(e) => {
                        const newTerapi = [...anakData.terapi_sebelumnya];
                        newTerapi[index].frekuensi = e.target.value;
                        setAnakData(prev => ({ ...prev, terapi_sebelumnya: newTerapi }));
                      }}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </div>
                  <div>
                    <label>Lama Terapi</label>
                    <input
                      type="text"
                      value={terapi.lama_terapi}
                      onChange={(e) => {
                        const newTerapi = [...anakData.terapi_sebelumnya];
                        newTerapi[index].lama_terapi = e.target.value;
                        setAnakData(prev => ({ ...prev, terapi_sebelumnya: newTerapi }));
                      }}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </div>
                  <div>
                    <label>Tempat</label>
                    <input
                      type="text"
                      value={terapi.tempat}
                      onChange={(e) => {
                        const newTerapi = [...anakData.terapi_sebelumnya];
                        newTerapi[index].tempat = e.target.value;
                        setAnakData(prev => ({ ...prev, terapi_sebelumnya: newTerapi }));
                      }}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newTerapi = anakData.terapi_sebelumnya.filter((_, i) => i !== index);
                    setAnakData(prev => ({ ...prev, terapi_sebelumnya: newTerapi }));
                  }}
                  className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* Lampiran */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Lampiran</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Hasil EEG', name: 'hasil_eeg_url' },
              { label: 'Hasil BERA', name: 'hasil_bera_url' },
              { label: 'Hasil CT Scan', name: 'hasil_ct_scan_url' },
              { label: 'Program Terapi 3 Bulan', name: 'program_terapi_3bln_url' },
              { label: 'Hasil Psikologis/Psikiatris', name: 'hasil_psikologis_psikiatris_url' },
            ].map(({ label, name }) => (
              <div key={name}>
                <label className="block mb-1 font-medium">{label}</label>
                <div data-hs-file-upload='{"maxFiles":1,"singleton":true}' className="w-full">
                  <div className="relative flex w-full border overflow-hidden border-gray-200 shadow-2xs rounded-lg text-sm focus:outline-hidden focus:z-10 focus:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:border-neutral-600">
                    <span className="h-full py-3 px-4 bg-gray-100 text-nowrap dark:bg-neutral-800">Choose File</span>
                    <span className="group grow flex overflow-hidden h-full py-3 px-4" data-hs-file-upload-previews="">
                      <span className={selectedFileNames[name] ? '' : 'hidden'}>
                        <span className="flex items-center w-full">
                          <span className="grow-0 overflow-hidden truncate" data-hs-file-upload-file-name="">
                            {selectedFileNames[name] || 'No Chosen File'}
                          </span>
                        </span>
                      </span>
                      <span className={selectedFileNames[name] ? 'hidden' : ''}>No Chosen File</span>
                    </span>
                    <input
                      type="file"
                      name={name}
                      accept="application/pdf,image/*"
                      onChange={handleLampiranChange}
                      className="absolute top-0 left-0 size-full opacity-0 cursor-pointer"
                      data-hs-file-upload-trigger=""
                      disabled={lampiranLoading[name]}
                    />
                  </div>
                  {selectedFileNames[name] && (
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        className="text-xs text-red-600 border border-red-200 rounded px-2 py-1 hover:bg-red-50"
                        onClick={() => handleLampiranDelete(name)}
                        disabled={lampiranLoading[name]}
                      >
                        {lampiranLoading[name] ? 'Menghapus...' : 'Hapus'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" type="button" onClick={handleBack}>
            Kembali
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AnakEditForm; 