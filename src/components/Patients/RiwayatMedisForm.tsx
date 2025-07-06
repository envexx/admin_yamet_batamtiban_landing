import React, { useState, useEffect } from 'react';
import { anakAPI } from '../../services/api';
import { RiwayatMedisData } from '../../types';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';

interface RiwayatMedisFormProps {
  anakId: number;
  riwayatData?: RiwayatMedisData | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const RiwayatMedisForm: React.FC<RiwayatMedisFormProps> = ({ anakId, riwayatData, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<RiwayatMedisData>>({
    riwayat_kehamilan: {
      usia_ibu_saat_hamil: undefined,
      usia_ayah_saat_hamil: undefined,
      kondisi_kehamilan: {
        mual_muntah: false,
        asupan_gizi_memadai: false,
        perawatan_kehamilan: false,
        kehamilan_diinginkan: false,
        berat_bayi_normal: false,
        komplikasi: {
          diabetes: false,
          hipertensi: false,
          asma: false,
          tbc: false,
          infeksi_virus: false,
          kecelakaan_trauma: false,
          pendarahan_flek: false,
          masalah_pernapasan: false,
        },
        lifestyle: {
          merokok: false,
          tinggal_sekitar_perokok: false,
          konsumsi_alkohol: false,
          konsumsi_obat: false,
        },
      },
      catatan_tambahan: '',
    },
    riwayat_kelahiran: {
      jenis_kelahiran: 'normal',
      alasan_sc: '',
      forcep_vacuum_dipacu: false,
      premature: false,
      usia_kelahiran_bulan: undefined,
      bagian_keluar_dulu: 'kepala',
      sungsang: false,
      kondisi_bayi: {
        kuning: false,
        detak_jantung: '',
        apgar_score: '',
      },
      proses_kelahiran: {
        lama_waktu_melahirkan: '',
        dibantu_oleh: 'dokter',
        tempat_bersalin: '',
        hal_spesifik: '',
      },
    },
    riwayat_setelah_lahir: {
      asi_sampai_bulan: undefined,
      riwayat_kecelakaan: [],
      riwayat_sakit: [],
    },
    riwayat_imunisasi: [],
    riwayat_penyakit: [],
  });

  useEffect(() => {
    if (riwayatData) {
      setFormData(riwayatData);
    }
  }, [riwayatData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;
    
    if (type === 'number') {
      finalValue = value === '' ? undefined : parseInt(value);
    } else if (type === 'checkbox') {
      finalValue = (e.target as HTMLInputElement).checked;
    }
    
    // Handle nested object updates
    const keys = name.split('.');
    setFormData(prev => {
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = finalValue;
      return newData;
    });
  };

  const addRiwayatImunisasi = () => {
    setFormData(prev => ({
      ...prev,
      riwayat_imunisasi: [
        ...(prev.riwayat_imunisasi || []),
        {
          jenis_imunisasi: '',
          usia_recommended: '',
          status: 'sudah' as const,
          tanggal_imunisasi: new Date().toISOString().split('T')[0],
          tempat_imunisasi: '',
          reaksi: '',
        }
      ]
    }));
  };

  const updateRiwayatImunisasi = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      riwayat_imunisasi: prev.riwayat_imunisasi?.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeRiwayatImunisasi = (index: number) => {
    setFormData(prev => ({
      ...prev,
      riwayat_imunisasi: prev.riwayat_imunisasi?.filter((_, i) => i !== index)
    }));
  };

  const addRiwayatPenyakit = () => {
    setFormData(prev => ({
      ...prev,
      riwayat_penyakit: [
        ...(prev.riwayat_penyakit || []),
        {
          nama_penyakit: '',
          bagian_tubuh: '',
          usia_saat_sakit: '',
          gejala: '',
          pengobatan: '',
          status: 'sembuh' as const,
        }
      ]
    }));
  };

  const updateRiwayatPenyakit = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      riwayat_penyakit: prev.riwayat_penyakit?.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeRiwayatPenyakit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      riwayat_penyakit: prev.riwayat_penyakit?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (riwayatData) {
        await anakAPI.updateRiwayatMedis(anakId, formData);
      } else {
        await anakAPI.createRiwayatMedis(anakId, formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan data riwayat medis');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Menyimpan data riwayat medis..." />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}

      {/* Riwayat Kehamilan */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Riwayat Kehamilan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usia Ibu Saat Hamil
            </label>
            <input
              type="number"
              name="riwayat_kehamilan.usia_ibu_saat_hamil"
              value={formData.riwayat_kehamilan?.usia_ibu_saat_hamil || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Usia dalam tahun"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usia Ayah Saat Hamil
            </label>
            <input
              type="number"
              name="riwayat_kehamilan.usia_ayah_saat_hamil"
              value={formData.riwayat_kehamilan?.usia_ayah_saat_hamil || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Usia dalam tahun"
            />
          </div>
        </div>

        {/* Kondisi Kehamilan */}
        <div className="mt-4">
          <h4 className="font-medium mb-3">Kondisi Kehamilan</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="riwayat_kehamilan.kondisi_kehamilan.mual_muntah"
                checked={formData.riwayat_kehamilan?.kondisi_kehamilan?.mual_muntah || false}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Mual muntah
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="riwayat_kehamilan.kondisi_kehamilan.asupan_gizi_memadai"
                checked={formData.riwayat_kehamilan?.kondisi_kehamilan?.asupan_gizi_memadai || false}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Asupan gizi memadai
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="riwayat_kehamilan.kondisi_kehamilan.perawatan_kehamilan"
                checked={formData.riwayat_kehamilan?.kondisi_kehamilan?.perawatan_kehamilan || false}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Perawatan kehamilan
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="riwayat_kehamilan.kondisi_kehamilan.kehamilan_diinginkan"
                checked={formData.riwayat_kehamilan?.kondisi_kehamilan?.kehamilan_diinginkan || false}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Kehamilan diinginkan
              </label>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catatan Tambahan
          </label>
          <textarea
            name="riwayat_kehamilan.catatan_tambahan"
            value={formData.riwayat_kehamilan?.catatan_tambahan || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Catatan tambahan tentang kehamilan"
          />
        </div>
      </div>

      {/* Riwayat Kelahiran */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Riwayat Kelahiran</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jenis Kelahiran
            </label>
            <select
              name="riwayat_kelahiran.jenis_kelahiran"
              value={formData.riwayat_kelahiran?.jenis_kelahiran || 'normal'}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="normal">Normal</option>
              <option value="caesar">Caesar</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alasan SC (jika caesar)
            </label>
            <input
              type="text"
              name="riwayat_kelahiran.alasan_sc"
              value={formData.riwayat_kelahiran?.alasan_sc || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Alasan operasi caesar"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usia Kelahiran (bulan)
            </label>
            <input
              type="number"
              name="riwayat_kelahiran.usia_kelahiran_bulan"
              value={formData.riwayat_kelahiran?.usia_kelahiran_bulan || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Usia kehamilan saat lahir"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bagian Keluar Duluan
            </label>
            <select
              name="riwayat_kelahiran.bagian_keluar_dulu"
              value={formData.riwayat_kelahiran?.bagian_keluar_dulu || 'kepala'}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="kepala">Kepala</option>
              <option value="kaki">Kaki</option>
            </select>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="riwayat_kelahiran.forcep_vacuum_dipacu"
              checked={formData.riwayat_kelahiran?.forcep_vacuum_dipacu || false}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Forcep/Vacuum/Dipacu
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="riwayat_kelahiran.premature"
              checked={formData.riwayat_kelahiran?.premature || false}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Premature
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="riwayat_kelahiran.sungsang"
              checked={formData.riwayat_kelahiran?.sungsang || false}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Sungsang
            </label>
          </div>
        </div>
      </div>

      {/* Riwayat Setelah Lahir */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Riwayat Setelah Lahir</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ASI Sampai Bulan
            </label>
            <input
              type="number"
              name="riwayat_setelah_lahir.asi_sampai_bulan"
              value={formData.riwayat_setelah_lahir?.asi_sampai_bulan || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Berapa bulan mendapat ASI"
            />
          </div>
        </div>
      </div>

      {/* Riwayat Imunisasi */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Riwayat Imunisasi</h3>
          <Button type="button" size="sm" variant="secondary" onClick={addRiwayatImunisasi}>
            Tambah Imunisasi
          </Button>
        </div>
        <div className="space-y-4">
          {formData.riwayat_imunisasi?.map((imunisasi, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jenis Imunisasi
                  </label>
                  <input
                    type="text"
                    value={imunisasi.jenis_imunisasi || ''}
                    onChange={(e) => updateRiwayatImunisasi(index, 'jenis_imunisasi', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nama imunisasi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={imunisasi.status || 'sudah'}
                    onChange={(e) => updateRiwayatImunisasi(index, 'status', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="sudah">Sudah</option>
                    <option value="belum">Belum</option>
                    <option value="terlambat">Terlambat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Imunisasi
                  </label>
                  <input
                    type="date"
                    value={imunisasi.tanggal_imunisasi || ''}
                    onChange={(e) => updateRiwayatImunisasi(index, 'tanggal_imunisasi', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tempat Imunisasi
                  </label>
                  <input
                    type="text"
                    value={imunisasi.tempat_imunisasi || ''}
                    onChange={(e) => updateRiwayatImunisasi(index, 'tempat_imunisasi', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tempat imunisasi"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reaksi
                  </label>
                  <input
                    type="text"
                    value={imunisasi.reaksi || ''}
                    onChange={(e) => updateRiwayatImunisasi(index, 'reaksi', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Reaksi setelah imunisasi"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  type="button"
                  size="sm"
                  variant="danger"
                  onClick={() => removeRiwayatImunisasi(index)}
                >
                  Hapus
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Riwayat Penyakit */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Riwayat Penyakit</h3>
          <Button type="button" size="sm" variant="secondary" onClick={addRiwayatPenyakit}>
            Tambah Penyakit
          </Button>
        </div>
        <div className="space-y-4">
          {formData.riwayat_penyakit?.map((penyakit, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Penyakit
                  </label>
                  <input
                    type="text"
                    value={penyakit.nama_penyakit || ''}
                    onChange={(e) => updateRiwayatPenyakit(index, 'nama_penyakit', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nama penyakit"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bagian Tubuh
                  </label>
                  <input
                    type="text"
                    value={penyakit.bagian_tubuh || ''}
                    onChange={(e) => updateRiwayatPenyakit(index, 'bagian_tubuh', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Bagian tubuh yang terkena"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Usia Saat Sakit
                  </label>
                  <input
                    type="text"
                    value={penyakit.usia_saat_sakit || ''}
                    onChange={(e) => updateRiwayatPenyakit(index, 'usia_saat_sakit', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Usia saat sakit"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={penyakit.status || 'sembuh'}
                    onChange={(e) => updateRiwayatPenyakit(index, 'status', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="sembuh">Sembuh</option>
                    <option value="kronis">Kronis</option>
                    <option value="kambuh-kambuhan">Kambuh-kambuhan</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gejala
                  </label>
                  <input
                    type="text"
                    value={penyakit.gejala || ''}
                    onChange={(e) => updateRiwayatPenyakit(index, 'gejala', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Gejala yang dialami"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pengobatan
                  </label>
                  <input
                    type="text"
                    value={penyakit.pengobatan || ''}
                    onChange={(e) => updateRiwayatPenyakit(index, 'pengobatan', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Pengobatan yang dilakukan"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  type="button"
                  size="sm"
                  variant="danger"
                  onClick={() => removeRiwayatPenyakit(index)}
                >
                  Hapus
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" variant="primary">
          {riwayatData ? 'Update Riwayat Medis' : 'Simpan Riwayat Medis'}
        </Button>
      </div>
    </form>
  );
};

export default RiwayatMedisForm; 