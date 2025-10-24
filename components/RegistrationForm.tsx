import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ALL_CLASSES } from '../constants';

const RegistrationForm: React.FC<{onSuccess: () => void}> = ({onSuccess}) => {
    const { addUser } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        className: 'LỚP 1',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState<Partial<typeof formData>>({});
    const [passwordError, setPasswordError] = useState('');

    const validatePassword = (password: string) => {
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password),
        };
        const errorMessages = [];
        if (!checks.length) errorMessages.push('Tối thiểu 8 ký tự');
        if (!checks.uppercase) errorMessages.push('Ít nhất 1 chữ hoa');
        if (!checks.number) errorMessages.push('Ít nhất 1 chữ số');
        if (!checks.special) errorMessages.push('Ít nhất 1 ký tự đặc biệt');
        
        setPasswordError(errorMessages.join(', '));
        return errorMessages.length === 0;
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (name === 'password') {
            validatePassword(value);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Partial<typeof formData> = {};

        if (!formData.username) newErrors.username = 'Vui lòng nhập tên đăng nhập.';
        if (!formData.fullName) newErrors.fullName = 'Vui lòng nhập họ tên.';
        if (!formData.className) newErrors.className = 'Vui lòng chọn lớp.';
        if (!formData.phone) newErrors.phone = 'Vui lòng nhập số điện thoại.';
        
        const isPasswordValid = validatePassword(formData.password);
        if (!formData.password) {
            setPasswordError('Vui lòng nhập mật khẩu.');
        } else if (!isPasswordValid) {
            // Error is already set by validatePassword
        }
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu không khớp.';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0 && isPasswordValid && formData.password === formData.confirmPassword) {
            try {
                await addUser({
                    username: formData.username,
                    password: formData.password,
                    fullName: formData.fullName,
                    className: formData.className,
                    type: 'user',
                });
                onSuccess();
            } catch (err: any) {
                 setErrors(prev => ({...prev, username: err.message }));
            }
        }
    };
    
    const renderError = (field: keyof typeof formData) => {
        const errorId = `${String(field)}-error`;
        if (errors[field]) {
            return <p id={errorId} className="text-red-500 text-xs mt-1">{errors[field]}</p>;
        }
        return null;
    };

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required aria-required="true" aria-describedby={errors.username ? 'username-error' : undefined} />
                {renderError('username')}
            </div>
            <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Họ tên người đăng ký</label>
                <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required aria-required="true" aria-describedby={errors.fullName ? 'fullName-error' : undefined}/>
                {renderError('fullName')}
            </div>
            <div>
                <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-1">Lớp</label>
                <select id="className" name="className" value={formData.className} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required aria-required="true" aria-describedby={errors.className ? 'className-error' : undefined}>
                    {ALL_CLASSES.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                </select>
                {renderError('className')}
            </div>
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">SĐT/Zalo liên hệ</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required aria-required="true" aria-describedby={errors.phone ? 'phone-error' : undefined} />
                {renderError('phone')}
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required aria-required="true" aria-describedby={passwordError ? 'password-error-desc' : 'password-hint'} />
                {passwordError && <p id="password-error-desc" className="text-red-500 text-xs mt-1">{passwordError}</p>}
                <p id="password-hint" className="text-xs text-gray-500 mt-1">Tối thiểu 8 ký tự, gồm chữ hoa, số và ký tự đặc biệt.</p>
            </div>
            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Nhập lại mật khẩu</label>
                <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required aria-required="true" aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined} />
                {renderError('confirmPassword')}
            </div>
            <button type="submit" className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-300">
                Đăng ký & Tiếp tục
            </button>
        </form>
    );
};

export default RegistrationForm;