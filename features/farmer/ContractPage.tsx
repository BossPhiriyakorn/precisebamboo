// features/farmer/ContractPage.tsx
import React, { useState, useMemo } from 'react';
import { ContractPlot, Page, ContractDetails } from '../../types';
import { mockContractPlots } from '../../data/mockData';
import * as Icons from '../../constants';
import FarmerHeader from './FarmerHeader';

// Props
interface ContractPageProps {
    onMenuClick: () => void;
    onNotificationClick: () => void;
}

type ContractView = 'main' | 'pendingList' | 'plotDetails';


// =================================================================
// Sub-components
// =================================================================


const PlotCard: React.FC<{ plot: ContractPlot, onClick: () => void }> = ({ plot, onClick }) => (
    <button 
        onClick={onClick} 
        className="w-full text-left bg-white rounded-xl shadow-md p-4 flex items-center gap-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:bg-slate-50 border border-slate-100"
    >
        {/* รูปภาพแปลง */}
        <div className="relative">
            <img 
                src={plot.imageUrl} 
                alt={plot.code} 
                className="rounded-lg object-cover shadow-sm" 
                style={{ width: '110px', height: '85px' }}
            />
            {plot.isPending && (
                <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    รอ
                </div>
            )}
        </div>
        
        {/* ข้อมูลแปลง */}
        <div className="flex-grow min-w-0">
            <div className="flex items-center justify-between mb-1">
                <p className="font-bold text-slate-900 text-lg">{plot.code}</p>
                {/* ไอคอนลูกศร */}
                <Icons.ChevronRightIcon className="w-6 h-6 text-slate-400 flex-shrink-0" />
            </div>
            
            <div className="flex items-start gap-1.5 text-sm text-slate-600 mb-2">
                <Icons.MapPinIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-400" />
                <span className="line-clamp-2">{plot.location}</span>
            </div>
            
            {plot.signedDate && (
                <div className="flex items-center gap-1 text-xs text-slate-500">
                    <span>เซ็นสัญญา: {plot.signedDate}</span>
                </div>
            )}
        </div>
    </button>
);

