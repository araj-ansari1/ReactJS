import Spinner from './Spinner';

const Button = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    className = '',
}) => {
    const base =
        'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-primary-600 hover:bg-primary-700 text-white',
        secondary:
            'border border-gray-300 dark:border-bank-border text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-bank-card',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        ghost: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-bank-card',
        success: 'bg-green-600 hover:bg-green-700 text-white',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
        >
            {loading && <Spinner size="sm" />}
            {children}
        </button>
    );
};

export default Button;
