import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';
import useToast from '../../hooks/useToast';
import { formatCurrency } from '../../utils/formatCurrency';
import { ROUTES } from '../../constants/routes';

const Navbar = ({ onMenuClick }) => {
    const { currentUser, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [bellOpen, setBellOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const bellRef = useRef(null);
    const profileRef = useRef(null);

    // Bahar click karne par dropdown band karo
    useEffect(() => {
        const handleClick = (e) => {
            if (bellRef.current && !bellRef.current.contains(e.target))
                setBellOpen(false);
            if (profileRef.current && !profileRef.current.contains(e.target))
                setProfileOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleLogout = () => {
        logout();
        showToast('Logged out successfully 👋', 'success');
        navigate(ROUTES.LOGIN);
    };

    const notifications = [
        {
            id: 1,
            title: 'Transfer Successful',
            desc: '₹5,000 received from Sneha',
            time: '2 min ago',
            icon: '💸',
            unread: true,
        },
        {
            id: 2,
            title: 'EMI Due Reminder',
            desc: 'Home Loan EMI due on Dec 1',
            time: '1 hr ago',
            icon: '🏦',
            unread: true,
        },
        {
            id: 3,
            title: 'KYC Verified',
            desc: 'Your KYC has been approved',
            time: '2 hrs ago',
            icon: '✅',
            unread: true,
        },
        {
            id: 4,
            title: 'Login Alert',
            desc: 'New login from Chrome, Windows',
            time: '5 hrs ago',
            icon: '🔐',
            unread: false,
        },
        {
            id: 5,
            title: 'Cashback Credited',
            desc: '₹800 cashback added to account',
            time: '1 day ago',
            icon: '🎁',
            unread: false,
        },
    ];

    const unreadCount = notifications.filter((n) => n.unread).length;

    return (
        <header
            className="h-16 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-10"
            style={{
                backgroundColor: isDark ? '#0f172a' : '#ffffff',
                borderBottom: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
            }}
        >
            {/* ===== LEFT ===== */}
            <div className="flex items-center gap-4">
                {/* Hamburger — mobile */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-lg transition-colors"
                    style={{ color: '#6b7280' }}
                >
                    <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            d="M3 6h14M3 10h14M3 14h14"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>

                {/* Welcome text */}
                <div className="hidden lg:block">
                    <p
                        className="text-sm"
                        style={{ color: isDark ? '#94a3b8' : '#6b7280' }}
                    >
                        Welcome back,{' '}
                        <span
                            className="font-semibold"
                            style={{ color: isDark ? '#f1f5f9' : '#111827' }}
                        >
                            {currentUser?.name?.split(' ')[0]}
                        </span>{' '}
                        👋
                    </p>
                </div>
            </div>

            {/* ===== RIGHT ===== */}
            <div className="flex items-center gap-2">
                {/* Balance chip */}
                <div
                    className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border"
                    style={{
                        backgroundColor: isDark ? '#1e293b' : '#f9fafb',
                        borderColor: isDark ? '#334155' : '#e5e7eb',
                    }}
                >
                    <span
                        className="text-xs"
                        style={{ color: isDark ? '#94a3b8' : '#6b7280' }}
                    >
                        Balance
                    </span>
                    <span
                        className="text-sm font-bold"
                        style={{ color: '#16a34a' }}
                    >
                        {formatCurrency(currentUser?.balance || 0)}
                    </span>
                </div>

                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border transition-colors"
                    style={{
                        backgroundColor: isDark ? '#1e293b' : '#f9fafb',
                        borderColor: isDark ? '#334155' : '#e5e7eb',
                        color: isDark ? '#94a3b8' : '#6b7280',
                    }}
                    title={isDark ? 'Light Mode' : 'Dark Mode'}
                >
                    {isDark ? '☀️' : '🌙'}
                </button>

                {/* ===== BELL NOTIFICATION ===== */}
                <div className="relative" ref={bellRef}>
                    <button
                        onClick={() => {
                            setBellOpen((p) => !p);
                            setProfileOpen(false);
                        }}
                        className="w-9 h-9 flex items-center justify-center rounded-xl border transition-colors relative"
                        style={{
                            backgroundColor: isDark ? '#1e293b' : '#f9fafb',
                            borderColor: isDark ? '#334155' : '#e5e7eb',
                            color: isDark ? '#94a3b8' : '#6b7280',
                        }}
                    >
                        🔔
                        {unreadCount > 0 && (
                            <span
                                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-bold"
                                style={{
                                    backgroundColor: '#ef4444',
                                    fontSize: '10px',
                                }}
                            >
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Bell Dropdown */}
                    {bellOpen && (
                        <div
                            className="absolute right-0 top-12 w-80 rounded-2xl shadow-2xl border z-50 overflow-hidden animate-bounce-in"
                            style={{
                                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                                borderColor: isDark ? '#334155' : '#e5e7eb',
                            }}
                        >
                            {/* Header */}
                            <div
                                className="flex items-center justify-between px-4 py-3 border-b"
                                style={{
                                    borderColor: isDark ? '#334155' : '#f3f4f6',
                                }}
                            >
                                <h3
                                    className="font-semibold text-sm"
                                    style={{
                                        color: isDark ? '#f1f5f9' : '#111827',
                                    }}
                                >
                                    Notifications
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span
                                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                                        style={{
                                            backgroundColor: '#fee2e2',
                                            color: '#dc2626',
                                        }}
                                    >
                                        {unreadCount} new
                                    </span>
                                    <button
                                        className="text-xs font-medium"
                                        style={{ color: '#2563eb' }}
                                        onClick={() =>
                                            showToast(
                                                'All notifications marked as read',
                                                'success',
                                            )
                                        }
                                    >
                                        Mark all read
                                    </button>
                                </div>
                            </div>

                            {/* Notifications list */}
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors"
                                        style={{
                                            backgroundColor: notif.unread
                                                ? isDark
                                                    ? 'rgba(37,99,235,0.08)'
                                                    : '#eff6ff'
                                                : 'transparent',
                                            borderBottom: `1px solid ${isDark ? '#334155' : '#f9fafb'}`,
                                        }}
                                        onClick={() =>
                                            showToast(notif.title, 'info')
                                        }
                                    >
                                        <div
                                            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
                                            style={{
                                                backgroundColor: isDark
                                                    ? '#334155'
                                                    : '#f3f4f6',
                                            }}
                                        >
                                            {notif.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p
                                                    className="text-sm font-semibold truncate"
                                                    style={{
                                                        color: isDark
                                                            ? '#f1f5f9'
                                                            : '#111827',
                                                    }}
                                                >
                                                    {notif.title}
                                                </p>
                                                {notif.unread && (
                                                    <span
                                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                                        style={{
                                                            backgroundColor:
                                                                '#3b82f6',
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <p
                                                className="text-xs mt-0.5 truncate"
                                                style={{
                                                    color: isDark
                                                        ? '#94a3b8'
                                                        : '#6b7280',
                                                }}
                                            >
                                                {notif.desc}
                                            </p>
                                            <p
                                                className="text-xs mt-0.5"
                                                style={{
                                                    color: isDark
                                                        ? '#64748b'
                                                        : '#9ca3af',
                                                }}
                                            >
                                                {notif.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div
                                className="px-4 py-3 border-t text-center"
                                style={{
                                    borderColor: isDark ? '#334155' : '#f3f4f6',
                                }}
                            >
                                <button
                                    className="text-sm font-medium"
                                    style={{ color: '#2563eb' }}
                                    onClick={() => {
                                        setBellOpen(false);
                                        navigate(ROUTES.NOTIFICATIONS);
                                    }}
                                >
                                    View All Notifications →
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ===== PROFILE AVATAR ===== */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => {
                            setProfileOpen((p) => !p);
                            setBellOpen(false);
                        }}
                        className="flex items-center gap-2 p-1 rounded-xl border transition-colors"
                        style={{
                            backgroundColor: isDark ? '#1e293b' : '#f9fafb',
                            borderColor: profileOpen
                                ? '#2563eb'
                                : isDark
                                  ? '#334155'
                                  : '#e5e7eb',
                        }}
                    >
                        <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: '#2563eb' }}
                        >
                            {currentUser?.avatar}
                        </div>
                        <div className="hidden sm:block text-left pr-1">
                            <p
                                className="text-xs font-semibold leading-none"
                                style={{
                                    color: isDark ? '#f1f5f9' : '#111827',
                                }}
                            >
                                {currentUser?.name?.split(' ')[0]}
                            </p>
                            <p
                                className="text-xs capitalize mt-0.5"
                                style={{
                                    color: isDark ? '#94a3b8' : '#6b7280',
                                }}
                            >
                                {currentUser?.role}
                            </p>
                        </div>
                        <span
                            className="text-xs hidden sm:block pr-1"
                            style={{ color: isDark ? '#94a3b8' : '#6b7280' }}
                        >
                            ▾
                        </span>
                    </button>

                    {/* Profile Dropdown */}
                    {profileOpen && (
                        <div
                            className="absolute right-0 top-12 w-64 rounded-2xl shadow-2xl border z-50 overflow-hidden animate-bounce-in"
                            style={{
                                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                                borderColor: isDark ? '#334155' : '#e5e7eb',
                            }}
                        >
                            {/* User info header */}
                            <div
                                className="px-4 py-4 border-b"
                                style={{
                                    borderColor: isDark ? '#334155' : '#f3f4f6',
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg"
                                        style={{ backgroundColor: '#2563eb' }}
                                    >
                                        {currentUser?.avatar}
                                    </div>
                                    <div>
                                        <p
                                            className="font-bold text-sm"
                                            style={{
                                                color: isDark
                                                    ? '#f1f5f9'
                                                    : '#111827',
                                            }}
                                        >
                                            {currentUser?.name}
                                        </p>
                                        <p
                                            className="text-xs"
                                            style={{
                                                color: isDark
                                                    ? '#94a3b8'
                                                    : '#6b7280',
                                            }}
                                        >
                                            {currentUser?.email}
                                        </p>
                                        <span
                                            className="text-xs px-2 py-0.5 rounded-full font-medium capitalize mt-1 inline-block"
                                            style={{
                                                backgroundColor: '#eff6ff',
                                                color: '#2563eb',
                                            }}
                                        >
                                            {currentUser?.role}
                                        </span>
                                    </div>
                                </div>

                                {/* Balance */}
                                <div
                                    className="mt-3 p-2 rounded-xl flex items-center justify-between"
                                    style={{
                                        backgroundColor: isDark
                                            ? '#334155'
                                            : '#f9fafb',
                                    }}
                                >
                                    <span
                                        className="text-xs"
                                        style={{
                                            color: isDark
                                                ? '#94a3b8'
                                                : '#6b7280',
                                        }}
                                    >
                                        Balance
                                    </span>
                                    <span
                                        className="text-sm font-bold"
                                        style={{ color: '#16a34a' }}
                                    >
                                        {formatCurrency(
                                            currentUser?.balance || 0,
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* Menu items */}
                            <div className="py-2">
                                {[
                                    {
                                        icon: '👤',
                                        label: 'My Profile',
                                        action: () => {
                                            navigate(ROUTES.PROFILE);
                                            setProfileOpen(false);
                                        },
                                    },
                                    {
                                        icon: '💳',
                                        label: 'My Cards',
                                        action: () => {
                                            navigate(ROUTES.CARDS);
                                            setProfileOpen(false);
                                        },
                                    },
                                    {
                                        icon: '📋',
                                        label: 'Transactions',
                                        action: () => {
                                            navigate(ROUTES.TRANSACTIONS);
                                            setProfileOpen(false);
                                        },
                                    },
                                    {
                                        icon: '🔐',
                                        label: 'Security Settings',
                                        action: () => {
                                            navigate(ROUTES.PROFILE);
                                            setProfileOpen(false);
                                            showToast(
                                                'Opening security settings...',
                                                'info',
                                            );
                                        },
                                    },
                                ].map((item) => (
                                    <button
                                        key={item.label}
                                        onClick={item.action}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                                        style={{
                                            color: isDark
                                                ? '#cbd5e1'
                                                : '#374151',
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.backgroundColor =
                                                isDark ? '#334155' : '#f9fafb')
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.backgroundColor =
                                                'transparent')
                                        }
                                    >
                                        <span>{item.icon}</span>
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Divider */}
                            <div
                                style={{
                                    height: '1px',
                                    backgroundColor: isDark
                                        ? '#334155'
                                        : '#f3f4f6',
                                }}
                            />

                            {/* Logout */}
                            <div className="py-2">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                                    style={{ color: '#ef4444' }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.backgroundColor =
                                            '#fef2f2')
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.backgroundColor =
                                            'transparent')
                                    }
                                >
                                    <span>🚪</span>
                                    <span className="font-medium">Logout</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
