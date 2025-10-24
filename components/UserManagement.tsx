import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ALL_CLASSES } from '../constants';
import Modal from './Modal';

type SubscriptionPlan = '1-month' | '3-month' | '6-month';

const subscriptionOptions: { plan: SubscriptionPlan; label: string; price: string }[] = [
    { plan: '1-month', label: '1 Tháng', price: '150.000 VNĐ' },
    { plan: '3-month', label: '3 Tháng', price: '420.000 VNĐ' },
    { plan: '6-month', label: '6 Tháng', price: '850.000 VNĐ' },
];

const UserManagement: React.FC = () => {
    const { user, users, addUser, deleteUser, updateUserSubscription } = useAuth();
    
    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        password: '',
        type: 'user' as 'user' | 'admin',
        className: 'LỚP 1',
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('1-month');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        if (!formData.username || !formData.password || !formData.fullName) {
            setMessage('Vui lòng điền đầy đủ các trường.');
            setIsError(true);
            return;
        }

        try {
            await addUser({
                username: formData.username,
                password: formData.password,
                fullName: formData.fullName,
                type: formData.type,
                className: formData.type === 'user' ? formData.className : undefined,
            });
            setMessage(`Tạo người dùng '${formData.username}' thành công!`);
            setIsError(false);
            setFormData({ username: '', fullName: '', password: '', type: 'user', className: 'LỚP 1' });
        } catch (err: any) {
            setMessage(err.message || 'Đã xảy ra lỗi khi tạo người dùng.');
            setIsError(true);
        }
    };
    
    const handleDelete = async (username: string) => {
        setMessage('');
        if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng '${username}' không? Hành động này không thể hoàn tác.`)) {
            try {
                await deleteUser(username);
                setMessage(`Đã xóa người dùng '${username}' thành công.`);
                setIsError(false);
            } catch (err: any) {
                setMessage(err.message || 'Lỗi khi xóa người dùng.');
                setIsError(true);
            }
        }
    };
    
    const handleOpenSubModal = (userToManage: any) => {
        setSelectedUser(userToManage);
        setSelectedPlan(userToManage.subscriptionPlan || '1-month');
        setIsSubModalOpen(true);
    };
    
    const handleSubscriptionUpdate = async () => {
        if (!selectedUser) return;
        setMessage('');
        try {
            await updateUserSubscription(selectedUser.username, selectedPlan);
            setMessage(`Cập nhật gói đăng ký cho '${selectedUser.username}' thành công.`);
            setIsError(false);
            setIsSubModalOpen(false);
            setSelectedUser(null);
        } catch (err: any) {
             setMessage(err.message || 'Lỗi khi cập nhật gói đăng ký.');
             setIsError(true);
        }
    };
    
    const getPlanLabel = (plan: SubscriptionPlan) => {
        return subscriptionOptions.find(opt => opt.plan === plan)?.label || 'Chưa có';
    }

    return (
        <div>
            {message && (
                <div role="alert" className={`p-3 rounded-md mb-4 text-sm ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}
            <div className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tạo người dùng mới</h2>
                <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                     <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                        <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                        <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Loại tài khoản</label>
                        <select id="type" name="type" value={formData.type} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                            <option value="user">Người dùng (User)</option>
                            <option value="admin">Quản trị viên (Admin)</option>
                        </select>
                    </div>
                     {formData.type === 'user' && (
                        <div>
                            <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-1">Lớp</label>
                            <select id="className" name="className" value={formData.className} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                               {ALL_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    )}
                    <button type="submit" className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-300">
                        Tạo người dùng
                    </button>
                </form>
            </div>
            
            <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Danh sách người dùng ({users.length})</h2>
                <div className="overflow-x-auto bg-white rounded-lg shadow border">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên đăng nhập</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ và tên</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lớp</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gói đăng ký</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày hết hạn</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((u) => (
                                <tr key={u.username} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.fullName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.className || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ u.type === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800' }`}>
                                            {u.type}
                                        </span>
                                    </td>
                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getPlanLabel(u.subscriptionPlan as SubscriptionPlan)}</td>
                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.subscriptionExpiry || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                        {u.type === 'user' && (
                                            <button onClick={() => handleOpenSubModal(u)} className="text-blue-600 hover:text-blue-900">
                                                Quản lý
                                            </button>
                                        )}
                                        <button onClick={() => handleDelete(u.username)} disabled={user?.username === u.username} className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed">
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={isSubModalOpen}
                onClose={() => setIsSubModalOpen(false)}
                title={`Quản lý đăng ký cho ${selectedUser?.username}`}
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">Chọn một gói để áp dụng cho người dùng này.</p>
                    <div>
                        <label htmlFor="subscriptionPlan" className="block text-sm font-medium text-gray-700 mb-1">Gói đăng ký</label>
                        <select 
                            id="subscriptionPlan"
                            value={selectedPlan}
                            onChange={(e) => setSelectedPlan(e.target.value as SubscriptionPlan)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            {subscriptionOptions.map(opt => (
                                <option key={opt.plan} value={opt.plan}>
                                    {opt.label} - {opt.price}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-3">
                         <button onClick={() => setIsSubModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                            Hủy
                        </button>
                        <button onClick={handleSubscriptionUpdate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            Lưu thay đổi
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default UserManagement;