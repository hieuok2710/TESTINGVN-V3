import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginForm: React.FC<{onClose: () => void}> = ({ onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login(username, password);
            onClose(); // Close modal on successful login
        } catch (err: any) {
            setError(err.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p role="alert" className="text-red-500 text-sm bg-red-100 p-3 rounded-md">{error}</p>}
            <div>
                <label htmlFor="login-username" className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                <input 
                    type="text" 
                    id="login-username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                    required 
                    autoComplete="username"
                    aria-required="true"
                />
            </div>
            <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                <input 
                    type="password" 
                    id="login-password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                    required 
                    autoComplete="current-password"
                    aria-required="true"
                />
            </div>
            <button 
                type="submit" 
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
            >
                Đăng nhập
            </button>
        </form>
    );
};

export default LoginForm;