const ContractItemCard: React.FC<{ contract: ContractDetails, plotImage: string }> = ({ contract, plotImage }) => {
    // ฟังก์ชันสำหรับอ่านชื่อไฟล์ PDF
    const getPdfFileName = (contractId: string) => {
        const pdfFiles: { [key: string]: string } = {
            'c001-1': 'Sale-and-Purchase-Agreement_TH.pdf',
            'c001-2': 'Contract-Addendum-2024.pdf',
            'c001-3': 'Bamboo-Cultivation-Agreement.pdf',
            'c001-4': 'Payment-Terms-Contract.pdf',
            'pending-plot004': 'Sale-and-Purchase-Agreement_TH.pdf',
            'pending-plot005': 'Contract-Addendum-2024.pdf',
            'pending-plot006': 'Bamboo-Cultivation-Agreement.pdf',
            'pending-plot007': 'Payment-Terms-Contract.pdf'
        };
        return pdfFiles[contractId] || 'Sale-and-Purchase-Agreement_TH.pdf';
    };

    const pdfFileName = getPdfFileName(contract.id);

    return (
        <div className="w-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            {/* PDF Preview Header */}
            <div className="bg-red-600 text-white p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icons.DocumentTextIcon className="w-5 h-5" />
                    <span className="text-sm font-semibold">PDF Document</span>
                </div>
                <div className="text-xs bg-red-700 px-2 py-1 rounded max-w-32 truncate" title={pdfFileName}>
                    {pdfFileName}
                </div>
            </div>

        {/* PDF Content Preview */}
        <div className="bg-gray-50 p-4">
            {/* Document Header */}
            <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                <div className="text-center mb-4">
                    <div className="text-blue-600 font-bold text-lg mb-2">20/30CISE</div>
                    <div className="text-sm text-gray-600 mb-2">สัญญาเลขที่: SP-{contract.id}</div>
                    <h1 className="text-lg font-bold text-gray-800 mb-1">สัญญาซื้อขายผลผลิตไม่ล่วงหน้า</h1>
                    <p className="text-sm text-gray-600">สำหรับโครงการต้นแบบการปลูกและการใช้ประโยชน์จากไผ่อย่างยั่งยืน</p>
                    <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600">
                        <span className="font-medium">ไฟล์:</span> {pdfFileName}
                    </div>
                </div>

                {/* Contract Details */}
                <div className="space-y-3 text-xs">
                    <div className="border-b border-gray-200 pb-2">
                        <p className="font-semibold text-gray-700">สัญญาฉบับนี้ทำขึ้นระหว่าง</p>
                        <div className="mt-2 space-y-1 text-gray-600">
                            <p>ผู้ขาย: เกษตรกรผู้ปลูกไผ่</p>
                            <p>อยู่บ้านเลขที่: ___________ หมู่ที่: ___________</p>
                            <p>ซอย: ___________ ถนน: ___________</p>
                            <p>ตำบล: ___________ อำเภอ: ___________ จังหวัด: ___________</p>
                        </div>
                    </div>

                    <div className="border-b border-gray-200 pb-2">
                        <p className="font-semibold text-gray-700">กับ</p>
                        <div className="mt-2 space-y-1 text-gray-600">
                            <p>บริษัท พรีไซซ สมาร์ท ไลฟ์ จำกัด</p>
                            <p>โดยมี: ___________ เป็นผู้แทน</p>
                            <p>สำนักงานตั้งอยู่บ้านเลขที่: ___________</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="bg-blue-50 p-2 rounded">
                            <p className="font-semibold text-blue-800">ข้อ 1. วัตถุประสงค์ของสัญญา</p>
                            <p className="text-blue-700 text-xs mt-1">
                                ผู้ซื้อประกอบธุรกิจผลิตสินค้าแปรรูปจากไผ่ และผู้ขายมีความประสงค์จะขายผลผลิตไผ่...
                            </p>
                        </div>

                        <div className="bg-green-50 p-2 rounded">
                            <p className="font-semibold text-green-800">ข้อ 2. ระยะเวลาในการปฏิบัติตามสัญญา</p>
                            <p className="text-green-700 text-xs mt-1">
                                สัญญาฉบับนี้มีผลบังคับใช้ตั้งแต่วันที่ {contract.date} ถึงวันที่ ________
                            </p>
                        </div>

                        <div className="bg-yellow-50 p-2 rounded">
                            <p className="font-semibold text-yellow-800">ข้อ 3. รายละเอียดของสถานที่ปลูกไผ่</p>
                            <p className="text-yellow-700 text-xs mt-1">
                                ผู้ขายใช้ปลูกไผ่เพื่อส่งมอบให้แก่ผู้ซื้อตามสัญญาฉบับนี้...
                            </p>
                        </div>
                    </div>
                </div>

                {/* Document Footer */}
                <div className="mt-4 pt-3 border-t border-gray-200 text-center">
                    <div className="text-xs text-gray-500">หน้า 1</div>
                </div>
            </div>
        </div>

        {/* Action Footer */}
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex items-center gap-2">
                <img 
                    src={plotImage} 
                    alt="แปลงปลูก" 
                    className="w-8 h-8 rounded object-cover" 
                />
                <div className="text-xs text-gray-600">
                    <p className="font-medium">แปลงปลูกไผ่</p>
                    <p>ไฟล์: {pdfFileName}</p>
                    <p>อัพโหลดเมื่อ: {contract.date}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Icons.ChevronRightIcon className="w-4 h-4 text-gray-400" />
            </div>
        </div>
    </div>
);
};


// =================================================================
// Main Component
// =================================================================

