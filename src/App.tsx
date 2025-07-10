import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import LoginForm from './components/Auth/LoginForm';
import DashboardOverview from './components/Dashboard/DashboardOverview';
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

// ErrorBoundary untuk menangkap error 500
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    // Bisa log error ke server di sini
    // console.error(error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <ServerErrorPage onRetry={() => window.location.reload()} />;
    }
    return this.props.children;
  }
}

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
      default:
        return '';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(open => !open)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={getPageTitle()} subtitle={getPageSubtitle()} onToggleSidebar={() => setSidebarOpen(open => !open)} />
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/dashboard" element={
              <ProtectedRoute requiredRole="ADMIN-OR-HIGHER">
                <DashboardOverview />
              </ProtectedRoute>
            } />
            <Route path="/anak" element={<AnakList />} />
            <Route path="/anak/tambah" element={<AnakAddForm />} />
            <Route path="/anak/:id" element={<AnakDetail />} />
            <Route path="/anak/edit/:id" element={<AnakEditForm />} />
            <Route path="/users" element={
              <ProtectedRoute requiredRole="SUPERADMIN">
                <UserManagement />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={<ProfileSettings />} />
            <Route path="/assessment" element={
              <ProtectedRoute requiredRole="ADMIN-OR-HIGHER">
                <AssessmentList />
              </ProtectedRoute>
            } />
            <Route path="/program-terapi" element={
              <ProtectedRoute requiredRole="ADMIN-OR-HIGHER">
                <ProgramTerapiList />
              </ProtectedRoute>
            } />
            <Route path="/terapis" element={
              <ProtectedRoute requiredRole="MANAGER-OR-SUPERADMIN">
                <TerapisList />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
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
    if (location.pathname === '/register') {
      return <RegisterForm />;
    }
    // Jika user tidak login dan bukan di /register, tampilkan NotFoundPage
    if (location.pathname !== '/login') {
      return <NotFoundPage />;
    }
    return <LoginForm />;
  }

  return <>
    <Dashboard />
    <ChatbotBubble />
  </>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <Routes>
            <Route path="/register" element={<RegisterForm />} />
            {/* Route root: redirect tergantung status login */}
            <Route path="/" element={<RootRedirect />} />
            <Route path="*" element={<AppContent />} />
            <Route path="/404" element={<NotFoundPage />} />
          </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
}

// Komponen untuk redirect root sesuai status login
const RootRedirect: React.FC = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return <Navigate to="/login" replace />;
};

export default App;