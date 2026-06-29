// File path: /client/src/App.jsx
// Purpose: Main application component with clean state-based navigation.
// Architecture: Uses a single layout with dynamic navigation and content routing.

import React, { useState, useEffect } from 'react';
import { ConfigProvider, useConfig } from './context/ConfigContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import FormRenderer from './components/dynamic/FormRenderer';
import TableRenderer from './components/dynamic/TableRenderer';
import NotificationBell from './components/ui/NotificationBell';

import Landing from './pages/public/Landing';
import WorkerDirectory from './pages/public/WorkerDirectory';
import WorkerProfile from './pages/public/WorkerProfile';
import WorkerDashboard from './pages/worker/Dashboard';
import WorkerJobs from './pages/worker/Jobs';
import WorkerApplications from './pages/worker/Applications';
import WorkerVerification from './pages/worker/Verification';
import EmployerDashboard from './pages/employer/Dashboard';
import EmployerPostJob from './pages/employer/PostJob';
import EmployerMyJobs from './pages/employer/MyJobs';
import EmployerApplicants from './pages/employer/Applicants';
import AdminDashboard from './pages/admin/Dashboard';
import AdminApprovals from './pages/admin/Approvals';
import AdminVerification from './pages/admin/Verification';
import AdminPayments from './pages/admin/Payments';
import AdminSettings from './pages/admin/Settings';

import './styles/index.css';

