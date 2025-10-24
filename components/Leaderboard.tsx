import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface QuizResultEntry {
    username: string;
    score: number;
}

interface LeaderboardUser {
    rank: number;
    fullName: string;
    username: string;
    totalScore: number;
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

const TopPlayerCard: React.FC<{ user: LeaderboardUser; colors: string }> = ({ user, colors }) => (
    <div className={`flex flex-col items-center p-6 rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-105 ${colors}`}>
        <div className="relative">
            <img 
                className="w-24 h-24 rounded-full border-4 border-white shadow-md" 
                src={`https://api.dicebear.com/8.x/fun-emoji/svg?seed=${user.username}`} 
                alt={user.fullName}
            />
            <span className="absolute -bottom-2 -right-2 text-4xl">
                {user.rank === 1 && '🥇'}
                {user.rank === 2 && '🥈'}
                {user.rank === 3 && '🥉'}
            </span>
        </div>
        <h3 className="text-xl font-bold mt-4 text-white text-center truncate w-full">{user.fullName}</h3>
        <p className="text-sm text-white/80">@{user.username}</p>
        <p className="mt-3 text-2xl font-extrabold text-white bg-black/20 px-4 py-1 rounded-full">
            {user.totalScore}
        </p>
    </div>
);


const Leaderboard: React.FC = () => {
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
    const { users } = useAuth();

    useEffect(() => {
        const results = getQuizResults();
        
        const scores: { [username: string]: number } = {};
        results.forEach(result => {
            scores[result.username] = (scores[result.username] || 0) + result.score;
        });

        const rankedUsers = Object.entries(scores)
            .map(([username, totalScore]) => {
                const user = users.find(u => u.username === username);
                return {
                    username,
                    fullName: user?.fullName || username,
                    totalScore
                };
            })
            .sort((a, b) => b.totalScore - a.totalScore)
            .slice(0, 10) // Display top 10
            .map((user, index) => ({
                ...user,
                rank: index + 1
            }));

        setLeaderboardData(rankedUsers);
    }, [users]);
    
    const topThree = leaderboardData.slice(0, 3);
    const rest = leaderboardData.slice(3);

    return (
        <section className="py-16 sm:py-20 bg-white">
            <div className="container mx-auto px-4">
                 <div className="text-center mb-12">
                    <h2 className="section-title">Bảng Xếp Hạng <span className="gradient-text">Vinh Danh</span></h2>
                    <p className="section-subtitle">Vinh danh những học viên xuất sắc nhất trên toàn hệ thống.</p>
                </div>

                {leaderboardData.length === 0 ? (
                    <div className="text-center bg-slate-50 p-8 rounded-xl shadow-sm max-w-2xl mx-auto border">
                        <p className="text-slate-600">
                            Chưa có dữ liệu xếp hạng. Dữ liệu sẽ xuất hiện ở đây sau khi người dùng hoàn thành các bài kiểm tra.
                        </p>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto">
                        {/* Top 3 Players */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            {topThree.find(u => u.rank === 2) && <div className="md:mt-8"><TopPlayerCard user={topThree.find(u => u.rank === 2)!} colors="bg-gradient-to-br from-slate-400 to-slate-600" /></div>}
                            {topThree.find(u => u.rank === 1) && <div><TopPlayerCard user={topThree.find(u => u.rank === 1)!} colors="bg-gradient-to-br from-amber-400 to-yellow-600" /></div>}
                            {topThree.find(u => u.rank === 3) && <div className="md:mt-8"><TopPlayerCard user={topThree.find(u => u.rank === 3)!} colors="bg-gradient-to-br from-orange-400 to-amber-700" /></div>}
                        </div>

                        {/* Rest of the players */}
                        {rest.length > 0 && (
                             <ul className="space-y-3">
                                {rest.map(user => (
                                    <li key={user.username} className="p-4 flex items-center justify-between transition-all duration-300 bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] border">
                                        <div className="flex items-center">
                                            <div className="w-10 text-center font-bold text-slate-500">{user.rank}</div>
                                             <img 
                                                className="w-12 h-12 rounded-full ml-4" 
                                                src={`https://api.dicebear.com/8.x/fun-emoji/svg?seed=${user.username}`} 
                                                alt={user.fullName}
                                            />
                                            <div className="ml-4">
                                                <p className="text-md font-semibold text-slate-900">{user.fullName}</p>
                                                <p className="text-sm text-slate-500">@{user.username}</p>
                                            </div>
                                        </div>
                                        <div className="text-lg font-bold text-indigo-600">
                                            {user.totalScore} <span className="text-sm font-medium text-slate-500">điểm</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Leaderboard;