import React, { useState, useEffect, useRef } from 'react';
import { SUBJECT_LEVELS, QUIZ_ROUNDS, GRADE_LEVELS, ALL_CLASSES } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import Modal from './Modal';

interface GradeNavProps {
    onStartQuiz: (className: string) => void;
}

const buttonColors = [
  'bg-rose-500 hover:bg-rose-600',
  'bg-pink-500 hover:bg-pink-600',
  'bg-fuchsia-500 hover:bg-fuchsia-600',
  'bg-purple-500 hover:bg-purple-600',
  'bg-violet-500 hover:bg-violet-600',
  'bg-indigo-500 hover:bg-indigo-600',
  'bg-blue-500 hover:bg-blue-600',
  'bg-sky-500 hover:bg-sky-600',
  'bg-cyan-500 hover:bg-cyan-600',
  'bg-teal-500 hover:bg-teal-600',
  'bg-emerald-500 hover:bg-emerald-600',
  'bg-green-500 hover:bg-green-600',
  'bg-lime-500 hover:bg-lime-600',
  'bg-yellow-500 hover:bg-yellow-600',
  'bg-amber-500 hover:bg-amber-600',
  'bg-orange-500 hover:bg-orange-600',
  'bg-red-500 hover:bg-red-600',
];

const GradeNav: React.FC<GradeNavProps> = ({ onStartQuiz }) => {
    const { user } = useAuth();
    const [activeGradeLevel, setActiveGradeLevel] = useState<string>(GRADE_LEVELS[0].level);
    const [expandedClass, setExpandedClass] = useState<string | null>(null);

    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const [isAttemptsModalOpen, setIsAttemptsModalOpen] = useState(false);
    const [attemptsSummary, setAttemptsSummary] = useState<{ subject: string, rounds: { name: string, left: number }[] }[]>([]);

    const [attempts, setAttempts] = useState<{ [quizName: string]: number }>({});
    const prevUserRef = useRef(user);

    const getTodayString = () => new Date().toISOString().split('T')[0];

    useEffect(() => {
        // Set active grade level based on logged in user's class
        if (user?.className) {
            const userGradeLevel = GRADE_LEVELS.find(g => g.classes.includes(user.className!));
            if (userGradeLevel) {
                setActiveGradeLevel(userGradeLevel.level);
                // Automatically expand their class view
                setExpandedClass(user.className);
            }
        } else {
            // Default for logged out users, and reset expansion
            setActiveGradeLevel(GRADE_LEVELS[0].level);
            setExpandedClass(null);
        }
    }, [user]);


    useEffect(() => {
        if (user) {
            try {
                const allAttemptsRaw = localStorage.getItem('quiz_attempts');
                const allAttempts = allAttemptsRaw ? JSON.parse(allAttemptsRaw) : {};
                const todayString = getTodayString();
                const userAttemptsToday = allAttempts[user.username]?.[todayString] || {};
                setAttempts(userAttemptsToday);
            } catch (e) {
                console.error("Failed to load quiz attempts", e);
                setAttempts({});
            }
        } else {
            setAttempts({}); // Clear attempts if user logs out
        }
    }, [user]);

    // Effect to show attempts notification on login
    useEffect(() => {
        if (user && !prevUserRef.current && user.className) { // User just logged in and is a student
            try {
                const allAttemptsRaw = localStorage.getItem('quiz_attempts');
                const allAttempts = allAttemptsRaw ? JSON.parse(allAttemptsRaw) : {};
                const todayString = getTodayString();
                const userAttemptsToday = allAttempts[user.username]?.[todayString] || {};
                
                const summary = SUBJECT_LEVELS.map(subjectItem => {
                    const roundsSummary = QUIZ_ROUNDS.map(round => {
                        const subjectName = subjectItem.subject.replace('ÔN TẬP MÔN ', '').replace('ÔN TẬP ', '');
                        const fullQuizName = `${subjectName} - ${user.className} - ${round.name}`;
                        const attemptsMade = userAttemptsToday[fullQuizName] || 0;
                        return {
                            name: round.name,
                            left: 4 - attemptsMade
                        };
                    });
                    return {
                        subject: subjectItem.subject,
                        rounds: roundsSummary
                    };
                });
                
                setAttemptsSummary(summary);
                setIsAttemptsModalOpen(true);

            } catch (e) {
                console.error("Failed to generate attempts summary", e);
            }
        }
        
        prevUserRef.current = user;

    }, [user]);

    const handleQuizStart = (className: string, subjectName: string, roundName: string) => {
        if (!user) {
            setAlertMessage('Vui lòng đăng nhập hoặc đăng ký để tham gia thi.');
            setIsAlertModalOpen(true);
            return;
        }

        const subjectShortName = subjectName
            .replace('ÔN TẬP MÔN ', '')
            .replace('ÔN TẬP ', '');
        const fullQuizName = `${subjectShortName} - ${className} - ${roundName}`;
        const currentAttempts = attempts[fullQuizName] || 0;

        if (currentAttempts >= 4) {
            setAlertMessage(`Bạn đã hết lượt thi cho vòng này hôm nay. Vui lòng quay lại vào ngày mai.`);
            setIsAlertModalOpen(true);
            return;
        }

        // Record the new attempt
        try {
            const allAttemptsRaw = localStorage.getItem('quiz_attempts');
            const allAttempts = allAttemptsRaw ? JSON.parse(allAttemptsRaw) : {};
            const todayString = getTodayString();

            if (!allAttempts[user.username]) {
                allAttempts[user.username] = {};
            }
            if (!allAttempts[user.username][todayString]) {
                allAttempts[user.username][todayString] = {};
            }
            
            const newCount = currentAttempts + 1;
            allAttempts[user.username][todayString][fullQuizName] = newCount;
            localStorage.setItem('quiz_attempts', JSON.stringify(allAttempts));
            
            setAttempts(prev => ({...prev, [fullQuizName]: newCount}));
        } catch(e) {
             console.error("Failed to save quiz attempt", e);
             setAlertMessage('Không thể lưu lại lượt thi của bạn. Vui lòng thử lại.');
             setIsAlertModalOpen(true);
             return;
        }

        onStartQuiz(fullQuizName);
    };
    
    const activeGradeData = GRADE_LEVELS.find(g => g.level === activeGradeLevel);
    const classesToDisplay = user?.className
        ? activeGradeData?.classes.filter(c => c === user.className) ?? []
        : activeGradeData?.classes ?? [];

    return (
        <>
            <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b" aria-label="Grade and Subject Navigation">
                <div className="container mx-auto px-4">
                    <div role="tablist" aria-label="Grade Levels" className="flex justify-center border-b">
                        {GRADE_LEVELS.map((grade, index) => (
                            <button
                                key={grade.level}
                                id={`grade-tab-${index}`}
                                role="tab"
                                aria-selected={activeGradeLevel === grade.level}
                                aria-controls="grade-panel"
                                onClick={() => {
                                    setActiveGradeLevel(grade.level);
                                    setExpandedClass(null); // Collapse on tab change
                                }}
                                className={`relative px-6 py-4 text-sm font-bold uppercase tracking-wider focus:outline-none transition-all duration-300
                                    ${activeGradeLevel === grade.level 
                                        ? 'text-indigo-600' 
                                        : 'text-slate-500 hover:text-indigo-600'
                                    }`
                                }
                            >
                                {grade.level}
                                {activeGradeLevel === grade.level && (
                                     <span className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full"></span>
                                )}
                            </button>
                        ))}
                    </div>
                    
                    <div
                        id="grade-panel"
                        role="tabpanel"
                        aria-live="polite"
                        className="transition-all duration-500 ease-in-out py-6"
                    >
                         <div className="flex justify-center items-start flex-wrap gap-4">
                            {classesToDisplay.map((className) => {
                                const classIndex = ALL_CLASSES.findIndex(c => c === className);
                                const colorClass = buttonColors[classIndex < 0 ? 0 : classIndex % buttonColors.length];

                                return (
                                <div key={className} className="flex flex-col items-center">
                                    <button
                                        onClick={() => setExpandedClass(prev => (prev === className ? null : className))}
                                        className={`px-6 py-3 text-sm sm:text-base font-semibold text-white rounded-full transition-all duration-300 transform hover:scale-105 shadow-md whitespace-nowrap ${colorClass} ${
                                            expandedClass === className ? 'ring-4 ring-offset-2 ring-white/70' : ''
                                        }`}
                                        aria-expanded={expandedClass === className}
                                        aria-controls={`subjects-for-${className.replace(' ', '-')}`}
                                    >
                                        {className}
                                    </button>
                                    <div
                                        id={`subjects-for-${className.replace(' ', '-')}`}
                                        className="transition-all duration-300 ease-out grid w-full mt-2"
                                        style={{ gridTemplateRows: expandedClass === className ? '1fr' : '0fr' }}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="p-4 bg-slate-200/60 rounded-lg w-full max-w-lg min-w-[300px] sm:min-w-[400px]">
                                                {SUBJECT_LEVELS.map(subjectItem => {
                                                    return (
                                                         <div key={subjectItem.subject} className="mb-3 last:mb-0">
                                                            <h5 className="font-semibold text-sm text-slate-800">{subjectItem.subject}</h5>
                                                            <div className="flex flex-wrap gap-2 mt-1.5">
                                                                {QUIZ_ROUNDS.map(round => {
                                                                    const subjectShortName = subjectItem.subject.replace('ÔN TẬP MÔN ', '').replace('ÔN TẬP ', '');
                                                                    const fullQuizName = `${subjectShortName} - ${className} - ${round.name}`;
                                                                    const attemptsMade = user ? (attempts[fullQuizName] || 0) : 0;
                                                                    const attemptsLeft = 4 - attemptsMade;

                                                                    return (
                                                                        <button
                                                                            key={round.id}
                                                                            onClick={() => handleQuizStart(className, subjectItem.subject, round.name)}
                                                                            disabled={user ? attemptsLeft <= 0 : false}
                                                                            className="px-4 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-100 rounded-full hover:bg-indigo-600 hover:text-white transition-colors duration-200 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                                                                        >
                                                                            {round.name} {user && `(${attemptsLeft}/4)`}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )})}
                         </div>
                    </div>
                </div>
            </nav>
            <Modal
                isOpen={isAttemptsModalOpen}
                onClose={() => setIsAttemptsModalOpen(false)}
                title="Thông báo lượt thi hôm nay"
            >
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <p className="text-slate-700">
                        Xin chào <strong>{user?.username}</strong>! Dưới đây là số lượt thi còn lại của bạn cho lớp <strong>{user?.className}</strong> trong ngày hôm nay.
                    </p>
                    {attemptsSummary.map(subjectData => (
                        <div key={subjectData.subject}>
                            <h4 className="font-bold text-md text-indigo-700">{subjectData.subject}</h4>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600">
                                {subjectData.rounds.map(roundData => (
                                    <li key={roundData.name}>
                                        {roundData.name}: <span className="font-semibold">{roundData.left}/4</span> lượt
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => setIsAttemptsModalOpen(false)}
                    className="mt-6 w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Bắt đầu thi
                </button>
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

export default GradeNav;