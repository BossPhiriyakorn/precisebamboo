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

// Simulating a loading spinner
const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
    </div>
);

function App() {
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
      // Check for LINE login callback
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('code')) {
        // Simulate fetching profile after LINE login
        setLineProfile({
          userId: 'U1234567890abcdef1234567890ab',
          displayName: 'สมชาย รักการเกษตร',
          pictureUrl: 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'
        });
        setRegistrationStatus('registering');
        setAuthStatus('unauthenticated');
      } else {
        setAuthStatus('unauthenticated'); // Default to role selection
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
      // For testing, farmer role goes directly to farmer view
      setRole(UserRole.FARMER);
      setAuthStatus('authenticated');
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

export default App;
