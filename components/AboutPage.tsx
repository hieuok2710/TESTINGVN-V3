import React from 'react';
import { useContent } from '../contexts/ContentContext';

const StatCard: React.FC<{ icon: React.ReactElement; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex items-start p-6 bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="flex-shrink-0 w-16 h-16 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-full">
            {icon}
        </div>
        <div className="ml-5">
            <h3 className="text-xl font-bold text-slate-800">{title}</h3>
            <p className="mt-2 text-slate-600">{description}</p>
        </div>
    </div>
);

const AboutPage: React.FC = () => {
    const { aboutContent } = useContent();

    return (
        <div className="bg-slate-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-indigo-50 to-slate-50 pt-24 pb-16 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 animate-fade-in-down">
                        <span className="gradient-text">{aboutContent.heroTitle}</span>
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-slate-600 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        {aboutContent.heroSubtitle}
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16 sm:py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                            <h2 className="text-3xl font-bold text-slate-800 mb-6">{aboutContent.mainHeading}</h2>
                            <div className="prose prose-lg max-w-none text-slate-700 space-y-4">
                                {aboutContent.paragraphs.map((p, index) => (
                                    <p key={index}>{p}</p>
                                ))}
                            </div>
                        </div>
                        <div className="animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                            <img 
                                src={aboutContent.image} 
                                alt="Học sinh đang học tập vui vẻ" 
                                className="rounded-2xl shadow-2xl shadow-indigo-200 w-full h-auto object-cover" 
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission, Vision, Values Section */}
            <section className="py-16 sm:py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
                            <StatCard
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
                                title="Sứ mệnh"
                                description="Cung cấp một nền tảng học tập trực tuyến chất lượng cao, dễ tiếp cận, giúp mọi học sinh Việt Nam phát huy tối đa tiềm năng của mình."
                            />
                        </div>
                        <div className="animate-fade-in-up" style={{ animationDelay: '1.1s' }}>
                            <StatCard
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                                title="Tầm nhìn"
                                description="Trở thành người bạn đồng hành tin cậy của mọi gia đình Việt, dẫn đầu trong việc ứng dụng công nghệ để cá nhân hóa lộ trình học tập."
                            />
                        </div>
                        <div className="animate-fade-in-up" style={{ animationDelay: '1.3s' }}>
                            <StatCard
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
                                title="Giá trị cốt lõi"
                                description="Sáng tạo - Tận tâm - Chất lượng - Đồng hành. Chúng tôi cam kết mang đến những giá trị tốt nhất cho sự phát triển của học sinh."
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;