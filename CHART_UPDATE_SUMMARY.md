# Update Logika Chart Pertumbuhan Anak Dashboard - Frontend Implementation

## Perubahan yang Dilakukan

### Sebelumnya
Chart Pertumbuhan Anak menggunakan field `mulai_terapi` sebagai patokan untuk menghitung pertumbuhan anak baru.

### Sekarang
Chart Pertumbuhan Anak menggunakan field `tanggal_pemeriksaan` sebagai patokan untuk menghitung pertumbuhan anak baru, sesuai dengan dokumentasi backend yang disederhanakan.

## Bug Fixes

### 1. **Top Keluhan Data Format Issue**
**Problem**: Backend mengirimkan data `top_keluhan` dalam format object `{keluhan: string, count: number}` tetapi frontend mengharapkan array string.

**Solution**: Update frontend untuk menangani kedua format data:
```typescript
// Handle both string and object formats
const keluhanText = typeof keluhan === 'string' ? keluhan : keluhan.keluhan || keluhan.count || 'Unknown';
const keluhanCount = typeof keluhan === 'object' ? keluhan.count : null;

return (
  <div key={i} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
    <span className="font-medium">{keluhanText}</span>
    <span className="text-blue-600 font-semibold">
      {keluhanCount ? `${keluhanCount} kasus` : `#${i + 1}`}
    </span>
  </div>
);
```

**Type Update**:
```typescript
top_keluhan?: (string | { keluhan: string; count: number })[];
```

### 2. **Fallback Data for Testing**
Menambahkan fallback data untuk testing ketika backend belum siap:
```typescript
const fallbackData: DashboardStats = {
  total_anak: 150,
  anak_keluar_bulan_lalu: 5,
  anak_keluar_bulan_ini: 3,
  anak_aktif: 142,
  total_terapis: 20,
  total_admin: 5,
  growth: [
    { period: "Minggu 1", count: 12 },
    { period: "Minggu 2", count: 8 },
    { period: "Minggu 3", count: 15 },
    { period: "Minggu 4", count: 10 }
  ],
  period: period,
  filter_applied: new Date().toISOString(),
  insight: {
    top_keluhan: [
      { keluhan: "Terlambat Bicara", count: 15 },
      { keluhan: "Hiperaktif", count: 12 },
      { keluhan: "Kesulitan Belajar", count: 8 }
    ],
    age_distribution: { "<2": 45, "2-4": 60, "4-6": 35, ">6": 10 },
    referral_source: { "Dokter": 40, "Guru": 25, "Orang Tua": 35 },
    therapy_success_count: 25,
    avg_therapy_duration_month: 6.5
  }
};
```

## Implementasi Frontend

### 1. Update Period Options
Mengubah opsi period untuk menyesuaikan dengan backend yang disederhanakan:

```typescript
// Sebelumnya
<option value="month">6 Bulan Terakhir</option>
<option value="quarter">4 Kuartal Terakhir</option>
<option value="year">3 Tahun Terakhir</option>
<option value="3month">3 Bulan Terakhir</option>
<option value="1year">1 Tahun Terakhir</option>
<option value="3year">3 Tahun Terakhir</option>

// Sekarang
<option value="1month">1 Bulan Terakhir</option>
<option value="4month">4 Bulan Terakhir</option>
<option value="6month">6 Bulan Terakhir</option>
<option value="1year">1 Tahun Terakhir</option>
<option value="all">Semua Waktu</option>
```

### 2. Update Default Values
```typescript
// Sebelumnya
const [period, setPeriod] = useState<string>('month');
const [growthPeriod, setGrowthPeriod] = useState<string>('month');

