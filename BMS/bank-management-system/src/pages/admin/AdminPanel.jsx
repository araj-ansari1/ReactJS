import { useNavigate } from 'react-router-dom';
import { MOCK_USERS } from '../../constants/mockUsers';
import { MOCK_TRANSACTIONS } from '../../constants/mockTransactions';
import { MOCK_LOANS } from '../../constants/mockLoans';
import { ROUTES } from '../../constants/routes';
import { ROLES } from '../../constants/roles';
import { formatCurrency } from '../../utils/formatCurrency';
import { StatCard } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import BarChart from '../../components/charts/BarChart';
import { MONTHLY_DATA } from '../../constants/mockTransactions';

const AdminPanel = () => {
    const navigate = useNavigate();

    // System stats
    const totalUsers = MOCK_USERS.length;
    const totalCustomers = MOCK_USERS.filter(
        (u) => u.role === ROLES.CUSTOMER,
    ).length;
    const totalEmployees = MOCK_USERS.filter(
        (u) => u.role === ROLES.EMPLOYEE,
    ).length;
    const activeUsers = MOCK_USERS.filter((u) => u.isActive).length;
    const totalTxns = MOCK_TRANSACTIONS.length;
    const totalLoans = MOCK_LOANS.filter((l) => l.status === 'active').length;
    const totalDeposits = MOCK_USERS.reduce((s, u) => s + u.balance, 0);
    const pendingKyc = MOCK_USERS.filter(
        (u) => u.kycStatus === 'pending',
    ).length;

    // Recent signups
    const recentUsers = [...MOCK_USERS]
        .sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
        .slice(0, 5);

    const roleColor = {
        admin: 'bg-red-100   text-red-700   dark:bg-red-900/20   dark:text-red-400',
        employee:
            'bg-blue-100  text-blue-700  dark:bg-blue-900/20  dark:text-blue-400',
        customer:
            'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    };

    return (
        <div className="space-y-6">
            {/* ===== HEADER ===== */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Admin Panel ⚙️
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        System overview and management
                    </p>
                </div>
                <Button onClick={() => navigate(ROUTES.USER_MANAGEMENT)}>
                    👥 Manage Users
                </Button>
            </div>

            {/* ===== STAT CARDS ===== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    title="Total Users"
                    value={totalUsers}
                    icon="👥"
                    color="blue"
                    change="12%"
                    changeType="up"
                />
                <StatCard
                    title="Total Deposits"
                    value={formatCurrency(totalDeposits)}
                    icon="💰"
                    color="green"
                    change="8.3%"
                    changeType="up"
                />
                <StatCard
                    title="Active Loans"
                    value={totalLoans}
                    icon="🏦"
                    color="purple"
                    change="5%"
                    changeType="up"
                />
                <StatCard
                    title="Pending KYC"
                    value={pendingKyc}
                    icon="⚠️"
                    color="orange"
                />
            </div>

            {/* ===== SECOND ROW STATS ===== */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    {
                        label: 'Customers',
                        value: totalCustomers,
                        color: 'text-green-600 dark:text-green-400',
                    },
                    {
                        label: 'Employees',
                        value: totalEmployees,
                        color: 'text-blue-600 dark:text-blue-400',
                    },
                    {
                        label: 'Active Users',
                        value: activeUsers,
                        color: 'text-primary-600 dark:text-primary-400',
                    },
                    {
                        label: 'Transactions',
                        value: totalTxns,
                        color: 'text-purple-600 dark:text-purple-400',
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

            {/* ===== CHARTS + RECENT USERS ===== */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {/* Chart */}
                <div className="xl:col-span-2 bg-white dark:bg-bank-card rounded-xl border border-gray-200 dark:border-bank-border p-6">
                    <h2 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Monthly Transactions
                    </h2>
                    <p className="text-xs text-gray-400 mb-5">
                        System-wide income vs expense
                    </p>
                    <BarChart data={MONTHLY_DATA} />
                </div>

                {/* Recent Users */}
                <div className="bg-white dark:bg-bank-card rounded-xl border border-gray-200 dark:border-bank-border p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-gray-900 dark:text-white">
                            Recent Signups
                        </h2>
                        <button
                            onClick={() => navigate(ROUTES.USER_MANAGEMENT)}
                            className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                        >
                            View All →
                        </button>
                    </div>
                    <div className="space-y-3">
                        {recentUsers.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-bank-border/20 transition-colors"
                            >
                                <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-sm flex-shrink-0">
                                    {user.avatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate">
                                        {user.email}
                                    </p>
                                </div>
                                <span
                                    className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize flex-shrink-0 ${roleColor[user.role]}`}
                                >
                                    {user.role}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ===== SYSTEM ALERTS ===== */}
            <div className="bg-white dark:bg-bank-card rounded-xl border border-gray-200 dark:border-bank-border p-6">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
                    System Alerts
                </h2>
                <div className="space-y-3">
                    {[
                        {
                            type: 'warning',
                            msg: `${pendingKyc} users have pending KYC verification`,
                            time: 'Now',
                            icon: '⚠️',
                        },
                        {
                            type: 'info',
                            msg: 'System backup completed successfully',
                            time: '2 hrs ago',
                            icon: '✅',
                        },
                        {
                            type: 'success',
                            msg: 'Monthly report generated and emailed to stakeholders',
                            time: '1 day ago',
                            icon: '📊',
                        },
                        {
                            type: 'info',
                            msg: 'New RBI compliance update applied',
                            time: '3 days ago',
                            icon: '🏛️',
                        },
                    ].map((alert, i) => (
                        <div
                            key={i}
                            className={`flex items-center gap-3 p-3 rounded-xl ${
                                alert.type === 'warning'
                                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                                    : alert.type === 'success'
                                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                                      : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800'
                            }`}
                        >
                            <span className="text-xl flex-shrink-0">
                                {alert.icon}
                            </span>
                            <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                                {alert.msg}
                            </p>
                            <span className="text-xs text-gray-400 whitespace-nowrap">
                                {alert.time}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
