# User Management Implementation

## Overview
Implementasi sistem manajemen user YAMET dengan role-based permissions yang memungkinkan superadmin dan admin untuk mengelola user dengan tingkat akses yang berbeda.

## Fitur yang Diimplementasikan

### 1. **Register User (Enhanced)**
- **Endpoint**: `POST /api/auth/register`
- **Komponen**: `RegisterForm.tsx`
- **Fitur**:
  - Registrasi publik untuk ORANGTUA (status: pending)
  - Registrasi oleh admin/superadmin untuk semua role
  - Validasi email dan phone uniqueness
  - Password hashing

### 2. **Create Admin (Superadmin Only)**
- **Endpoint**: `POST /api/auth/create-admin`
- **Komponen**: `CreateAdminForm.tsx`
- **Fitur**:
  - Hanya bisa diakses oleh SUPERADMIN
  - Dapat membuat ADMIN, MANAJER, TERAPIS, ORANGTUA
  - User yang dibuat langsung aktif
  - Audit trail dengan tracking `created_by`

### 3. **Update User (Role-based permissions)**
- **Endpoint**: `PUT /api/auth/update-user`
- **Komponen**: `UpdateUserForm.tsx`
- **Fitur**:
  - Permission matrix berdasarkan role
  - Update password opsional
  - Update role dan status sesuai permission
  - Delete user (soft delete)

### 4. **List Users (Superadmin Only)**
- **Endpoint**: `GET /api/auth/users`
- **Komponen**: `UserManagement.tsx`
- **Fitur**:
  - Pagination dan filtering
  - Search berdasarkan nama, email
  - Sorting berdasarkan field
  - Statistics per role

### 5. **Activate User**
- **Endpoint**: `POST /api/auth/activate`
- **Fitur**:
  - Mengaktifkan user dengan status pending
  - Permission-based activation

### 6. **Toggle User Status**
- **Endpoint**: `POST /api/auth/toggle-active`
- **Fitur**:
  - Mengubah status user antara active/inactive
  - Permission-based toggle

### 7. **Update Profile (Self)**
- **Endpoint**: `PUT /api/auth/update`
- **Fitur**:
  - User mengupdate profilnya sendiri
  - Update password opsional

## Role Hierarchy & Permissions

### **SUPERADMIN**
- **Create**: ADMIN, MANAJER, TERAPIS, ORANGTUA
- **Update**: All except other SUPERADMIN
- **Activate**: All
- **View**: All
- **Delete**: All except other SUPERADMIN

### **ADMIN**
- **Create**: TERAPIS, ORANGTUA
- **Update**: TERAPIS, ORANGTUA
- **Activate**: TERAPIS, ORANGTUA
- **View**: All
- **Delete**: TERAPIS, ORANGTUA

### **MANAJER**
- **Create**: -
- **Update**: -
- **Activate**: -
- **View**: Limited

### **TERAPIS**
- **Create**: -
- **Update**: -
- **Activate**: -
- **View**: Limited

### **ORANGTUA**
- **Create**: -
- **Update**: Self only
- **Activate**: -
- **View**: Self only

## File Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── RegisterForm.tsx          # Enhanced register form
│   │   └── LoginForm.tsx
│   └── Users/
│       ├── UserManagement.tsx        # Main user management
│       ├── CreateAdminForm.tsx       # Create admin modal
│       └── UpdateUserForm.tsx        # Update user modal
├── services/
│   └── api.ts                        # Updated API service
└── types/
    └── index.ts                      # Updated type definitions
```

## API Service Updates

### New Methods in `authAPI`:

```typescript
// Enhanced Register
register: async (userData: RegisterData): Promise<ApiResponse<User>>

// Create Admin (Superadmin Only)
createAdmin: async (adminData: CreateAdminData): Promise<ApiResponse<User>>

// Update User (Role-based permissions)
updateUser: async (updateData: UpdateUserData): Promise<ApiResponse<User>>

