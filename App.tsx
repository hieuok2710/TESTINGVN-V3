import React, { useState, Suspense, lazy } from 'react';
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import FeaturedNews from './components/FeaturedNews';
import Footer from './components/Footer';
import GradeNav from './components/GradeNav';
import { AuthProvider } from './contexts/AuthContext';
import { ContentProvider } from './contexts/ContentContext';
import { ChatProvider } from './contexts/ChatContext';
import Leaderboard from './components/Leaderboard';
import ChatWidget from './components/ChatWidget';

// Lazy load components for code splitting
const Quiz = lazy(() => import('./components/Quiz'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const NewsPage = lazy(() => import('./components/NewsPage'));
const QuizHistory = lazy(() => import('./components/QuizHistory'));

type View = 'main' | 'quiz' | 'admin' | 'news' | 'history';

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
);

const App: React.FC = () => {
    const [view, setView] = useState<View>('main');
    const [quizClassName, setQuizClassName] = useState<string | null>(null);

    const handleStartQuiz = (className: string) => {
        setQuizClassName(className);
        setView('quiz');
        window.scrollTo(0, 0);
    };

    const handleEndQuiz = () => {
        setQuizClassName(null);
        setView('main');
    };
    
    const handleGoToAdmin = () => {
        setView('admin');
        window.scrollTo(0, 0);
    }
    
    const handleExitAdmin = () => {
        setView('main');
    }

    const handleGoToHome = () => {
        setView('main');
        window.scrollTo(0, 0);
    }

    const handleGoToNews = () => {
        setView('news');
        window.scrollTo(0, 0);
    }

    const handleGoToHistory = () => {
        setView('history');
        window.scrollTo(0, 0);
    }

    const renderMainContent = () => (
        <>
            <HeroSlider />
            <Leaderboard />
            <FeaturedNews />
        </>
    );

    return (
        <AuthProvider>
            <ChatProvider>
                <ContentProvider>
                    <div className="bg-slate-50 antialiased">
                        <div className="sticky top-0 z-40">
                            <Header 
                                onGoToAdmin={handleGoToAdmin} 
                                onGoToHome={handleGoToHome}
                                onGoToNews={handleGoToNews}
                                onGoToHistory={handleGoToHistory}
                            />
                            {view !== 'admin' && view !== 'quiz' && <GradeNav onStartQuiz={handleStartQuiz} />}
                        </div>
                        <main id="main-content">
                            <Suspense fallback={<LoadingSpinner />}>
                                {view === 'main' && renderMainContent()}
                                {view === 'news' && <NewsPage />}
                                {view === 'history' && <QuizHistory />}
                                {view === 'quiz' && quizClassName && (
                                    <Quiz className={quizClassName} onEndQuiz={handleEndQuiz} />
                                )}
                                {view === 'admin' && <AdminDashboard onExit={handleExitAdmin} />}
                            </Suspense>
                        </main>
                        <Footer />
                        <ChatWidget />
                    </div>
                </ContentProvider>
            </ChatProvider>
        </AuthProvider>
    );
};

export default App;