// types.ts
// ไฟล์นี้ใช้สำหรับนิยาม Type และ Interface ทั้งหมดที่ใช้ในโปรเจค

import React from 'react';

// Enumสำหรับบทบาทของผู้ใช้
export enum UserRole {
  FARMER = 'เกษตรกร',
  FACTORY = 'โรงงาน',
  ADMIN = 'แอดมิน',
}

// Enumสำหรับหน้าต่างๆ ในแอปพลิเคชัน
export enum Page {
  DASHBOARD = 'แดชบอร์ดรวม',
  USER_MANAGEMENT = 'จัดการผู้ใช้',
  MASTER_DATA = 'จัดการข้อมูลหลัก',
  COMMUNITY = 'จัดการระบบชุมชนและความรู้',
  MONITORING = 'ระบบติดตามและตรวจสอบ',
  // Farmer/Factory specific pages
  BOOKING = 'จองคิว',
  CALENDAR = 'ปฎิทิน',
  KNOWLEDGE = 'ข่าวสาร',
  FINANCE = 'การเงินและการขนส่ง',
  PROFILE = 'โปรไฟล์',
  PLOT_MANAGEMENT = 'จัดการแปลงปลูก',
  CONTRACT = 'สัญญา',
  CHECK_STATUS = 'ตรวจสอบสถานะ',
  SHIPMENT_STATUS = 'สถานะขนส่ง',
  PRACTICE_CALENDAR = 'ปฎิทินการปฎิบัตร',
}

// Enumสำหรับสถานะการจองคิว
export enum BookingStatus {
  PENDING = 'รอดำเนินการ',
  CONFIRMED = 'ยืนยันแล้ว',
  COMPLETED = 'เสร็จสิ้น',
  REJECTED = 'ปฏิเสธ',
}

// Base Interface for Booking
interface BookingBase {
  id: string;
  date: string;
  description: string;
  status: BookingStatus;
  address?: string; 
  estimatedQuantity?: string;
  plotName?: string;
  supervisorName?: string;
  type?: string; // For filtering
  bambooSpecies?: string; // For seedling details
  bambooVariety?: string; // For seedling details
}

// Specific type for Farmer's view and their bookings in Admin view
export interface FarmerBooking extends BookingBase {
  userType: UserRole.FARMER;
  userName: string; // Farmer's name
}

// Specific type for Factory's view and their bookings in Admin view
export interface FactoryBooking extends BookingBase {
  userType: UserRole.FACTORY;
  userName: string; // Factory's name
  farmerName: string; // The farmer they are visiting
  pickupLocation: string; // Farmer's address, but specific for this context
}

// Union type for use in components that can handle both
export type Booking = (FarmerBooking | FactoryBooking) & {
    // These fields are kept for broader compatibility but new logic should use the specific types
    userType?: UserRole.FARMER | UserRole.FACTORY;
    userName?: string;
    farmerName?: string;
    pickupLocation?: string;
    bambooSpecies?: string;
    bambooVariety?: string;
};


// Enumสำหรับสถานะการขนส่ง (แบบย่อ)
export enum ShipmentStatus {
  PREPARING = 'Preparing',
  IN_TRANSIT = 'In Transit',
  DELIVERED = 'Delivered',
}

// Enum สำหรับสถานะการขนส่งแบบละเอียด (สำหรับ Stepper)
export enum ShipmentProgressStatus {
    EN_ROUTE_TO_PLOT = 'ขนส่งกำลังไปยังแปลงปลูกของคุณ',
    ARRIVED_AT_PLOT = 'ขนส่งไปถึงแปลงปลูก',
    PICKING_UP = 'ขนส่งเข้ารับไผ่',
    EN_ROUTE_TO_FACTORY = 'ขนส่งนำไผ่กลับไปยังโรงงาน',
    COMPLETED = 'ขนส่งสำเร็จ', // สถานะสุดท้าย
}


// Interface สำหรับข้อมูลการขนส่ง
export interface Shipment {
  id: string;
  title: string;
  date: string;
  from: string;
  to: string;
  status: ShipmentStatus; // สถานะแบบย่อ
}

