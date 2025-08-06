import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import LoginForm from './components/Auth/LoginForm';
import CleanDashboardOverview from './components/Dashboard/CleanDashboardOverview';
import AnakList from './components/Patients/PatientList';
import UserManagement from './components/Users/UserManagement';
import ProfileSettings from './components/Profile/ProfileSettings';
import LoadingSpinner from './components/UI/LoadingSpinner';
import AnakDetail from './components/Patients/PatientDetail';
import AssessmentList from './components/Patients/AssessmentList';
import ProgramTerapiList from './components/Patients/ProgramTerapiList';
import RegisterForm from './components/Auth/RegisterForm';
import AnakEditForm from './components/Patients/AnakEditForm';
import AnakAddForm from './components/Patients/AnakAddForm';
import TerapisList from './components/Users/TerapisList';
import ChatbotBubble from './components/ChatbotBubble';
import NotFoundPage from './components/NotFoundPage';
import ServerErrorPage from './components/ServerErrorPage';
import SettingAplikasiPage from './components/Settings/SettingAplikasiPage';
import FaviconManager from './components/UI/FaviconManager';
import ConversionPage from './components/Conversion/ConversionPage';
import NotifikasiPage from './components/Notifikasi/NotifikasiPage';
import ErrorBoundary from './components/UI/ErrorBoundary';
import { AppConfigProvider } from './contexts/AppConfigContext';
import { DashboardCacheProvider } from './contexts/DashboardCacheContext';



const Dashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get active tab from current path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/') return 'dashboard';
    if (path.startsWith('/anak')) return 'anak';
    if (path === '/assessment') return 'assessment';
    if (path === '/program-terapi') return 'program-terapi';
    if (path === '/users') return 'users';
    if (path === '/profile') return 'profile';
    if (path === '/terapis') return 'terapis';
    if (path === '/setting-aplikasi') return 'setting-aplikasi';
    if (path === '/conversion') return 'conversion';
    if (path === '/notifikasi') return 'notifikasi';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  const setActiveTab = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'anak':
        navigate('/anak');
        break;
      case 'assessment':
        navigate('/assessment');
        break;
      case 'program-terapi':
        navigate('/program-terapi');
        break;
      case 'users':
        navigate('/users');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'terapis':
        navigate('/terapis');
        break;
      case 'setting-aplikasi':
        navigate('/setting-aplikasi');
        break;
      case 'conversion':
        navigate('/conversion');
        break;
      case 'notifikasi':
        navigate('/notifikasi');
        break;
      default:
        navigate('/dashboard');
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'anak':
        return 'Manajemen Anak';
      case 'assessment':
        return 'Assessment';
      case 'program-terapi':
        return 'Program Terapi';
      case 'users':
        return 'Manajemen Pengguna';
      case 'profile':
        return 'Profil Saya';
      case 'terapis':
        return 'Manajemen Terapis';
      case 'setting-aplikasi':
        return 'Pengaturan Aplikasi';
      case 'conversion':
        return 'Data Conversion';
      case 'notifikasi':
        return 'Data Notifikasi';
      default:
        return 'Dashboard';
    }
  };

  const getPageSubtitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Selamat datang di sistem manajemen YAMET';
      case 'anak':
        return 'Kelola data anak dan informasi terapi';
      case 'assessment':
        return 'Kelola assessment dan evaluasi anak';
      case 'program-terapi':
        return 'Kelola program terapi dan rencana pengobatan';
      case 'users':
        return 'Kelola pengguna sistem dan hak akses';
      case 'profile':
        return 'Kelola informasi profil Anda';
      case 'terapis':
        return 'Kelola data terapis dan informasi jadwal';
      case 'setting-aplikasi':
        return 'Kelola pengaturan aplikasi dan konfigurasi sistem';
      case 'conversion':
        return 'Kelola data conversion rate untuk mengukur efektivitas program YAMET';
      case 'notifikasi':
        return 'Kelola notifikasi sistem untuk mengirim pemberitahuan kepada user';
      default:
        return '';
    }
  };

  return (
    <>
      <FaviconManager />
      <div className="flex h-screen bg-gray-50">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(open => !open)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title={getPageTitle()} subtitle={getPageSubtitle()} onToggleSidebar={() => setSidebarOpen(open => !open)} />
          <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/dashboard" element={
              <ProtectedRoute requiredRole="ADMIN-OR-HIGHER">
                <ErrorBoundary>
                  <CleanDashboardOverview />
                </ErrorBoundary>
              </ProtectedRoute>
            } />
            <Route path="/anak" element={
              <ErrorBoundary>
                <AnakList />
              </ErrorBoundary>
            } />
            <Route path="/anak/tambah" element={
              <ErrorBoundary>
                <AnakAddForm />
              </ErrorBoundary>
            } />
            <Route path="/anak/:id" element={
              <ErrorBoundary>
                <AnakDetail />
              </ErrorBoundary>
            } />
            <Route path="/anak/edit/:id" element={
              <ErrorBoundary>
                <AnakEditForm />
              </ErrorBoundary>
            } />
            <Route path="/users" element={
              <ProtectedRoute requiredRole="SUPERADMIN">
                <ErrorBoundary>
                  <UserManagement />
                </ErrorBoundary>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ErrorBoundary>
                <ProfileSettings />
              </ErrorBoundary>
            } />
            <Route path="/assessment" element={
              <ProtectedRoute requiredRole="ADMIN-OR-HIGHER">
                <ErrorBoundary>
                  <AssessmentList />
                </ErrorBoundary>
              </ProtectedRoute>
            } />
            <Route path="/program-terapi" element={
              <ProtectedRoute requiredRole="ADMIN-OR-HIGHER">
                <ErrorBoundary>
                  <ProgramTerapiList />
                </ErrorBoundary>
              </ProtectedRoute>
            } />
            <Route path="/terapis" element={
              <ProtectedRoute requiredRole="MANAGER-OR-SUPERADMIN">
                <ErrorBoundary>
                  <TerapisList />
                </ErrorBoundary>
              </ProtectedRoute>
            } />
            <Route path="/conversion" element={
              <ProtectedRoute requiredRole="ADMIN-OR-HIGHER">
                <ErrorBoundary>
                  <ConversionPage />
                </ErrorBoundary>
              </ProtectedRoute>
            } />
            <Route path="/notifikasi" element={
              <ProtectedRoute requiredRole="SUPERADMIN">
                <ErrorBoundary>
                  <NotifikasiPage />
                </ErrorBoundary>
              </ProtectedRoute>
            } />
            <Route path="/setting-aplikasi" element={
              <ErrorBoundary>
                <SettingAplikasiPage />
              </ErrorBoundary>
            } />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
    </>
  );
};

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" text="Memuat aplikasi..." />
      </div>
    );
  }

  if (!user) {
    // Redirect ke login jika tidak ada user
    return <Navigate to="/login" replace />;
  }

  // Jika user sudah login, tampilkan dashboard
  return (
    <>
      <Dashboard />
      <ErrorBoundary>
        <ChatbotBubble />
      </ErrorBoundary>
    </>
  );
};

function App() {
  return (
    <AppConfigProvider>
      <Router>
        <AuthProvider>
          <DashboardCacheProvider>
            <ErrorBoundary>
              <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<AppContent />} />
              </Routes>
            </ErrorBoundary>
          </DashboardCacheProvider>
        </AuthProvider>
      </Router>
    </AppConfigProvider>
  );
}



export default App;