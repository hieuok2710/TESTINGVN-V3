import React, { useState, Suspense, lazy, useEffect, useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import GradeNav from './components/GradeNav';
import { AuthProvider } from './contexts/AuthContext';
import { ContentProvider } from './contexts/ContentContext';
import { ChatProvider } from './contexts/ChatContext';
import ChatWidget from './components/ChatWidget';
import MainContent from './components/MainContent';

// Lazy load components for code splitting
const Quiz = lazy(() => import('./components/Quiz'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const NewsPage = lazy(() => import('./components/NewsPage'));
const QuizHistory = lazy(() => import('./components/QuizHistory'));
const AboutPage = lazy(() => import('./components/AboutPage'));

type View = 'main' | 'quiz' | 'admin' | 'news' | 'history' | 'about';

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
);

const App: React.FC = () => {
    const [view, setView] = useState<View>('main');
    const [quizClassName, setQuizClassName] = useState<string | null>(null);
    const [isGradeNavVisible, setIsGradeNavVisible] = useState(true);
    const inactivityTimerRef = useRef<number | null>(null);
    const hideGradeNavUntil = useRef(0);

    useEffect(() => {
        const resetTimer = () => {
            if (Date.now() < hideGradeNavUntil.current) {
                return; // Manually hidden, so ignore activity
            }
            if (inactivityTimerRef.current) {
                clearTimeout(inactivityTimerRef.current);
            }
            setIsGradeNavVisible(true);
            inactivityTimerRef.current = window.setTimeout(() => {
                setIsGradeNavVisible(false);
            }, 15000); // 15 seconds
        };

        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keydown', resetTimer);
        
        resetTimer(); // Start the timer initially

        return () => {
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keydown', resetTimer);
            if (inactivityTimerRef.current) {
                clearTimeout(inactivityTimerRef.current);
            }
        };
    }, []);

    const handleHideGradeNav = () => {
        setIsGradeNavVisible(false);
        // Hide for a very long time, effectively until next page load/session.
        hideGradeNavUntil.current = Date.now() + 60 * 60 * 1000; // 1 hour
    };
    
    const handleEnableGradeNavAutoHide = () => {
        hideGradeNavUntil.current = 0; // Re-enable auto-hide
        
        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
        }
        setIsGradeNavVisible(true);
        inactivityTimerRef.current = window.setTimeout(() => {
            setIsGradeNavVisible(false);
        }, 15000);
    };


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

    const handleGoToAbout = () => {
        setView('about');
        window.scrollTo(0, 0);
    }

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
                                onGoToAbout={handleGoToAbout}
                                onStartQuiz={handleStartQuiz}
                                onHideGradeNav={handleHideGradeNav}
                                onEnableGradeNavAutoHide={handleEnableGradeNavAutoHide}
                            />
                            <div className={`transition-all duration-500 ease-in-out ${isGradeNavVisible ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                {view !== 'admin' && view !== 'quiz' && <GradeNav onStartQuiz={handleStartQuiz} />}
                            </div>
                        </div>
                        <main id="main-content">
                            <Suspense fallback={<LoadingSpinner />}>
                                {view === 'main' && <MainContent />}
                                {view === 'news' && <NewsPage />}
                                {view === 'history' && <QuizHistory />}
                                {view === 'about' && <AboutPage />}
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