// Interface สำหรับข้อมูลการขนส่งของเกษตรกร (แบบละเอียด)
export interface FarmerShipment {
    id: string;
    date: string;
    statusText: string;
    statusColor: 'red' | 'green' | 'blue';
    plotName: string;
    supervisorName: string;
    detailedStatus: ShipmentProgressStatus;
    // Optional details for expanded view
    factoryName?: string;
    netWeight?: string;
}


// Enum สำหรับสถานะการชำระเงิน
export enum PaymentStatus {
  PAID = 'สำเร็จ',
  PENDING = 'รอดำเนินการ',
}

// Interface สำหรับข้อมูลการชำระเงิน
export interface Payment {
  id: string;
  description: string;
  date: string;
  amount: string;
  status: PaymentStatus;
}

// Interface for structured address
export interface Address {
    province: string;
    district: string;
    subdistrict: string;
    postalCode: string;
    moo: string;
    street: string;
    soi: string;
    fullAddressText?: string; // Optional full text representation
}

// Interface for Promoter Information
export interface PromoterInfo {
    name: string;
    phone: string;
    email: string;
}

// Enum for Farmer Status
export enum FarmerStatus {
    APPROVED = 'อนุมัติ',
    PENDING = 'รอดำเนินการ',
    REJECTED = 'ไม่อนุมัติ',
}

// สถานะการลงทะเบียนและเอกสาร
export enum RegistrationStatus {
  NOT_REGISTERED = 'ยังไม่ลงทะเบียน',
  REGISTERED = 'ลงทะเบียนแล้ว',
  DOCUMENTS_SUBMITTED = 'ส่งเอกสารแล้ว',
  APPROVED = 'อนุมัติแล้ว'
}

// สถานะการมอบหมายนักส่งเสริม
export enum PromoterStatus {
  NOT_ASSIGNED = 'ยังไม่มอบหมาย',
  ASSIGNED = 'มอบหมายแล้ว',
  CONFIRMED = 'ยืนยันแล้ว',
  REJECTED = 'ปฏิเสธ'
}

// Interface สำหรับข้อมูลโปรไฟล์ผู้ใช้ (Updated)
export interface Profile {
  id?: string; // เพิ่ม id เป็น optional
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  lineId?: string; // ทำให้ optional
  address: Address;
  avatarUrl?: string; // ทำให้ optional
  status: FarmerStatus;
  promoterInfo?: PromoterInfo;
  // เพิ่มสถานะใหม่
  registrationStatus?: RegistrationStatus;
  promoterStatus?: PromoterStatus;
  hasSubmittedDocuments?: boolean;
  isDeveloperMode?: boolean; // สำหรับการทดสอบโดยนักพัฒนา
}

// Enum for Knowledge Article Status in Admin Panel
export enum KnowledgeArticleStatus {
    PUBLISHED = 'เผยแพร่แล้ว',
    HIDDEN = 'ซ่อน',
}

// Interface สำหรับบทความในคลังความรู้
export interface KnowledgeArticle {
  id: string;
  title: string;
  imageUrl: string;
  content: string;
  postDate: string;
  status: KnowledgeArticleStatus;
  category: string;
  link?: string;
}

// Enum สำหรับประเภทของการแจ้งเตือน
export enum NotificationType {
  KNOWLEDGE = 'คลังความรู้',
  BOOKING_REMINDER = 'แจ้งเตือนนัดหมาย',
  ADMIN_UPDATE = 'ประกาศจากแอดมิน',
}

// Interface สำหรับข้อมูลการแจ้งเตือน
export interface Notification {
  id: string;
  type: NotificationType;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; // ไอคอนเป็น React Component
  title: string;
  message: string;
  date: string;
  read: boolean; // สถานะการอ่าน
}

// Interface for the slide-out notification panel
export interface SimpleNotification {
  id: string;
  message: string;
  timestamp: string;
  isLatest: boolean;
}

// Interface สำหรับรายการเมนูในแถบนำทาง (Navigation Bar)
export interface NavItem {
    page: Page;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; // ไอคอนเป็น React Component
}

// ---- Auth Types ----
export type AuthStatus = 'loading' | 'unauthenticated' | 'authenticated';
export interface LineProfile {
    userId: string;
    displayName: string;
    pictureUrl: string;
}

// Interface for Plot data used in dropdowns
export interface Plot {
    id: string;
    name: string;
}

