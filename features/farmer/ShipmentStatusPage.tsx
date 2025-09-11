// features/farmer/ShipmentStatusPage.tsx
// คอมโพเนนต์สำหรับหน้าตรวจสอบสถานะการขนส่งของเกษตรกร

import React, { useState, useMemo } from 'react';
import { FarmerShipment, Page, ShipmentProgressStatus } from '../../types';
import { mockFarmerShipments } from '../../data/mockData';
import * as Icons from '../../constants';
import FarmerHeader from './FarmerHeader';

// Props
interface ShipmentStatusPageProps {
    onMenuClick: () => void;
    onNotificationClick: () => void;
}

// =================================================================
// Sub-components
// =================================================================

const ShipmentCard: React.FC<{ shipment: FarmerShipment; onClick: () => void; }> = ({ shipment, onClick }) => {
    // Correct mapping from color name to Tailwind CSS text color class
    const statusColorClass = {
        red: 'text-red-500',
        green: 'text-green-500',
        blue: 'text-blue-500',
    };
    
    return (
        <button
            onClick={onClick}
            className="w-full text-left bg-white rounded-2xl p-5 shadow-lg border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
            <div className="flex justify-between items-start">
                <span className="font-semibold text-sm text-slate-600">{shipment.date}</span>
                <div className="text-right">
                    <p className="text-xs text-slate-500">สถานะ</p>
                    {/* Apply the correct text color class */}
                    <p className={`font-bold text-sm ${statusColorClass[shipment.statusColor]}`}>
                       {shipment.statusText}
                    </p>
                </div>
            </div>
            <div className="mt-3">
                <p className="text-xs text-slate-500">ชื่อแปลงปลูก</p>
                <p className="font-bold text-lg text-slate-900">{shipment.plotName}</p>
                 <p className="text-xs text-slate-500 mt-2">ชื่อผู้ดูแล</p>
                <p className="font-bold text-lg text-slate-900">{shipment.supervisorName}</p>
            </div>
        </button>
    );
};


const ShipmentDetailView: React.FC<{ shipment: FarmerShipment }> = ({ shipment }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const stepperSteps = [
        { status: ShipmentProgressStatus.EN_ROUTE_TO_PLOT, label: "ขนส่งกำลังไปยังแปลงปลูกของคุณ", icon: Icons.TruckIcon },
        { status: ShipmentProgressStatus.ARRIVED_AT_PLOT, label: "ขนส่งไปถึงแปลงปลูก", icon: Icons.ShipmentLocationIcon },
        { status: ShipmentProgressStatus.PICKING_UP, label: "ขนส่งเข้ารับไผ่", icon: Icons.ShipmentPickupIcon },
        { status: ShipmentProgressStatus.EN_ROUTE_TO_FACTORY, label: "ขนส่งนำไผ่กลับไปยังโรงงาน", icon: Icons.ShipmentFactoryIcon },
    ];
    
    const currentStatusIndex = stepperSteps.findIndex(step => step.status === shipment.detailedStatus);

    return (
        <div className="space-y-6">
            {/* Stepper */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex flex-col">
                    {stepperSteps.map((step, index) => {
                        const isCompleted = index < currentStatusIndex;
                        const isActive = index === currentStatusIndex;

                        return (
                            <div key={step.status} className="flex items-start">
                                {/* Icon and line */}
                                <div className="flex flex-col items-center mr-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                        isCompleted ? 'bg-blue-600 border-blue-700' :
                                        isActive ? 'bg-blue-600 border-blue-700' :
                                        'bg-gray-200 border-gray-300'
                                    }`}>
                                        {isCompleted ? <Icons.CheckIcon className="w-6 h-6 text-white"/> : <step.icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-500'}`} />}
                                    </div>
                                    {index < stepperSteps.length - 1 && (
                                        <div className={`w-0.5 h-12 transition-colors ${isCompleted ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                                    )}
                                </div>
                                {/* Label */}
                                <div className={`pt-3 ${isActive ? 'font-bold text-blue-700' : isCompleted ? 'text-slate-800' : 'text-gray-500'}`}>
                                    {step.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Details Card */}
             <div className="bg-white rounded-2xl p-5 shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs text-slate-500">วันที่</p>
                        <p className="font-bold text-slate-800">{shipment.date}</p>
                    </div>
                     <div className="text-right">
                        <p className="text-xs text-slate-500">สถานะ</p>
                        <p className={`font-bold text-red-500`}>{shipment.statusText}</p>
                    </div>
                </div>
                 <div className="mt-4 space-y-3">
                    <div>
                        <p className="text-xs text-slate-500">ชื่อแปลงปลูก</p>
                        <p className="font-bold text-slate-800 text-lg">{shipment.plotName}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500">ชื่อผู้ดูแล</p>
                        <p className="font-bold text-slate-800 text-lg">{shipment.supervisorName}</p>
                    </div>
                    {/* Collapsible section */}
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-40' : 'max-h-0'}`}>
                         <div className="pt-3 border-t border-slate-200 space-y-3">
                            <div>
                                <p className="text-xs text-slate-500">โรงงาน</p>
                                <p className="font-bold text-slate-800 text-lg">{shipment.factoryName || '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">น้ำหนักสุทธิ</p>
                                <p className="font-bold text-slate-800 text-lg">{shipment.netWeight || '-'}</p>
                            </div>
                         </div>
                    </div>
                </div>
                 <div className="flex justify-center mt-2">
                    <button onClick={() => setIsExpanded(!isExpanded)} className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                        {isExpanded ? 'ดูน้อยลง' : 'ดูเพิ่มเติม'}
                    </button>
                </div>
            </div>
        </div>
    );
};


// =================================================================
// Main Component
// =================================================================
const ShipmentStatusPage: React.FC<ShipmentStatusPageProps> = ({ onMenuClick, onNotificationClick }) => {
    const [selectedShipment, setSelectedShipment] = useState<FarmerShipment | null>(null);

    const handleBack = () => {
        setSelectedShipment(null);
    };

    return (
        <div className="relative min-h-screen bg-[#007AB8] overflow-x-hidden">
             <FarmerHeader 
                title={Page.SHIPMENT_STATUS}
                onMenuClick={onMenuClick}
                onNotificationClick={onNotificationClick}
                onBackClick={selectedShipment ? handleBack : undefined}
            />
            
            <div className="absolute bottom-0 left-0 w-full h-64 z-0 pointer-events-none">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 256" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M-200 100 Q 160 20, 520 100 T 1240 100 T 1960 100" stroke="white" strokeOpacity="0.1" strokeWidth="2" />
                    <path d="M-200 130 Q 160 50, 520 130 T 1240 130 T 1960 130" stroke="white" strokeOpacity="0.1" strokeWidth="2" />
                    <path d="M-200 160 Q 160 80, 520 160 T 1240 160 T 1960 160" stroke="white" strokeOpacity="0.1" strokeWidth="2" />
                    <path d="M-200 190 Q 160 110, 520 190 T 1240 190 T 1960 190" stroke="white" strokeOpacity="0.1" strokeWidth="2" />
                </svg>
            </div>

            <main className="container mx-auto p-4 sm:p-6 lg:p-8 -mt-16 relative z-10">
                {/* Coming Soon View */}
                <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="text-center space-y-6">
                        <div className="w-24 h-24 mx-auto bg-amber-100 rounded-full flex items-center justify-center">
                            <Icons.TruckIcon className="w-12 h-12 text-amber-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">สถานะขนส่ง</h2>
                            <p className="text-slate-600 text-lg">เร็วๆ นี้</p>
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-md">
                            <p className="text-amber-800 text-sm">
                                ระบบตรวจสอบสถานะการขนส่งกำลังอยู่ในระหว่างการพัฒนา 
                                <br />
                                ขออภัยในความไม่สะดวก
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ShipmentStatusPage;