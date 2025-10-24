import React, { useState, useEffect, useCallback, useId } from 'react';
import { QUESTION_BANK, QuizQuestion, SUBJECT_LEVELS } from '../constants';
import Modal from './Modal';
import { useAuth } from '../contexts/AuthContext';
import Confetti from './Confetti';

interface QuizProps {
    className: string;
    onEndQuiz: () => void;
}

interface QuizResult {
    participantName: string;
    answeredCount: number;
    correctCount: number;

    totalScore: number;
    totalQuestions: number;
}

interface QuizResultEntry {
    username: string;
    score: number;
    className: string; // The name of the quiz
    date: string; // The date the quiz was taken
}

const getQuestionBank = (): { [subject: string]: { [className: string]: QuizQuestion[] } } => {
    try {
        const storedBank = localStorage.getItem('quiz_bank');
        if (storedBank) {
            // A deep merge might be better, but for now, this assumes localStorage bank is complete
            return { ...QUESTION_BANK, ...JSON.parse(storedBank) };
        }
    } catch (e) {
        console.error("Failed to parse question bank from localStorage", e);
    }
    return QUESTION_BANK;
};

const saveQuizResult = (result: QuizResultEntry) => {
    try {
        const existingResultsRaw = localStorage.getItem('quiz_results');
        const existingResults: QuizResultEntry[] = existingResultsRaw ? JSON.parse(existingResultsRaw) : [];
        existingResults.push(result);
        localStorage.setItem('quiz_results', JSON.stringify(existingResults));
    } catch (e) {
        console.error("Failed to save quiz result", e);
    }
};


