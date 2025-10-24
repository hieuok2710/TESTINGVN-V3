import React, { useState, useRef } from 'react';

// Danh sách các key trong localStorage cần được sao lưu và phục hồi.
const RELEVANT_KEYS = [
    'app_users',
    'app_logins',
    'app_news',
    'app_hero_slides',
    'quiz_bank',
    'quiz_results',
    'quiz_attempts'
];

const SystemManagement: React.FC = () => {
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const restoreInputRef = useRef<HTMLInputElement>(null);

    const showMessage = (text: string, error: boolean = false) => {
        setMessage(text);
        setIsError(error);
        setTimeout(() => setMessage(''), 5000);
    };

    const handleBackup = () => {
        try {
            const backupData: { [key: string]: any } = {};
            let hasData = false;

            RELEVANT_KEYS.forEach(key => {
                const item = localStorage.getItem(key);
                if (item) {
                    try {
                        backupData[key] = JSON.parse(item);
                        hasData = true;
                    } catch (e) {
                        console.warn(`Could not parse localStorage item ${key}, storing as raw string.`, e);
                        backupData[key] = item;
                        hasData = true;
                    }
                }
            });

            if (!hasData) {
                showMessage('Không có dữ liệu để sao lưu.', true);
                return;
            }

            const jsonString = JSON.stringify(backupData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            
            const today = new Date().toISOString().split('T')[0];
            a.download = `website_backup_${today}.json`;
            a.href = url;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showMessage('Sao lưu dữ liệu thành công!', false);

        } catch (error) {
            console.error('Lỗi khi tạo bản sao lưu:', error);
            showMessage(`Đã xảy ra lỗi khi sao lưu: ${error instanceof Error ? error.message : String(error)}`, true);
        }
    };

    const handleRestoreClick = () => {
        restoreInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error("Nội dung tệp không thể đọc được.");
                const data = JSON.parse(text);

                const confirmation = window.confirm(
                    'CẢNH BÁO: Hành động này sẽ XÓA SẠCH toàn bộ dữ liệu hiện tại (người dùng, câu hỏi, nội dung,...) và thay thế bằng dữ liệu từ tệp sao lưu.\n\nHành động này không thể hoàn tác. Bạn có chắc chắn muốn tiếp tục?'
                );
                
                if (confirmation) {
                    // Xóa dữ liệu cũ
                    RELEVANT_KEYS.forEach(key => localStorage.removeItem(key));
                    
                    // Nạp dữ liệu mới
                    Object.keys(data).forEach(key => {
                        if (RELEVANT_KEYS.includes(key)) {
                             localStorage.setItem(key, JSON.stringify(data[key]));
                        }
                    });

                    alert('Phục hồi dữ liệu thành công! Ứng dụng sẽ được tải lại ngay bây giờ.');
                    window.location.reload();
                }

            } catch (err: any) {
                showMessage(`Lỗi khi xử lý tệp phục hồi: ${err.message}`, true);
            } finally {
                if (event.target) {
                    event.target.value = ''; // Reset input để có thể chọn lại cùng tệp
                }
            }
        };
        reader.onerror = () => {
             showMessage('Không thể đọc tệp đã chọn.', true);
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-gray-800">Quản lý Sao lưu & Phục hồi</h2>

            {message && (
                <div role="alert" className={`p-3 rounded-md text-sm ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}
            
            {/* Backup Section */}
            <div className="p-6 border rounded-lg bg-gray-50">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Sao lưu Dữ liệu Toàn bộ Hệ thống</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Nhấn nút bên dưới để tải xuống một tệp JSON chứa tất cả dữ liệu quan trọng của trang web, bao gồm người dùng, câu hỏi, nội dung và kết quả thi. Lưu trữ tệp này ở một nơi an toàn.
                </p>
                <button
                    onClick={handleBackup}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Tạo và Tải xuống Bản sao lưu
                </button>
            </div>

            {/* Restore Section */}
            <div className="p-6 border-2 border-dashed border-red-400 rounded-lg bg-red-50">
                 <h3 className="text-xl font-semibold text-red-800 mb-2">Phục hồi Dữ liệu từ Bản sao lưu</h3>
                 <p className="text-sm text-red-700 mb-4">
                    <span className="font-bold">CẢNH BÁO:</span> Chức năng này sẽ xóa toàn bộ dữ liệu hiện có trên trang web và thay thế bằng dữ liệu từ tệp sao lưu của bạn. Hãy chắc chắn bạn đã chọn đúng tệp và hiểu rõ về hành động này.
                </p>
                <button
                    onClick={handleRestoreClick}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    Nhập & Phục hồi Dữ liệu
                </button>
                <input
                    type="file"
                    ref={restoreInputRef}
                    onChange={handleFileChange}
                    accept="application/json"
                    className="hidden"
                    aria-hidden="true"
                />
            </div>
        </div>
    );
};

export default SystemManagement;