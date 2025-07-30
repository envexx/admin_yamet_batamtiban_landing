# Sub-Program Dropdown Implementation - Program Terapi

## 🔍 Fitur yang Ditambahkan

### Dropdown Sub-Program Terapi
**Lokasi**: Menu Program Terapi List
**Tujuan**: Menambahkan dropdown untuk sub-program terapi (CBT, Neurosenso, Hidroterapi) yang muncul ketika user memilih program utama OT, BT, atau SI

## 📋 Implementasi yang Ditambahkan

### 1. **Type Definitions Update** (`src/types/index.ts`)

#### **ProgramTerapi Interface:**
```typescript
export interface ProgramTerapi {
  id: number;
  anak_id: number;
  program_name: string;
  sub_program?: string; // ✅ Added
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
```

#### **CreateProgramTerapiData Interface:**
```typescript
export interface CreateProgramTerapiData {
  program_name: string;
  sub_program?: string; // ✅ Added
  description?: string;
  start_date?: string;
  end_date?: string;
  status?: 'AKTIF' | 'SELESAI' | 'DIBATALKAN';
  jam_per_minggu: number | null;
}
```

#### **UpdateProgramTerapiData Interface:**
```typescript
export interface UpdateProgramTerapiData {
  program_name?: string;
  sub_program?: string; // ✅ Added
  description?: string;
  start_date?: string;
  end_date?: string;
  status?: 'AKTIF' | 'SELESAI' | 'DIBATALKAN';
  jam_per_minggu?: number | null;
}
```

### 2. **ProgramTerapiList Component** (`src/components/Patients/ProgramTerapiList.tsx`)

#### **State Baru yang Ditambahkan:**
```typescript
const [addForm, setAddForm] = useState<CreateProgramTerapiData>({
  program_name: '',
  sub_program: '', // ✅ Added
  description: '',
  start_date: '',
  end_date: '',
  status: 'AKTIF',
  jam_per_minggu: 0
});

const [editForm, setEditForm] = useState<UpdateProgramTerapiData>({
  program_name: '',
  sub_program: '', // ✅ Added
  description: '',
  start_date: '',
  end_date: '',
  status: 'AKTIF',
  jam_per_minggu: 0
});
```

#### **Fungsi Helper yang Ditambahkan:**
```typescript
// Function to get sub-program options based on main program
const getSubProgramOptions = (mainProgram: string) => {
  switch (mainProgram) {
    case 'OT':
    case 'BT':
    case 'SI':
      return [
        { value: 'CBT', label: 'CBT - Cognitive Behavioral Therapy' },
        { value: 'NEUROSENSO', label: 'Neurosenso' },
        { value: 'HIDROTERAPI', label: 'Hidroterapi' }
      ];
    default:
      return [];
  }
};

// Function to check if sub-program is required
const isSubProgramRequired = (mainProgram: string) => {
  return ['OT', 'BT', 'SI'].includes(mainProgram);
};
```

#### **Dropdown Sub-Program di Form Add:**
```tsx
{/* Sub Program Dropdown - Only show for OT, BT, SI */}
{addForm.program_name && isSubProgramRequired(addForm.program_name) && (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Sub Program *
    </label>
    <select
      value={addForm.sub_program}
      onChange={e => setAddForm(prev => ({ ...prev, sub_program: e.target.value }))}
      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
      required
    >
      <option value="">Pilih sub program</option>
      {getSubProgramOptions(addForm.program_name).map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
)}
```

#### **Dropdown Sub-Program di Form Edit:**
```tsx
{/* Sub Program Dropdown - Only show for OT, BT, SI */}
{editForm.program_name && isSubProgramRequired(editForm.program_name) && (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Sub Program *
    </label>
    <select
      value={editForm.sub_program}
      onChange={e => setEditForm(prev => ({ ...prev, sub_program: e.target.value }))}
      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
      required
    >
      <option value="">Pilih sub program</option>
      {getSubProgramOptions(editForm.program_name).map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
)}
```

#### **Validasi Sub-Program:**
```typescript
// Validate sub-program is required for OT, BT, SI
if (isSubProgramRequired(addForm.program_name) && !addForm.sub_program) {
  showAlert({ type: 'error', title: 'Data Tidak Valid', message: 'Sub program harus dipilih untuk program terapi ini' });
  return;
}
```

#### **Tampilan Sub-Program di Card:**
```tsx
<div>
  <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
    {program.program_name}
  </h4>
  {program.sub_program && (
    <p className="text-sm text-purple-600 font-medium mt-1">
      {program.sub_program}
    </p>
  )}
</div>
```

## 🎯 Fitur Dropdown Sub-Program

### ✅ **Keunggulan Implementasi:**

1. **Conditional Rendering**: Dropdown hanya muncul untuk program OT, BT, SI
2. **Dynamic Options**: Opsi dropdown berubah berdasarkan program utama
3. **Validation**: Validasi memastikan sub-program dipilih untuk program yang membutuhkannya
4. **Visual Feedback**: Sub-program ditampilkan di card program terapi
5. **User Experience**: Reset sub-program ketika program utama berubah

### 🔧 **Opsi Sub-Program yang Tersedia:**

1. **CBT - Cognitive Behavioral Therapy**
2. **Neurosenso**
3. **Hidroterapi**

### 📝 **Alur Kerja Dropdown:**

1. User memilih program utama (OT, BT, SI)
2. Dropdown sub-program muncul otomatis
3. User memilih sub-program dari opsi yang tersedia
4. Validasi memastikan sub-program dipilih
5. Data disimpan dengan program utama dan sub-program
6. Sub-program ditampilkan di card program terapi

## 🚀 **Status Implementasi**

- ✅ **Type Definitions**: Updated dengan field sub_program
- ✅ **Form Add**: Dropdown sub-program ditambahkan
- ✅ **Form Edit**: Dropdown sub-program ditambahkan
- ✅ **Validation**: Validasi sub-program untuk OT, BT, SI
- ✅ **Card Display**: Sub-program ditampilkan di card
- ✅ **State Management**: Proper cleanup dan reset
- ✅ **User Experience**: Conditional rendering dan dynamic options

## 🔍 **Testing yang Perlu Dilakukan**

1. **Add Program OT/BT/SI**: Pastikan dropdown sub-program muncul
2. **Add Program TW/CBT**: Pastikan dropdown sub-program tidak muncul
3. **Edit Program**: Pastikan sub-program tersimpan dan ditampilkan
4. **Validation**: Pastikan error muncul jika sub-program tidak dipilih
5. **Card Display**: Pastikan sub-program ditampilkan di card
6. **State Reset**: Pastikan sub-program direset ketika program utama berubah

## 📚 **Referensi**

### **File yang Diperbaiki:**
- `src/types/index.ts` - Tambah field sub_program
- `src/components/Patients/ProgramTerapiList.tsx` - Implementasi dropdown

### **Komponen yang Digunakan:**
- `select` HTML element dengan styling Tailwind
- `useState` untuk state management
- `showAlert` untuk validasi feedback

## ⚠️ **Catatan Penting**

1. **Backend Integration**: Pastikan backend mendukung field sub_program
2. **Data Migration**: Data lama mungkin tidak memiliki sub_program
3. **Validation**: Sub-program wajib untuk OT, BT, SI
4. **User Experience**: Dropdown muncul/hilang secara dinamis
5. **Consistency**: Implementasi konsisten di add dan edit form 