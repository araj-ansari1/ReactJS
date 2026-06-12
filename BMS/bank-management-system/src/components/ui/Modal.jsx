import { useEffect } from 'react';
import Button from './Button';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    // ESC key se close karo
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    // Body scroll band karo jab modal open ho
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    return (
        // Backdrop
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            {/* Modal box — click propagation rokke */}
            <div
                className={`w-full ${sizes[size]} bg-white dark:bg-bank-card rounded-2xl shadow-2xl animate-bounce-in`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-bank-border">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-bank-border transition-colors"
                    >
                        ✕
                    </button>
                </div>
                {/* Content */}
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
