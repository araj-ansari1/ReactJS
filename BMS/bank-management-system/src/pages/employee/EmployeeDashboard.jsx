import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import { MOCK_USERS } from '../../constants/mockUsers';
import { MOCK_LOANS } from '../../constants/mockLoans';
import { MOCK_TRANSACTIONS } from '../../constants/mockTransactions';
import { ROLES } from '../../constants/roles';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { StatCard } from '../../components/ui/Card';

const INITIAL_TASKS = [
    {
        id: 1,
        task: 'Review KYC for Sneha Gupta',
        priority: 'high',
        status: 'pending',
        due: '2024-11-20',
    },
    {
        id: 2,
        task: 'Process Home Loan application',
        priority: 'high',
        status: 'in-progress',
        due: '2024-11-21',
    },
    {
        id: 3,
        task: 'Call back customer Amit Kumar',
        priority: 'medium',
        status: 'pending',
        due: '2024-11-22',
    },
    {
        id: 4,
        task: 'Update account details for Rahul',
        priority: 'low',
        status: 'completed',
        due: '2024-11-19',
    },
    {
        id: 5,
        task: 'Generate monthly statement',
        priority: 'medium',
        status: 'pending',
        due: '2024-11-25',
    },
];

const EmployeeDashboard = () => {
    const { currentUser } = useAuth();
    const { showToast } = useToast();

    // ===== STATES =====
    const [customers, setCustomers] = useState(
        MOCK_USERS.filter((u) => u.role === ROLES.CUSTOMER),
    );
    const [tasks, setTasks] = useState(INITIAL_TASKS);
    const [activeTab, setActiveTab] = useState('tasks');

    // Modals
    const [addTaskModal, setAddTaskModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);

    // Add Task Form
    const emptyTask = {
        task: '',
        priority: 'medium',
        due: '',
        status: 'pending',
    };
    const [taskForm, setTaskForm] = useState(emptyTask);
    const [taskErrors, setTaskErrors] = useState({});

    // Edit Customer Form (limited)
    const [editForm, setEditForm] = useState({
        phone: '',
        address: '',
        kycStatus: '',
    });

    // ===== DATA =====
    const pendingKyc = customers.filter((u) => u.kycStatus === 'pending');
    const activeLoans = MOCK_LOANS.filter((l) => l.status === 'active');
    const failedTxns = MOCK_TRANSACTIONS.filter((t) => t.status === 'failed');

    const pendingTasks = tasks.filter((t) => t.status === 'pending').length;
    const completedTasks = tasks.filter((t) => t.status === 'completed').length;

    const kycVariant = {
        verified: 'success',
        pending: 'pending',
        rejected: 'failed',
    };

    const priorityColor = {
        high: 'text-red-600   bg-red-50   border-red-200',
        medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
        low: 'text-green-600  bg-green-50  border-green-200',
    };

    const taskStatusVariant = {
        pending: 'pending',
        'in-progress': 'info',
        completed: 'success',
    };

    const tabs = [
        { key: 'tasks', label: `📋 Tasks (${tasks.length})` },
        { key: 'customers', label: `👤 Customers (${customers.length})` },
        { key: 'kyc', label: `⚠️ KYC (${pendingKyc.length})` },
        { key: 'txns', label: `❌ Failed (${failedTxns.length})` },
    ];

    // ===== ADD TASK =====
    const validateTask = () => {
        const e = {};
        if (!taskForm.task.trim()) e.task = 'Task description required';
        if (!taskForm.due) e.due = 'Due date required';
        setTaskErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleAddTask = async () => {
        if (!validateTask()) return;
        setLoading(true);
        await new Promise((res) => setTimeout(res, 600));

        const newTask = {
            id: Date.now(),
            task: taskForm.task.trim(),
            priority: taskForm.priority,
            due: taskForm.due,
            status: taskForm.status,
        };

        setTasks((prev) => [newTask, ...prev]);
        setLoading(false);
        setAddTaskModal(false);
        setTaskForm(emptyTask);
        setTaskErrors({});
        showToast(`Task added successfully! ✅`, 'success');
    };

    // ===== TOGGLE TASK STATUS =====
    const toggleTask = (id) => {
        setTasks((prev) =>
            prev.map((t) =>
                t.id === id
                    ? {
                          ...t,
                          status:
                              t.status === 'completed'
                                  ? 'pending'
                                  : 'completed',
                      }
                    : t,
            ),
        );
    };

    // ===== DELETE TASK =====
    const deleteTask = (id) => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        showToast('Task deleted', 'success');
    };

    // ===== KYC HANDLE =====
    const handleKyc = (userId, status, name) => {
        setCustomers((prev) =>
            prev.map((u) =>
                u.id === userId ? { ...u, kycStatus: status } : u,
            ),
        );
        showToast(
            status === 'verified'
                ? `KYC approved for ${name} ✅`
                : `KYC rejected for ${name} ❌`,
            status === 'verified' ? 'success' : 'error',
        );
    };

    // ===== EDIT CUSTOMER =====
    const openEdit = (user) => {
        setSelectedUser(user);
        setEditForm({
            phone: user.phone || '',
            address: user.address || '',
            kycStatus: user.kycStatus || 'pending',
        });
        setEditModal(true);
    };

    const handleSaveEdit = () => {
        if (!editForm.phone) {
            showToast('Phone required', 'error');
            return;
        }
        setCustomers((prev) =>
            prev.map((u) =>
                u.id === selectedUser.id ? { ...u, ...editForm } : u,
            ),
        );
        showToast(`${selectedUser.name} updated ✅`, 'success');
        setEditModal(false);
    };

    return (
        <div className="space-y-6">
            {/* ===== HEADER ===== */}
            <div
                className="rounded-2xl p-6 text-white relative overflow-hidden"
                style={{
                    background: 'linear-gradient(to right, #2563eb, #1e40af)',
                }}
            >
                <div
                    className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
                    style={{
                        backgroundColor: 'white',
                        transform: 'translate(50%,-50%)',
                    }}
                />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black border-2 flex-shrink-0"
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            borderColor: 'rgba(255,255,255,0.3)',
                        }}
                    >
                        {currentUser?.avatar}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-xl font-bold">
                            Welcome, {currentUser?.name} 👋
                        </h1>
                        <p
                            className="text-sm mt-0.5"
                            style={{ color: '#bfdbfe' }}
                        >
                            {currentUser?.department || 'Banking Operations'} •{' '}
                            {currentUser?.employeeId || 'EMP-001'}
                        </p>
                    </div>
                    {/* Task progress */}
                    <div
                        className="px-4 py-3 rounded-xl text-center"
                        style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                    >
                        <p className="text-2xl font-black">
                            {completedTasks}/{tasks.length}
                        </p>
                        <p className="text-xs" style={{ color: '#bfdbfe' }}>
                            Tasks Done
                        </p>
                    </div>
                </div>
            </div>

            {/* ===== STAT CARDS ===== */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    title="Pending Tasks"
                    value={pendingTasks}
                    icon="📋"
                    color="blue"
                />
                <StatCard
                    title="Pending KYC"
                    value={pendingKyc.length}
                    icon="⚠️"
                    color="orange"
                />
                <StatCard
                    title="Active Loans"
                    value={activeLoans.length}
                    icon="🏦"
                    color="green"
                />
                <StatCard
                    title="Failed Txns"
                    value={failedTxns.length}
                    icon="❌"
                    color="red"
                />
            </div>

            {/* ===== TABS ===== */}
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

            {/* ===== TAB: TASKS ===== */}
            {activeTab === 'tasks' && (
                <div className="section-card animate-fade-in">
                    {/* Task header */}
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="font-semibold text-gray-900">
                                My Tasks
                            </h2>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {pendingTasks} pending • {completedTasks}{' '}
                                completed
                            </p>
                        </div>
                        <Button size="sm" onClick={() => setAddTaskModal(true)}>
                            + Add Task
                        </Button>
                    </div>

                    {/* Task progress bar */}
                    <div className="mb-5">
                        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                            <span>Overall Progress</span>
                            <span>
                                {tasks.length > 0
                                    ? Math.round(
                                          (completedTasks / tasks.length) * 100,
                                      )
                                    : 0}
                                %
                            </span>
                        </div>
                        <div
                            className="w-full h-2.5 rounded-full overflow-hidden"
                            style={{ backgroundColor: '#e5e7eb' }}
                        >
                            <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{
                                    width: `${tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0}%`,
                                    backgroundColor: '#2563eb',
                                }}
                            />
                        </div>
                    </div>

                    {/* Tasks list */}
                    {tasks.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-4xl mb-2">🎉</p>
                            <p className="text-gray-400 font-medium">
                                Koi task nahi! Naya add karo.
                            </p>
                            <Button
                                className="mt-4"
                                size="sm"
                                onClick={() => setAddTaskModal(true)}
                            >
                                + Add First Task
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="flex items-start gap-3 p-4 rounded-xl border transition-all duration-200"
                                    style={{
                                        backgroundColor:
                                            task.status === 'completed'
                                                ? '#f9fafb'
                                                : '#ffffff',
                                        borderColor:
                                            task.status === 'completed'
                                                ? '#f3f4f6'
                                                : '#e5e7eb',
                                        opacity:
                                            task.status === 'completed'
                                                ? 0.7
                                                : 1,
                                    }}
                                >
                                    {/* Checkbox */}
                                    <button
                                        onClick={() => toggleTask(task.id)}
                                        className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200"
                                        style={{
                                            backgroundColor:
                                                task.status === 'completed'
                                                    ? '#22c55e'
                                                    : 'transparent',
                                            borderColor:
                                                task.status === 'completed'
                                                    ? '#22c55e'
                                                    : '#d1d5db',
                                            color: 'white',
                                        }}
                                    >
                                        {task.status === 'completed' && (
                                            <span className="text-xs font-bold">
                                                ✓
                                            </span>
                                        )}
                                    </button>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <p
                                            className={`text-sm font-medium ${
                                                task.status === 'completed'
                                                    ? 'line-through text-gray-400'
                                                    : 'text-gray-900'
                                            }`}
                                        >
                                            {task.task}
                                        </p>
                                        <div className="flex items-center flex-wrap gap-2 mt-1.5">
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize border ${priorityColor[task.priority]}`}
                                            >
                                                {task.priority}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                📅 Due: {formatDate(task.due)}
                                            </span>
                                            <Badge
                                                variant={
                                                    taskStatusVariant[
                                                        task.status
                                                    ]
                                                }
                                            >
                                                {task.status}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Delete button */}
                                    <button
                                        onClick={() => deleteTask(task.id)}
                                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                                        title="Delete task"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ===== TAB: CUSTOMERS ===== */}
            {activeTab === 'customers' && (
                <div className="section-card animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-gray-900">
                            Customer List
                        </h2>
                        <div
                            className="px-3 py-1 rounded-lg text-xs font-medium"
                            style={{
                                backgroundColor: '#fef3c7',
                                color: '#92400e',
                            }}
                        >
                            ⚠️ Limited Edit Access
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr
                                    style={{
                                        borderBottom: '2px solid #f3f4f6',
                                    }}
                                >
                                    {[
                                        'Customer',
                                        'Account',
                                        'Balance',
                                        'KYC',
                                        'Phone',
                                        'Since',
                                        'Actions',
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            className="text-left py-3 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer) => (
                                    <tr
                                        key={customer.id}
                                        style={{
                                            borderBottom: '1px solid #f9fafb',
                                        }}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="py-3 px-3">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                                                    style={{
                                                        backgroundColor:
                                                            '#2563eb',
                                                    }}
                                                >
                                                    {customer.avatar}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {customer.name}
                                                    </p>
                                                    <p className="text-xs text-gray-400 truncate max-w-[120px]">
                                                        {customer.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-3">
                                            <span className="text-xs font-mono text-gray-500">
                                                {customer.accountNumber}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3">
                                            <span className="text-sm font-semibold text-gray-900">
                                                {formatCurrency(
                                                    customer.balance,
                                                )}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3">
                                            <Badge
                                                variant={
                                                    kycVariant[
                                                        customer.kycStatus
                                                    ]
                                                }
                                            >
                                                {customer.kycStatus}
                                            </Badge>
                                        </td>
                                        <td className="py-3 px-3">
                                            <span className="text-xs text-gray-500">
                                                {customer.phone}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3">
                                            <span className="text-xs text-gray-400">
                                                {formatDate(customer.joinDate)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(
                                                            customer,
                                                        );
                                                        setViewModal(true);
                                                    }}
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                    title="View"
                                                >
                                                    👁️
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        openEdit(customer)
                                                    }
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-green-50 hover:text-green-600 transition-colors"
                                                    title="Edit (Limited)"
                                                >
                                                    ✏️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ===== TAB: KYC ===== */}
            {activeTab === 'kyc' && (
                <div className="section-card animate-fade-in">
                    <h2 className="font-semibold text-gray-900 mb-4">
                        Pending KYC Reviews ({pendingKyc.length})
                    </h2>
                    {pendingKyc.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-4xl mb-2">🎉</p>
                            <p className="text-gray-400">
                                Sab KYC complete ho gaye!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {pendingKyc.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center gap-3 p-4 rounded-xl border"
                                    style={{
                                        backgroundColor: '#fffbeb',
                                        borderColor: '#fde68a',
                                    }}
                                >
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                                        style={{ backgroundColor: '#f59e0b' }}
                                    >
                                        {user.avatar}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {user.email} • {user.phone}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {user.address} • Joined:{' '}
                                            {formatDate(user.joinDate)}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <Button
                                            size="sm"
                                            variant="success"
                                            onClick={() =>
                                                handleKyc(
                                                    user.id,
                                                    'verified',
                                                    user.name,
                                                )
                                            }
                                        >
                                            ✓ Approve
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() =>
                                                handleKyc(
                                                    user.id,
                                                    'rejected',
                                                    user.name,
                                                )
                                            }
                                        >
                                            ✕ Reject
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ===== TAB: FAILED TRANSACTIONS ===== */}
            {activeTab === 'txns' && (
                <div className="section-card animate-fade-in">
                    <h2 className="font-semibold text-gray-900 mb-4">
                        Failed Transactions ({failedTxns.length})
                    </h2>
                    {failedTxns.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-4xl mb-2">✅</p>
                            <p className="text-gray-400">
                                Koi failed transaction nahi!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {failedTxns.map((txn) => (
                                <div
                                    key={txn.id}
                                    className="flex items-center gap-3 p-4 rounded-xl border"
                                    style={{
                                        backgroundColor: '#fef2f2',
                                        borderColor: '#fecaca',
                                    }}
                                >
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
                                        style={{ backgroundColor: '#ef4444' }}
                                    >
                                        ✕
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">
                                            {txn.description}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {txn.reference} •{' '}
                                            {formatDate(txn.date)}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            From: {txn.fromAccount} → To:{' '}
                                            {txn.toAccount}
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-sm font-bold text-red-600 mb-1">
                                            {formatCurrency(txn.amount)}
                                        </p>
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                showToast(
                                                    'Retry initiated! ✅',
                                                    'success',
                                                )
                                            }
                                        >
                                            Retry
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ===== ADD TASK MODAL ===== */}
            <Modal
                isOpen={addTaskModal}
                onClose={() => {
                    setAddTaskModal(false);
                    setTaskForm(emptyTask);
                    setTaskErrors({});
                }}
                title="Add New Task"
                size="sm"
            >
                <div className="space-y-4">
                    {/* Task Description */}
                    <div>
                        <label className="form-label">Task Description *</label>
                        <textarea
                            value={taskForm.task}
                            onChange={(e) => {
                                setTaskForm((p) => ({
                                    ...p,
                                    task: e.target.value,
                                }));
                                setTaskErrors((p) => ({ ...p, task: '' }));
                            }}
                            placeholder="Task ka description likho..."
                            rows={3}
                            className={`input-field resize-none ${taskErrors.task ? 'border-red-400' : ''}`}
                        />
                        {taskErrors.task && (
                            <p className="form-error">{taskErrors.task}</p>
                        )}
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="form-label">Priority *</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                {
                                    key: 'high',
                                    label: '🔴 High',
                                    bg: '#fef2f2',
                                    border: '#fca5a5',
                                    text: '#dc2626',
                                },
                                {
                                    key: 'medium',
                                    label: '🟡 Medium',
                                    bg: '#fffbeb',
                                    border: '#fcd34d',
                                    text: '#d97706',
                                },
                                {
                                    key: 'low',
                                    label: '🟢 Low',
                                    bg: '#f0fdf4',
                                    border: '#86efac',
                                    text: '#16a34a',
                                },
                            ].map((p) => (
                                <button
                                    key={p.key}
                                    onClick={() =>
                                        setTaskForm((prev) => ({
                                            ...prev,
                                            priority: p.key,
                                        }))
                                    }
                                    className="py-2.5 rounded-xl border-2 text-xs font-bold transition-all duration-200 active:scale-95"
                                    style={{
                                        backgroundColor:
                                            taskForm.priority === p.key
                                                ? p.bg
                                                : '#ffffff',
                                        borderColor:
                                            taskForm.priority === p.key
                                                ? p.border
                                                : '#e5e7eb',
                                        color:
                                            taskForm.priority === p.key
                                                ? p.text
                                                : '#6b7280',
                                        transform:
                                            taskForm.priority === p.key
                                                ? 'scale(1.02)'
                                                : 'scale(1)',
                                    }}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="form-label">Due Date *</label>
                        <input
                            type="date"
                            value={taskForm.due}
                            onChange={(e) => {
                                setTaskForm((p) => ({
                                    ...p,
                                    due: e.target.value,
                                }));
                                setTaskErrors((p) => ({ ...p, due: '' }));
                            }}
                            min={new Date().toISOString().split('T')[0]}
                            className={`input-field ${taskErrors.due ? 'border-red-400' : ''}`}
                        />
                        {taskErrors.due && (
                            <p className="form-error">{taskErrors.due}</p>
                        )}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="form-label">Status</label>
                        <select
                            value={taskForm.status}
                            onChange={(e) =>
                                setTaskForm((p) => ({
                                    ...p,
                                    status: e.target.value,
                                }))
                            }
                            className="input-field"
                        >
                            <option value="pending">⏳ Pending</option>
                            <option value="in-progress">🔄 In Progress</option>
                            <option value="completed">✅ Completed</option>
                        </select>
                    </div>

                    {/* Preview */}
                    {taskForm.task && (
                        <div
                            className="p-3 rounded-xl border"
                            style={{
                                backgroundColor: '#f9fafb',
                                borderColor: '#e5e7eb',
                            }}
                        >
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                Preview
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                                {taskForm.task}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5">
                                <span
                                    className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize border ${priorityColor[taskForm.priority]}`}
                                >
                                    {taskForm.priority}
                                </span>
                                {taskForm.due && (
                                    <span className="text-xs text-gray-400">
                                        📅 {formatDate(taskForm.due)}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 pt-1">
                        <Button
                            variant="secondary"
                            fullWidth
                            onClick={() => {
                                setAddTaskModal(false);
                                setTaskForm(emptyTask);
                                setTaskErrors({});
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            fullWidth
                            loading={loading}
                            onClick={handleAddTask}
                        >
                            {loading ? 'Adding...' : '+ Add Task'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* ===== VIEW CUSTOMER MODAL ===== */}
            <Modal
                isOpen={viewModal}
                onClose={() => setViewModal(false)}
                title="Customer Details"
                size="md"
            >
                {selectedUser && (
                    <div className="space-y-4">
                        <div
                            className="flex items-center gap-4 p-4 rounded-xl"
                            style={{ backgroundColor: '#f9fafb' }}
                        >
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl"
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
                                <Badge
                                    variant={kycVariant[selectedUser.kycStatus]}
                                >
                                    KYC: {selectedUser.kycStatus}
                                </Badge>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                {
                                    label: 'Account No',
                                    value: selectedUser.accountNumber,
                                },
                                {
                                    label: 'Balance',
                                    value: formatCurrency(selectedUser.balance),
                                },
                                { label: 'Phone', value: selectedUser.phone },
                                {
                                    label: 'Address',
                                    value: selectedUser.address,
                                },
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
                            ].map((row) => (
                                <div
                                    key={row.label}
                                    className="p-3 rounded-lg"
                                    style={{ backgroundColor: '#f9fafb' }}
                                >
                                    <p className="text-xs text-gray-400 mb-0.5">
                                        {row.label}
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {row.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div
                            className="p-3 rounded-xl text-sm"
                            style={{
                                backgroundColor: '#eff6ff',
                                color: '#1d4ed8',
                            }}
                        >
                            ℹ️ Employee sirf Phone, Address aur KYC update kar
                            sakta hai.
                        </div>
                        <Button
                            fullWidth
                            onClick={() => {
                                setViewModal(false);
                                openEdit(selectedUser);
                            }}
                        >
                            ✏️ Edit Limited Fields
                        </Button>
                    </div>
                )}
            </Modal>

            {/* ===== LIMITED EDIT MODAL ===== */}
            <Modal
                isOpen={editModal}
                onClose={() => setEditModal(false)}
                title={`Edit — ${selectedUser?.name}`}
                size="sm"
            >
                {selectedUser && (
                    <div className="space-y-4">
                        <div
                            className="p-3 rounded-xl text-sm font-medium"
                            style={{
                                backgroundColor: '#fffbeb',
                                color: '#92400e',
                                border: '1px solid #fde68a',
                            }}
                        >
                            ⚠️ Sirf yeh 3 fields edit kar sakte ho: Phone,
                            Address, KYC Status
                        </div>

                        <div>
                            <label className="form-label">Phone Number</label>
                            <input
                                type="text"
                                value={editForm.phone}
                                onChange={(e) =>
                                    setEditForm((p) => ({
                                        ...p,
                                        phone: e.target.value,
                                    }))
                                }
                                className="input-field"
                                placeholder="+91 98765 43210"
                            />
                        </div>
                        <div>
                            <label className="form-label">Address</label>
                            <input
                                type="text"
                                value={editForm.address}
                                onChange={(e) =>
                                    setEditForm((p) => ({
                                        ...p,
                                        address: e.target.value,
                                    }))
                                }
                                className="input-field"
                                placeholder="City, State"
                            />
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
                                <option value="verified">✅ Verified</option>
                                <option value="pending">⏳ Pending</option>
                                <option value="rejected">❌ Rejected</option>
                            </select>
                        </div>

                        {/* Read only */}
                        <div
                            className="p-3 rounded-xl space-y-2"
                            style={{
                                backgroundColor: '#f9fafb',
                                border: '1px solid #e5e7eb',
                            }}
                        >
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                🔒 Read Only
                            </p>
                            {[
                                { label: 'Name', value: selectedUser.name },
                                { label: 'Email', value: selectedUser.email },
                                {
                                    label: 'Balance',
                                    value: formatCurrency(selectedUser.balance),
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

                        <div className="flex gap-3">
                            <Button
                                variant="secondary"
                                fullWidth
                                onClick={() => setEditModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button fullWidth onClick={handleSaveEdit}>
                                💾 Save
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default EmployeeDashboard;
