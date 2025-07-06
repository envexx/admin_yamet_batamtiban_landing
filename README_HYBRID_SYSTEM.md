# 🚀 Hybrid Database System - Frontend Guide

## 📋 **Overview**

Sistem telah diperbarui untuk mendukung **Hybrid Database Architecture**:
- **PostgreSQL**: Data terstruktur (anak, assessment, program terapi)
- **MongoDB Atlas**: Data fleksibel (survey, riwayat medis, perilaku, perkembangan, dokumen)

## 🛠️ **Setup & Installation**

### **Prerequisites**
- Node.js 16+ 
- npm atau yarn
- Backend server dengan hybrid database support

### **Installation**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎯 **Key Features**

### **1. Complete Data View**
- Tampilkan semua data anak (SQL + MongoDB) dalam satu halaman
- Data summary cards untuk quick overview
- Modal views untuk detail lengkap

### **2. Survey Management**
- Form survey dengan keluhan orang tua dan guru
- Dynamic fields dengan add/remove functionality
- Data validation dan error handling

### **3. Medical History**
- Riwayat kehamilan dan kelahiran
- Data imunisasi dengan tracking
- Riwayat penyakit dengan status tracking

### **4. Behavior & Development Tracking**
- Perilaku sehari-hari dan sosial
- Perkembangan fisik, motor, bahasa, kognitif
- Data tracking yang komprehensif

### **5. Document Management**
- Upload dan manage dokumen
- Kategorisasi dokumen
- File preview dan download

## 📱 **User Interface**

### **Patient Detail Page**
```
┌─────────────────────────────────────┐
│ Data Anak (SQL)                     │
├─────────────────────────────────────┤
│ Data Keluarga (SQL)                 │
├─────────────────────────────────────┤
│ Survey & Keluhan (MongoDB) [Tambah] │
│ Riwayat Medis (MongoDB) [Tambah]    │
│ Perilaku & Kebiasaan [Tambah]       │
│ Perkembangan Detail [Tambah]        │
│ Dokumen & Lampiran [Tambah]         │
├─────────────────────────────────────┤
│ Data Assessment (SQL)               │
│ Data Program Terapi (SQL)           │
└─────────────────────────────────────┘
```

### **Data Summary Cards**
- **Survey**: Tanggal terakhir, jumlah keluhan
- **Medical**: Jumlah imunisasi, jumlah penyakit
- **Behavior**: Tingkat aktivitas, interaksi sosial
- **Development**: Tinggi, berat, lingkar kepala
- **Documents**: Total dokumen tersedia

## 🔧 **API Integration**

### **Complete Data Endpoint**
```typescript
// Fetch all data for a patient
const response = await anakAPI.getCompleteData(anakId);
const { 
  anak, 
  survey_dan_keluhan, 
  riwayat_medis_detail,
  perilaku_dan_kebiasaan,
  perkembangan_detail,
  dokumen_dan_lampiran 
} = response.data;
```

### **Dashboard Data Endpoint**
```typescript
// Fetch optimized data for dashboard
const response = await anakAPI.getDashboardData(anakId);
const { 
  anak, 
  pemeriksaan_terbaru, 
  terapi_aktif,
  survey_terbaru,
  riwayat_medis_summary 
} = response.data;
```

### **MongoDB CRUD Operations**
```typescript
// Survey operations
await anakAPI.createSurvey(anakId, surveyData);
await anakAPI.updateSurvey(anakId, surveyData);
await anakAPI.getSurvey(anakId);

// Medical history operations
await anakAPI.createRiwayatMedis(anakId, riwayatData);
await anakAPI.updateRiwayatMedis(anakId, riwayatData);
await anakAPI.getRiwayatMedis(anakId);

// Behavior operations
await anakAPI.createPerilaku(anakId, perilakuData);
await anakAPI.updatePerilaku(anakId, perilakuData);
await anakAPI.getPerilaku(anakId);

// Development operations
await anakAPI.createPerkembangan(anakId, perkembanganData);
await anakAPI.updatePerkembangan(anakId, perkembanganData);
await anakAPI.getPerkembangan(anakId);

// Document operations
await anakAPI.addDokumen(anakId, dokumenData);
await anakAPI.deleteDokumen(anakId, docId);
await anakAPI.getDokumen(anakId);
```

## 📝 **Form Usage**

### **Survey Form**
```typescript
// Create new survey
<SurveyForm
  anakId={anakId}
  onSuccess={handleSuccess}
  onCancel={handleCancel}
/>

// Edit existing survey
<SurveyForm
  anakId={anakId}
  surveyData={existingSurvey}
  onSuccess={handleSuccess}
  onCancel={handleCancel}
/>
```

### **Medical History Form**
```typescript
// Create new medical history
<RiwayatMedisForm
  anakId={anakId}
  onSuccess={handleSuccess}
  onCancel={handleCancel}
/>

// Edit existing medical history
<RiwayatMedisForm
  anakId={anakId}
  riwayatData={existingRiwayat}
  onSuccess={handleSuccess}
  onCancel={handleCancel}
/>
```

## 🎨 **Component Structure**

### **Patient Detail Component**
```typescript
// Main component with hybrid data
const PatientDetail = () => {
  const [completeData, setCompleteData] = useState<AnakCompleteData | null>(null);
  
  // Fetch complete data including MongoDB
  const fetchCompleteData = async () => {
    const response = await anakAPI.getCompleteData(anakId);
    setCompleteData(response.data);
  };
  
  // Render SQL and MongoDB data sections
  return (
    <div>
      {/* SQL Data Sections */}
      <AnakDataSection anak={completeData?.anak} />
      <FamilyDataSection anak={completeData?.anak} />
      
      {/* MongoDB Data Sections */}
      <SurveySection 
        data={completeData?.survey_dan_keluhan}
        onAdd={handleAddSurvey}
        onEdit={handleEditSurvey}
      />
      <MedicalHistorySection 
        data={completeData?.riwayat_medis_detail}
        onAdd={handleAddRiwayat}
        onEdit={handleEditRiwayat}
      />
      {/* ... other MongoDB sections */}
    </div>
  );
};
```

### **Data Summary Cards**
```typescript
// Reusable summary card component
const DataSummaryCard = ({ 
  title, 
  data, 
  summary, 
  onView, 
  onAdd, 
  onEdit 
}) => (
  <div className="bg-white rounded-lg shadow-sm border p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="flex space-x-2">
        <Button size="sm" variant="secondary" onClick={onView}>
          Lihat
        </Button>
        <Button size="sm" variant="primary" onClick={data ? onEdit : onAdd}>
          {data ? 'Edit' : 'Tambah'}
        </Button>
      </div>
    </div>
    {data ? (
      <div className="space-y-2">
        {summary}
      </div>
    ) : (
      <p className="text-gray-500 text-sm">Belum ada data</p>
    )}
  </div>
);
```

## 🔄 **Data Flow**

### **1. Load Patient Data**
```
User clicks patient → fetchCompleteData() → API call → 
Set complete data → Render SQL + MongoDB sections
```

### **2. Add/Edit MongoDB Data**
```
User clicks Add/Edit → Open form modal → User fills form → 
Submit form → API call → Refresh data → Close modal
```

### **3. View Data Details**
```
User clicks View → Open detail modal → Display formatted data → 
User can view all details in organized sections
```

## 🎯 **Best Practices**

### **1. Error Handling**
```typescript
try {
  const response = await anakAPI.getCompleteData(anakId);
  if (response.status === 'success') {
    setCompleteData(response.data);
  }
} catch (error) {
  // Handle different error types
  if (error.response?.status === 500) {
    setError('Database connection error');
  } else if (error.response?.status === 404) {
    setError('Patient not found');
  } else {
    setError('Unknown error occurred');
  }
}
```

### **2. Loading States**
```typescript
const [loading, setLoading] = useState(true);

const fetchData = async () => {
  setLoading(true);
  try {
    // API call
  } finally {
    setLoading(false);
  }
};

if (loading) {
  return <LoadingSpinner text="Loading patient data..." />;
}
```

### **3. Form Validation**
```typescript
const validateForm = (data: Partial<SurveyData>) => {
  const errors: string[] = [];
  
  if (!data.survey_singkat?.tanggal_survey) {
    errors.push('Tanggal survey is required');
  }
  
  if (data.keluhan_orang_tua?.some(k => !k.keluhan)) {
    errors.push('All complaints must have descriptions');
  }
  
  return errors;
};
```

## 🧪 **Testing**

### **Unit Tests**
```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

### **Integration Tests**
```bash
# Test API integration
npm run test:integration

# Test form submissions
npm run test:forms
```

### **Manual Testing Checklist**
- [ ] Load patient detail page
- [ ] View all data sections
- [ ] Add new survey data
- [ ] Edit existing survey data
- [ ] Add new medical history
- [ ] Edit existing medical history
- [ ] View data in modals
- [ ] Test form validation
- [ ] Test error handling
- [ ] Test loading states

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Data Not Loading**
   ```bash
   # Check API endpoint
   curl http://localhost:3000/api/anak/1/complete
   
   # Check network tab in browser
   # Verify response format matches types
   ```

2. **Form Submission Fails**
   ```bash
   # Check form validation
   # Verify required fields
   # Check API endpoint availability
   ```

3. **MongoDB Connection Issues**
   ```bash
   # Check backend logs
   # Verify MongoDB connection string
   # Check network connectivity
   ```

### **Debug Commands**
```bash
# Check API health
curl http://localhost:3000/api/health

# Test specific endpoint
curl http://localhost:3000/api/anak/1/survey

# Check TypeScript compilation
npm run type-check
```

## 📚 **Additional Resources**

- [API Documentation](./API_DOCUMENTATION.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [Component Library](./COMPONENT_LIBRARY.md)
- [Migration Guide](./HYBRID_DATABASE_MIGRATION.md)

## 🤝 **Support**

Untuk bantuan teknis:
1. Cek dokumentasi di folder `docs/`
2. Review error logs di console
3. Test API endpoints dengan Postman
4. Hubungi tim development

---

**🎉 Sistem hybrid database siap digunakan!** 