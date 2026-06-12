// Reusable card wrapper — dashboard mein use hoga

const Card = ({ children, className = '', onClick }) => (
    <div
        onClick={onClick}
        className={`bg-white dark:bg-bank-card rounded-xl border border-gray-200 dark:border-bank-border shadow-sm hover:shadow-md transition-all duration-200 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
        {children}
    </div>
);

// Dashboard stat card — icon, title, value, change
export const StatCard = ({ title, value, change, changeType, icon, color }) => {
    const colors = {
        blue: 'bg-blue-100   dark:bg-blue-900/20   text-blue-600   dark:text-blue-400',
        green: 'bg-green-100  dark:bg-green-900/20  text-green-600  dark:text-green-400',
        purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
        orange: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
        red: 'bg-red-100    dark:bg-red-900/20    text-red-600    dark:text-red-400',
    };

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${colors[color] || colors.blue}`}
                >
                    {icon}
                </div>
                {change && (
                    <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${changeType === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}
                    >
                        {changeType === 'up' ? '↑' : '↓'} {change}
                    </span>
                )}
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {value}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        </Card>
    );
};

export default Card;
