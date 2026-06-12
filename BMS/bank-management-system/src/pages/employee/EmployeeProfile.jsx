import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import { useState } from 'react';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

const EmployeeProfile = () => {
    const { currentUser } = useAuth();
    const { showToast } = useToast();

    const [editModal, setEditModal] = useState(false);
    const [passModal, setPassModal] = useState(false);
    const [activeTab, setActiveTab] = useState('info');
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: currentUser?.name || '',
        phone: currentUser?.phone || '',
        address: currentUser?.address || '',
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
        showToast('Profile updated! ✅', 'success');
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

    const tabs = [
        { key: 'info', label: '👤 Personal Info' },
        { key: 'work', label: '💼 Work Details' },
        { key: 'security', label: '🔐 Security' },
    ];

    const stats = [
        { label: 'Tasks Completed', value: '48', icon: '✅', color: '#16a34a' },
        { label: 'KYC Approved', value: '23', icon: '📋', color: '#2563eb' },
        { label: 'Loans Processed', value: '12', icon: '🏦', color: '#7c3aed' },
        { label: 'Working Days', value: '284', icon: '📅', color: '#d97706' },
    ];

    return (
        <div className="space-y-6 max-w-4xl">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Employee Profile 💼
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Aapki professional profile
                </p>
            </div>

            {/* HERO CARD */}
            <div
                className="rounded-2xl p-6 text-white relative overflow-hidden"
                style={{
                    background:
                        'linear-gradient(135deg, #1e40af, #2563eb, #3b82f6)',
                }}
            >
                <div
                    className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
                    style={{
                        backgroundColor: 'white',
                        transform: 'translate(30%,-30%)',
                    }}
                />
                <div
                    className="absolute bottom-0 left-0 w-36 h-36 rounded-full opacity-10"
                    style={{
                        backgroundColor: 'white',
                        transform: 'translate(-30%,30%)',
                    }}
                />

                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <div
                            className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-black border-2"
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                borderColor: 'rgba(255,255,255,0.4)',
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
                                className="px-3 py-1 rounded-full text-xs font-semibold"
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                }}
                            >
                                💼 Employee
                            </span>
                            <span
                                className="px-3 py-1 rounded-full text-xs font-semibold"
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                }}
                            >
                                {currentUser?.department ||
                                    'Banking Operations'}
                            </span>
                            <span
                                className="px-3 py-1 rounded-full text-xs font-semibold"
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                }}
                            >
                                ID: {currentUser?.employeeId || 'EMP-001'}
                            </span>
                        </div>
                    </div>

                    {/* Edit button */}
                    <button
                        onClick={() => setEditModal(true)}
                        className="px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95"
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                        }}
                    >
                        ✏️ Edit Profile
                    </button>
                </div>

                {/* Stats row */}
                <div
                    className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 relative z-10"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}
                >
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="text-center p-3 rounded-xl"
                            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                        >
                            <p className="text-2xl font-black">{stat.value}</p>
                            <p
                                className="text-xs mt-0.5"
                                style={{ color: '#bfdbfe' }}
                            >
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* TABS */}
            <div
                className="flex gap-1 p-1 rounded-xl border"
                style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}
            >
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200"
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

            {/* TAB: PERSONAL INFO */}
            {activeTab === 'info' && (
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
                            ✏️ Edit
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            {
                                label: 'Full Name',
                                value: currentUser?.name,
                                icon: '👤',
                            },
                            {
                                label: 'Email',
                                value: currentUser?.email,
                                icon: '📧',
                            },
                            {
                                label: 'Phone',
                                value: currentUser?.phone,
                                icon: '📱',
                            },
                            {
                                label: 'Address',
                                value: currentUser?.address,
                                icon: '📍',
                            },
                            {
                                label: 'Date Joined',
                                value: formatDate(currentUser?.joinDate),
                                icon: '📅',
                            },
                            {
                                label: 'KYC Status',
                                value: currentUser?.kycStatus,
                                icon: '✅',
                                isKyc: true,
                            },
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
                                    {item.isKyc ? (
                                        <Badge
                                            variant={
                                                item.value === 'verified'
                                                    ? 'success'
                                                    : 'pending'
                                            }
                                        >
                                            {item.value}
                                        </Badge>
                                    ) : (
                                        <p className="text-sm font-semibold text-gray-900">
                                            {item.value || '—'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB: WORK DETAILS */}
            {activeTab === 'work' && (
                <div
                    className="rounded-xl border p-6 animate-fade-in"
                    style={{
                        backgroundColor: '#ffffff',
                        borderColor: '#e5e7eb',
                    }}
                >
                    <h2 className="font-semibold text-gray-900 mb-5">
                        Work Details
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            {
                                label: 'Employee ID',
                                value:
                                    currentUser?.employeeId || 'EMP-2023-042',
                                icon: '🪪',
                            },
                            {
                                label: 'Department',
                                value:
                                    currentUser?.department || 'Loans & Credit',
                                icon: '🏢',
                            },
                            {
                                label: 'Designation',
                                value: 'Senior Banking Officer',
                                icon: '💼',
                            },
                            {
                                label: 'Branch',
                                value: 'Kanpur Main Branch',
                                icon: '🏦',
                            },
                            {
                                label: 'Reporting To',
                                value: 'Arjun Sharma (Admin)',
                                icon: '👔',
                            },
                            {
                                label: 'Shift',
                                value: 'Morning (9AM - 6PM)',
                                icon: '⏰',
                            },
                            {
                                label: 'Salary',
                                value: formatCurrency(85000) + '/month',
                                icon: '💰',
                            },
                            {
                                label: 'Joining Date',
                                value: formatDate(currentUser?.joinDate),
                                icon: '📅',
                            },
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
                                    <p className="text-sm font-semibold text-gray-900">
                                        {item.value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Permissions */}
                    <div
                        className="mt-5 pt-5"
                        style={{ borderTop: '1px solid #f3f4f6' }}
                    >
                        <h3 className="font-semibold text-gray-900 mb-3">
                            Access Permissions
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {[
                                { perm: 'View Customer Data', allowed: true },
                                {
                                    perm: 'Edit Customer Profile',
                                    allowed: true,
                                },
                                { perm: 'KYC Approval', allowed: true },
                                { perm: 'Retry Transactions', allowed: true },
                                { perm: 'Delete Users', allowed: false },
                                { perm: 'Change User Balance', allowed: false },
                                { perm: 'Admin Panel Access', allowed: false },
                                {
                                    perm: 'System Configuration',
                                    allowed: false,
                                },
                            ].map((item) => (
                                <div
                                    key={item.perm}
                                    className="flex items-center justify-between p-3 rounded-xl"
                                    style={{
                                        backgroundColor: item.allowed
                                            ? '#f0fdf4'
                                            : '#fef2f2',
                                    }}
                                >
                                    <span className="text-sm text-gray-700">
                                        {item.perm}
                                    </span>
                                    <span className="text-sm font-bold">
                                        {item.allowed ? '✅' : '❌'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: SECURITY */}
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
                            Security Settings
                        </h2>
                        <div className="space-y-3">
                            {[
                                {
                                    label: '2-Factor Authentication',
                                    desc: 'OTP on every login',
                                    enabled: true,
                                },
                                {
                                    label: 'Login Notifications',
                                    desc: 'Email on new login',
                                    enabled: true,
                                },
                                {
                                    label: 'Suspicious Alert',
                                    desc: 'Alert on unusual activity',
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
                                    className="flex items-center justify-between p-3 rounded-xl transition-colors"
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

            {/* EDIT MODAL */}
            <Modal
                isOpen={editModal}
                onClose={() => setEditModal(false)}
                title="Edit Profile"
                size="sm"
            >
                <div className="space-y-4">
                    {[
                        {
                            label: 'Full Name',
                            field: 'name',
                            type: 'text',
                            placeholder: 'Full name',
                        },
                        {
                            label: 'Phone',
                            field: 'phone',
                            type: 'tel',
                            placeholder: '+91 98765 43210',
                        },
                        {
                            label: 'Address',
                            field: 'address',
                            type: 'text',
                            placeholder: 'City, State',
                        },
                    ].map((f) => (
                        <div key={f.field}>
                            <label className="form-label">{f.label}</label>
                            <input
                                type={f.type}
                                value={form[f.field]}
                                onChange={(e) =>
                                    setForm((p) => ({
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

export default EmployeeProfile;
