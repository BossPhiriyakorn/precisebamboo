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
import { handleUrlBasedAuth, cleanUrlAfterAuth, storeAuthContext, getStoredAuthContext, clearStoredAuthContext } from './utils/authHandler';
import { checkFarmerRegistration, saveFarmerRegistration, getApprovedFarmer, getFarmerRegistrationStatus, getAllFarmers } from './utils/farmerStorage';
import { createFarmerLineLoginUrl } from './utils/navigation';
import { handleLineCallback } from './utils/lineCallback';

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
  const [isDirectLogin, setIsDirectLogin] = useState<boolean>(false);

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
      // ตรวจสอบการเข้าสู่ระบบผ่าน URL
      const authContext = handleUrlBasedAuth();
      
      if (authContext.isDirectLogin && authContext.role) {
        // การเข้าสู่ระบบโดยตรงผ่านลิงค์
        setIsDirectLogin(true);
        storeAuthContext(authContext);
        cleanUrlAfterAuth();
        
        if (authContext.role === UserRole.FARMER) {
          // สำหรับเกษตรกร ให้ไปที่ LINE Login
          // เปลี่ยน URL เป็น LINE Login URL
          const lineLoginUrl = createFarmerLineLoginUrl();
          window.location.href = lineLoginUrl;
          return;
        } else {
          // สำหรับ Admin และ Factory ให้ไปที่หน้า login
          setShowLogin(authContext.role);
          setAuthStatus('unauthenticated');
        }
        return;
      }
      
      // ตรวจสอบ stored auth context
      const storedContext = getStoredAuthContext();
      if (storedContext && storedContext.isDirectLogin) {
        setIsDirectLogin(true);
        
        if (storedContext.role === UserRole.FARMER) {
          // สำหรับเกษตรกร ให้ไปที่ LINE Login
          const lineLoginUrl = createFarmerLineLoginUrl();
          window.location.href = lineLoginUrl;
          return;
        } else {
          setShowLogin(storedContext.role);
          setAuthStatus('unauthenticated');
        }
        return;
      }
      
      // Check for LINE login callback
      const urlParams = new URLSearchParams(window.location.search);
      const action = urlParams.get('action');
      const code = urlParams.get('code');
      
      if (action === 'line_callback' && code) {
        console.log('Processing LINE callback...', { action, code, state: urlParams.get('state') });
        
        // ใช้ handleLineCallback function ที่มีอยู่แล้ว
        const callbackResult = handleLineCallback();
        
        console.log('LINE Callback Result:', callbackResult);
        
        if (callbackResult.success) {
          // ตั้งค่า LINE profile
          setLineProfile(callbackResult.profile);
          
          console.log('LINE Callback Success - Role Check:', {
            callbackRole: callbackResult.role,
            isFarmer: callbackResult.role === UserRole.FARMER,
            userRoleEnum: UserRole.FARMER,
            state: urlParams.get('state'),
            roleComparison: {
              callbackRoleType: typeof callbackResult.role,
              userRoleType: typeof UserRole.FARMER,
              strictEqual: callbackResult.role === UserRole.FARMER,
              looseEqual: callbackResult.role == UserRole.FARMER
            }
          });
          
          // Debug: ตรวจสอบ farmer registration status
          console.log('Farmer Registration Debug:', {
            checkResult: checkFarmerRegistration(),
            registrationStatus: getFarmerRegistrationStatus(),
            allFarmers: getAllFarmers()
          });
          
          // ตรวจสอบ role และดำเนินการตาม role
          if (callbackResult.role === UserRole.FARMER) {
            console.log('✅ Processing FARMER role...');
            
            // ตรวจสอบว่าเกษตรกรเคยลงทะเบียนแล้วหรือไม่
            const isFarmerRegistered = checkFarmerRegistration();
            console.log('Is farmer registered?', isFarmerRegistered);
            
            if (isFarmerRegistered) {
              // ถ้าลงทะเบียนแล้ว ให้ไปที่ farmer view
              console.log('✅ Farmer is registered, going to farmer view');
              setRole(UserRole.FARMER);
              setAuthStatus('authenticated');
            } else {
              // ถ้ายังไม่ลงทะเบียน ให้ไปหน้าลงทะเบียน
              console.log('✅ Farmer not registered, going to registration');
              setRegistrationStatus('registering');
              setAuthStatus('unauthenticated');
            }
          } else {
            // สำหรับ role อื่นๆ (admin, factory) - ไปหน้า login
            console.log('❌ Processing other role:', callbackResult.role);
            console.log('❌ This should not happen for farmer login!');
            setShowLogin(callbackResult.role);
            setAuthStatus('unauthenticated');
          }
        } else {
          // แสดงข้อผิดพลาด
          console.error('LINE Login Error:', callbackResult.error, callbackResult.errorDescription);
          setAuthStatus('unauthenticated');
        }
      } else {
        console.log('No LINE callback detected, going to role selection');
        setAuthStatus('unauthenticated'); // Default to role selection
      }
    }, 1000); // 1 second loading simulation
  }, []);

  const handleLogout = () => {
    setRole(null);
    setShowLogin(null);
    setRegistrationStatus(null);
    setLineProfile(null);
    setIsDirectLogin(false);
    setAuthStatus('unauthenticated');
    clearStoredAuthContext();
    // Also remove code from URL to prevent re-login loop on refresh
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const handleSelectRole = (selectedRole: UserRole) => {
    if (selectedRole === UserRole.FARMER) {
      // Mock: เกษตรกรไปหน้าแรกเลย (สำหรับนักพัฒนาออกแบบต่อเติม)
      // TODO: เปลี่ยนเป็นระบบจริงเมื่อพร้อม (ตรวจสอบการลงทะเบียน, LINE Login)
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
    // ล้าง stored auth context หลังจากเข้าสู่ระบบสำเร็จ
    clearStoredAuthContext();
  };

  const handleSubmitRegistration = (farmerData?: any) => {
    try {
      // บันทึกข้อมูลเกษตรกรใน memory
      if (farmerData) {
        console.log('Saving farmer registration data:', farmerData);
        saveFarmerRegistration(farmerData);
        
        // ตรวจสอบว่าข้อมูลถูกบันทึกแล้ว
        const savedData = getApprovedFarmer();
        console.log('Saved farmer data:', savedData);
      }
      
      // หลังจากสมัครสมาชิกสำเร็จ ให้ไปที่ FarmerDashboard
      setRole(UserRole.FARMER);
      setAuthStatus('authenticated');
      setRegistrationStatus(null);
      
      // แจ้งให้ระบบรีเฟรชข้อมูล
      window.dispatchEvent(new CustomEvent('farmerRegistrationUpdated'));
    } catch (error) {
      console.error('Error saving farmer registration:', error);
      // แม้จะเกิดข้อผิดพลาดก็ยังให้ไปหน้า Dashboard
      setRole(UserRole.FARMER);
      setAuthStatus('authenticated');
      setRegistrationStatus(null);
    }
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
      return <Login 
                role={showLogin} 
                onLoginSuccess={handleLoginSuccess} 
                onBack={isDirectLogin ? undefined : handleLogout} 
                isDirectLogin={isDirectLogin}
              />;
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