// Sekarang
const [period, setPeriod] = useState<string>('1month');
const [growthPeriod, setGrowthPeriod] = useState<string>('1month');
```

### 3. Update Filter Logic
Logika filter diperbarui untuk menangani format period yang disederhanakan:

```typescript
const getFilteredGrowth = () => {
  if (!stats?.growth) return [];
  
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  let minDate: Date | null = null;
  
  if (growthPeriod === '1month') {
    minDate = new Date(now);
    minDate.setMonth(now.getMonth() - 1);
    minDate.setHours(0, 0, 0, 0);
  } else if (growthPeriod === '4month') {
    minDate = new Date(now);
    minDate.setMonth(now.getMonth() - 4);
    minDate.setHours(0, 0, 0, 0);
  } else if (growthPeriod === '6month') {
    minDate = new Date(now);
    minDate.setMonth(now.getMonth() - 6);
    minDate.setHours(0, 0, 0, 0);
  } else if (growthPeriod === '1year') {
    minDate = new Date(now);
    minDate.setFullYear(now.getFullYear() - 1);
    minDate.setHours(0, 0, 0, 0);
  } else if (growthPeriod === 'all') {
    // Untuk 'all', tampilkan semua data tanpa filter
    return stats.growth.sort((a, b) => {
      return a.period.localeCompare(b.period);
    });
  }
  
  return stats.growth
    .filter(item => {
      // Handle period strings like "Minggu 1", "Jan 24", "2024"
      if (item.period.includes('Minggu')) {
        return true;
      }
      
      if (item.period.match(/^\d{4}$/)) {
        return true;
      }
      
      const date = new Date(item.period);
      if (!isNaN(date.getTime()) && minDate) {
        return date >= minDate && date <= now;
      }
      return true;
    })
    .sort((a, b) => {
      return a.period.localeCompare(b.period);
    });
};
```

### 4. Update Chart Display
Chart sekarang menampilkan "Pertumbuhan Anak (Pemeriksaan)" untuk memperjelas bahwa data berdasarkan tanggal pemeriksaan:

```typescript
<h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
  <BarChart2 className="w-5 h-5 text-blue-600" />
  Pertumbuhan Anak (Pemeriksaan)
