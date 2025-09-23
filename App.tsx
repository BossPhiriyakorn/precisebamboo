// App.tsx
// คอมโพเนนต์หลักของแอปพลิเคชัน ทำหน้าที่เป็นตัวจัดการการแสดงผลตามบทบาทของผู้ใช้

import React, { useState, useEffect, useCallback } from 'react';
import { UserRole, AuthStatus, LineProfile } from './types';
import FarmerView from './features/farmer/FarmerView';
import FactoryView from './features/factory/FactoryView';
import AdminView from './features/admin/AdminView';
import FarmerRegistration, { RegistrationStatus } from './features/auth/FarmerRegistration';
import LoginWithLinePage from './features/auth/LoginWithLinePage';
import { initialPolicyContent, initialTermsContent } from './data/policyContent';
import RoleSelector from './features/auth/RoleSelector';
import Login from './features/auth/Login';
import { parseUrlParams } from './utils/navigation';
import { handleLineCallback } from './utils/lineCallback';
import { AppProvider } from './contexts/AppContext';

// Simulating a loading spinner
const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
    </div>
);

function AppContent() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');
  const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatus | null>(null);
  const [lineProfile, setLineProfile] = useState<LineProfile | null>(null);
  const [showLogin, setShowLogin] = useState<UserRole | null>(null);

  const [policyContent, setPolicyContent] = useState(initialPolicyContent);
  const [termsContent, setTermsContent] = useState(initialTermsContent);

  const handleUpdatePolicies = useCallback((newPolicy: string, newTerms: string) => {
      setPolicyContent(newPolicy);
      setTermsContent(newTerms);
      alert('บันทึกนโยบายเรียบร้อยแล้ว');
  }, []);

  // Simulate checking authentication status
  useEffect(() => {
    setTimeout(() => {
        // Check for LINE login callback (เฉพาะเกษตรกรเท่านั้น)
        const lineCallback = handleLineCallback();
        if (lineCallback.success && lineCallback.role === UserRole.FARMER) {
          // ตั้งค่า profile จาก LINE
          setLineProfile(lineCallback.profile);
          
          // สำหรับเกษตรกร ตรวจสอบการลงทะเบียน
          const isRegistered = localStorage.getItem('bamboo_farmer_registered') === 'true';
          if (!isRegistered) {
            setRegistrationStatus('registering');
          } else {
            setRole(UserRole.FARMER);
            setAuthStatus('authenticated');
          }
        } else if (lineCallback.success && lineCallback.role) {
          // ถ้า LINE callback สำเร็จแต่ไม่ใช่เกษตรกร ให้ไปหน้า login
          setShowLogin(lineCallback.role);
        } else {
        // Check for role navigation parameters
        const navParams = parseUrlParams();
        if (navParams.role && navParams.action) {
          if (navParams.action === 'register') {
            setRegistrationStatus('registering');
          } else if (navParams.action === 'login' && navParams.role !== UserRole.FARMER) {
            setShowLogin(navParams.role);
          } else if (navParams.action === 'direct') {
            // สำหรับโรงงานเท่านั้น (แอดมินต้อง login ก่อน)
            if (navParams.role === UserRole.FACTORY) {
              setRole(navParams.role);
              setAuthStatus('authenticated');
            } else {
              // แอดมินต้องไปหน้า login
              setShowLogin(navParams.role);
            }
          } else if (navParams.role === UserRole.FARMER) {
            // สำหรับเกษตรกร ตรวจสอบการลงทะเบียน
            const isRegistered = localStorage.getItem('bamboo_farmer_registered') === 'true';
            if (!isRegistered) {
              // ถ้ายังไม่ลงทะเบียน ให้ไปหน้าสมัคร
              setRegistrationStatus('registering');
            } else {
              // ถ้าลงทะเบียนแล้ว ให้ไปหน้าแรก
              setRole(UserRole.FARMER);
              setAuthStatus('authenticated');
            }
          }
        } else {
          setAuthStatus('unauthenticated'); // Default to role selection
        }
      }
    }, 1000); // 1 second loading simulation
  }, []);

  const handleLogout = () => {
    setRole(null);
    setShowLogin(null);
    setRegistrationStatus(null);
    setLineProfile(null);
    setAuthStatus('unauthenticated');
    // Also remove code from URL to prevent re-login loop on refresh
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const handleSelectRole = (selectedRole: UserRole) => {
    if (selectedRole === UserRole.FARMER) {
      // ตรวจสอบการลงทะเบียนของเกษตรกร
      const isRegistered = localStorage.getItem('bamboo_farmer_registered') === 'true';
      if (!isRegistered) {
        // ถ้ายังไม่ลงทะเบียน ให้ไปหน้าสมัคร
        setRegistrationStatus('registering');
      } else {
        // ถ้าลงทะเบียนแล้ว ให้ไปหน้าแรก
        setRole(UserRole.FARMER);
        setAuthStatus('authenticated');
      }
    } else {
      // Admin and Factory go to a login page
      setShowLogin(selectedRole);
    }
  };

  const handleLoginSuccess = () => {
    setRole(showLogin);
    setAuthStatus('authenticated');
  };

  const handleSubmitRegistration = () => {
    // หลังจากสมัครสมาชิกสำเร็จ ให้ไปที่ FarmerDashboard
    localStorage.setItem('bamboo_farmer_registered', 'true'); // บันทึกสถานะการลงทะเบียน
    setRole(UserRole.FARMER);
    setAuthStatus('authenticated');
    setRegistrationStatus(null);
  };

  if (authStatus === 'loading') {
    return <LoadingSpinner />;
  }

  if (authStatus === 'authenticated') {
    switch(role) {
      case UserRole.FARMER:
        return <FarmerView onLogout={handleLogout} />;
      case UserRole.FACTORY:
        return <FactoryView onLogout={handleLogout} />;
      case UserRole.ADMIN:
        return <AdminView 
                  onLogout={handleLogout} 
                  policyContent={policyContent}
                  termsContent={termsContent}
                  onUpdatePolicies={handleUpdatePolicies}
                />;
      default:
        // This case should not be reached if logic is correct
        return <RoleSelector 
                  onSelectRole={handleSelectRole} 
                  onStartRegistration={() => setRegistrationStatus('registering')} 
                  onTestNotApproved={() => setRegistrationStatus('not_approved')} 
                />;
    }
  }

  if (registrationStatus) {
    return <FarmerRegistration
      status={registrationStatus}
      onBackToRoleSelector={handleLogout}
      onSubmit={handleSubmitRegistration}
      onRetry={() => setRegistrationStatus('registering')}
      policyContent={policyContent}
      termsContent={termsContent}
      lineProfile={lineProfile}
    />
  }
  
  if(showLogin) {
      return <Login role={showLogin} onLoginSuccess={handleLoginSuccess} onBack={handleLogout} />;
  }
  
  // Default unauthenticated view is the role selector
  // We can add logic here to show LoginWithLinePage first if needed
  // For now, RoleSelector is the main entry.
  return <RoleSelector
                   onSelectRole={handleSelectRole}
                   onStartRegistration={() => setRegistrationStatus('registering')}
                   onTestNotApproved={() => setRegistrationStatus('not_approved')}
                 />;
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