// ---- Farmer Status Check Types ----
export enum RegistrationStatusType {
    APPROVED = 'อนุมัติ',
    PENDING = 'รออนุมัติ',
    REJECTED = 'ไม่อนุมัติ',
}

export interface RegistrationStatusItem {
    id: string;
    title: string;
    status: RegistrationStatusType;
    date: string;
    rejectionReason?: string;
    details: {
        promoterInfo: PromoterInfo;
        personalInfo: Profile;
        plotInfo: PlotDetails;
    };
}

// ---- Farmer Contract Page Types ----
export interface ContractDetails {
    id: string;
    name: string; // e.g., "สัญญาฉบับที่ 01"
    date: string;
}

export interface ContractPlot {
    id: string;
    code: string; // e.g., "BambooLnwzaa001"
    location: string;
    imageUrl: string;
    signedDate: string;
    contracts: ContractDetails[];
    isPending?: boolean; // To differentiate between signed and pending plots
}


// ---- Admin Specific Types ----

// Enum for User Status in Admin Panel
export enum UserStatus {
    ACTIVE = 'ใช้งาน',
    PENDING = 'รออนุมัติ',
    INACTIVE = 'ไม่ใช้งาน',
}

// Interface for user data in the admin panel
export interface AdminUser {
    id: string;
    name: string;
    email: string;
    avatarInitials: string;
    avatarColor: string; // Tailwind bg color class e.g., 'bg-blue-200'
    status: UserStatus;
    registrationDate: string;
}

// Interface for recent activity data in the admin panel
export interface AdminActivity {
    id: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    iconBg: string; // Tailwind bg color class
    description: string; // Can contain HTML for bolding names etc.
    time: string;
}

// Interface for news on admin dashboard
export interface AdminNews {
    id: string;
    title: string;
    category: 'ประกาศ' | 'ข่าวสาร';
    date: string;
}

// ---- Master Data Management Types ----

export interface BambooSpecies {
    id: string;
    name: string; // ชื่อสายพันธุ์
    type: 'พันธุ์แท้' | 'ลูกผสม'; // ประเภท: พันธุ์แท้ / ลูกผสม
    parentage?: string; // เชื้อสาย (ถ้าเป็นลูกผสม) e.g., "กิมซุ่ง x ตงลืมแล้ง"
    harvestAge: string; // อายุเก็บเกี่ยว (e.g., "8 เดือน - 1 ปี")
    avgYield: string; // ผลผลิตเฉลี่ย (e.g., "1,500 - 2,000 กก./ไร่/ปี")
    avgHeight: string; // ความสูงเฉลี่ย (e.g., "15-20 เมตร")
    notableFeatures: string; // ลักษณะเด่น
    suitability: string; // ความเหมาะสม (e.g., "ดินร่วนปนทราย, ต้องการน้ำมาก")
}

export interface Equipment {
    id: string;
    name: string;
    description: string;
    supplier: string;
}

export interface EnvironmentalData {
    id: string;
    category: 'ปุ๋ย' | 'ใบอนุญาต';
    name: string;
    description: string;
}

// ---- Monitoring System Types ----
export enum MonitoringRequestStatus {
    PENDING = 'รอดำเนินการ',
    IN_PROGRESS = 'กำลังตรวจสอบ',
    COMPLETED = 'เสร็จสิ้น',
}

export interface MonitoringRequest {
    id:string;
    requesterName: string;
    requestType: 'ตรวจสอบคุณภาพดิน' | 'ตรวจสอบโรคพืช' | 'ประเมินคาร์บอนเครดิต' | 'อื่นๆ';
    requestDate: string;
    status: MonitoringRequestStatus;
    assignedTo: string | null;
}

// ---- Quota Management Types ----
export interface FactoryQuota {
    id: string;
    name: string;
    used: number;
    total: number;
}

export interface MaterialQuota {
    used: number;
    total: number;
}

export interface MonthlyQuota {
    monthKey: string;
    monthName: string;
    factoryQuotas: FactoryQuota[];
    seedQuota: MaterialQuota;
    fertilizerQuota: MaterialQuota;
}


// ---- Farmer Data Types ----
export interface PlotDetails {
    totalArea: string;
    soilType: string;
    waterSource: string;
    otherCropsArea: string;
    plotBreakdown: string[];
    bambooCount: number;
    averageAge: string;
}