const Quiz: React.FC<QuizProps> = ({ className, onEndQuiz }) => {
    const { user } = useAuth();
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>([]);
    const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [isQuizFinished, setIsQuizFinished] = useState(false);
    const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
    const [isReviewing, setIsReviewing] = useState(false);
    const resultTitleId = useId();
    const resultDescId = useId();

    useEffect(() => {
        const allQuestionsBank = getQuestionBank();
        const parts = className.split(' - ');
        if (parts.length < 2) {
            setQuestions([]);
            return;
        }
        const [subjectPart, gradePart] = parts;
        const roundName = parts[parts.length - 1] || '';
        
        const subjectKey = SUBJECT_LEVELS.find(s => s.subject.toUpperCase().includes(subjectPart.toUpperCase()))?.subject;
        const grade = gradePart || '';

        if (!subjectKey || !allQuestionsBank[subjectKey] || !allQuestionsBank[subjectKey][grade]) {
            setQuestions([]);
            return;
        }

        const questionsForGrade = [...(allQuestionsBank[subjectKey][grade] || [])];
        questionsForGrade.sort(() => 0.5 - Math.random());

        const easyPool = questionsForGrade.filter(q => q.difficulty === 'easy');
        const mediumPool = questionsForGrade.filter(q => !q.difficulty || q.difficulty === 'medium');
        const hardPool = questionsForGrade.filter(q => q.difficulty === 'hard');
        const combinedPool = [...easyPool, ...mediumPool, ...hardPool];

        const selectQuestions = (primaryPool: QuizQuestion[], count: number, usedQuestions: Set<QuizQuestion>): QuizQuestion[] => {
            const selected: QuizQuestion[] = [];
            for (const q of primaryPool) {
                if (selected.length >= count) break;
                if (!usedQuestions.has(q)) {
                    selected.push(q);
                    usedQuestions.add(q);
                }
            }
            for (const q of combinedPool) {
                if (selected.length >= count) break;
                if (!usedQuestions.has(q)) {
                    selected.push(q);
                    usedQuestions.add(q);
                }
            }
            return selected;
        };

        const usedQuestions = new Set<QuizQuestion>();
        let finalQuestions: QuizQuestion[] = [];

        if (roundName.includes('Vòng 1')) {
            const easyPart = selectQuestions(easyPool, 30, usedQuestions);
            finalQuestions = [...easyPart];
        } else if (roundName.includes('Vòng 2')) {
            const easyPart = selectQuestions(easyPool, 15, usedQuestions);
            const mediumPart = selectQuestions(mediumPool, 15, usedQuestions);
            finalQuestions = [...easyPart, ...mediumPart];
        } else if (roundName.includes('Vòng 3')) {
            const easyPart = selectQuestions(easyPool, 10, usedQuestions);
            const mediumPart = selectQuestions(mediumPool, 15, usedQuestions);
            const hardPart = selectQuestions(hardPool, 5, usedQuestions);
            finalQuestions = [...easyPart, ...mediumPart, ...hardPart];
        } else if (roundName.includes('Vòng 4')) {
            const mediumPart = selectQuestions(mediumPool, 15, usedQuestions);
            const hardPart = selectQuestions(hardPool, 15, usedQuestions);
            finalQuestions = [...mediumPart, ...hardPart];
        } else {
            // Default logic
            const easyPart = selectQuestions(easyPool, 10, usedQuestions);
            const mediumPart = selectQuestions(mediumPool, 10, usedQuestions);
            const hardPart = selectQuestions(hardPool, 10, usedQuestions);
            finalQuestions = [...easyPart, ...mediumPart, ...hardPart];
        }
        
        const quizSet = finalQuestions.slice(0, 30);
        
        setQuestions(quizSet);
        setAnswers(Array(quizSet.length).fill(null));

    }, [className]);
    
    const handleSubmitQuiz = useCallback(() => {
        if (isQuizFinished) return; // Prevent multiple submissions

        let correctCount = 0;
        const answeredCount = answers.filter(a => a !== null).length;

        questions.forEach((q, index) => {
            if (answers[index] === q.correctAnswerIndex) {
                correctCount++;
            }
        });
        
        const totalScore = correctCount * 10;
        
        const currentResult = {
            participantName: user?.username || 'Khách',
            answeredCount: answeredCount,
            correctCount: correctCount,
            totalScore: totalScore,
            totalQuestions: questions.length,
        };
        
        if (user) {
            saveQuizResult({
                username: user.username,
                score: totalScore,
                className: className,
                date: new Date().toLocaleDateString('vi-VN'),
            });
        }
        
        setQuizResult(currentResult);
        setIsQuizFinished(true);
        setIsSubmitModalOpen(false);
    }, [answers, questions, user, isQuizFinished, className]);

    useEffect(() => {
        if (timeLeft <= 0 && !isQuizFinished) {
            handleSubmitQuiz();
            return;
        }
        const timerId = setInterval(() => {
            setTimeLeft(prevTime => prevTime > 0 ? prevTime - 1 : 0);
        }, 1000);
        return () => clearInterval(timerId);
    }, [timeLeft, isQuizFinished, handleSubmitQuiz]);
    
    // Auto-submit on Escape key
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleSubmitQuiz();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleSubmitQuiz]);

    // Auto-submit on closing the window/tab
    useEffect(() => {
        const handleBeforeUnload = () => {
            // This is called when the user tries to close the tab/browser.
            // We submit the quiz state. This needs to be synchronous.
            handleSubmitQuiz();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [handleSubmitQuiz]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSelectAnswer = (optionIndex: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = optionIndex;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Block Ctrl+C, Ctrl+X, Ctrl+A on Windows/Linux
        // Block Cmd+C, Cmd+X, Cmd+A on macOS
        if (e.ctrlKey || e.metaKey) {
            if (['c', 'x', 'a'].includes(e.key.toLowerCase())) {
                e.preventDefault();
            }
        }
    };

    const answeredCount = answers.filter(a => a !== null).length;

    if (isQuizFinished && quizResult) {
        if (isReviewing) {
            return (
                <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-75 flex justify-center items-start p-4 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-xl my-8 w-full max-w-4xl animate-fade-in-down">
                        <div className="sticky top-0 bg-white p-5 border-b rounded-t-lg z-10 flex flex-wrap justify-between items-center gap-2">
                            <h2 className="text-2xl font-bold text-blue-800">Xem lại bài làm</h2>
                            <div>
                                <button onClick={() => setIsReviewing(false)} className="mr-4 px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
                                    Quay về kết quả
                                </button>
                                <button onClick={onEndQuiz} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                                    Về trang chủ
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            {questions.map((q, index) => {
                                const userAnswer = answers[index];
                                const wasAnswered = userAnswer !== null;

                                return (
                                    <div key={index} className="p-4 border rounded-lg bg-gray-50">
                                        {q.image && (
                                            <div className="mb-4 bg-slate-100 p-2 rounded-lg border">
                                                <img 
                                                    src={q.image} 
                                                    alt="Hình ảnh cho câu hỏi" 
                                                    className="w-full max-h-60 object-contain rounded-md mx-auto"
                                                />
                                            </div>
                                        )}
                                        <p className="font-semibold text-gray-800 mb-3">{index + 1}. {q.question}</p>
                                        <div className="space-y-2">
                                            {q.options.map((option, optIndex) => {
                                                const isCorrectOption = optIndex === q.correctAnswerIndex;
                                                const isUserChoice = optIndex === userAnswer;
                                                
                                                let optionClass = 'p-3 border rounded-md text-left text-sm flex items-center';
                                                if (isCorrectOption) {
                                                    optionClass += ' bg-green-100 border-green-400 text-green-800 font-semibold';
                                                } else if (isUserChoice && !isCorrectOption) {
                                                    optionClass += ' bg-red-100 border-red-400 text-red-800';
                                                } else {
                                                    optionClass += ' bg-white border-gray-300';
                                                }

                                                return (
                                                    <div key={optIndex} className={optionClass}>
                                                        {isCorrectOption && <span className="text-green-600 mr-2" aria-hidden="true">✔</span>}
                                                        {isUserChoice && !isCorrectOption && <span className="text-red-600 mr-2" aria-hidden="true">✖</span>}
                                                        {option}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {!wasAnswered && (
                                            <p className="mt-3 text-sm text-yellow-600 bg-yellow-100 p-2 rounded-md">Bạn đã không trả lời câu này. Đáp án đúng đã được tô màu xanh.</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-75 flex justify-center items-center p-4">
                { (quizResult.correctCount >= 29) && <Confetti /> }
                <div 
                    className="bg-white rounded-lg shadow-xl p-8 text-center animate-fade-in-down w-full max-w-md relative"
                    role="alertdialog"
                    aria-labelledby={resultTitleId}
                    aria-describedby={resultDescId}
                >
                    <h2 id={resultTitleId} className="text-3xl font-bold text-blue-800 mb-6">Kết quả bài thi</h2>
                    <div id={resultDescId} className="text-left space-y-4 text-gray-700">
                        <p className="text-lg"><strong>Tên người thi:</strong> <span className="font-semibold text-blue-700">{quizResult.participantName}</span></p>
                        <p className="text-lg"><strong>Số câu đã trả lời:</strong> <span className="font-semibold">{quizResult.answeredCount} / {quizResult.totalQuestions}</span></p>
                        <p className="text-lg"><strong>Số câu trả lời đúng:</strong> <span className="font-semibold text-green-600">{quizResult.correctCount} / {quizResult.totalQuestions}</span></p>
                        <div className="pt-4 mt-4 border-t">
                             <p className="text-2xl font-bold text-center"><strong>Tổng điểm:</strong> <span className="text-orange-500">{quizResult.totalScore}</span></p>
                        </div>
                    </div>
                     <div className="mt-8 flex flex-col space-y-3">
                        <button onClick={() => setIsReviewing(true)} className="w-full px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">
                            Xem lại đáp án
                        </button>
                        <button onClick={onEndQuiz} className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                            Quay về trang chủ
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-75 flex justify-center items-center p-4">
                <div className="bg-white rounded-lg shadow-xl p-8 text-center animate-fade-in-down" role="alert">
                    <h2 className="text-2xl font-bold text-red-600">Lỗi</h2>
                    <p className="text-gray-700 mt-2">Không tìm thấy bộ câu hỏi cho {className}. Vui lòng thử lại hoặc liên hệ quản trị viên.</p>
                    <button onClick={onEndQuiz} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Quay lại
                    </button>
                </div>
            </div>
        )
    }
    
    const currentQuestion = questions[currentQuestionIndex];
    const isTimeLow = timeLeft < 5 * 60; // 5 minutes

    return (
        <div 
            className="fixed inset-0 z-50 bg-gray-800 bg-opacity-75 flex items-start justify-center p-4 overflow-y-auto"
            onContextMenu={(e) => e.preventDefault()}
            onKeyDown={handleKeyDown}
            tabIndex={-1} // Makes the div focusable to capture key events
        >
            <div className="w-full max-w-7xl mx-auto animate-fade-in-down mt-4 mb-4 relative z-10">
                <div className="bg-blue-800 text-white p-4 rounded-t-lg shadow-lg flex flex-wrap justify-between items-center gap-2">
                    <h1 className="text-xl font-bold">{className}</h1>
                    <div className="flex items-center space-x-4">
                        <span className="font-semibold">{user?.username || 'Khách'}</span>
                        <div className={`px-4 py-2 rounded-full font-bold text-lg ${isTimeLow ? 'bg-red-500 animate-pulse' : 'bg-white/20'}`}>
                            {formatTime(timeLeft)}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row">
                    {/* Main Content */}
                    <div className="w-full lg:w-3/4 bg-white p-6 sm:p-8 rounded-bl-lg shadow-xl flex-grow">
                        {currentQuestion.image && (
                            <div className="mb-6 bg-slate-100 p-2 rounded-lg border">
                                <img 
                                    src={currentQuestion.image} 
                                    alt="Hình ảnh cho câu hỏi" 
                                    className="w-full max-h-80 object-contain rounded-md mx-auto"
                                />
                            </div>
                        )}
                        <p className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">{currentQuestionIndex + 1}. {currentQuestion.question}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {currentQuestion.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSelectAnswer(index)}
                                    className={`p-4 border-2 rounded-lg text-left text-gray-700 font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-md
                                        ${answers[currentQuestionIndex] === index
                                            ? 'bg-blue-500 border-blue-600 text-white shadow-lg'
                                            : 'bg-white border-gray-300 hover:border-blue-400'
                                        }`}
                                >
                                    <span className={`inline-block w-6 font-bold mr-2 ${answers[currentQuestionIndex] === index ? 'text-white' : 'text-blue-600'}`}>
                                        {String.fromCharCode(65 + index)}.
                                    </span>
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-1/4 bg-gray-100 p-4 rounded-br-lg shadow-xl">
                        <h3 className="font-bold text-gray-700 mb-3 text-center">Danh sách câu hỏi</h3>
                        <div className="grid grid-cols-5 gap-2">
                            {questions.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentQuestionIndex(index)}
                                    className={`w-10 h-10 rounded-full font-bold text-sm transition-colors duration-200
                                        ${currentQuestionIndex === index
                                            ? 'bg-blue-600 text-white ring-2 ring-offset-2 ring-blue-500'
                                            : answers[index] !== null
                                                ? 'bg-green-500 text-white'
                                                : 'bg-white hover:bg-gray-200 border'
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                         <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
                             <div className="flex items-center">
                                 <span className="w-4 h-4 bg-green-500 rounded-full inline-block mr-2"></span>
                                 <span>Đã trả lời</span>
                             </div>
                             <span>{answeredCount}/{questions.length}</span>
                        </div>
                        <div className="mt-6 flex flex-col space-y-3">
                             <button
                                onClick={handleNext}
                                disabled={currentQuestionIndex === questions.length - 1}
                                className="w-full py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Câu tiếp theo
                            </button>
                            <button
                                onClick={() => setIsSubmitModalOpen(true)}
                                className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Nộp bài
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isSubmitModalOpen}
                onClose={() => setIsSubmitModalOpen(false)}
                title="Xác nhận nộp bài"
            >
                <div className="text-center">
                    <p className="text-gray-700">Bạn đã trả lời {answeredCount} trên {questions.length} câu hỏi.</p>
                    <p className="text-gray-700 mt-2">Bạn có chắc chắn muốn nộp bài không?</p>
                    <div className="flex justify-center space-x-4 mt-6">
                        <button onClick={() => setIsSubmitModalOpen(false)} className="px-8 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                            Hủy
                        </button>
                        <button onClick={handleSubmitQuiz} className="px-8 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                            Nộp bài
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Quiz;