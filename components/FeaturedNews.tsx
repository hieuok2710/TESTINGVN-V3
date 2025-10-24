import React, { useState, useRef, useEffect } from 'react';
import { useContent } from '../contexts/ContentContext';

const NEWS_PER_PAGE = 4;

const LoadingIndicator: React.FC = () => (
    <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
);

const FeaturedNews: React.FC = () => {
    const { newsItems } = useContent();
    const [page, setPage] = useState(1);
    
    const displayedNews = newsItems.slice(0, page * NEWS_PER_PAGE);
    const hasMore = displayedNews.length < newsItems.length;

    const loaderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                // isIntersecting is a boolean that's true when the element is visible.
                if (entries[0].isIntersecting && hasMore) {
                    setPage(prevPage => prevPage + 1);
                }
            },
            { rootMargin: "200px" } // Load content 200px before it comes into view
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
    }, [hasMore]); // Rerun effect if 'hasMore' changes

    return (
        <section className="py-16 sm:py-20 bg-slate-100">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="section-title">Tin tức <span className="gradient-text">Nổi Bật</span></h2>
                    <p className="section-subtitle">Cập nhật những thông tin, sự kiện và thông báo mới nhất từ chúng tôi.</p>
                </div>
                 {displayedNews.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {displayedNews.map((news) => (
                                <div key={news.id} className="bg-white rounded-xl shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-all duration-300 ease-out hover:shadow-2xl hover:shadow-indigo-100">
                                    <div className="relative">
                                        <img 
                                            src={news.image} 
                                            alt={news.title} 
                                            className="w-full h-48 object-cover"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                        <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">{news.category}</div>
                                    </div>
                                    <div className="p-5 flex flex-col">
                                        <h3 className="text-md font-bold text-slate-800 mb-3 h-16 group-hover:text-indigo-700 transition-colors duration-300">
                                            <a href="#">{news.title}</a>
                                        </h3>
                                        <p className="text-xs text-slate-500 flex items-center mt-auto">
                                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                            {news.date}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Invisible element to trigger loading more items */}
                        <div ref={loaderRef} style={{ height: '20px' }} />
                        {hasMore && <LoadingIndicator />}
                    </>
                ) : (
                    <p className="text-center text-slate-600">Không có tin tức nào để hiển thị.</p>
                )}
            </div>
        </section>
    );
};

export default FeaturedNews;