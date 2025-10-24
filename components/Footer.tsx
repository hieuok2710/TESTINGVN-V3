import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-800 text-slate-400 py-8">
            <div className="container mx-auto px-4 text-center text-sm">
                <p>&copy; {new Date().getFullYear()} Một Sản phẩm của NGUYỄN TRUNG HIẾU-IT rights reserved.</p>
                <p className="mt-2">Hỗ trợ kỹ thuật: <strong className="text-slate-200">Trung Hiếu_IT</strong> | SĐT: <strong className="text-slate-200">0916.499.916</strong></p>
            </div>
        </footer>
    );
};

export default Footer;