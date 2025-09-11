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
    <button onClick={onClick} className="w-full text-left bg-white rounded-xl shadow-md p-4 flex items-center gap-4 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
        <img src={plot.imageUrl} alt={plot.code} className="w-20 h-20 rounded-lg object-cover" />
        <div className="flex-grow">
            <p className="font-bold text-slate-900">{plot.code}</p>
            <div className="flex items-start gap-1.5 mt-1 text-sm text-slate-600">
                <Icons.MapPinIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{plot.location}</span>
            </div>
            {plot.signedDate && <p className="text-xs text-slate-500 mt-1">วันที่: {plot.signedDate}</p>}
        </div>
        <Icons.ChevronRightIcon className="w-6 h-6 text-slate-400 flex-shrink-0" />
    </button>
);

const ContractItemCard: React.FC<{ contract: ContractDetails, plotImage: string }> = ({ contract, plotImage }) => (
    <button className="w-full text-left bg-white rounded-xl shadow-md p-4 flex items-center gap-4 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
        <img src={plotImage} alt={contract.name} className="w-20 h-20 rounded-lg object-cover" />
        <div className="flex-grow">
            <p className="font-bold text-slate-900">{contract.name}</p>
            <p className="text-sm text-slate-600 mt-1">วันที่: {contract.date}</p>
        </div>
        <Icons.ChevronRightIcon className="w-6 h-6 text-slate-400 flex-shrink-0" />
    </button>
);


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
                        {pendingPlots.map(plot => (
                            <PlotCard key={plot.id} plot={plot} onClick={() => handleSelectPlot(plot)} />
                        ))}
                    </div>
                );
            case 'plotDetails':
                if (!selectedPlot) return null;
                return (
                    <div className="space-y-4">
                        {selectedPlot.contracts.length > 0 ? (
                            selectedPlot.contracts.map(contract => (
                                <ContractItemCard key={contract.id} contract={contract} plotImage={selectedPlot.imageUrl} />
                            ))
                        ) : (
                            <div className="bg-white rounded-xl p-8 text-center text-slate-500">
                                ยังไม่มีสัญญาสำหรับแปลงนี้
                            </div>
                        )}
                    </div>
                );
            case 'main':
            default:
                return (
                    <div className="space-y-6">
                        <button 
                            onClick={() => setView('pendingList')} 
                            className="w-full text-white rounded-2xl p-6 flex items-center shadow-lg hover:shadow-xl transition-shadow"
                            style={{ background: 'linear-gradient(to right, #01AAE7, #005596)' }}
                        >
                            <div className="flex items-center gap-4 w-full">
                                <div className="bg-white rounded-lg flex flex-col items-center justify-center font-bold text-black" style={{ width: '180px', height: '180px' }}>
                                    <span className="text-5xl">{pendingPlots.length}</span>
                                    <span className="text-base">รายการ</span>
                                </div>
                                <div className="text-left flex-grow" style={{ marginLeft: '5%' }}>
                                    <p className="text-lg font-bold">รอเซ็นสัญญา</p>
                                </div>
                            </div>
                        </button>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 mb-3">รายชื่อแปลงปลูกที่เซ็นสัญญาแล้ว</h2>
                            <div className="space-y-4">
                                {signedPlots.map(plot => (
                                    <PlotCard key={plot.id} plot={plot} onClick={() => handleSelectPlot(plot)} />
                                ))}
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
        <div className="relative min-h-screen bg-white overflow-x-hidden">
            <FarmerHeader 
                title={headerTitle}
                onMenuClick={onMenuClick}
                onNotificationClick={onNotificationClick}
                onBackClick={view !== 'main' ? () => setView('main') : undefined}
            />
            
            <div className="absolute bottom-0 left-0 w-full z-0 pointer-events-none">
                <img 
                    src="/Group-bg.png" 
                    alt="Background decoration" 
                    className="w-full h-auto object-cover"
                />
            </div>

            <main className="container mx-auto p-4 sm:p-6 lg:p-8 pt-1.5 relative z-10">
                {renderContent()}
            </main>
        </div>
    );
};

export default ContractPage;
