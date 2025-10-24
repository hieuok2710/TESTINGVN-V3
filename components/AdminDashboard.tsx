import React, { useState, useEffect } from 'react';
import UserManagement from './UserManagement';
import QuizManagement from './QuizManagement';
import ContentManagement from './ContentManagement';
import SystemManagement from './SystemManagement';
import Modal from './Modal';
import { useAuth } from '../contexts/AuthContext';

interface AdminDashboardProps {
    onExit: () => void;
}

type AdminTab = 'users' | 'quizzes' | 'content' | 'system';

// --- Statistics Component ---
interface TopUser {
    rank: number;
    fullName: string;
    username: string;
    count: number;
}

const StatisticsView: React.FC = () => {
    const { users } = useAuth();
    const [topUsers, setTopUsers] = useState<TopUser[]>([]);

    useEffect(() => {
        const loginsRaw = localStorage.getItem('app_logins');
        const logins: string[] = loginsRaw ? JSON.parse(loginsRaw) : [];

        const loginCounts = logins.reduce((acc, username) => {
            acc[username] = (acc[username] || 0) + 1;
            return acc;
        }, {} as { [key: string]: number });

        const sortedLogins = Object.entries(loginCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([username, count], index) => {
                const user = users.find(u => u.username === username);
                return {
                    rank: index + 1,
                    fullName: user?.fullName || username,
                    username,
                    count
                };
            });

        setTopUsers(sortedLogins);
    }, [users]);

    return (
        <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Top 10 tài khoản truy cập nhiều nhất</h3>
            {topUsers.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hạng</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ và tên</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên đăng nhập</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lần truy cập</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {topUsers.map((user) => (
                                <tr key={user.username}>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.rank}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{user.fullName}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{user.username}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 font-bold">{user.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-500">Chưa có dữ liệu truy cập để thống kê.</p>
            )}
        </div>
    );
};


// --- Main Dashboard Component ---
const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExit }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<AdminTab>('users');
    const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
    
    if (user?.type !== 'admin') {
        return (
            <div className="bg-gray-100 py-8 min-h-screen">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold text-red-600">Truy cập bị từ chối</h1>
                    <p className="text-gray-700 mt-4">Bạn không có quyền truy cập vào khu vực này.</p>
                    <button onClick={onExit} className="mt-6 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                        Về trang chủ
                    </button>
                </div>
            </div>
        );
    }

    const renderTabContent = () => {
        return (
            <>
                <div id="panel-users" role="tabpanel" aria-labelledby="tab-users" hidden={activeTab !== 'users'}>
                   <UserManagement />
                </div>
                <div id="panel-quizzes" role="tabpanel" aria-labelledby="tab-quizzes" hidden={activeTab !== 'quizzes'}>
                    <QuizManagement />
                </div>
                <div id="panel-content" role="tabpanel" aria-labelledby="tab-content" hidden={activeTab !== 'content'}>
                    <ContentManagement />
                </div>
                <div id="panel-system" role="tabpanel" aria-labelledby="tab-system" hidden={activeTab !== 'system'}>
                    <SystemManagement />
                </div>
            </>
        );
    };
    
    return (
        <div className="bg-gray-100 py-8 min-h-screen">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-blue-800">Bảng điều khiển Quản trị</h1>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => setIsStatsModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Thống kê
                        </button>
                        <button onClick={onExit} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                            Thoát &rarr;
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg">
                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200">
                        <div role="tablist" aria-label="Admin sections" className="flex flex-wrap sm:flex-nowrap overflow-x-auto space-x-2 sm:space-x-4 p-2 sm:p-4">
                            <button
                                id="tab-users"
                                role="tab"
                                aria-selected={activeTab === 'users'}
                                aria-controls="panel-users"
                                onClick={() => setActiveTab('users')}
                                className={`px-3 py-2 font-medium text-xs sm:text-sm rounded-md flex-shrink-0 ${
                                    activeTab === 'users' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                Quản lý người dùng
                            </button>
                            <button
                                id="tab-quizzes"
                                role="tab"
                                aria-selected={activeTab === 'quizzes'}
                                aria-controls="panel-quizzes"
                                onClick={() => setActiveTab('quizzes')}
                                className={`px-3 py-2 font-medium text-xs sm:text-sm rounded-md flex-shrink-0 ${
                                    activeTab === 'quizzes' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                Quản lý câu hỏi
                            </button>
                             <button
                                id="tab-content"
                                role="tab"
                                aria-selected={activeTab === 'content'}
                                aria-controls="panel-content"
                                onClick={() => setActiveTab('content')}
                                className={`px-3 py-2 font-medium text-xs sm:text-sm rounded-md flex-shrink-0 ${
                                    activeTab === 'content' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                Quản lý Nội dung
                            </button>
                            <button
                                id="tab-system"
                                role="tab"
                                aria-selected={activeTab === 'system'}
                                aria-controls="panel-system"
                                onClick={() => setActiveTab('system')}
                                className={`px-3 py-2 font-medium text-xs sm:text-sm rounded-md flex-shrink-0 ${
                                    activeTab === 'system' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                Hệ thống
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-4 sm:p-6">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
            <Modal
                isOpen={isStatsModalOpen}
                onClose={() => setIsStatsModalOpen(false)}
                title="Bảng thống kê"
            >
                <StatisticsView />
            </Modal>
        </div>
    );
};

export default AdminDashboard;