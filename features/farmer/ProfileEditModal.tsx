// features/farmer/ProfileEditModal.tsx
// คอมโพเนนต์หน้าต่าง (Modal) สำหรับแก้ไขรูปโปรไฟล์

import React, { useState, useEffect, ChangeEvent, useRef } from 'react';
import { Profile } from '../../types';
import * as Icons from '../../constants';

// Props
interface ProfileEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: Profile;
    onSave: (updatedProfile: Profile) => void;
}


const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose, profile, onSave }) => {
    // State for avatar image
    const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setAvatarUrl(profile.avatarUrl);
            setPreviewUrl(null);
        }
    }, [profile.avatarUrl, isOpen]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('ขนาดไฟล์ต้องไม่เกิน 5MB');
                return;
            }

            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedProfile = {
            ...profile,
            avatarUrl: previewUrl || avatarUrl
        };
        onSave(updatedProfile);
    };

    const handleRemoveImage = () => {
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <header className="relative z-10 flex-shrink-0 text-white py-6 shadow-lg rounded-t-2xl" style={{ 
                    background: 'linear-gradient(180deg, #005596 0%, #009DDC 100%)'
                }}>
                    <div className="absolute inset-0 bg-black/20 rounded-t-2xl"></div>
                    <div className="relative container mx-auto px-4">
                        <div className="flex items-center justify-center">
                            <button onClick={onClose} className="absolute left-4 p-2 rounded-full hover:bg-white/10">
                                <Icons.ChevronLeftIcon className="w-6 h-6" />
                            </button>
                            <h1 className="text-xl font-bold">แก้ไขรูปโปรไฟล์</h1>
                        </div>
                    </div>
                </header>
                
                {/* Form Content */}
                <form onSubmit={handleSave} className="p-6 space-y-6">
                    {/* Current Profile Picture */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <div className="w-32 h-32 bg-gray-200 rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                                <img 
                                    src={previewUrl || avatarUrl} 
                                    alt="Profile Preview" 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                        </div>
                        
                        {/* File Input */}
                        <div className="w-full">
                            <label className="block text-sm font-bold text-slate-700 mb-2">เลือกรูปโปรไฟล์</label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition text-black bg-white"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                รองรับไฟล์: JPG, PNG, GIF (ขนาดไม่เกิน 5MB)
                            </p>
                        </div>

                        {/* Action Buttons */}
                        {previewUrl && (
                            <div className="flex space-x-2">
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white transition-colors"
                                    style={{ borderRadius: '5px' }}
                                >
                                    ยกเลิก
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Footer with Save Button */}
                    <div className="pt-4 border-t border-gray-200">
                        <button 
                            type="submit" 
                            className="w-full text-white font-bold py-3 px-6 shadow-md transition-colors text-lg"
                            style={{ 
                                backgroundColor: '#54B948',
                                borderRadius: '5px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#4A9E3F';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#54B948';
                            }}
                        >
                            บันทึกรูปภาพ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileEditModal;