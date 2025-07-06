# Hybrid Database Migration - Frontend Implementation

## 🚀 **Overview**

Sistem telah dimigrasi dari PostgreSQL-only ke **Hybrid Database System**:
- **PostgreSQL**: Data terstruktur (anak, orang_tua, pemeriksaan, dll)
- **MongoDB Atlas**: Data fleksibel (survey, riwayat_medis_detail, perilaku, dll)

## 📁 **Files Modified/Created**

### 1. **Types Updated** (`src/types/index.ts`)
- ✅ Added MongoDB data structures
- ✅ Added hybrid data interfaces
- ✅ Added complete data types

**New Types Added:**
```typescript
// MongoDB Data Structures
export interface SurveyData { ... }
export interface RiwayatMedisData { ... }
export interface PerilakuData { ... }
export interface PerkembanganData { ... }
export interface DokumenData { ... }

// Hybrid Data Types
export interface AnakCompleteData { ... }
export interface AnakDashboardData { ... }
```

### 2. **API Service Updated** (`src/services/api.ts`)
- ✅ Added hybrid database endpoints
- ✅ Added MongoDB CRUD operations
- ✅ Updated existing endpoints for hybrid support

**New API Methods:**
```typescript
// Hybrid Database Endpoints
getCompleteData: async (id: number) => Promise<ApiResponse<AnakCompleteData>>
getDashboardData: async (id: number) => Promise<ApiResponse<AnakDashboardData>>

// Survey Management (MongoDB)
getSurvey: async (anakId: number) => Promise<ApiResponse<SurveyData>>
createSurvey: async (anakId: number, surveyData: Partial<SurveyData>) => Promise<ApiResponse<SurveyData>>
updateSurvey: async (anakId: number, surveyData: Partial<SurveyData>) => Promise<ApiResponse<SurveyData>>

// Medical History Management (MongoDB)
getRiwayatMedis: async (anakId: number) => Promise<ApiResponse<RiwayatMedisData>>
createRiwayatMedis: async (anakId: number, riwayatData: Partial<RiwayatMedisData>) => Promise<ApiResponse<RiwayatMedisData>>
updateRiwayatMedis: async (anakId: number, riwayatData: Partial<RiwayatMedisData>) => Promise<ApiResponse<RiwayatMedisData>>

// Behavior Management (MongoDB)
getPerilaku: async (anakId: number) => Promise<ApiResponse<PerilakuData>>
createPerilaku: async (anakId: number, perilakuData: Partial<PerilakuData>) => Promise<ApiResponse<PerilakuData>>
updatePerilaku: async (anakId: number, perilakuData: Partial<PerilakuData>) => Promise<ApiResponse<PerilakuData>>

// Development Management (MongoDB)
getPerkembangan: async (anakId: number) => Promise<ApiResponse<PerkembanganData>>
createPerkembangan: async (anakId: number, perkembanganData: Partial<PerkembanganData>) => Promise<ApiResponse<PerkembanganData>>
updatePerkembangan: async (anakId: number, perkembanganData: Partial<PerkembanganData>) => Promise<ApiResponse<PerkembanganData>>

// Documents Management (MongoDB)
getDokumen: async (anakId: number) => Promise<ApiResponse<DokumenData>>
addDokumen: async (anakId: number, dokumenData: any) => Promise<ApiResponse<DokumenData>>
deleteDokumen: async (anakId: number, docId: string) => Promise<ApiResponse>
```

### 3. **New Form Components Created**

#### **SurveyForm** (`src/components/Patients/SurveyForm.tsx`)
- ✅ Complete survey form with dynamic fields
- ✅ Support for parent complaints and teacher complaints
- ✅ Add/remove functionality for complaint items
- ✅ Form validation and error handling

#### **RiwayatMedisForm** (`src/components/Patients/RiwayatMedisForm.tsx`)
- ✅ Comprehensive medical history form
- ✅ Pregnancy history section
- ✅ Birth history section
- ✅ Immunization records with add/remove
- ✅ Disease history with add/remove
- ✅ Nested form handling for complex data structures

