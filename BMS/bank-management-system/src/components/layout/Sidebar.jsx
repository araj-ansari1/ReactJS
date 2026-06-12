import { NavLink, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { ROLES } from '../../constants/roles';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';

// Role ke hisaab se alag alag menu items
const getNavItems = (role) => {
    // ===== CUSTOMER — Real Banking Access =====
    // Sirf: Dashboard, Transactions, Transfer, Cards, Loans, Notifications, Profile
    // NO: Deposit (bank karta hai), NO: Withdraw (ATM se hota hai — app se nahi)
    const customerItems = [
        { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: '🏠' },
        { path: ROUTES.TRANSACTIONS, label: 'Transactions', icon: '📋' },
        { path: ROUTES.TRANSFER, label: 'Send Money', icon: '💸' },
        { path: ROUTES.CARDS, label: 'My Cards', icon: '💳' },
        { path: ROUTES.LOANS, label: 'Loans', icon: '🏦' },
        { path: ROUTES.NOTIFICATIONS, label: 'Notifications', icon: '🔔' },
        { path: ROUTES.PROFILE, label: 'My Profile', icon: '👤' },
    ];

    // ===== EMPLOYEE — Medium Access =====
    const employeeItems = [
        { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: '🏠' },
        { path: ROUTES.TRANSACTIONS, label: 'Transactions', icon: '📋' },
        { path: ROUTES.TRANSFER, label: 'Transfer Money', icon: '💸' },
        { path: ROUTES.DEPOSIT, label: 'Deposit', icon: '💰' },
        { path: ROUTES.WITHDRAW, label: 'Withdraw', icon: '💵' },
        { path: ROUTES.CARDS, label: 'My Cards', icon: '💳' },
        { path: ROUTES.LOANS, label: 'Loans', icon: '🏦' },
        { path: ROUTES.NOTIFICATIONS, label: 'Notifications', icon: '🔔' },
        { path: ROUTES.PROFILE, label: 'Profile', icon: '👤' },
        { path: ROUTES.EMPLOYEE_DASH, label: 'Employee Dashboard', icon: '💼' },
        { path: ROUTES.EMPLOYEE_PROFILE, label: 'Work Profile', icon: '🪪' },
    ];

    // ===== ADMIN — Full Access =====
    const adminItems = [
        { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: '🏠' },
        { path: ROUTES.TRANSACTIONS, label: 'Transactions', icon: '📋' },
        { path: ROUTES.TRANSFER, label: 'Transfer Money', icon: '💸' },
        { path: ROUTES.DEPOSIT, label: 'Deposit', icon: '💰' },
        { path: ROUTES.WITHDRAW, label: 'Withdraw', icon: '💵' },
        { path: ROUTES.CARDS, label: 'My Cards', icon: '💳' },
        { path: ROUTES.LOANS, label: 'Loans', icon: '🏦' },
        { path: ROUTES.NOTIFICATIONS, label: 'Notifications', icon: '🔔' },
        { path: ROUTES.PROFILE, label: 'Profile', icon: '👤' },
        { path: ROUTES.ADMIN_PANEL, label: 'Admin Panel', icon: '⚙️' },
        { path: ROUTES.USER_MANAGEMENT, label: 'User Management', icon: '👥' },
    ];

    if (role === ROLES.ADMIN) return adminItems;
    if (role === ROLES.EMPLOYEE) return employeeItems;
    return customerItems;
};

const Sidebar = ({ isOpen, onClose }) => {
    const { currentUser, logout } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const navItems = getNavItems(currentUser?.role);

    const handleLogout = () => {
        logout();
        showToast('Logged out successfully', 'success');
        navigate(ROUTES.LOGIN);
    };

    const roleColors = {
        admin: 'bg-red-100    text-red-700    dark:bg-red-900/20    dark:text-red-400',
        employee:
            'bg-blue-100   text-blue-700   dark:bg-blue-900/20   dark:text-blue-400',
        customer:
            'bg-green-100  text-green-700  dark:bg-green-900/20  dark:text-green-400',
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
        fixed top-0 left-0 h-full w-64 z-30
        bg-white dark:bg-bank-dark
        border-r border-gray-200 dark:border-bank-border
        flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200 dark:border-bank-border">
                    <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        N
                    </div>
                    <div>
                        <h1 className="font-bold text-gray-900 dark:text-white text-lg leading-none">
                            NexaBank
                        </h1>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Banking Platform
                        </p>
                    </div>
                    {/* Mobile close button */}
                    <button
                        onClick={onClose}
                        className="ml-auto lg:hidden text-gray-400 hover:text-gray-600 text-xl"
                    >
                        ✕
                    </button>
                </div>

                {/* User info */}
                <div className="px-4 py-4 border-b border-gray-200 dark:border-bank-border">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-bank-card">
                        <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {currentUser?.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {currentUser?.name}
                            </p>
                            <span
                                className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${roleColors[currentUser?.role]}`}
                            >
                                {currentUser?.role}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Nav links */}
                <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `sidebar-link ${isActive ? 'active' : ''}`
                            }
                        >
                            <span className="text-base">{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Logout button */}
                <div className="px-3 py-4 border-t border-gray-200 dark:border-bank-border">
                    <button
                        onClick={handleLogout}
                        className="sidebar-link w-full text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
                    >
                        <span className="text-base">🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
