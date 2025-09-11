// features/farmer/FarmerBookingPage.tsx
// คอมโพเนนต์สำหรับหน้าจัดการการจองคิวของเกษตรกร (โฉมใหม่)

import React, { useState, useMemo, useEffect } from 'react';
import { Booking, BookingStatus, Page, Plot } from '../../types';
import * as Icons from '../../constants';
import FarmerHeader from './FarmerHeader';
import { mockPlots, mockBambooSpeciesList } from '../../data/mockData';

// Props
interface FarmerBookingPageProps {
    bookings: Booking[];
    onAddBooking: (newBookingData: Partial<Booking>) => void;
    onMenuClick: () => void;
    onNotificationClick: () => void;
}

type ViewState = 'landing' | 'list' | 'details';
type ListFilterType = 'จองคิวรับกล้าพันธุ์' | 'จองคิวการตัดไผ่' | 'จองคิวทำสัญญา' | 'อื่นๆ' | null;

// =================================================================
// Constants & Helpers
// =================================================================

const BOOKING_MENU_ITEMS = {
    LIST: { type: null, title: 'รายการนัดหมาย' },
    SEEDLING: { type: 'จองคิวรับกล้าพันธุ์', title: 'จองคิวขอรับกล้าพันธุ์' },
    HARVEST: { type: 'จองคิวการตัดไผ่', title: 'จองคิวการตัดไผ่' },
    CONTRACT: { type: 'จองคิวทำสัญญา', title: 'จองคิวทำสัญญา' },
};

const formatThaiDate = (dateStr: string): string => {
    const parts = dateStr.split('/');
    if (parts.length !== 3) return dateStr;
    const day = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10) + 2500;
    const thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    
    if (isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) return dateStr;

    return `${day} ${thaiMonths[monthIndex]} ${year}`;
};


// =================================================================
// Seedling Booking Modal (New)
// =================================================================

const SeedlingBookingModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: Partial<Booking>) => void;
}> = ({ isOpen, onClose, onConfirm }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<{
        plotName: string;
        bambooSpecies: string;
        date: Date | null;
    }>({ plotName: '', bambooSpecies: '', date: null });
    const [isFormValid, setIsFormValid] = useState(false);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

    useEffect(() => {
        if (isOpen) {
            // Reset state when opening
            setStep(1);
            setFormData({ plotName: '', bambooSpecies: '', date: null });
        }
    }, [isOpen]);
    
    useEffect(() => {
        setIsFormValid(!!(formData.plotName && formData.bambooSpecies && formData.date));
    }, [formData]);

    const handleMonthChange = (direction: 'prev' | 'next') => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(newMonth.getMonth() + (direction === 'next' ? 1 : -1));
            return newMonth;
        });
    };
    
    const handleConfirm = () => {
        if(isFormValid) {
            onConfirm({
                plotName: formData.plotName,
                bambooSpecies: formData.bambooSpecies,
                date: formData.date?.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace('พ.ศ. ',''),
            });
        }
    };
    
    const Calendar = () => {
        const weekdays = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
        const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
        const firstDayOfMonth = monthStart.getDay();
        const calendarDays = Array(firstDayOfMonth).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
        
        return (
            <div className="bg-white p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                    <button type="button" onClick={() => handleMonthChange('prev')} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"><Icons.ChevronLeftIcon className="w-5 h-5"/></button>
                    <h4 className="text-sm font-bold text-slate-800">{currentMonth.toLocaleString('th-TH', { month: 'long', year: 'numeric' })}</h4>
                    <button type="button" onClick={() => handleMonthChange('next')} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"><Icons.ChevronRightIcon className="w-5 h-5"/></button>
                </div>
                 <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-sky-800 bg-sky-100 rounded-md p-1 mb-2">
                    {weekdays.map(day => <div key={day}>{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    {calendarDays.map((day, index) => {
                         if (!day) return <div key={`empty-${index}`}></div>;
                         const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                         const isPast = dayDate < today;
                         const isSelected = formData.date?.toDateString() === dayDate.toDateString();
                         return (
                            <button type="button" key={day} disabled={isPast} onClick={() => setFormData(p => ({...p, date: dayDate}))} 
                            className={`w-8 h-8 rounded-full transition-colors flex items-center justify-center text-sm ${
                                isSelected ? 'bg-blue-600 text-white font-bold' : isPast ? 'text-gray-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-100'
                            }`}>{day}</button>
                         )
                    })}
                </div>
            </div>
        )
    };
    
    const SummaryItem: React.FC<{label: string, value: string | undefined}> = ({label, value}) => (
        <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600">{label}</span>
            <span className="font-bold text-slate-800">{value || '-'}</span>
        </div>
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                {step === 1 && (
                    <div className="p-6 space-y-4">
                        <h3 className="text-xl font-bold text-center text-slate-800">จองคิวขอรับกล้าพันธุ์</h3>
                         <div>
                            <label className="block text-sm font-bold text-slate-800 mb-1">เลือกแปลงปลูก</label>
                            <div className="relative">
                                <select value={formData.plotName} onChange={e => setFormData(p => ({...p, plotName: e.target.value}))} className={`w-full appearance-none p-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${formData.plotName ? '' : 'text-slate-400'}`}>
                                    <option value="" disabled>กรุณาเลือก</option>
                                    {mockPlots.map(plot => <option key={plot.id} value={plot.name}>{plot.name}</option>)}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-blue-500">
                                    <Icons.ChevronDownIcon className="w-5 h-5"/>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-800 mb-1">เลือกสายพันธุ์ไผ่</label>
                            <div className="relative">
                                 <select value={formData.bambooSpecies} onChange={e => setFormData(p => ({...p, bambooSpecies: e.target.value}))} className={`w-full appearance-none p-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${formData.bambooSpecies ? '' : 'text-slate-400'}`}>
                                    <option value="" disabled>กรุณาเลือก</option>
                                    {mockBambooSpeciesList.map(species => <option key={species} value={species}>{species}</option>)}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-blue-500">
                                    <Icons.ChevronDownIcon className="w-5 h-5"/>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-800 mb-1">เลือกวันที่จอง</label>
                            <Calendar />
                        </div>
                        <div className="pt-4">
                             <button onClick={() => setStep(2)} disabled={!isFormValid} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition">ถัดไป</button>
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div className="p-6 space-y-4">
                        <h3 className="text-xl font-bold text-center text-slate-800">ข้อมูลการจอง</h3>
                        <div className="bg-slate-50 p-4 rounded-lg space-y-2 border">
                            <SummaryItem label="ชื่อแปลงปลูก" value={formData.plotName} />
                            <SummaryItem label="สายพันธุ์ไผ่" value={formData.bambooSpecies} />
                            <SummaryItem label="วันที่จอง" value={formData.date ? formatThaiDate(formData.date.toLocaleDateString('th-TH').split(' ')[0].replace('พ.ศ.','')) : '-'} />
                        </div>
                         <div className="pt-4">
                            <button onClick={handleConfirm} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition">ยืนยัน</button>
                            <button onClick={() => setStep(1)} className="w-full text-center mt-2 text-slate-600 font-semibold text-sm hover:text-black">ย้อนกลับ</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


// =================================================================
// Sub-components
// =================================================================

const MenuButton: React.FC<{
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    onClick: () => void;
    alignIcon?: 'left' | 'right';
}> = ({ label, icon: Icon, onClick, alignIcon = 'left' }) => {
    const iconElement = (
        <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Icon className="w-10 h-10 text-white" />
        </div>
    );
    
    return (
        <button
            onClick={onClick}
            className={`w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl p-6 flex items-center justify-between shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
        >
            {alignIcon === 'left' && iconElement}
            <span className={`text-2xl font-bold ${alignIcon === 'left' ? 'text-right' : 'text-left'}`}>{label}</span>
            {alignIcon === 'right' && iconElement}
        </button>
    );
};

const AppointmentCard: React.FC<{ booking: Booking, onViewDetails: (booking: Booking) => void }> = ({ booking, onViewDetails }) => {
    const getStatusStyles = (status: BookingStatus) => {
        switch (status) {
            case BookingStatus.PENDING: return { text: 'text-orange-500', label: 'รอຢืนຢันนัดหมาย' };
            case BookingStatus.CONFIRMED: return { text: 'text-blue-600', label: 'ยืนยันนัดหมายแล้ว' };
            case BookingStatus.COMPLETED: return { text: 'text-green-600', label: 'เสร็จสิ้น' };
            default: return { text: 'text-gray-500', label: status };
        }
    };

    const statusStyle = getStatusStyles(booking.status);

    return (
        <div className="bg-white rounded-2xl p-4 shadow-md">
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-slate-800 text-lg pr-4">{booking.description}</h3>
                <div className="text-right flex-shrink-0">
                     <p className="text-sm text-slate-600 whitespace-nowrap">สถานะ : <span className={`font-bold ${statusStyle.text}`}>{statusStyle.label}</span></p>
                    <p className="text-sm text-slate-500 mt-1">{booking.date}</p>
                </div>
            </div>
            
            <div className="mt-3 space-y-2">
                 <div>
                    <p className="text-sm text-slate-500">ชื่อแปลงปลูก</p>
                    <p className="font-bold text-slate-900 text-lg">{booking.plotName || '-'}</p>
                </div>
                <div>
                    <p className="text-sm text-slate-500">ชื่อผู้ดูแล</p>
                    <p className="font-bold text-slate-900 text-lg">{booking.supervisorName || '-'}</p>
                </div>
            </div>

            <div className="flex justify-end items-center mt-2 pt-2">
                <button onClick={() => onViewDetails(booking)} className="flex items-center gap-1.5 text-sky-600 font-semibold text-sm hover:text-sky-800">
                    <Icons.EyeIcon className="w-5 h-5" />
                    <span>ดูข้อมูลเพิ่มเติม &gt;</span>
                </button>
            </div>
        </div>
    );
};

const BookingDetailView: React.FC<{ booking: Booking; onBack: () => void; }> = ({ booking, onBack }) => {
    const statusStyle = useMemo(() => {
        switch (booking.status) {
            case BookingStatus.PENDING: return { text: 'text-orange-500', label: 'รอຢืนຢันนัดหมาย' };
            case BookingStatus.CONFIRMED: return { text: 'text-blue-600', label: 'ยืนยันแล้ว' };
            case BookingStatus.COMPLETED: return { text: 'text-green-600', label: 'เสร็จสิ้น' };
            default: return { text: 'text-gray-500', label: booking.status };
        }
    }, [booking.status]);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex justify-between items-center mb-4 pb-4 border-b">
                <h3 className="font-bold text-slate-800 text-xl">ข้อมูลการจอง</h3>
                <div className="text-sm text-slate-600">สถานะ: <span className={`font-bold ${statusStyle.text}`}>{statusStyle.label}</span></div>
            </div>
            <div className="space-y-3 text-slate-700">
                <p><strong>ชื่อแปลงปลูก:</strong> {booking.plotName}</p>
                <p><strong>สายพันธุ์ไผ่:</strong> {booking.bambooSpecies || '-'}</p>
                <p><strong>พันธุ์:</strong> {booking.bambooVariety || '-'}</p>
                <p><strong>วันที่นัดหมาย:</strong> {formatThaiDate(booking.date)}</p>
            </div>
        </div>
    );
};


// =================================================================
// Main Component
// =================================================================

const FarmerBookingPage: React.FC<FarmerBookingPageProps> = ({ bookings, onAddBooking, onMenuClick, onNotificationClick }) => {
    const [view, setView] = useState<ViewState>('landing');
    const [pageTitle, setPageTitle] = useState(Page.BOOKING);
    const [listFilterType, setListFilterType] = useState<ListFilterType>(null);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    
    const handleMenuClick = (type: ListFilterType, title: string) => {
        setListFilterType(type);
        setPageTitle(title as Page);
        setView('list');
    };

    const handleViewDetailsClick = (booking: Booking) => {
        setSelectedBooking(booking);
        setView('details');
    };
    
    const handleBack = () => {
        if (view === 'details') {
            setSelectedBooking(null);
            setView('list');
        } else if (view === 'list') {
            setListFilterType(null);
            setPageTitle(Page.BOOKING);
            setView('landing');
        }
    };
    
    const handleConfirmNewBooking = (data: Partial<Booking>) => {
        onAddBooking({
            ...data,
            type: listFilterType || BOOKING_MENU_ITEMS.SEEDLING.type,
            description: `ขอรับกล้าพันธุ์: ${data.bambooSpecies}`,
            supervisorName: 'สมพง มีเงิน', // Mock supervisor
        });
        setCreateModalOpen(false);
    };

    const filteredBookings = useMemo(() => {
        if (!listFilterType) return bookings;
        return bookings.filter(b => b.type === listFilterType);
    }, [bookings, listFilterType]);


    const renderContent = () => {
        if (view === 'details' && selectedBooking) {
            return <BookingDetailView booking={selectedBooking} onBack={handleBack} />;
        }
        
        if (view === 'list') {
            return (
                <div className="space-y-4">
                     {listFilterType && (
                         <button
                            onClick={() => setCreateModalOpen(true)}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <Icons.PlusIcon className="w-6 h-6" />
                            <span>สร้างคิวใหม่</span>
                        </button>
                    )}

                    {filteredBookings.length > 0 ? (
                        filteredBookings.map(booking => (
                            <AppointmentCard key={booking.id} booking={booking} onViewDetails={handleViewDetailsClick} />
                        ))
                    ) : (
                        <div className="bg-white rounded-2xl p-8 text-center text-slate-500 shadow-md">
                            ไม่มีรายการนัดหมายประเภทนี้
                        </div>
                    )}
                </div>
            );
        }

        // Landing View - Coming Soon
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="text-center space-y-6">
                    <div className="w-24 h-24 mx-auto bg-amber-100 rounded-full flex items-center justify-center">
                        <Icons.CalendarIcon className="w-12 h-12 text-amber-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">จองคิว</h2>
                        <p className="text-slate-600 text-lg">เร็วๆ นี้</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-md">
                        <p className="text-amber-800 text-sm">
                            ระบบจองคิวกำลังอยู่ในระหว่างการพัฒนา 
                            <br />
                            ขออภัยในความไม่สะดวก
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="relative min-h-screen bg-[#007AB8] overflow-x-hidden">
            <FarmerHeader 
                title={view === 'details' && selectedBooking ? `นัดหมาย: ${selectedBooking.plotName}` : pageTitle}
                onMenuClick={onMenuClick}
                onNotificationClick={onNotificationClick}
                onBackClick={view !== 'landing' ? handleBack : undefined}
            />
            
            <div className="absolute bottom-0 left-0 w-full h-64 z-0 pointer-events-none">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 256" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M-200 100 Q 160 20, 520 100 T 1240 100 T 1960 100" stroke="white" strokeOpacity="0.1" strokeWidth="2" />
                    <path d="M-200 115 Q 160 35, 520 115 T 1240 115 T 1960 115" stroke="white" strokeOpacity="0.1" strokeWidth="2" />
                    <path d="M-200 130 Q 160 50, 520 130 T 1240 130 T 1960 130" stroke="white" strokeOpacity="0.1" strokeWidth="2" />
                    <path d="M-200 145 Q 160 65, 520 145 T 1240 145 T 1960 145" stroke="white" strokeOpacity="0.1" strokeWidth="2" />
                </svg>
            </div>

            <main className="container mx-auto p-4 sm:p-6 lg:p-8 -mt-16 relative z-10">
                {renderContent()}
            </main>

            <SeedlingBookingModal
                isOpen={isCreateModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onConfirm={handleConfirmNewBooking}
            />
        </div>
    );
};

export default FarmerBookingPage;