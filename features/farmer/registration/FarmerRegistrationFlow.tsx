// features/farmer/registration/FarmerRegistrationFlow.tsx
// คอมโพเนนต์สำหรับจัดการกระบวนการลงทะเบียนเข้าร่วมโครงการทั้งหมด

import React, { useState, useEffect, ChangeEvent, useRef } from 'react';
import * as Icons from '../../../constants';
import { thailandAddressData } from '../../../data/thailandAddressData';
import SearchableSelect from '../../../components/SearchableSelect';

// Props
interface FarmerRegistrationFlowProps {
    onBackToDashboard: () => void;
    onSubmitSuccess: () => void;
    isEditMode?: boolean;
}

// Interfaces
interface FormData {
    personal: { [key: string]: string };
    plot: { [key: string]: string };
}
interface UploadedFiles {
    idCard: File | null;
    landDeed: File[];
}
interface FilePreviews {
    idCard: string | null;
    landDeed: string[];
}

// Constants
const STEPS = [
    { id: 1, label: 'ข้อมูลส่วนตัว', icon: '/Vector (1).png' },
    { id: 2, label: 'ข้อมูลแปลงปลูก', icon: '/Vector (3).png' },
    { id: 3, label: 'เพิ่มเอกสาร', icon: '/Vector (2).png' },
    { id: 4, label: 'ขั้นตอนสำเร็จ', icon: '/icon-park-solid_list-success.png' },
];
const INITIAL_FORM_DATA: FormData = {
    personal: {
        title: '', firstName: '', lastName: '', phone: '', email: '',
        houseNumber: '', moo: '', street: '',
        province: '', district: '', subdistrict: '', postalCode: '',
    },
    plot: {
        areaSize: '', areaUnit: 'ไร่', prevCrops: '', deedType: '',
        houseNumber: '', moo: '',
        province: '', district: '', subdistrict: '', postalCode: '',
    },
};

// =================================================================
// Sub-components
// =================================================================