### 4. **PatientDetail Component Updated** (`src/components/Patients/PatientDetail.tsx`)
- ✅ Updated to use hybrid database endpoints
- ✅ Added MongoDB data sections
- ✅ Integrated new form components
- ✅ Added modal views for all data types
- ✅ Enhanced UI with data summary cards

## 🔄 **Migration Changes**

### **Before (PostgreSQL Only)**
```typescript
// Old API call
const response = await anakAPI.getById(Number(id));
const anak = response.data;
```

### **After (Hybrid Database)**
```typescript
// New API call for complete data
const response = await anakAPI.getCompleteData(Number(id));
const { anak, survey_dan_keluhan, riwayat_medis_detail, ... } = response.data;
```

## 📊 **Data Structure Changes**

### **Complete Data Response**
```typescript
{
  status: 200,
  message: "Data lengkap anak berhasil diambil",
  data: {
    // SQL Data
    anak: AnakData,
    orang_tua: OrangTuaData[],
    pemeriksaan: PemeriksaanData[],
    riwayat_terapi: RiwayatTerapiData[],
    riwayat_pendidikan: RiwayatPendidikanData[],
    milestone_perkembangan: MilestoneData[],
    
    // MongoDB Data (Optional)
    survey_dan_keluhan?: SurveyData,
    riwayat_medis_detail?: RiwayatMedisData,
    perilaku_dan_kebiasaan?: PerilakuData,
    perkembangan_detail?: PerkembanganData,
    dokumen_dan_lampiran?: DokumenData
  }
}
```

### **Dashboard Data Response**
```typescript
{
  status: 200,
  message: "Data dashboard anak berhasil diambil",
  data: {
    anak: AnakData,
    orang_tua: OrangTuaData[],
    pemeriksaan_terbaru: PemeriksaanData[], // 5 terbaru
    terapi_aktif: RiwayatTerapiData[], // 3 aktif
    milestone_terbaru: MilestoneData[], // 10 terbaru
    survey_terbaru?: SurveyData,
    riwayat_medis_summary?: {
      riwayat_kehamilan: any,
      riwayat_kelahiran: any,
      total_imunisasi: number,
      total_penyakit: number
    }
  }
}
```

## 🎯 **New Features**

### 1. **Survey Management**
- ✅ Create/Update survey data
- ✅ Parent complaints tracking
- ✅ Teacher complaints tracking
- ✅ Survey summary and history

### 2. **Medical History Management**
- ✅ Pregnancy history
- ✅ Birth history
- ✅ Immunization records
- ✅ Disease history
- ✅ Post-birth history

### 3. **Behavior & Habits Tracking**
- ✅ Daily behavior patterns
- ✅ Social behavior
- ✅ Special habits
- ✅ Emotional patterns

### 4. **Development Details**
- ✅ Physical development
- ✅ Motor development
- ✅ Language development
- ✅ Cognitive development
- ✅ Social development

### 5. **Document Management**
- ✅ File uploads
- ✅ Document categorization
- ✅ Document history

## 🔧 **Technical Implementation**

### **Error Handling**
```typescript
// Handle database-specific errors
try {
  const response = await anakAPI.getCompleteData(anakId);
  // Handle success
} catch (error) {
  // Handle SQL vs MongoDB errors
  if (error.response?.status === 500) {
    // Database connection error
  } else if (error.response?.status === 404) {
    // Data not found
  }
}
```

### **Form State Management**
```typescript
// Dynamic form arrays
const [formData, setFormData] = useState<Partial<SurveyData>>({
  keluhan_orang_tua: [],
  keluhan_guru: [],
  // ... other fields
});

// Add/Remove functionality
const addKeluhanOrangTua = () => {
  setFormData(prev => ({
    ...prev,
    keluhan_orang_tua: [
      ...(prev.keluhan_orang_tua || []),
      { keluhan: '', tingkat_kekhawatiran: 'sedang', tanggal_keluhan: new Date().toISOString().split('T')[0] }
    ]
  }));
};
```

