import React, { useState, useEffect } from 'react';
import { anakAPI } from '../../services/api';
import { SurveyData } from '../../types';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';

interface SurveyFormProps {
  anakId: number;
  surveyData?: SurveyData | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const SurveyForm: React.FC<SurveyFormProps> = ({ anakId, surveyData, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<SurveyData>>({
    survey_singkat: {
      mengetahui_yamet_dari: '',
      dijelaskan_mekanisme: false,
      bersedia_assessment_online: false,
      tanggal_survey: new Date().toISOString().split('T')[0],
    },
    keluhan_orang_tua: [],
    tindakan_yang_dilakukan: [],
    kendala_yang_dihadapi: [],
    keluhan_guru: [],
  });

  useEffect(() => {
    if (surveyData) {
      setFormData(surveyData);
    }
  }, [surveyData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;
    
    if (type === 'checkbox') {
      finalValue = (e.target as HTMLInputElement).checked;
    }
    
    if (name.startsWith('survey_singkat.')) {
      const field = name.replace('survey_singkat.', '');
      setFormData(prev => ({
        ...prev,
        survey_singkat: {
          ...prev.survey_singkat,
          [field]: finalValue
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: finalValue
      }));
    }
  };

  const addKeluhanOrangTua = () => {
    setFormData(prev => ({
      ...prev,
      keluhan_orang_tua: [
        ...(prev.keluhan_orang_tua || []),
        {
          keluhan: '',
          tingkat_kekhawatiran: 'sedang' as const,
          tanggal_keluhan: new Date().toISOString().split('T')[0],
        }
      ]
    }));
  };

  const updateKeluhanOrangTua = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      keluhan_orang_tua: prev.keluhan_orang_tua?.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeKeluhanOrangTua = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keluhan_orang_tua: prev.keluhan_orang_tua?.filter((_, i) => i !== index)
    }));
  };

  const addTindakanYangDilakukan = () => {
    setFormData(prev => ({
      ...prev,
      tindakan_yang_dilakukan: [
        ...(prev.tindakan_yang_dilakukan || []),
        {
          tindakan: '',
          hasil: '',
          tanggal_tindakan: new Date().toISOString().split('T')[0],
        }
      ]
    }));
  };

