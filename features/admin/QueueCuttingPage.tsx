// features/admin/QueueCuttingPage.tsx
// หน้าจัดการคิวตัดไผ่สำหรับแอดมิน

import React, { useState } from 'react';
import Card from '../../components/Card';
import * as Icons from '../../constants';
import { Booking, BookingStatus, UserRole } from '../../types';

// Mock data for cutting queue management
const mockCuttingQueueData: Booking[] = [
    {
        id: '1',
        date: '18/12/2567',
        description: 'จองคิวตัดไผ่: กิมซุ่ง อายุ 8 เดือน จำนวน 200 ต้น',
        status: BookingStatus.PENDING,
        userType: UserRole.FARMER,
        userName: 'สมชาย ใจดี',
        address: '123 หมู่ 1 ต.บ้านนา อ.เมือง จ.นครราชสีมา 30000',
        estimatedQuantity: '200 ต้น',
        plotName: 'แปลง A',
        supervisorName: 'สมพง มีเงิน',
        type: 'จองคิวการตัดไผ่',
        bambooSpecies: 'กิมซุ่ง',
        bambooVariety: 'พันธุ์แท้'
    },
    {
        id: '2',
        date: '19/12/2567',
        description: 'จองคิวตัดไผ่: ตงลืมแล้ง อายุ 10 เดือน จำนวน 150 ต้น',
        status: BookingStatus.CONFIRMED,
        userType: UserRole.FARMER,
        userName: 'สมหญิง รักดี',
        address: '456 หมู่ 2 ต.บ้านใหม่ อ.เมือง จ.นครราชสีมา 30000',
        estimatedQuantity: '150 ต้น',
        plotName: 'แปลง B',
        supervisorName: 'สมพง มีเงิน',
        type: 'จองคิวการตัดไผ่',
        bambooSpecies: 'ตงลืมแล้ง',
        bambooVariety: 'พันธุ์แท้'
    },
    {
        id: '3',
        date: '20/12/2567',
        description: 'จองคิวตัดไผ่: ไผ่รวก อายุ 12 เดือน จำนวน 300 ต้น',
        status: BookingStatus.COMPLETED,
        userType: UserRole.FARMER,
        userName: 'สมศักดิ์ ใจงาม',
        address: '789 หมู่ 3 ต.บ้านเก่า อ.เมือง จ.นครราชสีมา 30000',
        estimatedQuantity: '300 ต้น',
        plotName: 'แปลง C',
        supervisorName: 'สมพง มีเงิน',
        type: 'จองคิวการตัดไผ่',
        bambooSpecies: 'ไผ่รวก',
        bambooVariety: 'ลูกผสม'
    }
];

