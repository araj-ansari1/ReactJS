import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import { ROLES } from '../../constants/roles';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

const ProfilePage = () => {
    const { currentUser } = useAuth();
    const { showToast } = useToast();

    const isCustomer = currentUser?.role === ROLES.CUSTOMER;

    const [editModal, setEditModal] = useState(false);
    const [passModal, setPassModal] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: currentUser?.name || '',
        phone: currentUser?.phone || '',
        address: currentUser?.address || '',
        email: currentUser?.email || '',
    });

    const [passForm, setPassForm] = useState({
        current: '',
        newPass: '',
        confirm: '',
    });

    const handleSave = async () => {
        setLoading(true);
        await new Promise((res) => setTimeout(res, 800));
        setLoading(false);
        setEditModal(false);
        showToast('Profile updated successfully! ✅', 'success');
    };

    const handlePassChange = async () => {
        if (!passForm.current) {
            showToast('Current password required', 'error');
            return;
        }
        if (passForm.newPass.length < 6) {
            showToast('Min 6 characters', 'error');
            return;
        }
        if (passForm.newPass !== passForm.confirm) {
            showToast('Passwords match nahi karte', 'error');
            return;
        }
        setLoading(true);
        await new Promise((res) => setTimeout(res, 800));
        setLoading(false);
        setPassModal(false);
        showToast('Password changed! 🔐', 'success');
        setPassForm({ current: '', newPass: '', confirm: '' });
    };

    const kycVariant = {
        verified: 'success',
        pending: 'pending',
        rejected: 'failed',
    };

    const tabs = [
        { key: 'personal', label: '👤 Personal' },
        { key: 'account', label: '🏦 Account' },
        { key: 'security', label: '🔐 Security' },
        { key: 'activity', label: '📊 Activity' },
    ];

    return (
        <div className="space-y-6 max-w-4xl">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    My Profile 👤
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    {isCustomer
                        ? 'Apni personal information dekho aur limited fields update karo'
                        : 'Manage your personal information and settings'}
                </p>
            </div>

            {/* Customer limit banner */}
            {isCustomer && (
                <div
                    className="rounded-xl p-5 mt-4"
                    style={{
                        backgroundColor: '#eff6ff',
                        border: '1px solid #bfdbfe',
                    }}
                >
                    <p
                        className="text-sm font-bold mb-4"
                        style={{ color: '#1d4ed8' }}
                    >
                        📋 Aapke Account Rules (Real Banking)
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Kya kar sakte ho */}
                        <div
                            className="p-4 rounded-xl"
                            style={{
                                backgroundColor: '#f0fdf4',
                                border: '1px solid #bbf7d0',
                            }}
                        >
                            <p
                                className="text-xs font-bold mb-3"
                                style={{ color: '#15803d' }}
                            >
                                ✅ Aap Khud Kar Sakte Hain
                            </p>
                            <div className="space-y-2">
                                {[
                                    {
                                        action: 'Money Transfer',
                                        limit: 'Max ₹2,00,000/day',
                                    },
                                    {
                                        action: 'View Statements',
                                        limit: 'Unlimited',
                                    },
                                    {
                                        action: 'Apply for Loan',
                                        limit: 'As per eligibility',
                                    },
                                    {
                                        action: 'Manage Cards',
                                        limit: 'Freeze/Unfreeze',
                                    },
                                    {
                                        action: 'Update Profile',
                                        limit: 'Phone & Address only',
                                    },
                                    {
                                        action: 'Change Password',
                                        limit: 'Anytime',
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.action}
                                        className="flex items-center justify-between text-xs"
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <span style={{ color: '#16a34a' }}>
                                                ✓
                                            </span>
                                            <span className="text-gray-700 font-medium">
                                                {item.action}
                                            </span>
                                        </div>
                                        <span
                                            className="px-2 py-0.5 rounded-full font-medium"
                                            style={{
                                                backgroundColor: '#dcfce7',
                                                color: '#15803d',
                                            }}
                                        >
                                            {item.limit}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Kya nahi kar sakte */}
                        <div
                            className="p-4 rounded-xl"
                            style={{
                                backgroundColor: '#fef2f2',
                                border: '1px solid #fecaca',
                            }}
                        >
                            <p
                                className="text-xs font-bold mb-3"
                                style={{ color: '#dc2626' }}
                            >
                                ❌ Bank Se Karna Hoga (Branch/Employee)
                            </p>
                            <div className="space-y-2">
                                {[
                                    {
                                        action: 'Cash Withdrawal',
                                        how: 'ATM card use karo',
                                    },
                                    {
                                        action: 'Cash Deposit',
                                        how: 'Branch mein aao',
                                    },
                                    {
                                        action: 'Name Change',
                                        how: 'Documents le ke aao',
                                    },
                                    {
                                        action: 'Email Change',
                                        how: 'Branch verification',
                                    },
                                    {
                                        action: 'Account Closure',
                                        how: 'In-person required',
                                    },
                                    {
                                        action: 'Cheque Request',
                                        how: 'Branch se form bharo',
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.action}
                                        className="flex items-center justify-between text-xs"
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <span style={{ color: '#ef4444' }}>
                                                ✕
                                            </span>
                                            <span className="text-gray-700 font-medium">
                                                {item.action}
                                            </span>
                                        </div>
                                        <span
                                            className="px-2 py-0.5 rounded-full font-medium text-right max-w-[100px] text-center"
                                            style={{
                                                backgroundColor: '#fee2e2',
                                                color: '#dc2626',
                                            }}
                                        >
                                            {item.how}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Transfer limit info */}
                    <div
                        className="mt-3 p-3 rounded-xl flex items-center gap-3"
                        style={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #dbeafe',
                        }}
                    >
                        <span className="text-2xl">💸</span>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">
                                Money Transfer Limit
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Daily: ₹2,00,000 • Per Transaction: ₹2,00,000 •
                                Instant 24/7
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* HERO CARD */}
            <div
                className="rounded-2xl p-6 text-white relative overflow-hidden"
                style={{
                    background:
                        'linear-gradient(135deg, #1e3a8a, #2563eb, #3b82f6)',
                }}
            >
                <div
                    className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
                    style={{
                        backgroundColor: 'white',
                        transform: 'translate(30%,-30%)',
                    }}
                />

                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <div
                            className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-black border-2"
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                borderColor: 'rgba(255,255,255,0.3)',
                            }}
                        >
                            {currentUser?.avatar}
                        </div>
                        <button
                            onClick={() =>
                                showToast('Photo upload coming soon!', 'info')
                            }
                            className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                            style={{ color: '#2563eb' }}
                        >
                            📷
                        </button>
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-2xl font-black">
                            {currentUser?.name}
                        </h2>
                        <p style={{ color: '#bfdbfe' }}>{currentUser?.email}</p>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                            <span
                                className="px-3 py-1 rounded-full text-xs font-semibold capitalize"
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                }}
                            >
                                {currentUser?.role}
                            </span>
                            <span
                                className="px-3 py-1 rounded-full text-xs font-semibold"
                                style={{
                                    backgroundColor:
                                        currentUser?.kycStatus === 'verified'
                                            ? 'rgba(34,197,94,0.3)'
                                            : 'rgba(234,179,8,0.3)',
                                    color:
                                        currentUser?.kycStatus === 'verified'
                                            ? '#bbf7d0'
                                            : '#fef08a',
                                }}
                            >
                                KYC: {currentUser?.kycStatus}
                            </span>
                            <span
                                className="px-3 py-1 rounded-full text-xs font-semibold"
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                }}
                            >
                                Since {formatDate(currentUser?.joinDate)}
                            </span>
                        </div>
                    </div>

                    {/* Balance */}
                    <div className="text-center sm:text-right flex-shrink-0">
                        <p style={{ color: '#bfdbfe' }} className="text-sm">
                            Account Balance
                        </p>
                        <p className="text-3xl font-black">
                            {formatCurrency(currentUser?.balance || 0)}
                        </p>
                        <p
                            className="text-xs font-mono mt-1"
                            style={{ color: '#93c5fd' }}
                        >
                            {currentUser?.accountNumber}
                        </p>
                    </div>
                </div>
            </div>

            {/* TABS */}
            <div
                className="flex gap-1 p-1 rounded-xl border overflow-x-auto"
                style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}
            >
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className="flex-1 min-w-max py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap"
                        style={{
                            backgroundColor:
                                activeTab === tab.key
                                    ? '#ffffff'
                                    : 'transparent',
                            color:
                                activeTab === tab.key ? '#111827' : '#6b7280',
                            boxShadow:
                                activeTab === tab.key
                                    ? '0 1px 3px rgba(0,0,0,0.1)'
                                    : 'none',
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ===== PERSONAL TAB ===== */}
            {activeTab === 'personal' && (
                <div
                    className="rounded-xl border p-6 animate-fade-in"
                    style={{
                        backgroundColor: '#ffffff',
                        borderColor: '#e5e7eb',
                    }}
                >
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-semibold text-gray-900">
                            Personal Information
                        </h2>
                        <Button size="sm" onClick={() => setEditModal(true)}>
                            ✏️ {isCustomer ? 'Edit (Limited)' : 'Edit'}
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            {
                                label: 'Full Name',
                                value: currentUser?.name,
                                icon: '👤',
                                editable: !isCustomer,
                            },
                            {
                                label: 'Email',
                                value: currentUser?.email,
                                icon: '📧',
                                editable: !isCustomer,
                            },
                            {
                                label: 'Phone',
                                value: currentUser?.phone,
                                icon: '📱',
                                editable: true,
                            },
                            {
                                label: 'Address',
                                value: currentUser?.address,
                                icon: '📍',
                                editable: true,
                            },
                            {
                                label: 'Joined',
                                value: formatDate(currentUser?.joinDate),
                                icon: '📅',
                                editable: false,
                            },
                            {
                                label: 'KYC Status',
                                value: currentUser?.kycStatus,
                                icon: '✅',
                                editable: false,
                                isKyc: true,
                            },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="flex items-start gap-3 p-4 rounded-xl relative"
                                style={{
                                    backgroundColor: '#f9fafb',
                                    border: `1px solid ${item.editable ? '#e0e7ff' : '#f3f4f6'}`,
                                }}
                            >
                                <span className="text-xl mt-0.5">
                                    {item.icon}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-400 mb-0.5">
                                        {item.label}
                                    </p>
                                    {item.isKyc ? (
                                        <Badge
                                            variant={
                                                kycVariant[item.value] || 'gray'
                                            }
                                        >
                                            {item.value}
                                        </Badge>
                                    ) : (
                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                            {item.value || '—'}
                                        </p>
                                    )}
                                </div>
                                {/* Editable indicator */}
                                {item.editable && (
                                    <span
                                        className="text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0"
                                        style={{
                                            backgroundColor: '#e0e7ff',
                                            color: '#4338ca',
                                        }}
                                    >
                                        editable
                                    </span>
                                )}
                                {isCustomer &&
                                    !item.editable &&
                                    !item.isKyc && (
                                        <span
                                            className="text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0"
                                            style={{
                                                backgroundColor: '#f3f4f6',
                                                color: '#9ca3af',
                                            }}
                                        >
                                            🔒 locked
                                        </span>
                                    )}
                            </div>
                        ))}
                    </div>

                    {/* KYC pending */}
                    {currentUser?.kycStatus !== 'verified' && (
                        <div
                            className="mt-5 p-4 rounded-xl border flex items-center gap-3"
                            style={{
                                backgroundColor: '#fffbeb',
                                borderColor: '#fde68a',
                            }}
                        >
                            <span className="text-2xl">⚠️</span>
                            <div className="flex-1">
                                <p
                                    className="text-sm font-semibold"
                                    style={{ color: '#92400e' }}
                                >
                                    KYC Verification Pending
                                </p>
                                <p
                                    className="text-xs mt-0.5"
                                    style={{ color: '#b45309' }}
                                >
                                    KYC complete karo to unlock full banking
                                    features
                                </p>
                            </div>
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() =>
                                    showToast('KYC form coming soon!', 'info')
                                }
                            >
                                Complete KYC
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* ===== ACCOUNT TAB ===== */}
            {activeTab === 'account' && (
                <div
                    className="rounded-xl border p-6 animate-fade-in"
                    style={{
                        backgroundColor: '#ffffff',
                        borderColor: '#e5e7eb',
                    }}
                >
                    <h2 className="font-semibold text-gray-900 mb-5">
                        Account Details
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                        {[
                            {
                                label: 'Account Number',
                                value: currentUser?.accountNumber,
                                icon: '🔢',
                            },
                            {
                                label: 'Account Type',
                                value: 'Savings Account',
                                icon: '🏦',
                            },
                            {
                                label: 'IFSC Code',
                                value: 'NEXA0001234',
                                icon: '🏛️',
                            },
                            {
                                label: 'Branch',
                                value: 'Main Branch',
                                icon: '📍',
                            },
                            {
                                label: 'Balance',
                                value: formatCurrency(
                                    currentUser?.balance || 0,
                                ),
                                icon: '💰',
                            },
                            { label: 'Status', value: 'Active', icon: '✅' },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="flex items-start gap-3 p-4 rounded-xl"
                                style={{ backgroundColor: '#f9fafb' }}
                            >
                                <span className="text-xl mt-0.5">
                                    {item.icon}
                                </span>
                                <div>
                                    <p className="text-xs text-gray-400 mb-0.5">
                                        {item.label}
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900 font-mono">
                                        {item.value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Customer transaction limits */}
                    {isCustomer && (
                        <div
                            className="rounded-xl p-4"
                            style={{
                                backgroundColor: '#eff6ff',
                                border: '1px solid #bfdbfe',
                            }}
                        >
                            <p
                                className="text-sm font-semibold mb-3"
                                style={{ color: '#1d4ed8' }}
                            >
                                📊 Your Transaction Limits
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {[
                                    {
                                        label: 'Daily Withdraw',
                                        value: '₹10,000',
                                        icon: '💵',
                                    },
                                    {
                                        label: 'Per Txn Withdraw',
                                        value: '₹5,000',
                                        icon: '🏧',
                                    },
                                    {
                                        label: 'Daily Transfer',
                                        value: '₹2,00,000',
                                        icon: '💸',
                                    },
                                    {
                                        label: 'Min Withdraw',
                                        value: '₹100',
                                        icon: '⬇️',
                                    },
                                    {
                                        label: 'Min Transfer',
                                        value: '₹1',
                                        icon: '➡️',
                                    },
                                    {
                                        label: 'Deposit',
                                        value: 'Bank Only',
                                        icon: '💰',
                                    },
                                ].map((limit) => (
                                    <div
                                        key={limit.label}
                                        className="p-3 rounded-xl text-center"
                                        style={{
                                            backgroundColor: '#ffffff',
                                            border: '1px solid #dbeafe',
                                        }}
                                    >
                                        <p className="text-lg mb-1">
                                            {limit.icon}
                                        </p>
                                        <p
                                            className="text-sm font-bold"
                                            style={{ color: '#1d4ed8' }}
                                        >
                                            {limit.value}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {limit.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ===== SECURITY TAB ===== */}
            {activeTab === 'security' && (
                <div className="space-y-4 animate-fade-in">
                    <div
                        className="rounded-xl border p-6"
                        style={{
                            backgroundColor: '#ffffff',
                            borderColor: '#e5e7eb',
                        }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="font-semibold text-gray-900">
                                    Password
                                </h2>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    Last changed 30 days ago
                                </p>
                            </div>
                            <Button
                                size="sm"
                                onClick={() => setPassModal(true)}
                            >
                                🔑 Change
                            </Button>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>Strength:</span>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="w-8 h-1.5 rounded-full"
                                        style={{
                                            backgroundColor:
                                                i <= 3 ? '#22c55e' : '#e5e7eb',
                                        }}
                                    />
                                ))}
                            </div>
                            <span
                                style={{ color: '#16a34a' }}
                                className="font-medium"
                            >
                                Strong
                            </span>
                        </div>
                    </div>

                    <div
                        className="rounded-xl border p-6"
                        style={{
                            backgroundColor: '#ffffff',
                            borderColor: '#e5e7eb',
                        }}
                    >
                        <h2 className="font-semibold text-gray-900 mb-4">
                            Security Features
                        </h2>
                        <div className="space-y-3">
                            {[
                                {
                                    label: '2-Factor Auth',
                                    desc: 'OTP on every login',
                                    enabled: true,
                                },
                                {
                                    label: 'Login Notifications',
                                    desc: 'Email on new login',
                                    enabled: true,
                                },
                                {
                                    label: 'Transaction Alerts',
                                    desc: 'SMS on every transaction',
                                    enabled: true,
                                },
                                {
                                    label: 'Biometric Login',
                                    desc: 'Fingerprint/Face ID',
                                    enabled: false,
                                },
                            ].map((f) => (
                                <div
                                    key={f.label}
                                    className="flex items-center justify-between p-3 rounded-xl"
                                    style={{ backgroundColor: '#f9fafb' }}
                                >
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {f.label}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {f.desc}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() =>
                                            showToast(
                                                `${f.label} ${f.enabled ? 'disabled' : 'enabled'}!`,
                                                'success',
                                            )
                                        }
                                        className="relative w-11 h-6 rounded-full transition-colors duration-300 flex-shrink-0"
                                        style={{
                                            backgroundColor: f.enabled
                                                ? '#2563eb'
                                                : '#d1d5db',
                                        }}
                                    >
                                        <span
                                            className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300"
                                            style={{
                                                transform: f.enabled
                                                    ? 'translateX(20px)'
                                                    : 'translateX(2px)',
                                            }}
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ===== ACTIVITY TAB ===== */}
            {activeTab === 'activity' && (
                <div
                    className="rounded-xl border p-6 animate-fade-in"
                    style={{
                        backgroundColor: '#ffffff',
                        borderColor: '#e5e7eb',
                    }}
                >
                    <h2 className="font-semibold text-gray-900 mb-4">
                        Recent Activity
                    </h2>
                    <div className="space-y-3">
                        {[
                            {
                                action: 'Login',
                                time: 'Today, 09:15 AM',
                                icon: '🔐',
                                color: '#f0fdf4',
                                border: '#bbf7d0',
                            },
                            {
                                action: 'Password Changed',
                                time: 'Yesterday, 03:20 PM',
                                icon: '🔑',
                                color: '#fffbeb',
                                border: '#fde68a',
                            },
                            {
                                action: 'Profile Updated',
                                time: '2 days ago',
                                icon: '✏️',
                                color: '#eff6ff',
                                border: '#bfdbfe',
                            },
                            {
                                action: 'Card Applied',
                                time: '3 days ago',
                                icon: '💳',
                                color: '#f0fdf4',
                                border: '#bbf7d0',
                            },
                            {
                                action: 'Failed Login',
                                time: '5 days ago',
                                icon: '⚠️',
                                color: '#fef2f2',
                                border: '#fecaca',
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 p-3 rounded-xl"
                                style={{
                                    backgroundColor: item.color,
                                    border: `1px solid ${item.border}`,
                                }}
                            >
                                <div className="text-xl w-8 h-8 flex items-center justify-center flex-shrink-0">
                                    {item.icon}
                                </div>
                                <p className="text-sm font-medium text-gray-900 flex-1">
                                    {item.action}
                                </p>
                                <span className="text-xs text-gray-400">
                                    {item.time}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ===== EDIT MODAL ===== */}
            <Modal
                isOpen={editModal}
                onClose={() => setEditModal(false)}
                title={isCustomer ? 'Edit Profile (Limited)' : 'Edit Profile'}
                size="md"
            >
                <div className="space-y-4">
                    {isCustomer && (
                        <div
                            className="p-3 rounded-xl text-sm font-medium"
                            style={{
                                backgroundColor: '#fffbeb',
                                color: '#92400e',
                                border: '1px solid #fde68a',
                            }}
                        >
                            ⚠️ Customer sirf Phone aur Address update kar sakta
                            hai. Name/Email change ke liye branch visit karein.
                        </div>
                    )}

                    {/* Phone — Always editable */}
                    <div>
                        <label className="form-label">Phone Number</label>
                        <input
                            type="tel"
                            value={form.phone}
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    phone: e.target.value,
                                }))
                            }
                            placeholder="+91 98765 43210"
                            className="input-field"
                        />
                    </div>

                    {/* Address — Always editable */}
                    <div>
                        <label className="form-label">Address</label>
                        <input
                            type="text"
                            value={form.address}
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    address: e.target.value,
                                }))
                            }
                            placeholder="City, State"
                            className="input-field"
                        />
                    </div>

                    {/* Name — Only non-customer */}
                    {!isCustomer && (
                        <div>
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) =>
                                    setForm((p) => ({
                                        ...p,
                                        name: e.target.value,
                                    }))
                                }
                                placeholder="Full name"
                                className="input-field"
                            />
                        </div>
                    )}

                    {/* Read only for customer */}
                    {isCustomer && (
                        <div
                            className="p-4 rounded-xl space-y-2"
                            style={{
                                backgroundColor: '#f9fafb',
                                border: '1px solid #e5e7eb',
                            }}
                        >
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                🔒 Read Only (Branch se change karein)
                            </p>
                            {[
                                {
                                    label: 'Full Name',
                                    value: currentUser?.name,
                                },
                                { label: 'Email', value: currentUser?.email },
                                {
                                    label: 'Account No',
                                    value: currentUser?.accountNumber,
                                },
                            ].map((row) => (
                                <div
                                    key={row.label}
                                    className="flex justify-between text-sm"
                                >
                                    <span className="text-gray-400">
                                        {row.label}
                                    </span>
                                    <span className="font-medium text-gray-500">
                                        {row.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-3 pt-1">
                        <Button
                            variant="secondary"
                            fullWidth
                            onClick={() => setEditModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            fullWidth
                            loading={loading}
                            onClick={handleSave}
                        >
                            {loading ? 'Saving...' : 'Save Changes ✓'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* CHANGE PASSWORD MODAL */}
            <Modal
                isOpen={passModal}
                onClose={() => setPassModal(false)}
                title="Change Password"
                size="sm"
            >
                <div className="space-y-4">
                    {[
                        {
                            label: 'Current Password',
                            field: 'current',
                            placeholder: 'Current password',
                        },
                        {
                            label: 'New Password',
                            field: 'newPass',
                            placeholder: 'Min 6 characters',
                        },
                        {
                            label: 'Confirm Password',
                            field: 'confirm',
                            placeholder: 'Repeat new password',
                        },
                    ].map((f) => (
                        <div key={f.field}>
                            <label className="form-label">{f.label}</label>
                            <input
                                type="password"
                                value={passForm[f.field]}
                                onChange={(e) =>
                                    setPassForm((p) => ({
                                        ...p,
                                        [f.field]: e.target.value,
                                    }))
                                }
                                placeholder={f.placeholder}
                                className="input-field"
                            />
                        </div>
                    ))}
                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            fullWidth
                            onClick={() => setPassModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            fullWidth
                            loading={loading}
                            onClick={handlePassChange}
                        >
                            {loading ? 'Updating...' : 'Update Password 🔐'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ProfilePage;
