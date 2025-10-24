
import React from 'react';
import { FEATURED_VIDEOS } from '../constants';

const FeaturedVideos: React.FC = () => {
    const mainVideo = FEATURED_VIDEOS[0];
    const otherVideos = FEATURED_VIDEOS.slice(1);

    return (
        <section className="py-16 sm:py-20 bg-white">
            <div className="container mx-auto px-4">
                 <div className="text-center mb-12">
                    <h2 className="section-title">Video <span className="gradient-text">Nổi Bật</span></h2>
                    <p className="section-subtitle">Xem lại những khoảnh khắc đáng nhớ qua các video đặc sắc của chúng tôi.</p>
                </div>
                <div className="flex flex-wrap lg:flex-nowrap gap-8">
                    <div className="w-full lg:w-2/3">
                        <div className="aspect-w-16 aspect-h-9 bg-black rounded-xl overflow-hidden shadow-2xl shadow-slate-300">
                            <iframe 
                                src={`https://www.youtube.com/embed/${mainVideo.id}`} 
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        </div>
                        <h3 className="text-xl font-bold mt-4 text-slate-800">{mainVideo.title}</h3>
                    </div>
                    <div className="w-full lg:w-1/3">
                        <div className="space-y-4">
                            {otherVideos.map((video, index) => (
                                <a key={index} href="#" className="flex items-center space-x-4 group p-3 rounded-xl hover:bg-slate-100 transition-colors duration-200">
                                    <div className="w-32 h-20 flex-shrink-0 relative overflow-hidden rounded-lg">
                                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                    </div>
                                    <h4 className="text-sm font-semibold text-slate-700 group-hover:text-indigo-700 transition-colors duration-200">{video.title}</h4>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedVideos;