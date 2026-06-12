import { useState } from 'react';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import useToast from '../../hooks/useToast';

const ALL_NOTIFICATIONS = [
    {
        id: 1,
        title: 'Transfer Successful',
        desc: '₹5,000 received from Sneha Gupta',
        time: '2 min ago',
        icon: '💸',
        type: 'success',
        unread: true,
    },
    {
        id: 2,
        title: 'EMI Due Reminder',
        desc: 'Home Loan EMI ₹22,000 due on Dec 1, 2024',
        time: '1 hr ago',
        icon: '🏦',
        type: 'warning',
        unread: true,
    },
    {
        id: 3,
        title: 'KYC Verified',
        desc: 'Your KYC verification has been approved',
        time: '2 hrs ago',
        icon: '✅',
        type: 'success',
        unread: true,
    },
    {
        id: 4,
        title: 'Login Alert',
        desc: 'New login from Chrome, Windows, Kanpur',
        time: '5 hrs ago',
        icon: '🔐',
        type: 'info',
        unread: false,
    },
    {
        id: 5,
        title: 'Cashback Credited',
        desc: '₹800 cashback added to your account',
        time: '1 day ago',
        icon: '🎁',
        type: 'success',
        unread: false,
    },
    {
        id: 6,
        title: 'Transaction Failed',
        desc: '₹3,200 mobile recharge failed — Airtel',
        time: '2 days ago',
        icon: '❌',
        type: 'error',
        unread: false,
    },
    {
        id: 7,
        title: 'New Card Activated',
        desc: 'Your Visa Debit card ending 8901 activated',
        time: '3 days ago',
        icon: '💳',
        type: 'success',
        unread: false,
    },
    {
        id: 8,
        title: 'Loan Application Update',
        desc: 'Personal loan application under review',
        time: '4 days ago',
        icon: '📋',
        type: 'info',
        unread: false,
    },
    {
        id: 9,
        title: 'Password Changed',
        desc: 'Your account password was changed',
        time: '5 days ago',
        icon: '🔑',
        type: 'warning',
        unread: false,
    },
    {
        id: 10,
        title: 'Monthly Statement Ready',
        desc: 'Your November 2024 statement is ready',
        time: '6 days ago',
        icon: '📊',
        type: 'info',
        unread: false,
    },
    {
        id: 11,
        title: 'Transfer Sent',
        desc: '₹15,000 sent to Mohan Lal (Rent)',
        time: '1 week ago',
        icon: '💸',
        type: 'success',
        unread: false,
    },
    {
        id: 12,
        title: 'Security Alert',
        desc: 'Failed login attempt from unknown device',
        time: '1 week ago',
        icon: '⚠️',
        type: 'error',
        unread: false,
    },
];

const NotificationsPage = () => {
    const { showToast } = useToast();

    const [notifications, setNotifications] = useState(ALL_NOTIFICATIONS);
    const [filter, setFilter] = useState('all');

    const filtered = notifications.filter((n) => {
        if (filter === 'unread') return n.unread;
        if (filter === 'read') return !n.unread;
        return true;
    });

    const unreadCount = notifications.filter((n) => n.unread).length;

    const markAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
        showToast('All notifications marked as read ✅', 'success');
    };

    const markOneRead = (id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
        );
    };

    const deleteOne = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        showToast('Notification deleted', 'success');
    };

    const clearAll = () => {
        setNotifications([]);
        showToast('All notifications cleared', 'success');
    };

    const typeBg = {
        success: { bg: '#f0fdf4', border: '#bbf7d0', dot: '#22c55e' },
        warning: { bg: '#fffbeb', border: '#fde68a', dot: '#f59e0b' },
        error: { bg: '#fef2f2', border: '#fecaca', dot: '#ef4444' },
        info: { bg: '#eff6ff', border: '#bfdbfe', dot: '#3b82f6' },
    };

    return (
        <div className="space-y-6 max-w-3xl">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Notifications 🔔
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {unreadCount > 0
                            ? `${unreadCount} unread notifications`
                            : 'All caught up!'}
                    </p>
                </div>
                <div className="flex gap-2">
                    {unreadCount > 0 && (
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={markAllRead}
                        >
                            ✓ Mark All Read
                        </Button>
                    )}
                    {notifications.length > 0 && (
                        <Button size="sm" variant="danger" onClick={clearAll}>
                            🗑️ Clear All
                        </Button>
                    )}
                </div>
            </div>

            {/* FILTER TABS */}
            <div
                className="flex gap-1 p-1 rounded-xl border"
                style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}
            >
                {[
                    { key: 'all', label: `All (${notifications.length})` },
                    { key: 'unread', label: `Unread (${unreadCount})` },
                    {
                        key: 'read',
                        label: `Read (${notifications.length - unreadCount})`,
                    },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key)}
                        className="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200"
                        style={{
                            backgroundColor:
                                filter === tab.key ? '#ffffff' : 'transparent',
                            color: filter === tab.key ? '#111827' : '#6b7280',
                            boxShadow:
                                filter === tab.key
                                    ? '0 1px 3px rgba(0,0,0,0.1)'
                                    : 'none',
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* NOTIFICATIONS LIST */}
            <div
                className="rounded-xl border overflow-hidden"
                style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}
            >
                {filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-5xl mb-3">🎉</p>
                        <p className="font-semibold text-gray-700">
                            No notifications here!
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                            You're all caught up
                        </p>
                    </div>
                ) : (
                    <div>
                        {filtered.map((notif, idx) => {
                            const colors = typeBg[notif.type] || typeBg.info;
                            return (
                                <div
                                    key={notif.id}
                                    className="flex items-start gap-4 px-5 py-4 transition-colors cursor-pointer group"
                                    style={{
                                        backgroundColor: notif.unread
                                            ? colors.bg
                                            : '#ffffff',
                                        borderBottom:
                                            idx < filtered.length - 1
                                                ? '1px solid #f3f4f6'
                                                : 'none',
                                    }}
                                    onClick={() => markOneRead(notif.id)}
                                >
                                    {/* Icon */}
                                    <div
                                        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 mt-0.5"
                                        style={{
                                            backgroundColor: colors.bg,
                                            border: `1px solid ${colors.border}`,
                                        }}
                                    >
                                        {notif.icon}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p
                                                    className="text-sm font-semibold"
                                                    style={{ color: '#111827' }}
                                                >
                                                    {notif.title}
                                                </p>
                                                {notif.unread && (
                                                    <span
                                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                                        style={{
                                                            backgroundColor:
                                                                colors.dot,
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <span
                                                className="text-xs whitespace-nowrap flex-shrink-0"
                                                style={{ color: '#9ca3af' }}
                                            >
                                                {notif.time}
                                            </span>
                                        </div>
                                        <p
                                            className="text-sm mt-0.5"
                                            style={{ color: '#6b7280' }}
                                        >
                                            {notif.desc}
                                        </p>

                                        {/* Actions */}
                                        <div className="flex items-center gap-3 mt-2">
                                            {notif.unread && (
                                                <button
                                                    className="text-xs font-medium"
                                                    style={{ color: '#2563eb' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        markOneRead(notif.id);
                                                    }}
                                                >
                                                    Mark as read
                                                </button>
                                            )}
                                            <button
                                                className="text-xs font-medium"
                                                style={{ color: '#ef4444' }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteOne(notif.id);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