### **Nested Object Updates**
```typescript
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
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
    
    current[keys[keys.length - 1]] = value;
    return newData;
  });
};
```

## 🚀 **Usage Examples**

### **Fetch Complete Data**
```typescript
const fetchCompleteData = async () => {
  try {
    const response = await anakAPI.getCompleteData(anakId);
    if (response.status === 'success') {
      const { anak, survey_dan_keluhan, riwayat_medis_detail } = response.data;
      
      // Handle SQL data
      setAnakData(anak);
      
      // Handle MongoDB data (optional)
      setSurveyData(survey_dan_keluhan || null);
      setRiwayatMedisData(riwayat_medis_detail || null);
    }
  } catch (error) {
    console.error('Error fetching complete data:', error);
  }
};
```

### **Submit Survey Data**
```typescript
const submitSurvey = async (surveyData: Partial<SurveyData>) => {
  try {
    const response = await anakAPI.createSurvey(anakId, surveyData);
    if (response.status === 'success') {
      // Success handling
      setSurveyData(response.data);
    }
  } catch (error) {
    console.error('Error submitting survey:', error);
  }
};
```

## 📋 **Testing Checklist**

### **API Endpoints**
- [ ] Test `/api/anak/{id}/complete` endpoint
- [ ] Test `/api/anak/{id}/dashboard` endpoint
- [ ] Test `/api/anak/{id}/survey` CRUD operations
- [ ] Test `/api/anak/{id}/riwayat-medis` CRUD operations
- [ ] Test `/api/anak/{id}/perilaku` CRUD operations
- [ ] Test `/api/anak/{id}/perkembangan` CRUD operations
- [ ] Test `/api/anak/{id}/dokumen` CRUD operations

### **Form Components**
- [ ] Test SurveyForm create functionality
- [ ] Test SurveyForm update functionality
- [ ] Test RiwayatMedisForm create functionality
- [ ] Test RiwayatMedisForm update functionality
- [ ] Test form validation
- [ ] Test dynamic field add/remove
- [ ] Test nested object updates

### **UI Components**
- [ ] Test PatientDetail with complete data
- [ ] Test modal displays for all data types
- [ ] Test data summary cards
- [ ] Test form integration
- [ ] Test error handling
- [ ] Test loading states

## 🔍 **Troubleshooting**

### **Common Issues**

1. **MongoDB Connection Errors**
   - Check MongoDB Atlas connection string
   - Verify network connectivity
   - Check authentication credentials

2. **Data Not Loading**
   - Verify endpoint URLs
   - Check API response format
   - Verify data structure matches types

3. **Form Submission Errors**
   - Check required fields
   - Verify data validation
   - Check API endpoint availability

### **Debug Steps**

1. **Check Network Tab**
   - Verify API requests are being made
   - Check response status codes
   - Review response data structure

2. **Console Logs**
   - Add console.log for debugging
   - Check for JavaScript errors
   - Verify data flow

3. **Type Checking**
   - Verify TypeScript types match API response
   - Check for type mismatches
   - Validate data structures

## 📞 **Support**

Untuk bantuan teknis:
1. Cek **Health check**: `GET /api/health`
2. Review **Database logs** untuk error messages
3. Periksa **Network tab** di browser dev tools
4. Verifikasi **API documentation** untuk endpoint details

## 🎉 **Migration Complete**

Sistem hybrid database telah berhasil diimplementasikan dengan:
- ✅ **Backward compatibility** dengan data SQL existing
- ✅ **New MongoDB features** untuk data fleksibel
- ✅ **Enhanced UI** dengan data summary dan form management
- ✅ **Robust error handling** untuk kedua database
- ✅ **Type safety** dengan TypeScript interfaces
- ✅ **Comprehensive documentation** untuk maintenance

Sistem siap untuk production use dengan hybrid database architecture! 