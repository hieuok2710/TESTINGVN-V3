import React, { useState, useRef, useEffect } from 'react';
import { GALLERY_IMAGES } from '../constants';

const IMAGES_PER_PAGE = 8;

const LoadingIndicator: React.FC = () => (
    <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
);

const PhotoGallery: React.FC = () => {
    const [page, setPage] = useState(1);
    
    const displayedImages = GALLERY_IMAGES.slice(0, page * IMAGES_PER_PAGE);
    const hasMore = displayedImages.length < GALLERY_IMAGES.length;

    const loaderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage(prevPage => prevPage + 1);
                }
            },
            { rootMargin: "400px" } // Load images when user is 400px away from the bottom
        );

        const currentLoader = loaderRef.current;
        if (currentLoader) {
            observer.observe(currentLoader);
        }

        return () => {
            if (currentLoader) {
                observer.unobserve(currentLoader);
            }
        };
    }, [hasMore]);

    return (
        <section className="py-16 sm:py-20 bg-slate-100">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="section-title">Thư Viện <span className="gradient-text">Ảnh</span></h2>
                    <p className="section-subtitle">Lưu giữ những kỷ niệm đẹp và các hoạt động sôi nổi của nhà trường.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {displayedImages.map((src, index) => (
                        <div key={index} className="overflow-hidden rounded-xl shadow-lg group relative aspect-w-1 aspect-h-1">
                            <button className="w-full h-full text-left" aria-label={`View larger image for gallery image ${index + 1}`}>
                                <img src={src} alt={`Gallery image ${index + 1}`} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"/>
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-500 flex justify-center items-center">
                                    <svg aria-hidden="true" className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                </div>
                            </button>
                        </div>
                    ))}
                </div>
                <div ref={loaderRef} style={{ height: '20px' }}/>
                {hasMore && <LoadingIndicator />}
            </div>
        </section>
    );
};

export default PhotoGallery;