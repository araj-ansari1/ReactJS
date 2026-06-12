import { useState } from 'react';
import { MOCK_USERS } from '../../constants/mockUsers';
import { ROLES } from '../../constants/roles';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import useToast from '../../hooks/useToast';
import useAuth from '../../hooks/useAuth';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

const UserManagement = () => {
    const { showToast } = useToast();
    const { currentUser } = useAuth();

    const [users, setUsers] = useState(MOCK_USERS);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [viewModal, setViewModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [addModal, setAddModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [loading, setLoading] = useState(false);

    // ===== ADD USER FORM =====
    const emptyAddForm = {
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        role: ROLES.CUSTOMER,
        kycStatus: 'pending',
        isActive: true,
        balance: 5000,
    };
    const [addForm, setAddForm] = useState(emptyAddForm);
    const [addErrors, setAddErrors] = useState({});

    // ===== EDIT USER FORM =====
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        role: '',
        kycStatus: '',
        isActive: true,
        balance: 0,
    });

    // ===== FILTERED USERS =====
    const filtered = users.filter((u) => {
        const matchSearch =
            !search ||
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()) ||
            u.accountNumber.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === 'all' || u.role === roleFilter;
        const matchStatus =
            statusFilter === 'all' ||
            (statusFilter === 'active' ? u.isActive : !u.isActive);
        return matchSearch && matchRole && matchStatus;
    });

    // ===== VALIDATE ADD FORM =====
    const validateAdd = () => {
        const e = {};
        if (!addForm.name.trim()) e.name = 'Name required';
        if (!addForm.email.trim()) e.email = 'Email required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addForm.email))
            e.email = 'Invalid email';
        else if (users.find((u) => u.email === addForm.email))
            e.email = 'Email already exists';
        if (!addForm.password.trim()) e.password = 'Password required';
        else if (addForm.password.length < 6) e.password = 'Min 6 characters';
        if (!addForm.phone.trim()) e.phone = 'Phone required';
        if (isNaN(addForm.balance) || Number(addForm.balance) < 0)
            e.balance = 'Valid balance required';
        setAddErrors(e);
        return Object.keys(e).length === 0;
    };

    // ===== ADD USER =====
    const handleAddUser = async () => {
        if (!validateAdd()) return;
        setLoading(true);
        await new Promise((res) => setTimeout(res, 800));

        const newUser = {
            id: `u${String(users.length + 1).padStart(3, '0')}`,
            name: addForm.name.trim(),
            email: addForm.email.trim(),
            password: addForm.password,
            role: addForm.role,
            avatar: addForm.name
                .trim()
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2),
            phone: addForm.phone.trim(),
            address: addForm.address.trim() || 'Not provided',
            accountNumber: `NX-${String(users.length + 1).padStart(4, '0')}-${addForm.role.slice(0, 4).toUpperCase()}`,
            balance: Number(addForm.balance),
            joinDate: new Date().toISOString().split('T')[0],
            kycStatus: addForm.kycStatus,
            isActive: addForm.isActive,
        };

        setUsers((prev) => [...prev, newUser]);
        MOCK_USERS.push(newUser);
        setLoading(false);
        setAddModal(false);
        setAddForm(emptyAddForm);
        setAddErrors({});
        showToast(`${newUser.name} successfully add ho gaya! 🎉`, 'success');
    };

    // ===== OPEN EDIT =====
    const openEdit = (user) => {
        setSelectedUser(user);
        setEditForm({
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role,
            kycStatus: user.kycStatus,
            isActive: user.isActive,
            balance: user.balance,
        });
        setEditModal(true);
    };

    // ===== SAVE EDIT =====
    const handleSaveEdit = () => {
        if (!editForm.name || !editForm.email) {
            showToast('Name aur Email required hai', 'error');
            return;
        }
        setUsers((prev) =>
            prev.map((u) =>
                u.id === selectedUser.id
                    ? { ...u, ...editForm, balance: Number(editForm.balance) }
                    : u,
            ),
        );
        showToast(`${editForm.name} update ho gaya ✅`, 'success');
        setEditModal(false);
    };

    // ===== TOGGLE STATUS =====
    const toggleStatus = (userId) => {
        setUsers((prev) =>
            prev.map((u) =>
                u.id === userId ? { ...u, isActive: !u.isActive } : u,
            ),
        );
        const user = users.find((u) => u.id === userId);
        showToast(
            `${user?.name} ${user?.isActive ? 'deactivated' : 'activated'} ✅`,
            user?.isActive ? 'warning' : 'success',
        );
    };

    // ===== DELETE =====
    const handleDelete = () => {
        setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
        showToast(`${userToDelete.name} delete ho gaya`, 'success');
        setDeleteModal(false);
        setUserToDelete(null);
    };

    const kycVariant = {
        verified: 'success',
        pending: 'pending',
        rejected: 'failed',
    };
    const roleColors = {
        admin: 'bg-red-100   text-red-700',
        employee: 'bg-blue-100  text-blue-700',
        customer: 'bg-green-100 text-green-700',
    };

    return (
        <div className="space-y-6">
            {/* ===== HEADER ===== */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        User Management 👥
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {filtered.length} of {users.length} users
                    </p>
                </div>
                <Button onClick={() => setAddModal(true)}>
                    + Add New User
                </Button>
            </div>

            {/* ===== STATS ===== */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    {
                        label: 'Total Users',
                        value: users.length,
                        color: 'text-blue-600',
                    },
                    {
                        label: 'Customers',
                        value: users.filter((u) => u.role === ROLES.CUSTOMER)
                            .length,
                        color: 'text-green-600',
                    },
                    {
                        label: 'Employees',
                        value: users.filter((u) => u.role === ROLES.EMPLOYEE)
                            .length,
                        color: 'text-purple-600',
                    },
                    {
                        label: 'Pending KYC',
                        value: users.filter((u) => u.kycStatus === 'pending')
                            .length,
                        color: 'text-orange-600',
                    },
                ].map((stat) => (
                    <div key={stat.label} className="stat-card text-center">
                        <p className={`text-3xl font-black ${stat.color}`}>
                            {stat.value}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>

            {/* ===== FILTERS ===== */}
            <div className="section-card">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="🔍 Search name, email, account..."
                        className="input-field"
                    />
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="input-field"
                    >
                        <option value="all">All Roles</option>
                        <option value={ROLES.CUSTOMER}>Customer</option>
                        <option value={ROLES.EMPLOYEE}>Employee</option>
                        <option value={ROLES.ADMIN}>Admin</option>
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="input-field"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* ===== TABLE ===== */}
            <div className="section-card p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead style={{ backgroundColor: '#f9fafb' }}>
                            <tr>
                                {[
                                    'User',
                                    'Account No',
                                    'Role',
                                    'Balance',
                                    'KYC',
                                    'Status',
                                    'Joined',
                                    'Actions',
                                ].map((h) => (
                                    <th
                                        key={h}
                                        className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((user) => (
                                <tr
                                    key={user.id}
                                    style={{
                                        borderBottom: '1px solid #f3f4f6',
                                    }}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                                                style={{
                                                    backgroundColor: '#2563eb',
                                                }}
                                            >
                                                {user.avatar}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate max-w-[130px]">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-gray-400 truncate max-w-[130px]">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-xs font-mono text-gray-500">
                                            {user.accountNumber}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${roleColors[user.role]}`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm font-semibold text-gray-900">
                                            {formatCurrency(user.balance)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            variant={kycVariant[user.kycStatus]}
                                        >
                                            {user.kycStatus}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            variant={
                                                user.isActive
                                                    ? 'success'
                                                    : 'failed'
                                            }
                                        >
                                            {user.isActive
                                                ? 'Active'
                                                : 'Inactive'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-xs text-gray-400">
                                            {formatDate(user.joinDate)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setViewModal(true);
                                                }}
                                                title="View"
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                            >
                                                👁️
                                            </button>
                                            {user.id !== currentUser?.id && (
                                                <button
                                                    onClick={() =>
                                                        openEdit(user)
                                                    }
                                                    title="Edit"
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-green-50 hover:text-green-600 transition-colors"
                                                >
                                                    ✏️
                                                </button>
                                            )}
                                            {user.id !== currentUser?.id && (
                                                <button
                                                    onClick={() =>
                                                        toggleStatus(user.id)
                                                    }
                                                    title={
                                                        user.isActive
                                                            ? 'Deactivate'
                                                            : 'Activate'
                                                    }
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
                                                >
                                                    {user.isActive
                                                        ? '🚫'
                                                        : '✅'}
                                                </button>
                                            )}
                                            {user.id !== currentUser?.id && (
                                                <button
                                                    onClick={() => {
                                                        setUserToDelete(user);
                                                        setDeleteModal(true);
                                                    }}
                                                    title="Delete"
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                >
                                                    🗑️
                                                </button>
                                            )}
                                            {user.id === currentUser?.id && (
                                                <span className="text-xs text-gray-400 px-2">
                                                    (You)
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            <p className="text-4xl mb-2">👥</p>
                            <p>No users found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ===== ADD USER MODAL ===== */}
            <Modal
                isOpen={addModal}
                onClose={() => {
                    setAddModal(false);
                    setAddForm(emptyAddForm);
                    setAddErrors({});
                }}
                title="Add New User"
                size="lg"
            >
                <div className="space-y-4">
                    {/* Info banner */}
                    <div
                        className="p-3 rounded-xl text-sm font-medium"
                        style={{
                            backgroundColor: '#eff6ff',
                            color: '#1d4ed8',
                            border: '1px solid #bfdbfe',
                        }}
                    >
                        ℹ️ Naya user banao — account number automatically
                        generate hoga
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Name */}
                        <div>
                            <label className="form-label">Full Name *</label>
                            <input
                                type="text"
                                value={addForm.name}
                                onChange={(e) => {
                                    setAddForm((p) => ({
                                        ...p,
                                        name: e.target.value,
                                    }));
                                    setAddErrors((p) => ({ ...p, name: '' }));
                                }}
                                placeholder="Rahul Verma"
                                className={`input-field ${addErrors.name ? 'border-red-400' : ''}`}
                            />
                            {addErrors.name && (
                                <p className="form-error">{addErrors.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="form-label">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                value={addForm.email}
                                onChange={(e) => {
                                    setAddForm((p) => ({
                                        ...p,
                                        email: e.target.value,
                                    }));
                                    setAddErrors((p) => ({ ...p, email: '' }));
                                }}
                                placeholder="rahul@nexabank.com"
                                className={`input-field ${addErrors.email ? 'border-red-400' : ''}`}
                            />
                            {addErrors.email && (
                                <p className="form-error">{addErrors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="form-label">Password *</label>
                            <input
                                type="password"
                                value={addForm.password}
                                onChange={(e) => {
                                    setAddForm((p) => ({
                                        ...p,
                                        password: e.target.value,
                                    }));
                                    setAddErrors((p) => ({
                                        ...p,
                                        password: '',
                                    }));
                                }}
                                placeholder="Min 6 characters"
                                className={`input-field ${addErrors.password ? 'border-red-400' : ''}`}
                            />
                            {addErrors.password && (
                                <p className="form-error">
                                    {addErrors.password}
                                </p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="form-label">Phone Number *</label>
                            <input
                                type="text"
                                value={addForm.phone}
                                onChange={(e) => {
                                    setAddForm((p) => ({
                                        ...p,
                                        phone: e.target.value,
                                    }));
                                    setAddErrors((p) => ({ ...p, phone: '' }));
                                }}
                                placeholder="+91 98765 43210"
                                className={`input-field ${addErrors.phone ? 'border-red-400' : ''}`}
                            />
                            {addErrors.phone && (
                                <p className="form-error">{addErrors.phone}</p>
                            )}
                        </div>

                        {/* Address */}
                        <div>
                            <label className="form-label">Address</label>
                            <input
                                type="text"
                                value={addForm.address}
                                onChange={(e) =>
                                    setAddForm((p) => ({
                                        ...p,
                                        address: e.target.value,
                                    }))
                                }
                                placeholder="City, State"
                                className="input-field"
                            />
                        </div>

                        {/* Role */}
                        <div>
                            <label className="form-label">Role *</label>
                            <select
                                value={addForm.role}
                                onChange={(e) =>
                                    setAddForm((p) => ({
                                        ...p,
                                        role: e.target.value,
                                    }))
                                }
                                className="input-field"
                            >
                                <option value={ROLES.CUSTOMER}>
                                    👤 Customer
                                </option>
                                <option value={ROLES.EMPLOYEE}>
                                    💼 Employee
                                </option>
                                <option value={ROLES.ADMIN}>⚙️ Admin</option>
                            </select>
                        </div>

                        {/* KYC Status */}
                        <div>
                            <label className="form-label">KYC Status</label>
                            <select
                                value={addForm.kycStatus}
                                onChange={(e) =>
                                    setAddForm((p) => ({
                                        ...p,
                                        kycStatus: e.target.value,
                                    }))
                                }
                                className="input-field"
                            >
                                <option value="pending">⏳ Pending</option>
                                <option value="verified">✅ Verified</option>
                                <option value="rejected">❌ Rejected</option>
                            </select>
                        </div>

                        {/* Initial Balance */}
                        <div>
                            <label className="form-label">
                                Initial Balance (₹)
                            </label>
                            <div className="relative">
                                <span
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium"
                                    style={{ color: '#9ca3af' }}
                                >
                                    ₹
                                </span>
                                <input
                                    type="number"
                                    value={addForm.balance}
                                    onChange={(e) => {
                                        setAddForm((p) => ({
                                            ...p,
                                            balance: e.target.value,
                                        }));
                                        setAddErrors((p) => ({
                                            ...p,
                                            balance: '',
                                        }));
                                    }}
                                    placeholder="5000"
                                    min="0"
                                    className={`input-field pl-8 ${addErrors.balance ? 'border-red-400' : ''}`}
                                />
                            </div>
                            {addErrors.balance && (
                                <p className="form-error">
                                    {addErrors.balance}
                                </p>
                            )}
                        </div>

                        {/* Account Status */}
                        <div>
                            <label className="form-label">Account Status</label>
                            <select
                                value={addForm.isActive ? 'active' : 'inactive'}
                                onChange={(e) =>
                                    setAddForm((p) => ({
                                        ...p,
                                        isActive: e.target.value === 'active',
                                    }))
                                }
                                className="input-field"
                            >
                                <option value="active">✅ Active</option>
                                <option value="inactive">🚫 Inactive</option>
                            </select>
                        </div>
                    </div>

                    {/* Preview Card */}
                    {addForm.name && (
                        <div
                            className="p-4 rounded-xl border"
                            style={{
                                backgroundColor: '#f9fafb',
                                borderColor: '#e5e7eb',
                            }}
                        >
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                Preview
                            </p>
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg"
                                    style={{ backgroundColor: '#2563eb' }}
                                >
                                    {addForm.name
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')
                                        .toUpperCase()
                                        .slice(0, 2)}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">
                                        {addForm.name}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        {addForm.email || 'email@example.com'}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${roleColors[addForm.role]}`}
                                        >
                                            {addForm.role}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            Balance: ₹
                                            {Number(
                                                addForm.balance,
                                            ).toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <Button
                            variant="secondary"
                            fullWidth
                            onClick={() => {
                                setAddModal(false);
                                setAddForm(emptyAddForm);
                                setAddErrors({});
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            fullWidth
                            loading={loading}
                            onClick={handleAddUser}
                        >
                            {loading ? 'Adding...' : '+ Add User'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* ===== VIEW MODAL ===== */}
            <Modal
                isOpen={viewModal}
                onClose={() => setViewModal(false)}
                title="User Details"
                size="md"
            >
                {selectedUser && (
                    <div className="space-y-4">
                        <div
                            className="flex items-center gap-4 p-4 rounded-xl"
                            style={{ backgroundColor: '#f9fafb' }}
                        >
                            <div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl"
                                style={{ backgroundColor: '#2563eb' }}
                            >
                                {selectedUser.avatar}
                            </div>
                            <div>
                                <p className="text-lg font-bold text-gray-900">
                                    {selectedUser.name}
                                </p>
                                <p className="text-sm text-gray-400">
                                    {selectedUser.email}
                                </p>
                                <span
                                    className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize mt-1 inline-block ${roleColors[selectedUser.role]}`}
                                >
                                    {selectedUser.role}
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'Phone', value: selectedUser.phone },
                                {
                                    label: 'Address',
                                    value: selectedUser.address,
                                },
                                {
                                    label: 'Account No',
                                    value: selectedUser.accountNumber,
                                },
                                {
                                    label: 'Balance',
                                    value: formatCurrency(selectedUser.balance),
                                },
                                { label: 'KYC', value: selectedUser.kycStatus },
                                {
                                    label: 'Status',
                                    value: selectedUser.isActive
                                        ? 'Active'
                                        : 'Inactive',
                                },
                                {
                                    label: 'Joined',
                                    value: formatDate(selectedUser.joinDate),
                                },
                                { label: 'User ID', value: selectedUser.id },
                            ].map((row) => (
                                <div
                                    key={row.label}
                                    className="p-3 rounded-lg"
                                    style={{ backgroundColor: '#f9fafb' }}
                                >
                                    <p className="text-xs text-gray-400 mb-0.5">
                                        {row.label}
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900 capitalize">
                                        {row.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                        {selectedUser.id !== currentUser?.id && (
                            <Button
                                fullWidth
                                onClick={() => {
                                    setViewModal(false);
                                    openEdit(selectedUser);
                                }}
                            >
                                ✏️ Edit This User
                            </Button>
                        )}
                    </div>
                )}
            </Modal>

            {/* ===== EDIT MODAL ===== */}
            <Modal
                isOpen={editModal}
                onClose={() => setEditModal(false)}
                title={`Edit — ${selectedUser?.name}`}
                size="md"
            >
                {selectedUser && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                {
                                    label: 'Full Name',
                                    field: 'name',
                                    type: 'text',
                                    placeholder: 'Full name',
                                },
                                {
                                    label: 'Email',
                                    field: 'email',
                                    type: 'email',
                                    placeholder: 'email@example.com',
                                },
                                {
                                    label: 'Phone',
                                    field: 'phone',
                                    type: 'text',
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
                                    <label className="form-label">
                                        {f.label}
                                    </label>
                                    <input
                                        type={f.type}
                                        value={editForm[f.field]}
                                        onChange={(e) =>
                                            setEditForm((p) => ({
                                                ...p,
                                                [f.field]: e.target.value,
                                            }))
                                        }
                                        placeholder={f.placeholder}
                                        className="input-field"
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="form-label">Role</label>
                                <select
                                    value={editForm.role}
                                    onChange={(e) =>
                                        setEditForm((p) => ({
                                            ...p,
                                            role: e.target.value,
                                        }))
                                    }
                                    className="input-field"
                                >
                                    <option value={ROLES.CUSTOMER}>
                                        Customer
                                    </option>
                                    <option value={ROLES.EMPLOYEE}>
                                        Employee
                                    </option>
                                    <option value={ROLES.ADMIN}>Admin</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label">KYC Status</label>
                                <select
                                    value={editForm.kycStatus}
                                    onChange={(e) =>
                                        setEditForm((p) => ({
                                            ...p,
                                            kycStatus: e.target.value,
                                        }))
                                    }
                                    className="input-field"
                                >
                                    <option value="verified">Verified</option>
                                    <option value="pending">Pending</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label">
                                    Balance (₹)
                                </label>
                                <input
                                    type="number"
                                    value={editForm.balance}
                                    onChange={(e) =>
                                        setEditForm((p) => ({
                                            ...p,
                                            balance: e.target.value,
                                        }))
                                    }
                                    className="input-field"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="form-label">Status</label>
                                <select
                                    value={
                                        editForm.isActive
                                            ? 'active'
                                            : 'inactive'
                                    }
                                    onChange={(e) =>
                                        setEditForm((p) => ({
                                            ...p,
                                            isActive:
                                                e.target.value === 'active',
                                        }))
                                    }
                                    className="input-field"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button
                                variant="secondary"
                                fullWidth
                                onClick={() => setEditModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button fullWidth onClick={handleSaveEdit}>
                                💾 Save Changes
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* ===== DELETE MODAL ===== */}
            <Modal
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
                title="Delete User?"
                size="sm"
            >
                {userToDelete && (
                    <div className="space-y-4">
                        <div
                            className="p-4 rounded-xl text-center"
                            style={{ backgroundColor: '#fef2f2' }}
                        >
                            <p className="text-4xl mb-2">⚠️</p>
                            <p className="text-sm font-semibold text-red-800">
                                Delete karna chahte ho?
                            </p>
                            <p className="text-base font-black text-red-600 mt-1">
                                {userToDelete.name}
                            </p>
                            <p className="text-xs text-red-400 mt-1">
                                {userToDelete.role} •{' '}
                                {userToDelete.accountNumber}
                            </p>
                            <p className="text-xs text-red-400 mt-0.5">
                                Yeh action undo nahi hoga!
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="secondary"
                                fullWidth
                                onClick={() => setDeleteModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                fullWidth
                                onClick={handleDelete}
                            >
                                🗑️ Haan, Delete Karo
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default UserManagement;
