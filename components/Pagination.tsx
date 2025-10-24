import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) {
        return null;
    }

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav aria-label="Pagination" className="flex justify-center items-center space-x-1 sm:space-x-2 mt-12">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Go to previous page"
            >
                &larr; Trước
            </button>
            {pageNumbers.map(number => (
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                        currentPage === number
                            ? 'bg-indigo-600 text-white border border-indigo-600 shadow-sm'
                            : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
                    }`}
                    aria-label={`Go to page ${number}`}
                    aria-current={currentPage === number ? 'page' : undefined}
                >
                    {number}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Go to next page"
            >
                Sau &rarr;
            </button>
        </nav>
    );
};

export default Pagination;