import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { ALL_CLASSES, QUESTION_BANK, QuizQuestion, SUBJECT_LEVELS } from '../constants';
import Modal from './Modal';

type QuestionBankType = { [subject: string]: { [className: string]: QuizQuestion[] } };
type ImportedDataType = { [subject: string]: QuizQuestion[] };

// Helper functions to interact with localStorage
const getQuestionBank = (): QuestionBankType => {
    try {
        const storedBank = localStorage.getItem('quiz_bank');
        if (storedBank) {
            // Merge with default bank to ensure all classes have at least default questions
            return { ...QUESTION_BANK, ...JSON.parse(storedBank) };
        }
    } catch (e) {
        console.error("Failed to parse question bank from localStorage", e);
    }
    return QUESTION_BANK;
};

const saveQuestionBank = (bank: QuestionBankType) => {
    try {
        localStorage.setItem('quiz_bank', JSON.stringify(bank));
    } catch (e) {
        console.error("Failed to save question bank to localStorage", e);
    }
};


const QuizManagement: React.FC = () => {
    const [questionBank, setQuestionBank] = useState(getQuestionBank);
    const [selectedSubject, setSelectedSubject] = useState(SUBJECT_LEVELS[0].subject);
    const [selectedClass, setSelectedClass] = useState(ALL_CLASSES[0]);
    const [currentPage, setCurrentPage] = useState(1);
    const questionsPerPage = 10;

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importedQuestions, setImportedQuestions] = useState<ImportedDataType | null>(null);
    const importFileInputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        setCurrentPage(1);
    }, [selectedClass, selectedSubject]);
    
    const clearMessages = () => {
        setError('');
        setSuccessMessage('');
    };

    const handleGenerateQuestions = async () => {
        setIsLoading(true);
        clearMessages();
        try {
            if (!process.env.API_KEY) {
                throw new Error("API_KEY environment variable is not set. Please configure it to use the AI generation feature.");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

            const subjectForPrompt = selectedSubject.replace('ÔN TẬP MÔN ', '').replace('ÔN TẬP ', '');

            const generateBatch = async (difficulty: 'easy' | 'medium' | 'hard', iq: number, count: number): Promise<QuizQuestion[]> => {
                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: `Generate ${count} unique multiple-choice quiz questions about ${subjectForPrompt} for a student in ${selectedClass} in Vietnam. The questions must not be duplicates of each other. The questions should be ${difficulty} for their age (suitable for a child with an IQ level of ${iq}). The question must be in Vietnamese.`,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: Type.OBJECT,
                            properties: {
                                questions: {
                                    type: Type.ARRAY,
                                    description: `A list of ${count} unique quiz questions.`,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            question: { type: Type.STRING, description: 'The question text.' },
                                            options: { type: Type.ARRAY, description: 'A list of 4 possible answers.', items: { type: Type.STRING } },
                                            correctAnswerIndex: { type: Type.INTEGER, description: 'The 0-based index of the correct answer in the options array.' }
                                        },
                                        required: ['question', 'options', 'correctAnswerIndex']
                                    }
                                }
                            }
                        },
                        maxOutputTokens: 8192,
                        thinkingConfig: { thinkingBudget: 1000 },
                    },
                });

                const jsonStr = response.text.trim();
                const generatedData = JSON.parse(jsonStr);
                const questions: Omit<QuizQuestion, 'difficulty'>[] = generatedData.questions || [];
                return questions.map(q => ({ ...q, difficulty }));
            };

            // Generate 40 questions for each difficulty level
            const [easyQuestions, mediumQuestions, hardQuestions] = await Promise.all([
                generateBatch('easy', 60, 40),
                generateBatch('medium', 80, 40),
                generateBatch('hard', 100, 40)
            ]);
            
            const allGeneratedQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions];

            if (allGeneratedQuestions.length > 0) {
                 const updatedBank = { ...questionBank };
                if (!updatedBank[selectedSubject]) {
                    updatedBank[selectedSubject] = {};
                }
                if (!updatedBank[selectedSubject][selectedClass]) {
                    updatedBank[selectedSubject][selectedClass] = [];
                }
                updatedBank[selectedSubject][selectedClass].push(...allGeneratedQuestions);
                setQuestionBank(updatedBank);
                saveQuestionBank(updatedBank);
                
                const newTotalPages = Math.ceil(updatedBank[selectedSubject][selectedClass].length / questionsPerPage);
                setCurrentPage(newTotalPages > 0 ? newTotalPages : 1);
                
                setSuccessMessage(`${allGeneratedQuestions.length} questions (40 easy, 40 medium, 40 hard) generated and added successfully!`);
            } else {
                setError("Could not generate any questions. The API might have returned an empty response.");
            }

        } catch (err) {
            console.error(err);
            setError(`An error occurred while generating questions. ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExport = () => {
        clearMessages();
        const dataToExport: ImportedDataType = {};
        let totalQuestions = 0;

        SUBJECT_LEVELS.forEach(subjectItem => {
            const subjectKey = subjectItem.subject;
            const questions = questionBank[subjectKey]?.[selectedClass] || [];
            dataToExport[subjectKey] = questions;
            totalQuestions += questions.length;
        });

        if (totalQuestions === 0) {
            setError(`Không có câu hỏi nào để xuất cho ${selectedClass}.`);
            return;
        }

        const jsonString = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const classNameSlug = selectedClass.toLowerCase().replace(/\s+/g, '_');
        a.download = `questions_${classNameSlug}_all_subjects.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setSuccessMessage(`Xuất thành công ${totalQuestions} câu hỏi cho ${selectedClass}.`);
    };

    const handleImportClick = () => {
        importFileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        clearMessages();
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error("Nội dung tệp không thể đọc được.");
                const data = JSON.parse(text);
                
                const isValidStructure = Object.keys(data).every(subjectKey => {
                    const questions = data[subjectKey];
                    return Array.isArray(questions) && questions.every(q => 'question' in q && Array.isArray(q.options) && 'correctAnswerIndex' in q);
                });

                if (typeof data !== 'object' || data === null || Array.isArray(data) || !isValidStructure) {
                    throw new Error("Định dạng JSON không hợp lệ. Cần một đối tượng có key là tên môn học và value là một mảng các câu hỏi.");
                }

                setImportedQuestions(data);
                setIsImportModalOpen(true);
            } catch (err: any) {
                setError(`Lỗi khi nhập tệp: ${err.message}`);
            } finally {
                if (event.target) {
                    event.target.value = ''; // Reset to allow re-importing the same file
                }
            }
        };
        reader.onerror = () => {
             setError('Không thể đọc tệp đã chọn.');
        };
        reader.readAsText(file);
    };

    const performImport = (mode: 'append' | 'replace') => {
        if (!importedQuestions) return;

        const updatedBank = { ...questionBank };
        let totalImported = 0;

        Object.keys(importedQuestions).forEach(subjectKey => {
            const questionsToImport = importedQuestions[subjectKey];
            if (Array.isArray(questionsToImport)) {
                totalImported += questionsToImport.length;

                if (!updatedBank[subjectKey]) {
                    updatedBank[subjectKey] = {};
                }

                if (mode === 'replace') {
                    updatedBank[subjectKey][selectedClass] = questionsToImport;
                } else {
                    const existing = updatedBank[subjectKey][selectedClass] || [];
                    updatedBank[subjectKey][selectedClass] = [...existing, ...questionsToImport];
                }
            }
        });

        setQuestionBank(updatedBank);
        saveQuestionBank(updatedBank);
        setSuccessMessage(`${totalImported} câu hỏi đã được nhập thành công cho lớp ${selectedClass}!`);
        setIsImportModalOpen(false);
        setImportedQuestions(null);
    };
    
    const currentQuestions = questionBank[selectedSubject]?.[selectedClass] || [];

    // Pagination logic
    const totalPages = Math.ceil(currentQuestions.length / questionsPerPage);
    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const paginatedQuestions = currentQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);
    
    const importedQuestionCount = importedQuestions
        // FIX: Added an Array.isArray type guard to safely access the .length property.
        // When using Object.values on an object with an index signature, TypeScript may infer
        // the values as `unknown[]`. This check ensures we only access `.length` on actual arrays,
        // resolving the "Operator '+' cannot be applied to types 'unknown' and 'number'" error.
        ? Object.values(importedQuestions).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0)
        : 0;

    const handleDeleteQuestion = (qIndexOnPage: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này không?')) {
            const actualIndex = indexOfFirstQuestion + qIndexOnPage;
            
            const updatedBank = { ...questionBank };
            updatedBank[selectedSubject][selectedClass].splice(actualIndex, 1);
            
            const newTotalQuestions = updatedBank[selectedSubject][selectedClass].length;
            const newTotalPages = Math.ceil(newTotalQuestions / questionsPerPage);
            if (currentPage > newTotalPages && newTotalPages > 0) {
                setCurrentPage(newTotalPages);
            }

            setQuestionBank(updatedBank);
            saveQuestionBank(updatedBank);
            setSuccessMessage('Xóa câu hỏi thành công!');
            setError('');
        }
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;
        return (
            <div className="flex justify-center items-center space-x-2 mt-4">
                <button
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border hover:bg-gray-50 disabled:opacity-50"
                >
                    Trước
                </button>
                <span className="text-sm text-gray-600">Trang {currentPage} / {totalPages}</span>
                <button
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border hover:bg-gray-50 disabled:opacity-50"
                >
                    Sau
                </button>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            {successMessage && <div className="p-3 rounded-md bg-green-100 text-green-700">{successMessage}</div>}
            {error && <div className="p-3 rounded-md bg-red-100 text-red-700">{error}</div>}

            {/* Controls */}
            <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="subject-select" className="block text-sm font-medium text-gray-700 mb-1">Chọn Môn học</label>
                        <select id="subject-select" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                            {SUBJECT_LEVELS.map(s => <option key={s.subject} value={s.subject}>{s.subject}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="class-select" className="block text-sm font-medium text-gray-700 mb-1">Chọn Lớp</label>
                        <select id="class-select" value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                           {ALL_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                 </div>
                 <div className="flex flex-wrap gap-2 pt-2 border-t">
                    <button onClick={handleGenerateQuestions} disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300">
                        {isLoading ? 'Đang tạo câu hỏi...' : `Tạo câu hỏi AI cho ${selectedSubject} - ${selectedClass}`}
                    </button>
                    <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition-colors">
                        Xuất câu hỏi
                    </button>
                    <button onClick={handleImportClick} className="px-4 py-2 bg-yellow-500 text-white font-bold rounded-md hover:bg-yellow-600 transition-colors">
                        Nhập câu hỏi
                    </button>
                    <input type="file" ref={importFileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
                 </div>
            </div>

            {/* Question List */}
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Danh sách câu hỏi ({currentQuestions.length})</h3>
                <div className="bg-white rounded-lg shadow border divide-y">
                     {paginatedQuestions.length > 0 ? paginatedQuestions.map((q, index) => (
                        <div key={index} className="p-4">
                            <div className="flex items-start gap-4">
                                {q.image && (
                                    <img 
                                        src={q.image} 
                                        alt="Thumbnail câu hỏi" 
                                        className="w-24 h-16 object-contain rounded-md flex-shrink-0 bg-slate-100 p-1 border" 
                                    />
                                )}
                                <div className="flex-grow">
                                    <p className="font-semibold text-gray-800">{indexOfFirstQuestion + index + 1}. {q.question}</p>
                                    <div className="mt-2 space-y-1 text-sm">
                                        {q.options.map((opt, optIndex) => (
                                            <p key={optIndex} className={`${optIndex === q.correctAnswerIndex ? 'text-green-600 font-bold' : 'text-gray-600'}`}>
                                                {String.fromCharCode(65 + optIndex)}. {opt}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleDeleteQuestion(index)}
                                    className="text-red-500 hover:text-red-700 font-medium ml-4 flex-shrink-0"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    )) : (
                        <p className="p-4 text-gray-500">Không có câu hỏi nào cho môn học và lớp đã chọn.</p>
                    )}
                </div>
                {renderPagination()}
            </div>
            
            <Modal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                title="Xác nhận Nhập câu hỏi"
            >
                <div className="text-center">
                    <p className="text-lg text-gray-700 mb-4">
                        Bạn sắp nhập <strong className="text-blue-600">{importedQuestionCount}</strong> câu hỏi cho lớp <strong className="text-blue-600">{selectedClass}</strong>.
                    </p>
                    <p className="text-sm text-gray-600 mb-6">
                        Chọn 'Thêm' để thêm câu hỏi vào bộ câu hỏi hiện tại, hoặc 'Thay thế' để xóa tất cả câu hỏi hiện có của lớp này và thay bằng các câu hỏi mới.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <button onClick={() => performImport('append')} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">
                            Thêm
                        </button>
                        <button onClick={() => performImport('replace')} className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700">
                            Thay thế
                        </button>
                        <button onClick={() => setIsImportModalOpen(false)} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                            Hủy
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default QuizManagement;