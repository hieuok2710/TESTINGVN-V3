import React, { useState } from 'react';
import { UPCOMING_EVENTS } from '../constants';
import Pagination from './Pagination';

const EVENTS_PER_PAGE = 4;

const EventItem: React.FC<{ date: string; title: string }> = ({ date, title }) => (
    <div className="flex items-center space-x-4 p-4 transition-colors duration-300 rounded-xl hover:bg-slate-100">
        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex flex-col justify-center items-center rounded-lg font-extrabold shadow-lg">
            <span className="text-3xl leading-none">{date.split('/')[0]}</span>
            <span className="text-xs font-semibold tracking-wider">Th {date.split('/')[1]}</span>
        </div>
        <div className="flex-grow">
            <a href="#" className="font-bold text-lg text-slate-800 hover:text-orange-600 transition-colors duration-200">
                {title}
            </a>
            <p className="text-sm text-slate-500 mt-1">Xem chi tiết &rarr;</p>
        </div>
    </div>
);

const Events: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(UPCOMING_EVENTS.length / EVENTS_PER_PAGE);
    const indexOfLastEvent = currentPage * EVENTS_PER_PAGE;
    const indexOfFirstEvent = indexOfLastEvent - EVENTS_PER_PAGE;
    const currentEvents = UPCOMING_EVENTS.slice(indexOfFirstEvent, indexOfLastEvent);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <section className="py-16 sm:py-20 bg-white">
            <div className="container mx-auto px-4">
                 <div className="text-center mb-12">
                    <h2 className="section-title">Sự Kiện <span className="gradient-text">Sắp Diễn Ra</span></h2>
                    <p className="section-subtitle">Đừng bỏ lỡ những sự kiện hấp dẫn và quan trọng sắp tới.</p>
                </div>
                <div className="max-w-3xl mx-auto">
                    <div className="space-y-4">
                        {currentEvents.map((event, index) => (
                            <EventItem key={index} date={event.date} title={event.title} />
                        ))}
                    </div>
                     <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </section>
    );
};

export default Events;