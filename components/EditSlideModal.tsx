import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { HeroSlide } from '../contexts/ContentContext';

interface EditSlideModalProps {
    isOpen: boolean;
    onClose: () => void;
    slide: HeroSlide | null;
    onSave: (updatedSlide: HeroSlide) => void;
}

const EditSlideModal: React.FC<EditSlideModalProps> = ({ isOpen, onClose, slide, onSave }) => {
    const [formData, setFormData] = useState({ title: '', subtitle: '', image: '' });

    useEffect(() => {
        // When the slide prop changes (i.e., when the modal is opened for a specific slide),
        // update the form data to reflect that slide's content.
        if (slide) {
            setFormData({
                title: slide.title,
                subtitle: slide.subtitle,
                image: slide.image,
            });
        }
    }, [slide]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
             if (file.size > 2 * 1024 * 1024) { // 2MB limit
                alert("Tệp quá lớn. Vui lòng chọn ảnh nhỏ hơn 2MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.subtitle || !formData.image) {
            alert("Vui lòng điền đầy đủ thông tin và chọn một hình ảnh.");
            return;
        }
        if (slide) {
            onSave({ ...slide, ...formData });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Sửa thông tin Slide">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề chính</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề phụ</label>
                    <input
                        type="text"
                        name="subtitle"
                        value={formData.subtitle}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh</label>
                    <div className="mt-1">
                        <div className="flex justify-center items-center w-full">
                            <label htmlFor="slide-image-upload" className="flex flex-col justify-center items-center w-full h-48 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-100 relative overflow-hidden">
                                {formData.image ? (
                                    <>
                                        <img src={formData.image} alt="Xem trước" className="absolute inset-0 w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                            <span className="text-white font-semibold">Thay đổi ảnh</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col justify-center items-center pt-5 pb-6">
                                        <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Nhấn để tải ảnh lên</span></p>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF (Tối đa 2MB)</p>
                                    </div>
                                )}
                                <input 
                                    id="slide-image-upload" 
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
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Hủy</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Lưu</button>
                </div>
            </form>
        </Modal>
    );
};

export default EditSlideModal;