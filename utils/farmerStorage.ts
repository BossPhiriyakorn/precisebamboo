// utils/farmerStorage.ts
// ระบบเก็บข้อมูลเกษตรกรใน memory สำหรับการทดสอบ

export interface FarmerData {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  registrationDate: string;
  isApproved: boolean;
}

// เก็บข้อมูลเกษตรกรใน localStorage
const FARMER_STORAGE_KEY = 'farmer_registrations';

// ฟังก์ชันสำหรับตรวจสอบว่าเกษตรกรเคยลงทะเบียนแล้วหรือไม่
export const checkFarmerRegistration = (): boolean => {
  try {
    const stored = localStorage.getItem(FARMER_STORAGE_KEY);
    if (!stored) return false;
    
    const farmers: FarmerData[] = JSON.parse(stored);
    // ตรวจสอบว่ามีเกษตรกรที่ได้รับการอนุมัติแล้วหรือไม่
    return farmers.some(farmer => farmer.isApproved);
  } catch (error) {
    console.error('Error checking farmer registration:', error);
    return false;
  }
};

// ฟังก์ชันสำหรับบันทึกข้อมูลเกษตรกรใหม่
export const saveFarmerRegistration = (farmerData: Omit<FarmerData, 'id' | 'registrationDate' | 'isApproved'>): string => {
  try {
    console.log('Saving farmer registration:', farmerData);
    
    const stored = localStorage.getItem(FARMER_STORAGE_KEY);
    const farmers: FarmerData[] = stored ? JSON.parse(stored) : [];
    
    const newFarmer: FarmerData = {
      ...farmerData,
      id: generateFarmerId(),
      registrationDate: new Date().toISOString(),
      isApproved: true // สำหรับการทดสอบ ให้อนุมัติทันที
    };
    
    // ลบข้อมูลเก่าออกก่อน (ถ้ามี)
    const filteredFarmers = farmers.filter(f => !f.isApproved);
    filteredFarmers.push(newFarmer);
    
    localStorage.setItem(FARMER_STORAGE_KEY, JSON.stringify(filteredFarmers));
    
    console.log('Farmer registration saved successfully:', newFarmer);
    console.log('All farmers in storage:', filteredFarmers);
    
    return newFarmer.id;
  } catch (error) {
    console.error('Error saving farmer registration:', error);
    throw error;
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลเกษตรกรทั้งหมด
export const getAllFarmers = (): FarmerData[] => {
  try {
    const stored = localStorage.getItem(FARMER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting all farmers:', error);
    return [];
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลเกษตรกรที่ได้รับการอนุมัติ
export const getApprovedFarmer = (): FarmerData | null => {
  try {
    const farmers = getAllFarmers();
    console.log('All farmers in storage:', farmers);
    
    const approvedFarmer = farmers.find(farmer => farmer.isApproved);
    console.log('Approved farmer found:', approvedFarmer);
    
    return approvedFarmer || null;
  } catch (error) {
    console.error('Error getting approved farmer:', error);
    return null;
  }
};

// ฟังก์ชันสำหรับลบข้อมูลเกษตรกรทั้งหมด (สำหรับการทดสอบ)
export const clearAllFarmerData = (): void => {
  try {
    localStorage.removeItem(FARMER_STORAGE_KEY);
    console.log('All farmer data cleared');
  } catch (error) {
    console.error('Error clearing farmer data:', error);
  }
};

// ฟังก์ชันสำหรับ debug ข้อมูลใน localStorage
export const debugFarmerStorage = (): void => {
  try {
    const stored = localStorage.getItem(FARMER_STORAGE_KEY);
    console.log('=== Farmer Storage Debug ===');
    console.log('Raw localStorage data:', stored);
    
    if (stored) {
      const farmers = JSON.parse(stored);
      console.log('Parsed farmers data:', farmers);
      console.log('Number of farmers:', farmers.length);
      
      farmers.forEach((farmer, index) => {
        console.log(`Farmer ${index + 1}:`, {
          id: farmer.id,
          name: `${farmer.firstName} ${farmer.lastName}`,
          isApproved: farmer.isApproved,
          registrationDate: farmer.registrationDate
        });
      });
    } else {
      console.log('No farmer data found in localStorage');
    }
    console.log('=== End Debug ===');
  } catch (error) {
    console.error('Error debugging farmer storage:', error);
  }
};

// ฟังก์ชันสำหรับสร้าง ID เกษตรกร
const generateFarmerId = (): string => {
  return 'farmer_' + Math.random().toString(36).substr(2, 9);
};

// ฟังก์ชันสำหรับตรวจสอบสถานะการลงทะเบียน
export const getFarmerRegistrationStatus = (): 'not_registered' | 'registered' | 'approved' => {
  try {
    const stored = localStorage.getItem(FARMER_STORAGE_KEY);
    if (!stored) return 'not_registered';
    
    const farmers: FarmerData[] = JSON.parse(stored);
    if (farmers.length === 0) return 'not_registered';
    
    const approvedFarmer = farmers.find(farmer => farmer.isApproved);
    return approvedFarmer ? 'approved' : 'registered';
  } catch (error) {
    console.error('Error getting farmer registration status:', error);
    return 'not_registered';
  }
};

// ฟังก์ชันสำหรับอัปเดตข้อมูลเกษตรกร
export const updateFarmerData = (farmerId: string, updatedData: Partial<FarmerData>): boolean => {
  try {
    const stored = localStorage.getItem(FARMER_STORAGE_KEY);
    if (!stored) return false;
    
    const farmers: FarmerData[] = JSON.parse(stored);
    const farmerIndex = farmers.findIndex(farmer => farmer.id === farmerId);
    
    if (farmerIndex === -1) return false;
    
    // อัปเดตข้อมูลเกษตรกร
    farmers[farmerIndex] = { ...farmers[farmerIndex], ...updatedData };
    
    // บันทึกข้อมูลที่อัปเดต
    localStorage.setItem(FARMER_STORAGE_KEY, JSON.stringify(farmers));
    
    return true;
  } catch (error) {
    console.error('Error updating farmer data:', error);
    return false;
  }
};
