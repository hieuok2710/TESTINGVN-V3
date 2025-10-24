import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface QuizResultEntry {
    username: string;
    score: number;
    className: string;
    date: string;
}

const getQuizResults = (): QuizResultEntry[] => {
    try {
        const results = localStorage.getItem('quiz_results');
        return results ? JSON.parse(results) : [];
    } catch (e) {
        console.error("Failed to parse quiz results", e);
        return [];
    }
};

const QuizHistory: React.FC = () => {
    const { user } = useAuth();
    const [userHistory, setUserHistory] = useState<QuizResultEntry[]>([]);

    useEffect(() => {
        if (user) {
            const allResults = getQuizResults();
            const history = allResults
                .filter(result => result.username === user.username)
                .sort((a, b) => new Date(b.date.split('/').reverse().join('-')).getTime() - new Date(a.date.split('/').reverse().join('-')).getTime());
            setUserHistory(history);
        }
    }, [user]);

    if (!user) {
        return (
            <section className="py-16 sm:py-20 bg-slate-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-red-600">Truy cập bị từ chối</h2>
                    <p className="text-slate-600 mt-4">Vui lòng đăng nhập để xem lịch sử làm bài của bạn.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 sm:py-20 bg-slate-50 min-h-[60vh]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="section-title">Lịch sử <span className="gradient-text">Làm Bài</span></h2>
                    <p className="section-subtitle">Xem lại kết quả các bài thi bạn đã hoàn thành.</p>
                </div>

                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border">
                    {userHistory.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên bài thi</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày làm bài</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điểm số</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {userHistory.map((result, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.className}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 font-bold">{result.score}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center p-8">
                            <p className="text-slate-600">Bạn chưa hoàn thành bài thi nào. Hãy bắt đầu ngay!</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default QuizHistory;
