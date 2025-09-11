// features/auth/FarmerRegistration.tsx
// คอมโพเนนต์สำหรับหน้าสมัครสมาชิกของเกษตรกร

import React, { useState, ChangeEvent } from 'react';
import * as Icons from '../../constants';
import { LineProfile } from '../../types';
import { knowledgeArticles } from '../../data/mockData';
import PolicyModal from '../../components/PolicyModal';

export type RegistrationStatus = 'registering' | 'pending' | 'not_approved';

// Props
interface FarmerRegistrationProps {
    onBackToRoleSelector: () => void;
    status: RegistrationStatus;
    onSubmit: () => void;
    onRetry: () => void;
    policyContent: string;
    termsContent: string;
    lineProfile?: LineProfile | null; // Add optional prop for LINE data
}


// Helper InputField component
const InputField: React.FC<{ label: string, name: string, value: string, onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void, type?: string, required?: boolean, placeholder?: string, children?: React.ReactNode }> = ({ label, name, value, onChange, type = 'text', required = true, placeholder, children }) => (
    <div className="w-full">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
        {type === 'select' ? (
            <div className="relative">
                <select id={name} name={name} value={value} onChange={onChange} className="w-full appearance-none bg-white border border-gray-300 rounded-md py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-400" required={required}>
                    {children}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    {/* ปรับขนาดไอคอน Polygon 1 ให้เล็กลง 10% */}
                    <svg width="14.4" height="9.9" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="0,0 16,0 8,11" fill="#0A4A5A" />
                    </svg>
                </div>
            </div>
        ) : (
            <input type={type} id={name} name={name} value={value} onChange={onChange} className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-400 placeholder:text-[14px] placeholder:font-light placeholder:text-gray-400" placeholder={placeholder} required={required} />
        )}
    </div>
);

// Helper CustomCheckbox component - Now acts as a modal trigger
const CustomCheckbox: React.FC<{ label: string, checked: boolean, onClick: () => void }> = ({ label, checked, onClick }) => (
    <div onClick={onClick} className="flex items-center cursor-pointer ml-0 group">
        <div className="relative">
            <div className={`w-5 h-5 flex-shrink-0 flex items-center justify-center`}>
                {checked ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="8" cy="8" r="8" fill="#53B847"/>
                        <path d="M4 8.5L7 11.5L12 6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="8" cy="8" r="8" fill="#E5E7EB"/>
                    </svg>
                )}
            </div>
        </div>
        <span className="ml-3 text-sm text-gray-700 underline group-hover:text-sky-600">
            {label}
        </span>
    </div>
);

const FarmerRegistration: React.FC<FarmerRegistrationProps> = ({ onBackToRoleSelector, status, onSubmit, onRetry, policyContent, termsContent, lineProfile }) => {
    // Function to split a full name into first and last names
    const splitName = (fullName: string | undefined) => {
        if (!fullName) return { firstName: '', lastName: '' };
        const parts = fullName.split(' ');
        const lastName = parts.pop() || '';
        const firstName = parts.join(' ');
        return { firstName, lastName };
    };

    const [formData, setFormData] = useState({
        title: '',
        // Pre-fill name from LINE profile if available
        firstName: splitName(lineProfile?.displayName).firstName,
        lastName: splitName(lineProfile?.displayName).lastName,
        phone: '',
        email: '',
    });
    
    const [privacyAck, setPrivacyAck] = useState(false);
    const [termsAck, setTermsAck] = useState(false);
    const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | null>(null);

    const handleRetryClick = () => {
        onRetry();
    };
    
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const isFormValid = formData.title && formData.firstName && formData.lastName && formData.phone && privacyAck && termsAck;
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid) {
            onSubmit();
        }
    };
    
    const handleAcceptPolicy = () => {
        if (activeModal === 'privacy') {
            setPrivacyAck(true);
        } else if (activeModal === 'terms') {
            setTermsAck(true);
        }
    };

    const getModalTitle = () => {
        if (activeModal === 'privacy') return 'นโยบายความเป็นส่วนบุคคล';
        if (activeModal === 'terms') return 'เงื่อนไขและข้อตกลง';
        return '';
    };
    
    const getModalContent = () => {
        if (activeModal === 'privacy') return policyContent;
        if (activeModal === 'terms') return termsContent;
        return '';
    };


    // Render status pages if registration is not in 'registering' state
    if (status === 'pending' || status === 'not_approved') {
        return (
             <div className="min-h-screen bg-slate-100 p-4 sm:p-8 flex items-center justify-center">
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 w-full max-w-4xl">
                    <div className="text-center font-bold text-2xl mb-8 text-slate-800">
                        สถานะการสมัคร
                    </div>
                    {status === 'pending' && (
                        <div className="py-8 text-center space-y-6">
                            <div>
                                <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 bg-amber-100 border-amber-400 mx-auto">
                                    <Icons.ClockIcon className="w-8 h-8 text-amber-600"/>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mt-4">ส่งข้อมูลการสมัครเรียบร้อย</h2>
                                <p className="mt-2 text-slate-600 max-w-md mx-auto">
                                    เราได้รับข้อมูลของท่านแล้ว และจะดำเนินการตรวจสอบโดยเร็วที่สุด ท่านจะได้รับการแจ้งเตือนเมื่อการสมัครได้รับการอนุมัติ
                                </p>
                            </div>
                            <div className="max-w-2xl mx-auto">
                                <h3 className="font-bold text-slate-800 mb-4">ระหว่างรออนุมัติ สามารถศึกษาข้อมูลของเรา</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {knowledgeArticles.slice(0, 2).map(article => (
                                        <div key={article.id} className="bg-[#F7F6E8] rounded-2xl p-4 border-2 border-black flex flex-col">
                                            <img src={article.imageUrl} alt={article.title} className="w-full h-32 object-cover rounded-lg mb-4"/>
                                            <h3 className="font-bold text-sm text-slate-800 flex-grow mb-4">{article.title}</h3>
                                            <button disabled className="w-full bg-[#FEEA7E] text-black font-bold py-2 text-sm rounded-lg border-2 border-black mt-auto opacity-50 cursor-not-allowed">
                                                อ่านเพิ่มเติม
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                             <button onClick={onBackToRoleSelector} className="mt-8 bg-slate-200 hover:bg-slate-300 text-black font-bold py-2 px-6 rounded-lg transition-colors">กลับสู่หน้าหลัก</button>
                        </div>
                    )}
                    {status === 'not_approved' && (
                        <div className="py-10">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 bg-red-100 border-red-400 mx-auto">
                                   <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                </div>
                                <h2 className="text-2xl font-bold text-red-700 mt-4">การสมัครไม่ได้รับอนุมัติ</h2>
                                <p className="mt-2 text-slate-600">
                                    พบข้อผิดพลาดบางประการในข้อมูลการสมัครของคุณ กรุณาตรวจสอบและแก้ไขตามรายการด้านล่าง
                                </p>
                            </div>
                            <div className="mt-8 max-w-lg mx-auto bg-amber-50 p-4 rounded-lg border border-amber-200">
                                <h3 className="font-bold text-slate-900 mb-2">รายการที่ต้องแก้ไขจากแอดมิน:</h3>
                                <ul className="list-disc list-inside space-y-1 text-sm text-slate-800">
                                    <li>เอกสารสิทธิ์ในที่ดินไม่ชัดเจน โปรดอัปโหลดใหม่</li>
                                    <li>กรุณาตรวจสอบพิกัดแปลงปลูกอีกครั้ง</li>
                                </ul>
                            </div>
                            <div className="mt-8 text-center">
                                <button onClick={handleRetryClick} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">แก้ไขข้อมูลและส่งใหม่</button>
                            </div>
                        </div>
                    )}
                </div>
             </div>
        );
    }

    // New Registration Form UI
    return (
        <>
            <div 
                className="min-h-screen flex items-center justify-center p-4 relative bg-cover bg-center"
                style={{
                    backgroundImage: "linear-gradient(180deg, rgba(0,85,150,0.7) 0%, rgba(0,128,194,0.7) 40%, rgba(0,170,238,0.7) 100%), url('/images/banners/ดีไซน์ที่ยังไม่ได้ตั้งชื่อ (1) 3.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            >
                <div className="absolute inset-0" style={{opacity: 0.3}}></div>

                <div className="relative bg-white/95 backdrop-blur-md px-6 py-2 sm:px-8 sm:py-3 shadow-2xl w-full max-w-md border border-blue-100/50 flex flex-col justify-center" style={{ borderRadius: '10px', minHeight: '20%' }}>
                    <div className="flex justify-center mb-4" style={{ marginTop: '5%' }}>
                        <img src="/images/logos/LOGO_CMYK_ART_PRECISE (Original)_Precise 1.png" alt="Precise Logo" className="h-12 w-auto" />
                    </div>
                    <h2 className="text-[18px] font-medium text-gray-800 mb-4 text-left">ข้อมูลส่วนตัว</h2>
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <InputField label="คำนำหน้าชื่อ" name="title" value={formData.title} onChange={handleChange} type="select">
                            <option value="" disabled>กรุณาเลือก</option>
                            <option value="นาย">นาย</option>
                            <option value="นาง">นาง</option>
                            <option value="นางสาว">นางสาว</option>
                        </InputField>

                        <InputField label="ชื่อ" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="กรอกชื่อ" />
                        <InputField label="นามสกุล" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="กรอกนามสกุล" />
                        <InputField label="เบอร์โทร" name="phone" value={formData.phone} onChange={handleChange} placeholder="กรอกเบอร์โทร" />
                        <InputField label="อีเมล" name="email" value={formData.email} onChange={handleChange} placeholder="ABC@example.com" required={false} />

                        <div className="space-y-3 pt-0">
                           <CustomCheckbox 
                                label="รับทราบนโยบายความเป็นส่วนบุคคล" 
                                checked={privacyAck} 
                                onClick={() => !privacyAck && setActiveModal('privacy')} 
                            />
                            <CustomCheckbox 
                                label="ยอมรับเงื่อนไขและข้อตกลง" 
                                checked={termsAck} 
                                onClick={() => !termsAck && setActiveModal('terms')}
                            />
                        </div>

                        <div className="pt-1 space-y-3" style={{ marginBottom: 'calc(15% + 5px)' }}>
                            <button 
                                type="submit" 
                                disabled={!isFormValid} 
                                className="bg-gray-200 text-gray-500 font-bold transition-colors duration-300 disabled:cursor-not-allowed"
                                style={{
                                    width: '166px',
                                    height: '35px',
                                    backgroundColor: isFormValid ? '#53B847' : '#E5E7EB',
                                    color: isFormValid ? '#FFFFFF' : '#6B7280',
                                    margin: '0 auto',
                                    display: 'block',
                                    borderRadius: '5px'
                                }}
                                onMouseEnter={(e) => {
                                    if (isFormValid) {
                                        e.currentTarget.style.backgroundColor = '#4A9F3F';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (isFormValid) {
                                        e.currentTarget.style.backgroundColor = '#53B847';
                                    }
                                }}
                            >
                                บันทึก
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            <PolicyModal 
                isOpen={!!activeModal}
                onClose={() => setActiveModal(null)}
                onAccept={handleAcceptPolicy}
                title={getModalTitle()}
                content={getModalContent()}
            />
        </>
    );
};

export default FarmerRegistration;