</h3>
```

### 5. Update Chart Formatting
Formatting untuk berbagai jenis period:

```typescript
tickFormatter={value => {
  // Handle different period formats
  if (value.includes('Minggu')) {
    // Week format: "Minggu 1"
    return value;
  }
  if (value.match(/^\d{4}$/)) {
    // Year format: "2024"
    return value;
  }
  
  // Month format: try to parse as date
  const date = new Date(value);
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
  }
  return value;
}}
```

### 6. Update Stats Cards
Mengubah urutan dan prioritas stats cards sesuai dengan backend:

```typescript
<StatsCard title="Total Anak" value={stats.total_anak} icon={Users} color="blue" />
<StatsCard title="Anak Aktif" value={stats.anak_aktif || 0} icon={TrendingUp} color="green" />
<StatsCard title="Anak Keluar Bulan Ini" value={stats.anak_keluar_bulan_ini || 0} icon={LogOut} color="red" />
<StatsCard title="Anak Keluar Bulan Lalu" value={stats.anak_keluar_bulan_lalu || 0} icon={LogOut} color="orange" />
```

### 7. Add Insight Section
Menambahkan section insight yang disederhanakan:

```typescript
{/* Insight Section */}
{stats.insight && (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Top Keluhan */}
    {stats.insight.top_keluhan && stats.insight.top_keluhan.length > 0 && (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Top Keluhan</h3>
        <div className="space-y-3">
          {stats.insight.top_keluhan.map((keluhan: any, i: number) => {
            // Handle both string and object formats
            const keluhanText = typeof keluhan === 'string' ? keluhan : keluhan.keluhan || keluhan.count || 'Unknown';
            const keluhanCount = typeof keluhan === 'object' ? keluhan.count : null;
            
            return (
              <div key={i} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium">{keluhanText}</span>
                <span className="text-blue-600 font-semibold">
                  {keluhanCount ? `${keluhanCount} kasus` : `#${i + 1}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    )}

    {/* Referral Source */}
    {stats.insight.referral_source && (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-green-900 mb-4">Sumber Referral</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={Object.entries(stats.insight.referral_source).map(([source, count]) => ({ source, count }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="source" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )}
  </div>
)}
```

## Period yang Didukung (Backend Baru)

### 1. **1month (1 bulan terakhir)**
- Growth data: 4 minggu terakhir
- Format: `["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4"]`
- Backend: `period=1month`

### 2. **4month (4 bulan terakhir)**
- Growth data: 4 bulan terakhir (per bulan)
- Format: `["Jan 24", "Feb 24", "Mar 24", "Apr 24"]`
- Backend: `period=4month`

### 3. **6month (6 bulan terakhir)**
- Growth data: 6 bulan terakhir (per bulan)
- Format: `["Jan 24", "Feb 24", "Mar 24", "Apr 24", "Mei 24", "Jun 24"]`
- Backend: `period=6month`

### 4. **1year (1 tahun terakhir)**
- Growth data: 12 bulan terakhir (per bulan)
- Format: `["Jul 23", "Agu 23", ..., "Jun 24"]`
- Backend: `period=1year`

### 5. **all (Semua waktu)**
- Growth data: Semua tahun yang ada data (per tahun)
- Format: `["2022", "2023", "2024"]`
- Backend: `period=all`

## API Integration

### Request
```typescript
const response = await dashboardAPI.getStats(period);
```

### Response Structure (Baru)
```typescript
{
  status: "success",
  message: "Dashboard statistics fetched successfully",
  data: {
    total_anak: 150,
    anak_keluar_bulan_lalu: 5,
    anak_keluar_bulan_ini: 3,
    anak_aktif: 142,
    growth: [
      { period: "Minggu 1", count: 12 },
      { period: "Minggu 2", count: 8 },
      { period: "Minggu 3", count: 15 },
      { period: "Minggu 4", count: 10 }
    ],
    period: "1month",
    filter_applied: "2025-01-15T00:00:00.000Z",
    insight: {
      top_keluhan: [
        { keluhan: "Terlambat Bicara", count: 15 },
        { keluhan: "Hiperaktif", count: 12 },
        { keluhan: "Kesulitan Belajar", count: 8 }
      ],
      age_distribution: { "<2": 45, "2-4": 60, "4-6": 35, ">6": 10 },
      referral_source: { "Dokter": 40, "Guru": 25, "Orang Tua": 35 },
      therapy_success_count: 25,
      avg_therapy_duration_month: 6.5
    }
  }
}
```

## Type Updates

### DashboardStats Interface
```typescript
export interface DashboardStats {
  total_anak: number;
  total_admin?: number;
  total_terapis?: number;
  total_superadmin?: number;
  total_manajer?: number;
  total_orangtua?: number;
  anak_keluar_bulan_lalu?: number;
  anak_keluar_bulan_ini?: number;
  anak_aktif?: number;
  growth: Array<{ period: string; count: number }>;
  period?: string;
  filter_applied?: string;
  insight?: {
    // Simplified insight structure based on new backend
    top_keluhan?: (string | { keluhan: string; count: number })[];
    age_distribution?: { '<2': number; '2-4': number; '4-6': number; '>6': number };
    referral_source?: Record<string, number>;
    therapy_success_count?: number;
    avg_therapy_duration_month?: number;
    
    // Legacy fields for backward compatibility
    klinis?: { /* ... */ };
    demografi?: { /* ... */ };
    operasional?: { /* ... */ };
    prediktif?: { /* ... */ };
    bisnis?: { /* ... */ };
  };
}
```

## Error Handling

### TypeScript Improvements
- Mengubah `any` menjadi `unknown` untuk error handling
- Menambahkan type checking untuk error messages
- Menghapus unused imports
- Menambahkan type annotations untuk map functions
- Menangani format data yang berbeda untuk top_keluhan

```typescript
// Sebelumnya
} catch (err: any) {
  setError(err.message || 'Gagal memuat statistik dashboard');

// Sekarang
} catch (err: unknown) {
  const errorMessage = err instanceof Error ? err.message : 'Gagal memuat statistik dashboard';
  setError(errorMessage);
```

## Testing

Untuk testing, pastikan:
1. Backend endpoint `/api/dashboard/stats?period={period}` berfungsi dengan benar
2. Data `tanggal_pemeriksaan` tersedia di database
3. Format response sesuai dengan struktur baru
4. Chart menampilkan data dengan benar untuk semua period
5. Insight section menampilkan data dengan benar
6. Filter dan sorting berfungsi dengan baik
7. Top keluhan menampilkan data dengan format yang benar

## Catatan Penting

1. **Backend Dependency**: Implementasi ini bergantung pada backend yang sudah diupdate dengan struktur response yang disederhanakan
2. **Data Migration**: Pastikan field `tanggal_pemeriksaan` sudah terisi dengan benar di database
3. **Backward Compatibility**: Tipe data masih mendukung struktur lama untuk kompatibilitas
4. **Period Simplification**: Period options disederhanakan dari 6 opsi menjadi 5 opsi
5. **Insight Structure**: Struktur insight disederhanakan sesuai dengan backend baru
6. **Data Format Flexibility**: Frontend sekarang dapat menangani berbagai format data untuk top_keluhan

## Files Modified

- `src/components/Dashboard/DashboardOverview.tsx` - Main dashboard component
- `src/types/index.ts` - DashboardStats interface update
- `CHART_UPDATE_SUMMARY.md` - This documentation file

## Next Steps

1. Test integration dengan backend yang sudah diupdate
2. Verifikasi data display untuk semua period types
3. Test insight section dengan data baru
4. Test error handling dan edge cases
5. Update documentation jika diperlukan
6. Remove fallback data once backend is fully ready 