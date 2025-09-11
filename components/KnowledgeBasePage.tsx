// components/KnowledgeBasePage.tsx
// คอมโพเนนต์สำหรับหน้าคลังความรู้
// จัดการการแสดงผลทั้งในรูปแบบรายการบทความ (list view) และหน้ารายละเอียดบทความ (detail view)

import React, { useState, useEffect, useMemo } from 'react';
import { KnowledgeArticle } from '../types';
import * as Icons from '../constants';


// Props ที่คอมโพเนนตต้องการ
interface KnowledgeBasePageProps {
    articles: KnowledgeArticle[];                // รายการบทความทั้งหมด
    initialSelectedArticleId?: string | null;   // ID ของบทความที่ถูกเลือกมาตอนแรก (ถ้ามี)
    onClearSelection?: () => void;              // ฟังก์ชันที่จะทำงานเมื่อเคลียร์การเลือกบทความ
}

// Thai month map for date parsing
const thaiMonthMap: { [key: string]: number } = {
    'ม.ค.': 0, 'ก.พ.': 1, 'มี.ค.': 2, 'เม.ย.': 3, 'พ.ค.': 4, 'มิ.ย.': 5,
    'ก.ค.': 6, 'ส.ค.': 7, 'ก.ย.': 8, 'ต.ค.': 9, 'พ.ย.': 10, 'ธ.ค.': 11
};

// Date parsing function
const parseThaiDate = (dateStr: string): Date => {
    const parts = dateStr.split(' ');
    if (parts.length !== 3) return new Date(0); // Invalid format
    
    const day = parseInt(parts[0], 10);
    const month = thaiMonthMap[parts[1]];
    const year = parseInt(parts[2], 10) - 543; // Convert BE to AD

    if (isNaN(day) || month === undefined || isNaN(year)) {
        return new Date(0);
    }
    
    return new Date(year, month, day);
};


const KnowledgeBasePage: React.FC<KnowledgeBasePageProps> = ({ articles, initialSelectedArticleId, onClearSelection }) => {
    
    // ฟังก์ชันสำหรับค้นหาบทความจาก ID
    const findArticleById = (id: string | null): KnowledgeArticle | null => {
        if (!id) return null;
        return articles.find(a => a.id === id) || null;
    };

    // State สำหรับเก็บข้อมูลบทความที่กำลังถูกเลือกดู, การกรอง, และการเรียงลำดับ
    const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(() => findArticleById(initialSelectedArticleId || null));
    const [category, setCategory] = useState('ทั้งหมด');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    
    // useEffect เพื่ออัปเดต selectedArticle เมื่อ initialSelectedArticleId เปลี่ยนแปลง
    useEffect(() => {
        setSelectedArticle(findArticleById(initialSelectedArticleId || null));
    }, [initialSelectedArticleId, articles]);

    // ฟังก์ชันสำหรับกลับไปหน้ารายการบทความ
    const handleGoBack = () => {
        setSelectedArticle(null);
        if (onClearSelection) {
            onClearSelection();
        }
    };
    
    // สร้างรายการหมวดหมู่จากข้อมูลบทความ
    const categories = useMemo(() => ['ทั้งหมด', ...new Set(articles.map(a => a.category))], [articles]);

    // กรองและเรียงลำดับบทความ
    const displayedArticles = useMemo(() => {
        return articles
            .filter(article => category === 'ทั้งหมด' || article.category === category)
            .sort((a, b) => {
                const dateA = parseThaiDate(a.postDate).getTime();
                const dateB = parseThaiDate(b.postDate).getTime();
                return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
            });
    }, [articles, category, sortOrder]);


    // === ส่วนแสดงผลหน้ารายละเอียดบทความ ===
    if (selectedArticle) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <img src={selectedArticle.imageUrl} alt={selectedArticle.title} className="w-full h-80 object-cover" />
                    <div className="p-6 md:p-8">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-slate-900">{selectedArticle.title}</h1>
                        <p className="text-slate-500 mb-6 text-sm">เผยแพร่เมื่อ: {selectedArticle.postDate} • หมวดหมู่: {selectedArticle.category}</p>
                        <div className="prose max-w-none text-slate-800">
                           <p>{selectedArticle.content.repeat(10)}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // === ส่วนแสดงผลหน้ารายการบทความ ===
    return (
        <div className="space-y-6">
             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                 <div className="relative w-full sm:w-64">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full appearance-none bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-slate-800 leading-tight focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 font-semibold"
                    >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <Icons.ChevronDownIcon className="w-5 h-5"/>
                    </div>
                </div>
                <button
                    onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 bg-white border border-gray-300 rounded-lg font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                >
                    <span>{sortOrder === 'newest' ? 'ใหม่สุด' : 'เก่าสุด'}</span>
                    <Icons.AdjustmentsHorizontalIcon className="w-5 h-5 text-slate-500 rotate-90" />
                </button>
            </div>

             <div className="grid grid-cols-2 gap-4">
                {displayedArticles.map((article) => (
                    <div key={article.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-1">
                        <img src={article.imageUrl || 'https://images.unsplash.com/photo-1516586711933-7c3905534346?q=80&w=800&auto-format&fit=crop'} alt={article.title} className="w-full h-40 object-cover" />
                        <div className="p-4 flex flex-col flex-grow">
                            <h3 className="font-bold text-lg text-slate-800 leading-tight mb-2 line-clamp-2 min-h-[3.5rem]">{article.title}</h3>
                            <p className="text-sm text-slate-600 mb-4 flex-grow line-clamp-2">{article.content}</p>
                            <div className="flex items-center gap-2 mt-auto pt-2 text-xs text-slate-500 border-t border-slate-100">
                                <span>{article.postDate}</span>
                                <button onClick={() => setSelectedArticle(article)} className="font-semibold text-blue-500 hover:text-blue-700">
                                    อ่านเพิ่มเติม &gt;&gt;
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
             </div>
        </div>
    );
};

export default KnowledgeBasePage;