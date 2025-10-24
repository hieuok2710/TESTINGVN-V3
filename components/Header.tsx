import React, { useState, useId, useRef, useEffect } from 'react';
import { NAV_ITEMS, type NavItem, SUBJECT_LEVELS, QUIZ_ROUNDS } from '../constants';
import Modal from './Modal';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
    onGoToAdmin: () => void;
    onGoToHome: () => void;
    onGoToNews: () => void;
    onGoToHistory: () => void;
    onGoToAbout: () => void;
    onStartQuiz: (className: string) => void;
    onHideGradeNav: () => void;
    onEnableGradeNavAutoHide: () => void;
}

interface NavLinkProps {
    item: NavItem;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
    elementRef?: React.Ref<HTMLLIElement>;
    onChildClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}


const NavLink: React.FC<NavLinkProps> = ({ item, onClick, elementRef, onChildClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownId = useId();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (onClick) {
            // Let the custom handler decide whether to prevent default
            onClick(e);
        }
        // Let other links behave normally if no custom handler or if it doesn't prevent default
    };

    const hasChildren = item.label !== 'Vào thi' && item.children;

    return (
        <li 
            ref={elementRef}
            className="relative group"
            onMouseEnter={() => hasChildren && setIsOpen(true)}
            onMouseLeave={() => hasChildren && setIsOpen(false)}
        >
            <a 
                href={item.href} 
                onClick={handleClick}
                className="flex items-center px-4 py-3 text-sm font-semibold text-slate-200 uppercase tracking-wider hover:bg-slate-700 hover:text-white transition-colors duration-300 rounded-md"
                aria-haspopup={!!hasChildren}
                aria-expanded={isOpen}
                aria-controls={hasChildren ? dropdownId : undefined}
            >
                {item.label}
                {hasChildren && (
                    <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                )}
            </a>
            {isOpen && hasChildren && (
                <ul id={dropdownId} className="absolute left-0 mt-2 w-56 bg-slate-800 shadow-lg z-50 rounded-md overflow-hidden animate-fade-in-down">
                    {item.children.map((child, index) => (
                        <li key={index}>
                            <a href={child.href} onClick={(e) => onChildClick(e)} className="block px-4 py-3 text-sm text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors duration-300">
                                {child.label}
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
};

const Header: React.FC<HeaderProps> = ({ onGoToAdmin, onGoToHome, onGoToNews, onGoToHistory, onGoToAbout, onStartQuiz, onHideGradeNav, onEnableGradeNavAutoHide }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isQuizMenuOpen, setIsQuizMenuOpen] = useState(false);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const { user, logout } = useAuth();
    const quizMenuRef = useRef<HTMLLIElement>(null);
    const mobileMenuId = useId();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (quizMenuRef.current && !quizMenuRef.current.contains(event.target as Node)) {
                setIsQuizMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [quizMenuRef]);

    const handleRegistrationSuccess = () => {
        setIsRegisterModalOpen(false);
        setIsLoginModalOpen(true);
    };

    const handleStartQuizFromMenu = (subjectName: string, roundName: string) => {
        if (!user || !user.className) return;

        const subjectShortName = subjectName.replace('ÔN TẬP MÔN ', '').replace('ÔN TẬP ', '');
        const fullQuizName = `${subjectShortName} - ${user.className} - ${roundName}`;
        
        try {
            const allAttemptsRaw = localStorage.getItem('quiz_attempts');
            const allAttempts = allAttemptsRaw ? JSON.parse(allAttemptsRaw) : {};
            const todayString = new Date().toISOString().split('T')[0];
            const userAttemptsToday = allAttempts[user.username]?.[todayString] || {};
            const currentAttempts = userAttemptsToday[fullQuizName] || 0;

            if (currentAttempts >= 4) {
                setAlertMessage(`Bạn đã hết lượt thi cho vòng này hôm nay. Vui lòng quay lại vào ngày mai.`);
                setIsAlertModalOpen(true);
                setIsQuizMenuOpen(false);
                return;
            }

            if (!allAttempts[user.username]) allAttempts[user.username] = {};
            if (!allAttempts[user.username][todayString]) allAttempts[user.username][todayString] = {};
            allAttempts[user.username][todayString][fullQuizName] = currentAttempts + 1;
            localStorage.setItem('quiz_attempts', JSON.stringify(allAttempts));

        } catch (e) {
            console.error("Failed to save quiz attempt", e);
            setAlertMessage('Không thể lưu lại lượt thi của bạn. Vui lòng thử lại.');
            setIsAlertModalOpen(true);
            return;
        }

        onStartQuiz(fullQuizName);
        setIsQuizMenuOpen(false);
    };

    const handleNavLinkClick = (label: string, e: React.MouseEvent<HTMLAnchorElement>) => {
        if (label === 'Vào thi') {
            e.preventDefault();
            onEnableGradeNavAutoHide();
            if (user) {
                if (user.type === 'user' && user.className) {
                    setIsQuizMenuOpen(prev => !prev);
                }
            } else {
                setIsLoginModalOpen(true);
            }
        } else {
            e.preventDefault(); // Prevent default for all main nav items with actions
            let action: (() => void) | null = null;
            if (label === 'Trang chủ') action = onGoToHome;
            else if (label === 'Tin tức') action = onGoToNews;
            else if (label === 'Giới thiệu') action = onGoToAbout;

            if (action) {
                action();
                onHideGradeNav(); // Always hide grade nav on main page navigation
            } else {
                const item = NAV_ITEMS.find(i => i.label === label);
                if (item && !item.children) {
                     onHideGradeNav();
                }
            }
        }
    };

    const renderSubscriptionStatus = () => {
        if (!user || !user.subscriptionPlan || !user.subscriptionExpiry) {
            return null;
        }

        const expiryDate = new Date(user.subscriptionExpiry);
        const isExpired = expiryDate < new Date();
        const planLabels = { '1-month': 'Gói 1 Tháng', '3-month': 'Gói 3 Tháng', '6-month': 'Gói 6 Tháng' };

        return (
             <div className={`text-xs px-2 py-0.5 rounded-full ml-2 ${isExpired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                {planLabels[user.subscriptionPlan]} | Hết hạn: {expiryDate.toLocaleDateString('vi-VN')}
            </div>
        );
    };

    return (
        <>
            <header className="bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300">
                {/* Top Bar */}
                <div className="bg-slate-100/80 py-1.5 border-b border-slate-200">
                    <div className="container mx-auto px-4 flex justify-between items-center text-xs text-slate-600">
                        <div>
                            <span>Hotline: <strong className="font-semibold">0916.499.916</strong></span>
                        </div>
                        <div>
                            <span>Email: <strong className="font-semibold">nthieutc@gmail.com</strong></span>
                        </div>
                    </div>
                </div>

                {/* Main Header */}
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <img src="https://picsum.photos/150/50" alt="TESTINGVN_IT Logo" className="h-12"/>
                    </div>
                    <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 w-1/3 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all">
                        <label htmlFor="search-input" className="sr-only">Tìm kiếm</label>
                        <svg className="w-5 h-5 text-slate-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <input type="text" id="search-input" placeholder="Tìm kiếm khóa học, tin tức..." className="outline-none w-full bg-transparent text-sm"/>
                    </div>
                    <div className="flex items-center space-x-2">
                        {user ? (
                            <div className="flex items-center">
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-medium text-slate-700">Xin chào, {user.username}!{user.className && ` (${user.className})`}</span>
                                    {renderSubscriptionStatus()}
                                </div>
                                <button
                                    onClick={onGoToHistory}
                                    className="ml-4 px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-full hover:bg-teal-700 transition-colors duration-300 shadow-sm"
                                >
                                    Lịch sử thi
                                </button>
                                {user.type === 'admin' && (
                                    <button 
                                        onClick={onGoToAdmin}
                                        className="ml-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors duration-300 shadow-sm">
                                        Quản trị
                                    </button>
                                )}
                                <button
                                    onClick={logout}
                                    className="ml-2 px-4 py-2 text-sm font-semibold text-indigo-600 border border-indigo-200 bg-indigo-50 rounded-full hover:bg-indigo-600 hover:text-white transition-colors duration-300">
                                    Đăng xuất
                                </button>
                            </div>
                        ) : (
                             <>
                                <button 
                                    onClick={() => setIsLoginModalOpen(true)}
                                    className="px-5 py-2.5 text-sm font-semibold text-indigo-600 bg-white rounded-full hover:bg-slate-100 transition-colors duration-300 border border-slate-200">
                                    Đăng nhập
                                </button>
                                <button 
                                    onClick={() => setIsRegisterModalOpen(true)}
                                    className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors duration-300 shadow-sm">
                                    Đăng ký
                                </button>
                             </>
                        )}
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                            className="lg:hidden p-2"
                            aria-label="Open main menu"
                            aria-expanded={isMobileMenuOpen}
                            aria-controls={mobileMenuId}
                        >
                            <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                        </button>
                    </div>
                </div>

                {/* Navigation Bar */}
                <nav className="bg-slate-800 shadow-inner" aria-label="Main Navigation">
                    <div className="container mx-auto">
                        <ul className="hidden lg:flex justify-center items-center gap-x-2 p-2">
                            {NAV_ITEMS.map((item, index) => 
                                <NavLink 
                                    key={index} 
                                    item={item} 
                                    onClick={(e) => handleNavLinkClick(item.label, e)}
                                    onChildClick={
                                        item.label === 'Giới thiệu' 
                                            ? (e) => { e.preventDefault(); onGoToAbout(); onHideGradeNav(); }
                                            : () => { onHideGradeNav(); }
                                    }
                                    elementRef={item.label === 'Vào thi' ? quizMenuRef : undefined}
                                />
                            )}
                             {isQuizMenuOpen && user && user.type === 'user' && user.className && (
                                <div className="absolute top-full mt-2 w-96 bg-slate-800 shadow-lg z-50 rounded-md overflow-hidden animate-fade-in-down">
                                    <div className="p-3 bg-slate-900/50">
                                        <h3 className="font-bold text-white text-center">Lớp: {user.className}</h3>
                                    </div>
                                    <div className="p-2 max-h-80 overflow-y-auto">
                                        {SUBJECT_LEVELS.map(subject => (
                                            <div key={subject.subject} className="mb-2 last:mb-0">
                                                <h4 className="px-2 py-1 text-xs font-bold uppercase text-slate-400">{subject.subject}</h4>
                                                <ul className="space-y-1">
                                                    {QUIZ_ROUNDS.map(round => (
                                                        <li key={round.id}>
                                                            <button
                                                                onClick={() => handleStartQuizFromMenu(subject.subject, round.name)}
                                                                className="w-full text-left block px-3 py-2 text-sm text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors duration-200 rounded-md"
                                                            >
                                                                {round.name}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </ul>
                    </div>
                </nav>

                 {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div id={mobileMenuId} className="lg:hidden bg-slate-800">
                        <ul className="p-2">
                            {NAV_ITEMS.map((item, index) => (
                                 <li key={index} className="border-b border-slate-700 last:border-b-0">
                                    <a href={item.href}
                                        onClick={(e) => {
                                            handleNavLinkClick(item.label, e);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="block px-4 py-3 text-sm text-white hover:bg-indigo-600 rounded-md">
                                        {item.label}
                                    </a>
                                    {item.children && (
                                        <ul className="pl-4">
                                            {item.children.map((child, childIndex) => (
                                                <li key={childIndex}>
                                                     <a href={child.href} onClick={(e) => {
                                                        if (item.label === 'Giới thiệu') {
                                                            e.preventDefault();
                                                            onGoToAbout();
                                                        }
                                                        onHideGradeNav(); 
                                                        setIsMobileMenuOpen(false);
                                                     }} className="block px-4 py-2 text-sm text-slate-300 hover:text-white">
                                                        {child.label}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </header>

            <Modal 
                isOpen={isRegisterModalOpen} 
                onClose={() => setIsRegisterModalOpen(false)}
                title="Tạo tài khoản mới"
            >
                <RegistrationForm onSuccess={handleRegistrationSuccess} />
            </Modal>
            
            <Modal 
                isOpen={isLoginModalOpen} 
                onClose={() => setIsLoginModalOpen(false)}
                title="Đăng nhập tài khoản"
            >
                <LoginForm onClose={() => setIsLoginModalOpen(false)} />
            </Modal>
            <Modal
                isOpen={isAlertModalOpen}
                onClose={() => setIsAlertModalOpen(false)}
                title="Thông báo"
            >
                <div className="text-center">
                    <p className="text-slate-700 text-lg">
                       {alertMessage}
                    </p>
                    <button
                        onClick={() => setIsAlertModalOpen(false)}
                        className="mt-6 w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Đã hiểu
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default Header;