// List Users (Superadmin Only)
getAllUsers: async (filters: any = {}): Promise<ApiResponse<{ users: User[]; statistics: any; pagination: any }>>

// Toggle User Status
toggleActive: async (userId: number, isActive: boolean): Promise<ApiResponse>

// Activate User
activate: async (userId: number): Promise<ApiResponse>
```

## Type Definitions

### New Types:

```typescript
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
```

## Component Features

### RegisterForm.tsx
- Form registrasi untuk ORANGTUA
- Validasi input
- Auto-redirect ke login setelah berhasil
- Error handling

### CreateAdminForm.tsx
- Modal form untuk membuat admin
- Role selection dropdown
- Password visibility toggle
- Permission check (SUPERADMIN only)

### UpdateUserForm.tsx
- Modal form untuk update user
- Role-based field visibility
- Optional password update
- Delete user functionality
- Permission-based actions

### UserManagement.tsx
- Table dengan pagination
- Search dan filtering
- Role-based action buttons
- Statistics cards
- Modal integrations

## Security Features

### 1. **Role-Based Access Control**
- Setiap endpoint memvalidasi role user yang mengakses
- Permission matrix yang ketat untuk setiap operasi
- Frontend permission checks

### 2. **Data Validation**
- TypeScript type safety
- Form validation
- API response validation

### 3. **Error Handling**
- Comprehensive error messages
- User-friendly error display
- Loading states

## Usage Examples

### Create Admin (Superadmin)
```typescript
const adminData = {
  name: "John Doe",
  email: "john@yametbatamtiban.com",
  phone: "08123456789",
  password: "Admin123!",
  role: "ADMIN"
};

const response = await authAPI.createAdmin(adminData);
```

### Update User
```typescript
const updateData = {
  userId: 5,
  name: "John Doe Updated",
  email: "john.updated@yametbatamtiban.com",
  role: "MANAJER",
  status: "active"
};

const response = await authAPI.updateUser(updateData);
```

### List Users with Filters
```typescript
const filters = {
  page: 1,
  limit: 10,
  search: "admin",
  role: "ADMIN",
  status: "active"
};

const response = await authAPI.getAllUsers(filters);
```

## Testing

### Manual Testing Checklist
- [ ] Register sebagai ORANGTUA (status pending)
- [ ] Superadmin create admin baru
- [ ] Admin create terapis baru
- [ ] Update user dengan permission yang tepat
- [ ] Delete user dengan konfirmasi
- [ ] Activate user pending
- [ ] Toggle user status
- [ ] Search dan filter users
- [ ] Pagination berfungsi
- [ ] Error handling

### API Testing
```bash
# Test Create Admin
curl -X POST http://localhost:3000/api/auth/create-admin \
  -H "Authorization: Bearer <superadmin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Admin",
    "email": "newadmin@yametbatamtiban.com",
    "phone": "08123456791",
    "password": "Admin123!",
    "role": "ADMIN"
  }'

# Test Update User
curl -X PUT http://localhost:3000/api/auth/update-user \
  -H "Authorization: Bearer <superadmin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 5,
    "name": "Updated Admin Name",
    "email": "updated@yametbatamtiban.com",
    "status": "active"
  }'
```

## Future Enhancements

### Planned Features
1. **Bulk Operations**: Bulk create, update, delete users
2. **User Activity Logging**: Track user actions
3. **Password Reset**: Email-based password reset
4. **Email Verification**: Email verification system
5. **Advanced Permissions**: Granular permission system
6. **User Import/Export**: CSV import/export functionality
7. **Audit Trail**: Detailed audit logging
8. **Two-Factor Authentication**: 2FA support

### Technical Improvements
1. **Caching**: Redis caching for user data
2. **Rate Limiting**: API rate limiting
3. **Session Management**: Advanced session handling
4. **Real-time Updates**: WebSocket for real-time updates
5. **Mobile Support**: Mobile-responsive design improvements 