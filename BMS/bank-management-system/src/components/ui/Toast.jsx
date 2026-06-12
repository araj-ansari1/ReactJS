import { useEffect } from 'react';
import useToast from '../../hooks/useToast';

// Individual toast item
const ToastItem = ({ toast, onRemove }) => {
    const styles = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500',
    };

    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ',
    };

    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white shadow-lg animate-bounce-in min-w-[280px] ${styles[toast.type] || styles.success}`}
        >
            <span className="text-lg font-bold">
                {icons[toast.type] || icons.success}
            </span>
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button
                onClick={() => onRemove(toast.id)}
                className="text-white/80 hover:text-white text-lg leading-none"
            >
                ×
            </button>
        </div>
    );
};

// Toast container — screen ke top-right mein fixed position
const ToastContainer = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <ToastItem
                    key={toast.id}
                    toast={toast}
                    onRemove={removeToast}
                />
            ))}
        </div>
    );
};

export default ToastContainer;
