import React, { useEffect, useRef, useId } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const titleId = useId();

    useEffect(() => {
        if (isOpen) {
            const handleKeyDown = (event: KeyboardEvent) => {
                if (event.key === 'Escape') {
                    onClose();
                }
            };
            
            const trapFocus = (event: KeyboardEvent) => {
                if (event.key !== 'Tab' || !modalRef.current) return;

                const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );

                if (focusableElements.length === 0) return;

                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (event.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        event.preventDefault();
                    }
                } else { // Tab
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        event.preventDefault();
                    }
                }
            };

            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('keydown', trapFocus);
            
            // Focus the first focusable element in the modal, or the modal itself
            const firstFocusable = modalRef.current?.querySelector<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            setTimeout(() => {
                if (firstFocusable) {
                    firstFocusable.focus();
                } else if (modalRef.current) {
                    modalRef.current.focus();
                }
            }, 100); // Small delay to ensure modal is rendered

            return () => {
                document.removeEventListener('keydown', handleKeyDown);
                document.removeEventListener('keydown', trapFocus);
            };
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-slate-900 bg-opacity-50 backdrop-blur-sm z-50 flex justify-center items-center"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
        >
            <div 
                ref={modalRef}
                className="bg-white rounded-xl shadow-2xl w-full max-w-md m-4 relative animate-fade-in-down"
                onClick={(e) => e.stopPropagation()}
                tabIndex={-1} // Make modal container focusable programmatically
            >
                <div className="flex justify-between items-center p-5 border-b border-slate-200">
                    <h3 id={titleId} className="text-xl font-bold text-slate-800">{title}</h3>
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label="Close modal"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;