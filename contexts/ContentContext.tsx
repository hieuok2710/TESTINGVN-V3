import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Interfaces for content types
export interface NewsItem {
    id: string;
    title: string;
    category: string;
    image: string;
    date: string;
}

export interface HeroSlide {
    id: string;
    image: string;
    title: string;
    subtitle: string;
}

// Default data to populate the site on first load
const DEFAULT_FEATURED_NEWS: NewsItem[] = [
    { id: 'news-1', title: 'Hướng dẫn học sinh tham gia Hội thao giáo dục quốc phòng và an ninh', category: 'Tin tức', image: 'https://picsum.photos/400/300?random=1', date: '27/04/2024' },
    { id: 'news-2', title: 'Sôi nổi các hoạt động chào mừng kỷ niệm 49 năm ngày Giải phóng miền Nam', category: 'Sự kiện', image: 'https://picsum.photos/400/300?random=2', date: '26/04/2024' },
    { id: 'news-3', title: 'Tuyên truyền, phổ biến pháp luật về phòng, chống ma túy trong học đường', category: 'Thông báo', image: 'https://picsum.photos/400/300?random=3', date: '25/04/2024' },
    { id: 'news-4', title: 'Phát động cuộc thi trực tuyến tìm hiểu về Chủ tịch Hồ Chí Minh', category: 'Cuộc thi', image: 'https://picsum.photos/400/300?random=4', date: '24/04/2024' },
];

const DEFAULT_HERO_SLIDES: HeroSlide[] = [
    { id: 'slide-1', image: 'https://picsum.photos/1920/600?random=20', title: 'Chào Mừng Đến Với Cổng Giáo Dục Trạng Nguyên', subtitle: 'Nơi ươm mầm và phát triển tài năng Việt' },
    { id: 'slide-2', image: 'https://picsum.photos/1920/600?random=21', title: 'Các Kỳ Thi Trực Tuyến Hấp Dẫn', subtitle: 'Thử thách kiến thức, rinh ngàn giải thưởng' },
    { id: 'slide-3', image: 'https://picsum.photos/1920/600?random=22', title: 'Học Mà Chơi - Chơi Mà Học', subtitle: 'Phương pháp giáo dục hiện đại, hiệu quả' }
];

// Helper to get data from localStorage with a default value
const getStoredData = <T,>(key: string, defaultValue: T): T => {
    try {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
            return JSON.parse(storedValue);
        }
    } catch (e) {
        console.error(`Failed to parse ${key} from localStorage`, e);
    }
    return defaultValue;
};

// Context Type Definition
interface ContentContextType {
    newsItems: NewsItem[];
    heroSlides: HeroSlide[];
    addNews: (item: Omit<NewsItem, 'id' | 'date'>) => void;
    updateNews: (item: NewsItem) => void;
    deleteNews: (id: string) => void;
    updateHeroSlide: (item: HeroSlide) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

// Provider Component
export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [newsItems, setNewsItems] = useState<NewsItem[]>(() => getStoredData('app_news', DEFAULT_FEATURED_NEWS));
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => getStoredData('app_hero_slides', DEFAULT_HERO_SLIDES));

    // Persist to localStorage whenever content changes
    useEffect(() => {
        localStorage.setItem('app_news', JSON.stringify(newsItems));
    }, [newsItems]);

    useEffect(() => {
        localStorage.setItem('app_hero_slides', JSON.stringify(heroSlides));
    }, [heroSlides]);

    // CRUD functions for news
    const addNews = (item: Omit<NewsItem, 'id' | 'date'>) => {
        const newItem: NewsItem = {
            ...item,
            id: `news-${Date.now()}`,
            date: new Date().toLocaleDateString('vi-VN'),
        };
        setNewsItems(prev => [newItem, ...prev]);
    };

    const updateNews = (updatedItem: NewsItem) => {
        setNewsItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    };

    const deleteNews = (id: string) => {
        setNewsItems(prev => prev.filter(item => item.id !== id));
    };

    // Update function for hero slides
    const updateHeroSlide = (updatedSlide: HeroSlide) => {
        setHeroSlides(prev => prev.map(slide => slide.id === updatedSlide.id ? updatedSlide : slide));
    };

    return (
        <ContentContext.Provider value={{ newsItems, heroSlides, addNews, updateNews, deleteNews, updateHeroSlide }}>
            {children}
        </ContentContext.Provider>
    );
};

// Custom hook for easy context access
export const useContent = (): ContentContextType => {
    const context = useContext(ContentContext);
    if (context === undefined) {
        throw new Error('useContent must be used within a ContentProvider');
    }
    return context;
};