const ContractPage: React.FC<ContractPageProps> = ({ onMenuClick, onNotificationClick }) => {
    const [view, setView] = useState<ContractView>('main');
    const [selectedPlot, setSelectedPlot] = useState<ContractPlot | null>(null);
    

    const { pendingPlots, signedPlots } = useMemo(() => {
        const pending: ContractPlot[] = [];
        const signed: ContractPlot[] = [];
        mockContractPlots.forEach(plot => {
            if (plot.isPending) {
                pending.push(plot);
            } else {
                signed.push(plot);
            }
        });
        return { pendingPlots: pending, signedPlots: signed };
    }, []);

    const handleSelectPlot = (plot: ContractPlot) => {
        setSelectedPlot(plot);
        setView('plotDetails');
    };


    const renderContent = () => {
        switch (view) {
            case 'pendingList':
                return (
                    <div className="space-y-4">
                        {pendingPlots.length > 0 ? (
                            pendingPlots.map(plot => (
                            <PlotCard key={plot.id} plot={plot} onClick={() => handleSelectPlot(plot)} />
                            ))
                        ) : (
                            <div className="bg-white rounded-2xl p-8 text-center text-slate-500 shadow-lg">
                                <Icons.ClockIcon className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                                <h3 className="text-lg font-semibold mb-2">ไม่มีแปลงที่รอเซ็นสัญญา</h3>
                                <p className="text-sm">ขณะนี้ไม่มีแปลงที่รอการเซ็นสัญญา</p>
                            </div>
                        )}
                    </div>
                );
            case 'plotDetails':
                if (!selectedPlot) return null;
                return (
                    <div className="space-y-4">
                        {/* รายการสัญญา */}
                        <div>
                            <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Icons.DocumentTextIcon className="w-5 h-5 text-blue-600" />
                                รายการสัญญา
                            </h4>
                            
                            {selectedPlot.contracts.length > 0 ? (
                                <div className="space-y-3">
                                    {selectedPlot.contracts.map(contract => (
                                        <ContractItemCard key={contract.id} contract={contract} plotImage={selectedPlot.imageUrl} />
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {/* ตัวอย่างสัญญาสำหรับแปลงที่รอสัญญา */}
                                    <div className="text-center py-4 text-slate-600">
                                        <Icons.ClockIcon className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                                        <h5 className="text-sm font-semibold mb-2">สัญญาที่รอการเซ็น</h5>
                                    </div>
                                    <ContractItemCard 
                                        contract={{
                                            id: `pending-${selectedPlot.id}`,
                                            name: 'สัญญาฉบับที่รอเซ็น',
                                            date: 'รอการเซ็นสัญญา'
                                        }} 
                                        plotImage={selectedPlot.imageUrl} 
                                    />
                                </div>
                            )}
                        </div>

                        {/* ข้อมูลแปลงที่เลือก */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                            <div className="flex items-center gap-4 mb-4">
                                <img 
                                    src={selectedPlot.imageUrl} 
                                    alt={selectedPlot.code} 
                                    className="rounded-lg object-cover shadow-sm" 
                                    style={{ width: '110px', height: '85px' }}
                                />
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{selectedPlot.code}</h3>
                                    <div className="flex items-center gap-1 text-sm text-slate-600">
                                        <Icons.MapPinIcon className="w-4 h-4 text-slate-400" />
                                        <span className="line-clamp-1">{selectedPlot.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'main':
            default:
                return (
                    <div className="space-y-6">

                        {/* การ์ดรอเซ็นสัญญา */}
                        <button 
                            onClick={() => setView('pendingList')} 
                            className="w-full text-white rounded-2xl p-6 flex items-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            style={{ background: 'linear-gradient(135deg, #01AAE7 0%, #005596 100%)' }}
                        >
                            <div className="flex items-center gap-6 w-full">
                                {/* กล่องแสดงจำนวน */}
                                <div className="bg-white rounded-2xl flex flex-col items-center justify-center font-bold text-black shadow-lg" 
                                     style={{ width: '140px', height: '100px', minWidth: '140px' }}>
                                    <span className="text-4xl font-black text-slate-800">{pendingPlots.length}</span>
                                    <span className="text-sm font-semibold text-slate-600">รายการ</span>
                                </div>
                                
                                {/* ข้อความ */}
                                <div className="text-left flex-grow">
                                    <h3 className="text-xl font-bold mb-2">รอเซ็นสัญญา</h3>
                                </div>
                            </div>
                        </button>

                        {/* รายการแปลงที่เซ็นสัญญาแล้ว */}
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-4">
                                รายชื่อแปลงปลูกที่เซ็นสัญญาแล้ว
                            </h2>
                            <div className="space-y-3">
                                {signedPlots.length > 0 ? (
                                    signedPlots.map(plot => (
                                    <PlotCard key={plot.id} plot={plot} onClick={() => handleSelectPlot(plot)} />
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-slate-500">
                                        <Icons.DocumentTextIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                        <p>ยังไม่มีแปลงที่เซ็นสัญญาแล้ว</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
        }
    };
    
    let headerTitle = Page.CONTRACT;
    if (view === 'pendingList') {
        headerTitle = Page.CONTRACT;
    } else if (view === 'plotDetails' && selectedPlot) {
        headerTitle = selectedPlot.code as Page;
    }

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-x-hidden">
            <FarmerHeader 
                title={headerTitle}
                onMenuClick={onMenuClick}
                onNotificationClick={onNotificationClick}
                onBackClick={view !== 'main' ? () => setView('main') : undefined}
            />
            
            {/* Background decoration */}
            <div className="absolute bottom-0 left-0 w-full z-0 pointer-events-none">
                <img 
                    src="/Group-bg.png" 
                    alt="Background decoration" 
                    className="w-full h-auto object-cover opacity-20"
                />
            </div>

            {/* Main content */}
            <main className="container mx-auto p-4 sm:p-6 lg:p-8 pt-1.5 relative z-10">
                <div className="max-w-4xl mx-auto">
                {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default ContractPage;
