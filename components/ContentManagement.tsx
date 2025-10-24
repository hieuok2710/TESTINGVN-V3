import React, { useState } from 'react';
import { useContent, NewsItem, HeroSlide } from '../contexts/ContentContext';
import Modal from './Modal';
import EditSlideModal from './EditSlideModal';

const ContentManagement: React.FC = () => {
    const { newsItems, heroSlides, addNews, updateNews, deleteNews, updateHeroSlide } = useContent();

    // State for News Modal
    const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
    const [currentNewsItem, setCurrentNewsItem] = useState<NewsItem | null>(null);
    const [newsFormData, setNewsFormData] = useState({ title: '', category: '', image: '', date: '' });
    const [isDragging, setIsDragging] = useState(false);

    // State for Slide Modal
    const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState<HeroSlide | null>(null);


    // News Handlers
    const processNewsImage = (file: File) => {
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                alert("Tệp quá lớn. Vui lòng chọn ảnh nhỏ hơn 2MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewsFormData(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processNewsImage(file);
        }
    };
    
    const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation(); // Necessary to allow drop
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files && e.dataTransfer.files[0];
        if (file) {
            processNewsImage(file);
        }
    };


    const handleNewsFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewsFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleOpenNewsModal = (item: NewsItem | null) => {
        setCurrentNewsItem(item);
        if (item) {
             setNewsFormData({ title: item.title, category: item.category, image: item.image, date: item.date });
        } else {
             setNewsFormData({ title: '', category: 'Tin tức', image: '', date: '' });
        }
        setIsNewsModalOpen(true);
    };

    const handleSaveNews = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newsFormData.title || !newsFormData.category || !newsFormData.image) {
            alert("Vui lòng điền đầy đủ thông tin và chọn một hình ảnh.");
            return;
        }
        if (currentNewsItem) {
            updateNews({ ...currentNewsItem, ...newsFormData });
        } else {
            const { title, category, image } = newsFormData;
            addNews({ title, category, image });
        }
        setIsNewsModalOpen(false);
    };

    const handleDeleteNews = (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa tin tức này không?')) {
            deleteNews(id);
        }
    };

    // Slide Handlers
    const handleOpenSlideModal = (slide: HeroSlide) => {
        setCurrentSlide(slide);
        setIsSlideModalOpen(true);
    };

    const handleCloseSlideModal = () => {
        setIsSlideModalOpen(false);
        setCurrentSlide(null);
    };
    
    const handleSaveSlide = (updatedSlide: HeroSlide) => {
        updateHeroSlide(updatedSlide);
        handleCloseSlideModal();
    };

    return (
        <div className="space-y-12">
            {/* News Management Section */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">Quản lý Tin tức nổi bật</h2>
                    <button onClick={() => handleOpenNewsModal(null)} className="px-4 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition-colors">
                        Thêm tin mới
                    </button>
                </div>
                <div className="space-y-2">
                    {newsItems.map(item => (
                        <div key={item.id} className="p-3 border rounded-lg bg-white shadow-sm flex justify-between items-center">
                             <div className="flex items-center overflow-hidden">
                                <img src={item.image} alt={item.title} className="w-24 h-16 object-cover rounded-md mr-4 flex-shrink-0 hidden sm:block"/>
                                <div className="truncate">
                                    <p className="font-bold text-gray-800 truncate">{item.title}</p>
                                    <p className="text-sm text-gray-500">{item.category} &bull; {item.date}</p>
                                </div>
                            </div>
                            <div className="space-x-3 flex-shrink-0 ml-4">
                                <button onClick={() => handleOpenNewsModal(item)} className="text-blue-600 hover:text-blue-900 font-medium">Sửa</button>
                                <button onClick={() => handleDeleteNews(item.id)} className="text-red-600 hover:text-red-900 font-medium">Xóa</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hero Slider Management Section */}
            <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quản lý Ảnh bìa (Slider)</h2>
                <div className="space-y-2">
                     {heroSlides.map(slide => (
                        <div key={slide.id} className="p-3 border rounded-lg bg-white shadow-sm flex items-center">
                            <img src={slide.image} alt={slide.title} className="w-32 h-16 object-cover rounded-md mr-4 flex-shrink-0"/>
                            <div className="flex-grow overflow-hidden">
                                <p className="font-bold text-gray-800 truncate">{slide.title}</p>
                                <p className="text-sm text-gray-500 truncate">{slide.subtitle}</p>
                            </div>
                            <button onClick={() => handleOpenSlideModal(slide)} className="text-blue-600 hover:text-blue-900 font-medium ml-4 flex-shrink-0">Sửa</button>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* News Modal */}
            <Modal isOpen={isNewsModalOpen} onClose={() => setIsNewsModalOpen(false)} title={currentNewsItem ? "Sửa tin tức" : "Thêm tin tức mới"}>
                <form onSubmit={handleSaveNews} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                        <input type="text" name="title" value={newsFormData.title} onChange={handleNewsFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Chuyên mục</label>
                        <input type="text" name="category" value={newsFormData.category} onChange={handleNewsFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    {currentNewsItem && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày đăng</label>
                            <input type="text" name="date" value={newsFormData.date} onChange={handleNewsFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh</label>
                        <div className="mt-1">
                            <div className="flex justify-center items-center w-full">
                                <label 
                                    htmlFor="news-image-upload" 
                                    className={`flex flex-col justify-center items-center w-full h-48 bg-gray-50 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-100' : 'border-gray-300 hover:bg-gray-100'}`}
                                    onDragEnter={handleDragEnter}
                                    onDragLeave={handleDragLeave}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                >
                                    {newsFormData.image ? (
                                        <>
                                            <img src={newsFormData.image} alt="Xem trước" className="absolute inset-0 w-full h-full object-cover rounded-lg" />
                                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <span className="text-white font-semibold">Thay đổi ảnh</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col justify-center items-center pt-5 pb-6 text-center">
                                            <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Nhấn để tải ảnh lên</span> hoặc kéo và thả</p>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF (Tối đa 2MB)</p>
                                        </div>
                                    )}
                                    <input 
                                        id="news-image-upload" 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={handleImageUpload} 
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={() => setIsNewsModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Hủy</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Lưu</button>
                    </div>
                </form>
            </Modal>

            {/* Slider Modal */}
            <EditSlideModal 
                isOpen={isSlideModalOpen}
                onClose={handleCloseSlideModal}
                slide={currentSlide}
                onSave={handleSaveSlide}
            />
        </div>
    );
};

export default ContentManagement;