const QueueCuttingPage: React.FC = () => {
    const [selectedStatus, setSelectedStatus] = useState<BookingStatus | 'all'>('all');
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    const filteredBookings = selectedStatus === 'all' 
        ? mockCuttingQueueData 
        : mockCuttingQueueData.filter(booking => booking.status === selectedStatus);

    const getStatusColor = (status: BookingStatus) => {
        switch (status) {
            case BookingStatus.PENDING:
                return 'bg-yellow-100 text-yellow-800';
            case BookingStatus.CONFIRMED:
                return 'bg-blue-100 text-blue-800';
            case BookingStatus.COMPLETED:
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: BookingStatus) => {
        switch (status) {
            case BookingStatus.PENDING:
                return 'รอดำเนินการ';
            case BookingStatus.CONFIRMED:
                return 'ยืนยันแล้ว';
            case BookingStatus.COMPLETED:
                return 'เสร็จสิ้น';
            default:
                return status;
        }
    };

    const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
        // In a real app, this would update the database
        console.log(`Changing booking ${bookingId} status to ${newStatus}`);
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

    if (selectedBooking) {
        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setSelectedBooking(null)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Icons.ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">รายละเอียดการจองคิวตัดไผ่</h1>
                    </div>
                </div>

                {/* Booking Details */}
                <Card>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">ข้อมูลเกษตรกร</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">ชื่อ-นามสกุล</label>
                                        <p className="text-gray-900">{selectedBooking.userName}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">ที่อยู่</label>
                                        <p className="text-gray-900">{selectedBooking.address}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">แปลงปลูก</label>
                                        <p className="text-gray-900">{selectedBooking.plotName}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">ผู้ควบคุม</label>
                                        <p className="text-gray-900">{selectedBooking.supervisorName}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">ข้อมูลการจอง</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">วันที่จอง</label>
                                        <p className="text-gray-900">{formatThaiDate(selectedBooking.date)}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">สถานะ</label>
                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedBooking.status)}`}>
                                            {getStatusText(selectedBooking.status)}
                                        </span>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">สายพันธุ์</label>
                                        <p className="text-gray-900">{selectedBooking.bambooSpecies} ({selectedBooking.bambooVariety})</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">จำนวนที่จะตัด</label>
                                        <p className="text-gray-900">{selectedBooking.estimatedQuantity}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">รายละเอียดเพิ่มเติม</h3>
                            <p className="text-gray-700">{selectedBooking.description}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3 pt-4 border-t">
                            {selectedBooking.status === BookingStatus.PENDING && (
                                <>
                                    <button
                                        onClick={() => handleStatusChange(selectedBooking.id, BookingStatus.CONFIRMED)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        ยืนยันการจอง
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(selectedBooking.id, BookingStatus.REJECTED)}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        ปฏิเสธ
                                    </button>
                                </>
                            )}
                            {selectedBooking.status === BookingStatus.CONFIRMED && (
                                <button
                                    onClick={() => handleStatusChange(selectedBooking.id, BookingStatus.COMPLETED)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    หมายเหตุเสร็จสิ้น
                                </button>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">จัดการคิวตัดไผ่</h1>
                    <p className="text-gray-600 mt-1">จัดการการจองคิวตัดไผ่จากเกษตรกร</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Icons.BambooIcon className="w-8 h-8 text-green-600" />
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Icons.ClockIcon className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">รอดำเนินการ</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {mockCuttingQueueData.filter(b => b.status === BookingStatus.PENDING).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Icons.CheckIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">ยืนยันแล้ว</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {mockCuttingQueueData.filter(b => b.status === BookingStatus.CONFIRMED).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Icons.CheckIcon className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">เสร็จสิ้น</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {mockCuttingQueueData.filter(b => b.status === BookingStatus.COMPLETED).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filter and Table */}
            <Card>
                <div className="p-6">
                    {/* Filter */}
                    <div className="mb-6">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setSelectedStatus('all')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    selectedStatus === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                ทั้งหมด
                            </button>
                            <button
                                onClick={() => setSelectedStatus(BookingStatus.PENDING)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    selectedStatus === BookingStatus.PENDING
                                        ? 'bg-yellow-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                รอดำเนินการ
                            </button>
                            <button
                                onClick={() => setSelectedStatus(BookingStatus.CONFIRMED)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    selectedStatus === BookingStatus.CONFIRMED
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                ยืนยันแล้ว
                            </button>
                            <button
                                onClick={() => setSelectedStatus(BookingStatus.COMPLETED)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    selectedStatus === BookingStatus.COMPLETED
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                เสร็จสิ้น
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        เกษตรกร
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        วันที่จอง
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        สายพันธุ์
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        จำนวนที่จะตัด
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        สถานะ
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        การดำเนินการ
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{booking.userName}</div>
                                                <div className="text-sm text-gray-500">{booking.plotName}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatThaiDate(booking.date)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm text-gray-900">{booking.bambooSpecies}</div>
                                                <div className="text-sm text-gray-500">{booking.bambooVariety}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {booking.estimatedQuantity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                                                {getStatusText(booking.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => setSelectedBooking(booking)}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                            >
                                                ดูรายละเอียด
                                            </button>
                                            {booking.status === BookingStatus.PENDING && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusChange(booking.id, BookingStatus.CONFIRMED)}
                                                        className="text-green-600 hover:text-green-900 mr-3"
                                                    >
                                                        ยืนยัน
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(booking.id, BookingStatus.REJECTED)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        ปฏิเสธ
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredBookings.length === 0 && (
                        <div className="text-center py-12">
                            <Icons.BambooIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">ไม่พบข้อมูลการจองคิวตัดไผ่</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default QueueCuttingPage;