  const updateTindakanYangDilakukan = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      tindakan_yang_dilakukan: prev.tindakan_yang_dilakukan?.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeTindakanYangDilakukan = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tindakan_yang_dilakukan: prev.tindakan_yang_dilakukan?.filter((_, i) => i !== index)
    }));
  };

  const addKendalaYangDihadapi = () => {
    setFormData(prev => ({
      ...prev,
      kendala_yang_dihadapi: [
        ...(prev.kendala_yang_dihadapi || []),
        {
          kendala: '',
          dampak: '',
          solusi_dicoba: '',
        }
      ]
    }));
  };

  const updateKendalaYangDihadapi = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      kendala_yang_dihadapi: prev.kendala_yang_dihadapi?.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeKendalaYangDihadapi = (index: number) => {
    setFormData(prev => ({
      ...prev,
      kendala_yang_dihadapi: prev.kendala_yang_dihadapi?.filter((_, i) => i !== index)
    }));
  };

  const addKeluhanGuru = () => {
    setFormData(prev => ({
      ...prev,
      keluhan_guru: [
        ...(prev.keluhan_guru || []),
        {
          keluhan: '',
          mata_pelajaran: '',
          frekuensi: '',
          tanggal_laporan: new Date().toISOString().split('T')[0],
        }
      ]
    }));
  };

  const updateKeluhanGuru = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      keluhan_guru: prev.keluhan_guru?.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeKeluhanGuru = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keluhan_guru: prev.keluhan_guru?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (surveyData) {
        await anakAPI.updateSurvey(anakId, formData);
      } else {
        await anakAPI.createSurvey(anakId, formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan data survey');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Menyimpan data survey..." />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}

      {/* SURVEY SINGKAT */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-blue-900 mb-4">SURVEY SINGKAT</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              1. Mengetahui Adanya Yamet Dari :
            </label>
            <input
              type="text"
              name="survey_singkat.mengetahui_yamet_dari"
              value={formData.survey_singkat?.mengetahui_yamet_dari || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Sumber informasi YAMET"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              2. Apakah Sudah Dijelaskan Mekanisme Observasi dan Assessment oleh admin:
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="survey_singkat.dijelaskan_mekanisme"
                  checked={formData.survey_singkat?.dijelaskan_mekanisme === true}
                  onChange={() => setFormData(prev => ({
                    ...prev,
                    survey_singkat: { ...prev.survey_singkat, dijelaskan_mekanisme: true }
                  }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2">Ya</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="survey_singkat.dijelaskan_mekanisme"
                  checked={formData.survey_singkat?.dijelaskan_mekanisme === false}
                  onChange={() => setFormData(prev => ({
                    ...prev,
                    survey_singkat: { ...prev.survey_singkat, dijelaskan_mekanisme: false }
                  }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2">Tidak</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              3. Apakah bersedia assessment dan konsultasi hasil online:
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="survey_singkat.bersedia_assessment_online"
                  checked={formData.survey_singkat?.bersedia_assessment_online === true}
                  onChange={() => setFormData(prev => ({
                    ...prev,
                    survey_singkat: { ...prev.survey_singkat, bersedia_assessment_online: true }
                  }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2">Ya</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="survey_singkat.bersedia_assessment_online"
                  checked={formData.survey_singkat?.bersedia_assessment_online === false}
                  onChange={() => setFormData(prev => ({
                    ...prev,
                    survey_singkat: { ...prev.survey_singkat, bersedia_assessment_online: false }
                  }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2">Tidak</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Survey
            </label>
            <input
              type="date"
              name="survey_singkat.tanggal_survey"
              value={formData.survey_singkat?.tanggal_survey || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* RIWAYAT TUMBUH KEMBANG */}
      <div className="bg-green-50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-green-900 mb-4">RIWAYAT TUMBUH KEMBANG</h3>
        
        {/* Keluhan Orang Tua Saat Ini */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-green-800 mb-3">Keluhan Orang Tua Saat ini :</h4>
          {formData.keluhan_orang_tua?.map((keluhan, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{index + 1}.</span>
                <button
                  type="button"
                  onClick={() => removeKeluhanOrangTua(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Hapus
                </button>
              </div>
              <textarea
                value={keluhan.keluhan || ''}
                onChange={(e) => updateKeluhanOrangTua(index, 'keluhan', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={2}
                placeholder="Keluhan orang tua"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tingkat Kekhawatiran</label>
                  <select
                    value={keluhan.tingkat_kekhawatiran || 'sedang'}
                    onChange={(e) => updateKeluhanOrangTua(index, 'tingkat_kekhawatiran', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="rendah">Rendah</option>
                    <option value="sedang">Sedang</option>
                    <option value="tinggi">Tinggi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Keluhan</label>
                  <input
                    type="date"
                    value={keluhan.tanggal_keluhan || ''}
                    onChange={(e) => updateKeluhanOrangTua(index, 'tanggal_keluhan', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addKeluhanOrangTua}
            className="mt-2"
          >
            + Tambah Keluhan
          </Button>
        </div>

        {/* Apa saja yang telah dilakukan orang tua saat ini */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-green-800 mb-3">Apa saja yang telah dilakukan orang tua saat ini :</h4>
          {formData.tindakan_yang_dilakukan?.map((tindakan, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{index + 1}.</span>
                <button
                  type="button"
                  onClick={() => removeTindakanYangDilakukan(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Hapus
                </button>
              </div>
              <textarea
                value={tindakan.tindakan || ''}
                onChange={(e) => updateTindakanYangDilakukan(index, 'tindakan', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={2}
                placeholder="Tindakan yang telah dilakukan"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hasil</label>
                  <input
                    type="text"
                    value={tindakan.hasil || ''}
                    onChange={(e) => updateTindakanYangDilakukan(index, 'hasil', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Hasil tindakan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Tindakan</label>
                  <input
                    type="date"
                    value={tindakan.tanggal_tindakan || ''}
                    onChange={(e) => updateTindakanYangDilakukan(index, 'tanggal_tindakan', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addTindakanYangDilakukan}
            className="mt-2"
          >
            + Tambah Tindakan
          </Button>
        </div>

        {/* Apa saja kendala yang dihadapi */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-green-800 mb-3">Apa saja kendala yang dihadapi :</h4>
          {formData.kendala_yang_dihadapi?.map((kendala, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{index + 1}.</span>
                <button
                  type="button"
                  onClick={() => removeKendalaYangDihadapi(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Hapus
                </button>
              </div>
              <textarea
                value={kendala.kendala || ''}
                onChange={(e) => updateKendalaYangDihadapi(index, 'kendala', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={2}
                placeholder="Kendala yang dihadapi"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dampak</label>
                  <input
                    type="text"
                    value={kendala.dampak || ''}
                    onChange={(e) => updateKendalaYangDihadapi(index, 'dampak', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Dampak kendala"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Solusi yang Dicoba</label>
                  <input
                    type="text"
                    value={kendala.solusi_dicoba || ''}
                    onChange={(e) => updateKendalaYangDihadapi(index, 'solusi_dicoba', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Solusi yang telah dicoba"
                  />
                </div>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addKendalaYangDihadapi}
            className="mt-2"
          >
            + Tambah Kendala
          </Button>
        </div>
      </div>

      {/* Keluhan Guru */}
      <div className="bg-yellow-50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-yellow-900 mb-4">Keluhan Guru</h3>
        {formData.keluhan_guru?.map((keluhan, index) => (
          <div key={index} className="border rounded-lg p-4 bg-white mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Keluhan {index + 1}</span>
              <button
                type="button"
                onClick={() => removeKeluhanGuru(index)}
                className="text-red-600 hover:text-red-800"
              >
                Hapus
              </button>
            </div>
            <textarea
              value={keluhan.keluhan || ''}
              onChange={(e) => updateKeluhanGuru(index, 'keluhan', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              rows={2}
              placeholder="Keluhan guru"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mata Pelajaran</label>
                <input
                  type="text"
                  value={keluhan.mata_pelajaran || ''}
                  onChange={(e) => updateKeluhanGuru(index, 'mata_pelajaran', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Mata pelajaran"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frekuensi</label>
                <input
                  type="text"
                  value={keluhan.frekuensi || ''}
                  onChange={(e) => updateKeluhanGuru(index, 'frekuensi', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Frekuensi keluhan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Laporan</label>
                <input
                  type="date"
                  value={keluhan.tanggal_laporan || ''}
                  onChange={(e) => updateKeluhanGuru(index, 'tanggal_laporan', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={addKeluhanGuru}
          className="mt-2"
        >
          + Tambah Keluhan Guru
        </Button>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" variant="primary">
          {surveyData ? 'Update Survey' : 'Simpan Survey'}
        </Button>
      </div>
    </form>
  );
};

export default SurveyForm; 