function AppContent() {
  const { config, loading: configLoading, error: configError } = useConfig();
  const { user, isAuthenticated, login, logout, registerWorker, registerEmployer } = useAuth();
  const { toast, confirm } = useToast();
  
  const [currentView, setCurrentView] = useState('landing');
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);

  const isAdmin = isAuthenticated && user && ['super_admin', 'verification_admin', 'finance_admin', 'office_staff'].includes(user.role);
  const isWorker = isAuthenticated && user?.role === 'worker';
  const isEmployer = isAuthenticated && user?.role === 'employer';

  useEffect(() => {
    if (isAuthenticated && user) {
      if (isWorker && currentView === 'landing') setCurrentView('worker-dashboard');
      else if (isEmployer && currentView === 'landing') setCurrentView('employer-dashboard');
      else if (isAdmin && !currentView.startsWith('admin-')) setCurrentView('admin-dashboard');
    } else if (!isAuthenticated && !['landing', 'login', 'register-worker', 'register-employer', 'directory', 'worker-profile'].includes(currentView)) {
      setCurrentView('landing');
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated && user) toast.success(`Welcome back, ${user.fullName}!`);
  }, [isAuthenticated]);

  if (configLoading) return <div className="loading-screen"><div className="skeleton-text medium"></div><div className="skeleton-text short"></div></div>;
  if (configError) return <div className="loading-screen"><h2 className="text-danger">Failed to Load</h2><p className="text-muted">{configError}</p></div>;

  const handleNavigate = (view, id = null) => {
    if (view === 'worker-profile') setSelectedWorkerId(id);
    if (view === 'employer-applicants') setSelectedJobId(id);
    setCurrentView(view);
  };

  const handleLogout = async () => {
    const confirmed = await confirm({ title: 'Logout', message: 'Are you sure?', confirmText: 'Logout', type: 'warning' });
    if (confirmed) {
      logout();
      toast.info('You have been logged out');
      setCurrentView('landing');
    }
  };

  const renderNav = () => {
    if (isAdmin) {
      const navItems = [
        { id: 'admin-dashboard', label: 'Dashboard' },
        { id: 'admin-approvals', label: 'Approvals' },
        { id: 'admin-verification', label: 'Verification' },
        { id: 'admin-payments', label: 'Payments' },
        { id: 'admin-workers', label: 'Workers' },
        { id: 'admin-settings', label: 'Settings' }
      ];
      return navItems.map(item => (
        <button key={item.id} onClick={() => setCurrentView(item.id)} className={currentView === item.id ? 'active' : ''}>{item.label}</button>
      ));
    }
    if (isWorker) {
      const navItems = [
        { id: 'worker-dashboard', label: 'Dashboard' },
        { id: 'worker-jobs', label: 'Find Jobs' },
        { id: 'worker-applications', label: 'Applications' },
        { id: 'worker-verification', label: 'Verification' }
      ];
      return navItems.map(item => (
        <button key={item.id} onClick={() => setCurrentView(item.id)} className={currentView === item.id ? 'active' : ''}>{item.label}</button>
      ));
    }
    if (isEmployer) {
      const navItems = [
        { id: 'employer-dashboard', label: 'Dashboard' },
        { id: 'employer-post-job', label: 'Post Job' },
        { id: 'employer-my-jobs', label: 'My Jobs' },
        { id: 'directory', label: 'Browse Workers' }
      ];
      return navItems.map(item => (
        <button key={item.id} onClick={() => setCurrentView(item.id)} className={currentView === item.id ? 'active' : ''}>{item.label}</button>
      ));
    }
    return (
      <>
        <button onClick={() => setCurrentView('landing')} className={currentView === 'landing' ? 'active' : ''}>Home</button>
        <button onClick={() => setCurrentView('directory')} className={currentView === 'directory' ? 'active' : ''}>Browse Workers</button>
        {!isAuthenticated && (
          <>
            <button onClick={() => setCurrentView('login')} className={currentView === 'login' ? 'active' : ''}>Login</button>
            <button onClick={() => setCurrentView('register-worker')} className={currentView === 'register-worker' ? 'active' : ''}>Worker Registration</button>
            <button onClick={() => setCurrentView('register-employer')} className={currentView === 'register-employer' ? 'active' : ''}>Employer Registration</button>
          </>
        )}
      </>
    );
  };

  const renderPage = () => {
    switch (currentView) {
      case 'landing': return <Landing onNavigate={handleNavigate} />;
      case 'directory': return <WorkerDirectory onWorkerClick={(id) => handleNavigate('worker-profile', id)} />;
      case 'worker-profile': return <WorkerProfile workerId={selectedWorkerId} onBack={() => setCurrentView('directory')} />;
      case 'login': return !isAuthenticated ? <LoginForm onLogin={login} onSuccess={() => setCurrentView('landing')} /> : null;
      case 'register-worker': return !isAuthenticated ? <FormRenderer formId="workerRegistration" onSubmit={handleWorkerRegister} onCancel={() => setCurrentView('landing')} /> : null;
      case 'register-employer': return !isAuthenticated ? <FormRenderer formId="employerRegistration" onSubmit={handleEmployerRegister} onCancel={() => setCurrentView('landing')} /> : null;
      case 'worker-dashboard': return <WorkerDashboard onNavigate={handleNavigate} />;
      case 'worker-jobs': return <WorkerJobs />;
      case 'worker-applications': return <WorkerApplications />;
      case 'worker-verification': return <WorkerVerification onNavigate={handleNavigate} />;
      case 'employer-dashboard': return <EmployerDashboard onNavigate={handleNavigate} />;
      case 'employer-post-job': return <EmployerPostJob onNavigate={handleNavigate} />;
      case 'employer-my-jobs': return <EmployerMyJobs onNavigate={handleNavigate} />;
      case 'employer-applicants': return <EmployerApplicants jobId={selectedJobId} onNavigate={handleNavigate} />;
      case 'admin-dashboard': return <AdminDashboard />;
      case 'admin-approvals': return <AdminApprovals />;
      case 'admin-verification': return <AdminVerification />;
      case 'admin-payments': return <AdminPayments />;
      case 'admin-settings': return <AdminSettings />;
      case 'admin-workers': return <TableRenderer tableId="adminWorkers" onRowClick={(row) => toast.info(`Viewing: ${row.fullName}`)} />;
      default: return <Landing onNavigate={handleNavigate} />;
    }
  };

  const handleWorkerRegister = async (data) => {
    const transformedData = { phone: data.phone, password: 'test123', fullName: data.fullName, age: parseInt(data.age), gender: data.gender, photoUrl: null, emergencyContactName: data.emergencyContactName, emergencyContactPhone: data.emergencyContactPhone, emergencyContactRelationship: data.emergencyContactRelationship, zone: data.zone, woreda: data.woreda || '', workerType: data.workerType, educationLevel: data.educationLevel, yearsExperience: parseInt(data.yearsExperience), languages: data.languages || [], skills: data.skills || [], availability: data.availability, salaryExpectationMin: parseInt(data.salaryExpectationMin), salaryExpectationMax: parseInt(data.salaryExpectationMax), previousEmployers: data.previousEmployers || [] };
    const result = await registerWorker(transformedData);
    if (result.success) { toast.success(`Registration submitted! Payment: ${result.data.paymentRequired} ETB`); setCurrentView('landing'); } 
    else { toast.error(`Failed: ${result.message}`); }
  };

  const handleEmployerRegister = async (data) => {
    const transformedData = { phone: data.phone, email: data.email || '', password: 'test123', fullName: data.fullName, zone: data.zone, woreda: data.woreda || '', householdSize: parseInt(data.householdSize), childrenUnder5: parseInt(data.childrenUnder5), children5to12: parseInt(data.children5to12), elderlyMembers: parseInt(data.elderlyMembers), hasSpecialNeeds: data.hasSpecialNeeds || false, specialNotes: data.specialNotes || '' };
    const result = await registerEmployer(transformedData);
    if (result.success) { toast.success(`Registration submitted! Payment: ${result.data.paymentRequired} ETB`); setCurrentView('landing'); } 
    else { toast.error(`Failed: ${result.message}`); }
  };

  return (
    <div className="app-container">
      <header className={`app-header ${isAdmin ? 'admin-header' : ''}`}>
        <div className="d-flex items-center justify-between w-full">
          <h1 className="text-primary font-bold cursor-pointer" onClick={() => setCurrentView(isAdmin ? 'admin-dashboard' : isWorker ? 'worker-dashboard' : isEmployer ? 'employer-dashboard' : 'landing')}>
            🏠 {config.platform.name} {isAdmin && '- Admin Panel'}
          </h1>
          {isAuthenticated && (
            <div className="d-flex items-center gap-4">
              <NotificationBell />
              <span className="text-sm text-muted">Welcome, {user.fullName} {isAdmin && `(${user.role})`}</span>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">Logout</button>
            </div>
          )}
        </div>
        {!isAdmin && <p className="text-muted text-sm">{config.platform.tagline}</p>}
        <nav className="demo-nav">{renderNav()}</nav>
      </header>

      <main className="app-main">{renderPage()}</main>

      <footer className="app-footer">
        <p>© 2026 {config.platform.name}</p>
      </footer>
    </div>
  );
}

function LoginForm({ onLogin, onSuccess }) {
  const { toast } = useToast();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('worker');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await onLogin(phone, password, userType);
    if (result.success) { toast.success('Login successful!'); onSuccess(); } 
    else { toast.error(result.message); setError(result.message); }
    setLoading(false);
  };

  return (
    <div className="form-demo">
      <form onSubmit={handleSubmit} className="dynamic-form">
        <div className="form-header"><h2>Login</h2></div>
        {error && <div className="form-error">{error}</div>}
        <div className="form-group">
          <label className="form-label">User Type</label>
          <select value={userType} onChange={(e) => setUserType(e.target.value)} className="form-select">
            <option value="worker">Worker</option>
            <option value="employer">Employer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">{userType === 'admin' ? 'Email' : 'Phone'}</label>
          <input type={userType === 'admin' ? 'email' : 'tel'} value={phone} onChange={(e) => setPhone(e.target.value)} className="form-input" required />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" required />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </div>
      </form>
    </div>
  );
}

function App() {
  return (
    <ConfigProvider>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;