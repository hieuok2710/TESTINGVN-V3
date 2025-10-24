
import React, { useState } from 'react';
import { useContent } from '../contexts/ContentContext';

const HeroSlider: React.FC = () => {
    const { heroSlides: slides } = useContent();
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    }
    
    if (slides.length === 0) {
        return (
             <section className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full flex justify-center items-center bg-slate-200">
                <p className="text-slate-600">Không có ảnh bìa nào để hiển thị.</p>
            </section>
        );
    }

    return (
        <section className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full overflow-hidden">
            <div 
                className="relative h-full w-full flex transition-transform duration-1000 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {slides.map((slide, index) => (
                    <div key={slide.id} className="h-full w-full flex-shrink-0 relative">
                        <img 
                            src={slide.image} 
                            alt={slide.title} 
                            className="w-full h-full object-cover"
                            loading={index === 0 ? "eager" : "lazy"}
                            fetchPriority={index === 0 ? "high" : "auto"}
                            decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end items-center text-center p-8 md:p-16">
                           <div className="max-w-4xl">
                                <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 drop-shadow-lg animate-fade-in-down" style={{animationDelay: '0.2s'}}>{slide.title}</h1>
                                <p className="text-slate-200 text-lg md:text-2xl drop-shadow-md animate-fade-in-up" style={{animationDelay: '0.4s'}}>{slide.subtitle}</p>
                           </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
                {slides.map((_, index) => (
                    <button 
                        key={index} 
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-white scale-125' : 'bg-white/50 backdrop-blur-sm'}`}
                        aria-label={`Go to slide ${index + 1}`}
                    ></button>
                ))}
            </div>
        </section>
    );
};

export default HeroSlider;