const StepperHeader: React.FC<{ currentStep: number; isSubmitted?: boolean }> = ({ currentStep, isSubmitted = false }) => (
    <div className="flex items-center w-full px-4">
        {STEPS.map((step, index) => (
            <React.Fragment key={step.id}>
                <div className="flex flex-col items-center text-center flex-1 space-y-1.5">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                        ${currentStep > step.id || (isSubmitted && step.id === 4) ? 'bg-white border-white' :
                        currentStep === step.id ? 'bg-transparent border-white' :
                        'bg-transparent border-white/50'
                    }`}>
                        {currentStep > step.id || (isSubmitted && step.id === 4) ? (
                            <Icons.CheckIcon className="w-7 h-7 text-green-500" />
                        ) : (
                            <img 
                                src={step.icon} 
                                alt={step.label}
                                className={`w-4 h-4 transition-opacity ${currentStep === step.id ? 'opacity-100' : 'opacity-50'}`}
                            />
                        )}
                    </div>
                    <p className={`text-xs font-semibold transition-colors text-center leading-tight whitespace-nowrap ${currentStep >= step.id || (isSubmitted && step.id === 4) ? 'text-white' : 'text-white/50'}`} style={{ fontSize: '10px' }}>
                        {step.label}
                    </p>
                </div>
                {index < STEPS.length - 1 && (
                    <div className={`h-0.5 transition-colors duration-300 ${
                        currentStep >= step.id + 1 || (isSubmitted && step.id === 4) ? 'bg-white' : 'bg-white/50'
                    }`} style={{ 
                        width: '37px',
                        marginLeft: '-18.5px',
                        marginRight: '-18.5px',
                        marginTop: '-14.4px'
                    }}></div>
                )}
            </React.Fragment>
        ))}
    </div>
);

const InputField: React.FC<{ label: string; name: string; value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void; placeholder: string; required?: boolean; disabled?: boolean; }> = 
({ label, name, value, onChange, placeholder, required = true, disabled = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-bold text-slate-800 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input type="text" id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} disabled={disabled}
            className={`w-full p-3 border border-gray-300 rounded-lg bg-white text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        />
    </div>
);

const SelectField: React.FC<{ label: string; name: string; value: string; onChange: (e: ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode; required?: boolean; }> = 
({ label, name, value, onChange, children, required = true }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-bold text-slate-800 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            <select id={name} name={name} value={value} onChange={onChange} required={required}
                className={`w-full p-3 pr-10 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none ${value ? '' : 'text-slate-400'}`}
            >
                {children}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <img src="/Polygon 1.png" alt="dropdown" className="w-2 h-2" />
            </div>
        </div>
    </div>
);

const SearchableSelectField: React.FC<{ label: string; options: { value: string; label: string }[]; value: string; onChange: (value: string) => void; placeholder: string; disabled?: boolean; required?: boolean; }> = 
({ label, options, value, onChange, placeholder, disabled = false, required = true }) => (
    <div>
        <label className="block text-sm font-bold text-slate-800 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <SearchableSelect options={options} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} />
    </div>
);

// Helper function to check file type and extract URL
const getFileInfo = (preview: string): { url: string; type: 'image' | 'pdf'; filename?: string } => {
    // Check if it contains file type info (format: "url|type|filename")
    if (preview.includes('|')) {
        const parts = preview.split('|');
        const [url, type, filename] = parts;
        
        // Check if it's PDF by file type or filename
        const isPdf = type === 'application/pdf' || 
                     type.includes('pdf') || 
                     filename?.toLowerCase().endsWith('.pdf');
        
        return {
            url,
            type: isPdf ? 'pdf' : 'image',
            filename: filename || 'Unknown file'
        };
    }
    
    // Fallback for old format
    if (preview.startsWith('data:application/pdf')) {
        return { url: preview, type: 'pdf', filename: 'PDF Document' };
    }
    
    return { url: preview, type: 'image', filename: 'Image File' };
};

const FileUploadCard: React.FC<{ title: string; description: string; preview: string | null; onChange: (e: ChangeEvent<HTMLInputElement>) => void; onRemove: () => void; }> = 
({ title, description, preview, onChange, onRemove }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [pdfLoadError, setPdfLoadError] = useState(false);
    return (
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <h3 className="text-xl font-bold text-slate-800">{title}</h3>
            <p className="text-sm text-slate-500 mt-1 mb-0">{description}</p>
            <div className="w-full h-15 rounded-lg flex items-start justify-center relative pt-2.5">
                {preview ? (
                    <>
                        {(() => {
                            const fileInfo = getFileInfo(preview);
                            return fileInfo.type === 'image' ? (
                                <img src={fileInfo.url} alt="Preview" className="w-full h-full object-contain rounded-lg p-2" />
                            ) : (
                                <div className="w-full h-full bg-gray-50 rounded-lg border-2 border-gray-200 overflow-hidden">
                                    {/* PDF Preview Header */}
                                    <div className="bg-red-600 text-white p-3 flex items-center justify-between rounded-t-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className="text-sm font-bold">PDF #1</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="text-xs bg-red-700 px-3 py-1.5 rounded-full font-medium" title={fileInfo.filename}>
                                                {fileInfo.filename?.split('.')[0]?.substring(0, 8) || 'PDF'}
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={onRemove} 
                                                className="w-6 h-6 bg-red-700 hover:bg-red-800 rounded-full flex items-center justify-center transition-colors"
                                            >
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* PDF Content Preview - แสดง PDF จริง */}
                                    <div className="bg-white p-4 rounded-b-lg" style={{ minHeight: '250px' }}>
                                        {!pdfLoadError ? (
                                            <div className="w-full h-full border border-gray-200 rounded-lg overflow-hidden">
                                                <iframe 
                                                    src={fileInfo.url} 
                                                    className="w-full h-full border-0"
                                                    style={{ minHeight: '200px' }}
                                                    title={`PDF Preview - ${fileInfo.filename}`}
                                                    onError={() => setPdfLoadError(true)}
                                                    onLoad={() => setPdfLoadError(false)}
                                                >
                                                </iframe>
                                            </div>
                                        ) : (
                                            <div className="w-full h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-6" style={{ minHeight: '200px' }}>
                                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                                    <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <h4 className="text-lg font-semibold text-gray-700 mb-2">ไม่สามารถแสดง PDF ได้</h4>
                                                <p className="text-sm text-gray-500 mb-4 text-center">กรุณาใช้ตัวเลือกด้านล่างเพื่อดูไฟล์</p>
                                                <div className="flex gap-3">
                                                    <a 
                                                        href={fileInfo.url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                                    >
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                        เปิดไฟล์ PDF
                                                    </a>
                                                    <button 
                                                        onClick={() => window.open(fileInfo.url, '_blank')}
                                                        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                                                    >
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                        ดาวน์โหลด
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })()}
                    </>
                ) : (
                    <button type="button" onClick={() => inputRef.current?.click()} className="bg-white border border-[#8CC63F] text-[#8CC63F] hover:bg-green-50 font-bold text-sm py-2.5 px-4 transition-colors flex items-center justify-center gap-2" style={{ borderRadius: '5px' }}>
                        <Icons.PlusIcon className="w-4 h-4" />
                        อัปโหลดเอกสาร
                    </button>
                )}
                <input type="file" ref={inputRef} onChange={onChange} className="hidden" accept="image/jpeg, image/png, application/pdf" />
            </div>
        </div>
    );
};

const MultiFileUploadCard: React.FC<{ 
    title: string; 
    description: string; 
    previews: string[]; 
    onAddFile: (e: ChangeEvent<HTMLInputElement>) => void; 
    onRemoveFile: (index: number) => void; 
}> = ({ title, description, previews, onAddFile, onRemoveFile }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [pdfLoadErrors, setPdfLoadErrors] = useState<boolean[]>([]);

    // Reset PDF load errors when previews change
    useEffect(() => {
        setPdfLoadErrors(new Array(previews.length).fill(false));
    }, [previews.length]);

    return (
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <h3 className="text-xl font-bold text-slate-800">{title}</h3>
            <p className="text-sm text-slate-500 mt-1 mb-0">{description}</p>
            
            {previews.length === 0 ? (
                <div className="w-full h-15 rounded-lg flex items-start justify-center relative pt-2.5">
                    <button type="button" onClick={() => inputRef.current?.click()} className="bg-white border border-[#8CC63F] text-[#8CC63F] hover:bg-green-50 font-bold text-sm py-2.5 px-4 transition-colors flex items-center justify-center gap-2" style={{ borderRadius: '5px' }}>
                        <Icons.PlusIcon className="w-4 h-4" />
                        อัปโหลดเอกสาร
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {previews.map((preview, index) => (
                        <div key={index} className="relative w-full h-15 bg-gray-100 rounded-lg border-2 border-gray-200">
                            {(() => {
                                const fileInfo = getFileInfo(preview);
                                return fileInfo.type === 'image' ? (
                                    <img src={fileInfo.url} alt={`Preview ${index + 1}`} className="w-full h-full object-contain rounded-lg p-2" />
                                ) : (
                                    <div className="w-full h-full bg-gray-50 rounded-lg border-2 border-gray-200 overflow-hidden">
                                        {/* PDF Preview Header */}
                                        <div className="bg-red-600 text-white p-3 flex items-center justify-between rounded-t-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <span className="text-sm font-bold">PDF #{index + 1}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="text-xs bg-red-700 px-2 py-1 rounded-full font-medium" title={fileInfo.filename}>
                                                    {fileInfo.filename?.split('.')[0]?.substring(0, 6) || 'PDF'}
                                                </div>
                                                <button 
                                                    type="button" 
                                                    onClick={() => onRemoveFile(index)} 
                                                    className="w-5 h-5 bg-red-700 hover:bg-red-800 rounded-full flex items-center justify-center transition-colors"
                                                >
                                                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        {/* PDF Content Preview - แสดง PDF จริง */}
                                        <div className="bg-white p-3 rounded-b-lg" style={{ minHeight: '180px' }}>
                                            {!pdfLoadErrors[index] ? (
                                                <div className="w-full h-full border border-gray-200 rounded-lg overflow-hidden">
                                                    <iframe 
                                                        src={fileInfo.url} 
                                                        className="w-full h-full border-0"
                                                        style={{ minHeight: '150px' }}
                                                        title={`PDF Preview - ${fileInfo.filename}`}
                                                        onError={() => {
                                                            const newErrors = [...pdfLoadErrors];
                                                            newErrors[index] = true;
                                                            setPdfLoadErrors(newErrors);
                                                        }}
                                                        onLoad={() => {
                                                            const newErrors = [...pdfLoadErrors];
                                                            newErrors[index] = false;
                                                            setPdfLoadErrors(newErrors);
                                                        }}
                                                    >
                                                    </iframe>
                                                </div>
                                            ) : (
                                                <div className="w-full h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-4" style={{ minHeight: '150px' }}>
                                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
                                                        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <h5 className="text-sm font-semibold text-gray-700 mb-1">ไม่สามารถแสดง PDF ได้</h5>
                                                    <p className="text-xs text-gray-500 mb-3 text-center">กรุณาใช้ตัวเลือกด้านล่างเพื่อดูไฟล์</p>
                                                    <div className="flex gap-2">
                                                        <a 
                                                            href={fileInfo.url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
                                                        >
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                            เปิดไฟล์
                                                        </a>
                                                        <button 
                                                            onClick={() => window.open(fileInfo.url, '_blank')}
                                                            className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 transition-colors flex items-center gap-1"
                                                        >
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                            ดาวน์โหลด
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    ))}
                    <div className="flex justify-center">
                        <button type="button" onClick={() => inputRef.current?.click()} className="bg-white border border-[#8CC63F] text-[#8CC63F] hover:bg-green-50 font-bold text-sm py-2.5 px-4 transition-colors flex items-center justify-center gap-2" style={{ borderRadius: '5px' }}>
                            <Icons.PlusIcon className="w-4 h-4" />
                            อัปโหลดเอกสาร
                        </button>
                    </div>
                </div>
            )}
            
            <input type="file" ref={inputRef} onChange={onAddFile} className="hidden" accept="image/jpeg, image/png, application/pdf" />
        </div>
    );
};

const SummaryItem: React.FC<{label: string, value: string | undefined | React.ReactNode}> = ({label, value}) => (
    value ? <div className="grid grid-cols-3 gap-2"><span className="font-semibold text-slate-600 col-span-1">{label}:</span> <span className="col-span-2">{value}</span></div> : null
);

// Modal for success or confirmation
const ActionModal: React.FC<{
    type: 'success' | 'cancelConfirm';
    onClose: () => void;
    onConfirm: () => void;
}> = ({ type, onClose, onConfirm }) => {
    if (type === 'success') {
        return (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-sm w-full">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto border-4 border-green-500">
                        <Icons.CheckIcon className="w-10 h-10 text-green-500" strokeWidth={3}/>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mt-6">บันทึกข้อมูลเรียบร้อย</h2>
                    <p className="text-slate-600 mt-2 text-sm">
                        ข้อมูลที่คุณแก้ไขถูกบันทึกเรียบร้อยแล้ว กรุณารอแอดมินตรวจสอบข้อมูลอีกครั้ง
                    </p>
                    <div className="mt-8">
                        <button
                            onClick={onConfirm}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
                        >
                            ตกลง
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'cancelConfirm') {
        return (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] p-4">
                 <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-sm w-full">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto border-4 border-red-500">
                        <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mt-6">คุณต้องการยกเลิกการแก้ไขหรือไม่?</h2>
                    <p className="text-slate-600 mt-2 text-sm">
                        หากกดยืนยัน ข้อมูลที่คุณแก้ไขจะไม่ถูกบันทึก และคุณจะต้องเริ่มใหม่อีกครั้ง
                    </p>
                    <div className="mt-8 flex gap-4">
                        <button
                            onClick={onClose}
                            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-colors"
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={onConfirm}
                            className="w-full bg-white hover:bg-slate-100 text-red-600 font-bold py-3 rounded-lg transition-colors border-2 border-red-500"
                        >
                            ยืนยัน
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

// =================================================================
// Main Component
// =================================================================
const FarmerRegistrationFlow: React.FC<FarmerRegistrationFlowProps> = ({ onBackToDashboard, onSubmitSuccess, isEditMode = false }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
    const [files, setFiles] = useState<UploadedFiles>({ idCard: null, landDeed: [] });
    const [previews, setPreviews] = useState<FilePreviews>({ idCard: null, landDeed: [] });
    const [isStepValid, setIsStepValid] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [modalState, setModalState] = useState<'none' | 'success' | 'cancelConfirm'>('none');

    // Cleanup URL objects on unmount
    useEffect(() => {
        return () => {
            // Cleanup idCard URL
            if (previews.idCard && previews.idCard.includes('blob:')) {
                const url = previews.idCard.split('|')[0];
                URL.revokeObjectURL(url);
            }
            // Cleanup landDeed URLs
            previews.landDeed.forEach(preview => {
                if (preview && preview.includes('blob:')) {
                    const url = preview.split('|')[0];
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [previews]);

    // Form change handler
    const handleChange = (form: 'personal' | 'plot', e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [form]: { ...prev[form], [name]: value } }));
    };

    const handleAddressChange = (form: 'personal' | 'plot', field: 'province' | 'district' | 'subdistrict', value: string) => {
        setFormData(prev => {
            const newAddress = { ...prev[form], [field]: value };
            if (field === 'province') { newAddress.district = ''; newAddress.subdistrict = ''; newAddress.postalCode = ''; }
            if (field === 'district') { newAddress.subdistrict = ''; newAddress.postalCode = ''; }
            if (field === 'subdistrict') {
                newAddress.postalCode = thailandAddressData[newAddress.province]?.[newAddress.district]?.[value] || '';
            }
            return { ...prev, [form]: newAddress };
        });
    };
    
    // File upload handlers
    const handleSingleFileChange = (type: 'idCard', e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFiles(prev => ({...prev, [type]: file}));
            // Use URL.createObjectURL for better PDF preview support
            const fileUrl = URL.createObjectURL(file);
            // Store file type info and filename for better detection
            const fileInfo = `${fileUrl}|${file.type}|${file.name}`;
            setPreviews(prev => ({...prev, [type]: fileInfo}));
        }
    };

    const handleAddLandDeed = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFiles(prev => ({...prev, landDeed: [...prev.landDeed, file]}));
            // Use URL.createObjectURL for better PDF preview support
            const fileUrl = URL.createObjectURL(file);
            // Store file type info and filename for better detection
            const fileInfo = `${fileUrl}|${file.type}|${file.name}`;
            setPreviews(prev => ({...prev, landDeed: [...prev.landDeed, fileInfo]}));
        }
        if (e.target) {
            e.target.value = '';
        }
    };

    const handleRemoveLandDeed = (indexToRemove: number) => {
        setFiles(prev => ({...prev, landDeed: prev.landDeed.filter((_, index) => index !== indexToRemove)}));
        setPreviews(prev => ({...prev, landDeed: prev.landDeed.filter((_, index) => index !== indexToRemove)}));
    };
    
    // Validation logic
    useEffect(() => {
        let isValid = false;
        if (step === 1) {
            const { title, firstName, lastName, phone, houseNumber, province, district, subdistrict, postalCode } = formData.personal;
            isValid = !!(title && firstName && lastName && phone && houseNumber && province && district && subdistrict && postalCode);
        } else if (step === 2) {
            const { areaSize, areaUnit, prevCrops, deedType, houseNumber, province, district, subdistrict, postalCode } = formData.plot;
            isValid = !!(areaSize && areaUnit && prevCrops && deedType && houseNumber && province && district && subdistrict && postalCode);
        } else if (step === 3) {
            isValid = !!(files.idCard && files.landDeed.length > 0);
        } else if (step === 4) {
            isValid = true;
        }
        setIsStepValid(isValid);
    }, [step, formData, files]);

    // Navigation
    const nextStep = () => setStep(s => Math.min(s + 1, STEPS.length));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));
    
    const handleFinalSubmit = () => {
        setIsSubmitted(true);
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                             <h3 className="text-xl font-bold text-slate-800 text-center">ข้อมูลส่วนตัว</h3>
                             <SelectField label="คำนำหน้าชื่อ" name="title" value={formData.personal.title} onChange={e => handleChange('personal', e)}><option value="" disabled>กรุณาเลือก</option><option>นาย</option><option>นาง</option><option>นางสาว</option></SelectField>
                             <InputField label="ชื่อ" name="firstName" value={formData.personal.firstName} onChange={e => handleChange('personal', e)} placeholder="กรอกชื่อ" />
                             <InputField label="นามสกุล" name="lastName" value={formData.personal.lastName} onChange={e => handleChange('personal', e)} placeholder="กรอกนามสกุล" />
                             <InputField label="เบอร์โทร" name="phone" value={formData.personal.phone} onChange={e => handleChange('personal', e)} placeholder="กรอกเบอร์โทร" />
                             <InputField label="อีเมล" name="email" value={formData.personal.email} onChange={e => handleChange('personal', e)} placeholder="อีเมล (ไม่บังคับ)" required={false} />
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                             <h3 className="text-xl font-bold text-slate-800 text-center">ที่อยู่</h3>
                             <InputField label="บ้านเลขที่" name="houseNumber" value={formData.personal.houseNumber} onChange={e => handleChange('personal', e)} placeholder="xx/xxx" />
                             <InputField label="หมู่ที่" name="moo" value={formData.personal.moo} onChange={e => handleChange('personal', e)} placeholder="กรอกหมู่ที่" required={false} />
                             <InputField label="ถนน" name="street" value={formData.personal.street} onChange={e => handleChange('personal', e)} placeholder="กรอกชื่อถนน" required={false}/>
                             <SearchableSelectField label="จังหวัด" options={Object.keys(thailandAddressData).map(p=>({value:p, label:p}))} value={formData.personal.province} onChange={val => handleAddressChange('personal', 'province', val)} placeholder="เลือกจังหวัด" />
                             <SearchableSelectField label="อำเภอ/เขต" options={Object.keys(thailandAddressData[formData.personal.province]||{}).map(d=>({value:d, label:d}))} value={formData.personal.district} onChange={val => handleAddressChange('personal', 'district', val)} placeholder="เลือกอำเภอ" disabled={!formData.personal.province} />
                             <SearchableSelectField label="ตำบล/แขวง" options={Object.keys(thailandAddressData[formData.personal.province]?.[formData.personal.district]||{}).map(s=>({value:s, label:s}))} value={formData.personal.subdistrict} onChange={val => handleAddressChange('personal', 'subdistrict', val)} placeholder="เลือกตำบล" disabled={!formData.personal.district} />
                             <InputField label="รหัสไปรษณีย์" name="postalCode" value={formData.personal.postalCode} onChange={()=>{}} placeholder="รหัสไปรษณีย์" disabled={true}/>
                        </div>
                    </div>
                );
            case 2:
                 return (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                            <h3 className="text-xl font-bold text-slate-800 text-center">ข้อมูลแปลงปลูก</h3>
                            <div className="flex items-end gap-2">
                                <div className="flex-grow">
                                    <InputField label="จำนวนไร่ที่เข้าร่วมโครงการ" name="areaSize" value={formData.plot.areaSize} onChange={e => handleChange('plot', e)} placeholder="10" />
                                </div>
                                <div className="w-2/5">
                                    <SelectField label="หน่วย" name="areaUnit" value={formData.plot.areaUnit} onChange={e => handleChange('plot', e)}>
                                        <option>ไร่</option><option>งาน</option><option>ตารางวา</option>
                                    </SelectField>
                                </div>
                            </div>
                            <InputField label="พืชที่เคยปลูกในระยะเวลา 5 ปีย้อนหลัง" name="prevCrops" value={formData.plot.prevCrops} onChange={e => handleChange('plot', e)} placeholder="กรอกข้อมูล" />
                            <SelectField label="ประเภทโฉนดที่เข้าร่วม" name="deedType" value={formData.plot.deedType} onChange={e => handleChange('plot', e)}>
                                <option value="" disabled>กรุณาเลือก</option><option>โฉนดที่ดิน (น.ส. 4)</option><option>หนังสือรับรองการทำประโยชน์ (น.ส. 3 ก.)</option><option>อื่นๆ</option>
                            </SelectField>
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                            <h3 className="text-xl font-bold text-slate-800 text-center">ที่อยู่แปลงปลูก</h3>
                             <InputField label="บ้านเลขที่" name="houseNumber" value={formData.plot.houseNumber} onChange={e => handleChange('plot', e)} placeholder="xx/xxx" />
                             <InputField label="หมู่ที่" name="moo" value={formData.plot.moo} onChange={e => handleChange('plot', e)} placeholder="กรอกหมู่ที่" required={false} />
                             <SearchableSelectField label="จังหวัด" options={Object.keys(thailandAddressData).map(p=>({value:p, label:p}))} value={formData.plot.province} onChange={val => handleAddressChange('plot', 'province', val)} placeholder="เลือกจังหวัด" />
                             <SearchableSelectField label="อำเภอ/เขต" options={Object.keys(thailandAddressData[formData.plot.province]||{}).map(d=>({value:d, label:d}))} value={formData.plot.district} onChange={val => handleAddressChange('plot', 'district', val)} placeholder="เลือกอำเภอ" disabled={!formData.plot.province} />
                             <SearchableSelectField label="ตำบล/แขวง" options={Object.keys(thailandAddressData[formData.plot.province]?.[formData.plot.district]||{}).map(s=>({value:s, label:s}))} value={formData.plot.subdistrict} onChange={val => handleAddressChange('plot', 'subdistrict', val)} placeholder="เลือกตำบล" disabled={!formData.plot.district} />
                             <InputField label="รหัสไปรษณีย์" name="postalCode" value={formData.plot.postalCode} onChange={()=>{}} placeholder="รหัสไปรษณีย์" disabled={true}/>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <FileUploadCard 
                            title="สำเนาบัตรประชาชน" 
                            description="นามสกุลไฟล์ .JPG, .PDF เท่านั้น" 
                            preview={previews.idCard} 
                            onChange={(e) => handleSingleFileChange('idCard', e)} 
                            onRemove={() => { setFiles(p => ({...p, idCard: null})); setPreviews(p => ({...p, idCard: null})); }} 
                        />
                        <MultiFileUploadCard 
                            title="โฉนดที่ดิน" 
                            description="นามสกุลไฟล์ .JPG, .PDF เท่านั้น และขนาดไม่เกิน 5 MB (อัพโหลดได้มากกว่า 1 เอกสาร)"
                            previews={previews.landDeed} 
                            onAddFile={handleAddLandDeed} 
                            onRemoveFile={handleRemoveLandDeed} 
                        />
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-6">
                        {!isSubmitted ? (
                            // หน้าตรวจสอบข้อมูล
                            <div className="text-sm text-slate-800">
                                <div className="bg-white rounded-xl shadow-md p-6">
                                    <h3 className="text-xl font-bold text-slate-800 text-center mb-4">ตรวจสอบข้อมูล</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-bold text-lg mb-2 border-b pb-1">ข้อมูลส่วนตัว</h4>
                                            <SummaryItem label="ชื่อ-สกุล" value={`${formData.personal.title} ${formData.personal.firstName} ${formData.personal.lastName}`} />
                                            <SummaryItem label="เบอร์โทร" value={formData.personal.phone} />
                                            <SummaryItem label="ที่อยู่" value={`${formData.personal.houseNumber} หมู่ ${formData.personal.moo || '-'} ${formData.personal.street || ''} ต.${formData.personal.subdistrict} อ.${formData.personal.district} จ.${formData.personal.province} ${formData.personal.postalCode}`} />
                                        </div>
                                         <div>
                                            <h4 className="font-bold text-lg mb-2 border-b pb-1">ข้อมูลแปลงปลูก</h4>
                                            <SummaryItem label="ขนาด" value={`${formData.plot.areaSize} ${formData.plot.areaUnit}`} />
                                            <SummaryItem label="พืชเดิม" value={formData.plot.prevCrops} />
                                            <SummaryItem label="ที่อยู่แปลง" value={`${formData.plot.houseNumber} หมู่ ${formData.plot.moo || '-'} ต.${formData.plot.subdistrict} อ.${formData.plot.district} จ.${formData.plot.province} ${formData.plot.postalCode}`} />
                                        </div>
                                         <div>
                                            <h4 className="font-bold text-lg mb-2 border-b pb-1">เอกสาร</h4>
                                            <SummaryItem label="สำเนาบัตรประชาชน" value={<span className="flex items-center gap-2">{files.idCard ? <><Icons.CheckIcon className="w-5 h-5 text-green-500"/> {files.idCard.name}</> : 'ยังไม่อัปโหลด'}</span>} />
                                            <SummaryItem 
                                                label="โฉนดที่ดิน" 
                                                value={
                                                    files.landDeed.length > 0 ? (
                                                        <ul className="list-disc list-inside space-y-1">
                                                            {files.landDeed.map((file, index) => (
                                                                <li key={index} className="flex items-center gap-2">
                                                                    <Icons.CheckIcon className="w-5 h-5 text-green-500"/> <span>{file.name}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : 'ยังไม่อัปโหลด'
                                                } 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // หน้าลงทะเบียนเสร็จสิ้น
                            <div className="space-y-4">
                                <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-sm w-full mx-auto">
                                    <p className="font-bold text-slate-700 mb-4">ลงทะเบียนเสร็จสิ้น</p>
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto border-4 border-green-500">
                                        <Icons.CheckIcon className="w-12 h-12 text-green-500" strokeWidth={3}/>
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-800 mt-6">ลงทะเบียนสำเร็จ</h2>
                                    <p className="text-slate-600 mt-2 text-sm">
                                        เราได้รับข้อมูลการลงทะเบียนเข้าร่วมโครงการของท่านแล้ว ทีมงานจะแจ้งผลการอนุมัติให้ท่านทราบผ่านทาง Line OA หรืออีเมลที่ลงทะเบียนไว้
                                    </p>
                                </div>
                                
                                {/* ปุ่มที่ติดกับเฟรม */}
                                <div className="max-w-sm w-full mx-auto px-4">
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={onBackToDashboard}
                                            className="flex-1 bg-transparent hover:bg-green-50 text-[#54B948] font-bold py-3 transition-colors border-2 border-[#54B948] flex items-center justify-center gap-2"
                                            style={{ borderRadius: '5px' }}
                                        >
                                            <img src="/Vector (2.1).png" alt="Home" className="w-5 h-5" />
                                            หน้าหลัก
                                        </button>
                                        <button
                                            onClick={onSubmitSuccess}
                                            className="flex-1 bg-[#54B948] hover:bg-[#4A9E3F] text-white font-bold py-3 transition-colors"
                                            style={{ borderRadius: '5px' }}
                                        >
                                            ตรวจสอบสถานะ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div 
            className="min-h-screen bg-slate-100 flex flex-col"
            style={{
                backgroundImage: "url('/Group-bg.png')",
                backgroundPosition: "bottom",
                backgroundSize: "auto",
                backgroundRepeat: "no-repeat"
            }}
        >
            {/* Header */}
            <header className="relative z-10 flex-shrink-0 text-white py-8 shadow-lg rounded-b-2xl" style={{ 
                backgroundImage: "url('/images/banners/ดีไซน์ที่ยังไม่ได้ตั้งชื่อ (1) 3.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
            }}>
                <div className="absolute inset-0 bg-[#005596]/80 rounded-b-2xl"></div>
                <div className="relative container mx-auto px-4">
                     <div className="flex items-center justify-center mb-3">
                        <button onClick={step === 1 ? onBackToDashboard : prevStep} className="absolute left-4 p-2 rounded-full hover:bg-white/10">
                            <Icons.ChevronLeftIcon className="w-6 h-6" />
                        </button>
                        <h1 className="text-2xl font-bold">เพิ่มข้อมูลส่วนตัว</h1>
                    </div>
                    <StepperHeader currentStep={step} isSubmitted={isSubmitted} />
                </div>
            </header>
            
            {/* Main Content */}
            <main className="flex-grow overflow-y-auto no-scrollbar p-4 pb-24">
                <div className="max-w-xl mx-auto">
                    {renderStepContent()}
                </div>
            </main>
            
            {/* Footer */}
            {!isSubmitted && (
                <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200">
                <div className="max-w-xl mx-auto">
                    {isEditMode && step === 4 ? (
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => setModalState('cancelConfirm')}
                                className="w-full bg-white text-red-600 font-bold py-3 px-4 transition-colors duration-300 border-2 border-red-600 hover:bg-red-50"
                                style={{ borderRadius: '5px' }}
                            >
                                ยกเลิกการแก้ไข
                            </button>
                            <button
                                onClick={handleFinalSubmit}
                                disabled={!isStepValid}
                                className="w-full text-white font-bold py-3 px-4 transition-colors duration-300 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed shadow-lg"
                                style={{ 
                                    backgroundColor: isStepValid ? '#54B948' : '#9CA3AF',
                                    borderRadius: '5px',
                                    '--hover-color': '#4A9E3A'
                                } as React.CSSProperties & { '--hover-color': string }}
                                onMouseEnter={(e) => {
                                    if (isStepValid) {
                                        e.currentTarget.style.backgroundColor = '#4A9E3A';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (isStepValid) {
                                        e.currentTarget.style.backgroundColor = '#54B948';
                                    }
                                }}
                            >
                                บันทึกการแก้ไข
                            </button>
                        </div>
                    ) : (
                        !isSubmitted && (
                            <button
                                onClick={step === 4 ? handleFinalSubmit : nextStep}
                                disabled={!isStepValid}
                                className="w-full text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed shadow-lg"
                                style={{ 
                                    backgroundColor: isStepValid ? '#53B847' : '#9CA3AF',
                                    '--hover-color': '#4A9E3A'
                                } as React.CSSProperties & { '--hover-color': string }}
                                onMouseEnter={(e) => {
                                    if (isStepValid) {
                                        e.currentTarget.style.backgroundColor = '#4A9E3A';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (isStepValid) {
                                        e.currentTarget.style.backgroundColor = '#53B847';
                                    }
                                }}
                            >
                                {step === 3 ? 'ยืนยันการส่งเอกสาร' : step === 4 ? 'ยืนยันส่งเอกสาร' : 'ถัดไป'}
                            </button>
                        )
                    )}
                </div>
                </footer>
            )}
            
            {modalState !== 'none' && modalState !== 'success' && (
                <ActionModal
                    type={modalState as 'cancelConfirm'}
                    onClose={() => setModalState('none')}
                    onConfirm={onBackToDashboard}
                />
            )}
        </div>
    );
};

export default FarmerRegistrationFlow;