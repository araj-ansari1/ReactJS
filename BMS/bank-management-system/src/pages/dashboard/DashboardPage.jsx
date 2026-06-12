import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import {
    MOCK_TRANSACTIONS,
    MONTHLY_DATA,
    SPENDING_CATEGORIES,
} from '../../constants/mockTransactions';
import { MOCK_LOANS } from '../../constants/mockLoans';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { StatCard } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';
import { ROLES } from '../../constants/roles';

const DashboardPage = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [activeChart, setActiveChart] = useState('line');

    // Current user ki transactions filter karo
    const myTransactions = MOCK_TRANSACTIONS.filter(
        (t) => t.userId === currentUser?.id,
    ).slice(0, 5);

    // Stats calculate karo
    const totalIncome = MOCK_TRANSACTIONS.filter(
        (t) => t.userId === currentUser?.id && t.type === 'credit',
    ).reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = MOCK_TRANSACTIONS.filter(
        (t) => t.userId === currentUser?.id && t.type === 'debit',
    ).reduce((sum, t) => sum + t.amount, 0);

    const activeLoans = MOCK_LOANS.filter(
        (l) => l.userId === currentUser?.id && l.status === 'active',
    );

    const totalEmi = activeLoans.reduce((sum, l) => sum + l.emi, 0);

    const statusVariant = {
        completed: 'success',
        pending: 'pending',
        failed: 'failed',
    };

    return (
        <div className="space-y-6">
            {/* ===== PAGE HEADER ===== */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Dashboard 🏠
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {new Date().toLocaleDateString('en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>
                </div>
                <Button onClick={() => navigate(ROUTES.TRANSFER)} size="md">
                    💸 Transfer Money
                </Button>
            </div>

            {/* ===== STAT CARDS ===== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    title="Total Balance"
                    value={formatCurrency(currentUser?.balance || 0)}
                    change="2.5%"
                    changeType="up"
                    icon="💰"
                    color="blue"
                />
                <StatCard
                    title="Total Income"
                    value={formatCurrency(totalIncome)}
                    change="8.1%"
                    changeType="up"
                    icon="📈"
                    color="green"
                />
                <StatCard
                    title="Total Expense"
                    value={formatCurrency(totalExpense)}
                    change="3.2%"
                    changeType="down"
                    icon="📉"
                    color="red"
                />
                <StatCard
                    title="Monthly EMI"
                    value={formatCurrency(totalEmi)}
                    icon="🏦"
                    color="purple"
                />
            </div>

            {/* ===== ACCOUNT INFO CARD ===== */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 text-white relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <p className="text-primary-200 text-sm font-medium mb-1">
                                Account Number
                            </p>
                            <p className="text-xl font-mono font-bold tracking-widest">
                                {currentUser?.accountNumber}
                            </p>
                            <p className="text-primary-200 text-sm mt-2">
                                {currentUser?.name}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-primary-200 text-sm font-medium mb-1">
                                Available Balance
                            </p>
                            <p className="text-3xl font-black">
                                {formatCurrency(currentUser?.balance || 0)}
                            </p>
                            <div className="flex items-center justify-end gap-2 mt-2">
                                <span
                                    className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                                        currentUser?.kycStatus === 'verified'
                                            ? 'bg-green-500/20 text-green-200'
                                            : 'bg-yellow-500/20 text-yellow-200'
                                    }`}
                                >
                                    KYC: {currentUser?.kycStatus}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick actions */}
                    <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-white/20">
                        {currentUser?.role === ROLES.CUSTOMER
                            ? [
                                  {
                                      label: 'Send Money',
                                      icon: '💸',
                                      path: ROUTES.TRANSFER,
                                  },
                                  {
                                      label: 'My Cards',
                                      icon: '💳',
                                      path: ROUTES.CARDS,
                                  },
                                  {
                                      label: 'Loans',
                                      icon: '🏦',
                                      path: ROUTES.LOANS,
                                  },
                                  {
                                      label: 'History',
                                      icon: '📋',
                                      path: ROUTES.TRANSACTIONS,
                                  },
                              ].map((action) => (
                                  <button
                                      key={action.label}
                                      onClick={() => navigate(action.path)}
                                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95"
                                      style={{
                                          backgroundColor:
                                              'rgba(255,255,255,0.15)',
                                          color: 'white',
                                      }}
                                      onMouseEnter={(e) =>
                                          (e.currentTarget.style.backgroundColor =
                                              'rgba(255,255,255,0.25)')
                                      }
                                      onMouseLeave={(e) =>
                                          (e.currentTarget.style.backgroundColor =
                                              'rgba(255,255,255,0.15)')
                                      }
                                  >
                                      <span>{action.icon}</span>
                                      <span>{action.label}</span>
                                  </button>
                              ))
                            : [
                                  {
                                      label: 'Transfer',
                                      icon: '💸',
                                      path: ROUTES.TRANSFER,
                                  },
                                  {
                                      label: 'Deposit',
                                      icon: '💰',
                                      path: ROUTES.DEPOSIT,
                                  },
                                  {
                                      label: 'Withdraw',
                                      icon: '💵',
                                      path: ROUTES.WITHDRAW,
                                  },
                                  {
                                      label: 'Cards',
                                      icon: '💳',
                                      path: ROUTES.CARDS,
                                  },
                                  {
                                      label: 'Loans',
                                      icon: '🏦',
                                      path: ROUTES.LOANS,
                                  },
                                  {
                                      label: 'History',
                                      icon: '📋',
                                      path: ROUTES.TRANSACTIONS,
                                  },
                              ].map((action) => (
                                  <button
                                      key={action.label}
                                      onClick={() => navigate(action.path)}
                                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95"
                                      style={{
                                          backgroundColor:
                                              'rgba(255,255,255,0.15)',
                                          color: 'white',
                                      }}
                                      onMouseEnter={(e) =>
                                          (e.currentTarget.style.backgroundColor =
                                              'rgba(255,255,255,0.25)')
                                      }
                                      onMouseLeave={(e) =>
                                          (e.currentTarget.style.backgroundColor =
                                              'rgba(255,255,255,0.15)')
                                      }
                                  >
                                      <span>{action.icon}</span>
                                      <span>{action.label}</span>
                                  </button>
                              ))}
                    </div>
                </div>
            </div>

            {/* ===== CHARTS SECTION ===== */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {/* Income vs Expense Chart — 2/3 width */}
                <div className="xl:col-span-2 bg-white dark:bg-bank-card rounded-xl border border-gray-200 dark:border-bank-border p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                        <div>
                            <h2 className="font-semibold text-gray-900 dark:text-white">
                                Income vs Expense
                            </h2>
                            <p className="text-xs text-gray-400 mt-0.5">
                                Last 6 months
                            </p>
                        </div>
                        {/* Chart type toggle */}
                        <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-bank-border rounded-lg">
                            {[
                                { key: 'line', label: '📈 Line' },
                                { key: 'bar', label: '📊 Bar' },
                            ].map((c) => (
                                <button
                                    key={c.key}
                                    onClick={() => setActiveChart(c.key)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                                        activeChart === c.key
                                            ? 'bg-white dark:bg-bank-card text-gray-900 dark:text-white shadow-sm'
                                            : 'text-gray-500 dark:text-gray-400'
                                    }`}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {activeChart === 'line' ? (
                        <LineChart data={MONTHLY_DATA} />
                    ) : (
                        <BarChart data={MONTHLY_DATA} />
                    )}
                </div>

                {/* Spending breakdown — 1/3 width */}
                <div className="bg-white dark:bg-bank-card rounded-xl border border-gray-200 dark:border-bank-border p-6">
                    <h2 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Spending Breakdown
                    </h2>
                    <p className="text-xs text-gray-400 mb-4">This month</p>
                    <PieChart data={SPENDING_CATEGORIES} />

                    {/* Legend list */}
                    <div className="mt-2 space-y-2">
                        {SPENDING_CATEGORIES.map((cat) => (
                            <div
                                key={cat.name}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: cat.color }}
                                    />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {cat.name}
                                    </span>
                                </div>
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                    {formatCurrency(cat.value)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ===== BOTTOM SECTION ===== */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {/* Recent Transactions — 2/3 width */}
                <div className="xl:col-span-2 bg-white dark:bg-bank-card rounded-xl border border-gray-200 dark:border-bank-border p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-semibold text-gray-900 dark:text-white">
                            Recent Transactions
                        </h2>
                        <button
                            onClick={() => navigate(ROUTES.TRANSACTIONS)}
                            className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium"
                        >
                            View All →
                        </button>
                    </div>

                    {myTransactions.length === 0 ? (
                        <p className="text-center text-gray-400 py-8">
                            No transactions yet
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {myTransactions.map((txn) => (
                                <div
                                    key={txn.id}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-bank-border/30 transition-colors"
                                >
                                    {/* Type icon */}
                                    <div
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                            txn.type === 'credit'
                                                ? 'bg-green-100 dark:bg-green-900/20 text-green-600'
                                                : 'bg-red-100 dark:bg-red-900/20 text-red-500'
                                        }`}
                                    >
                                        {txn.type === 'credit' ? '↓' : '↑'}
                                    </div>

                                    {/* Description */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {txn.description}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {formatDate(txn.date)}
                                        </p>
                                    </div>

                                    {/* Amount + status */}
                                    <div className="text-right flex-shrink-0">
                                        <p
                                            className={`text-sm font-bold ${
                                                txn.type === 'credit'
                                                    ? 'text-green-600 dark:text-green-400'
                                                    : 'text-red-600 dark:text-red-400'
                                            }`}
                                        >
                                            {txn.type === 'credit' ? '+' : '-'}
                                            {formatCurrency(txn.amount)}
                                        </p>
                                        <Badge
                                            variant={statusVariant[txn.status]}
                                        >
                                            {txn.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Active Loans — 1/3 width */}
                <div className="bg-white dark:bg-bank-card rounded-xl border border-gray-200 dark:border-bank-border p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-semibold text-gray-900 dark:text-white">
                            Active Loans
                        </h2>
                        <button
                            onClick={() => navigate(ROUTES.LOANS)}
                            className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium"
                        >
                            View All →
                        </button>
                    </div>

                    {activeLoans.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-3xl mb-2">🎉</p>
                            <p className="text-sm text-gray-400">
                                No active loans!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {activeLoans.map((loan) => {
                                const progress = Math.round(
                                    (loan.paidMonths / loan.tenure) * 100,
                                );
                                return (
                                    <div
                                        key={loan.id}
                                        className="p-4 rounded-xl bg-gray-50 dark:bg-bank-border/30 border border-gray-100 dark:border-bank-border"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    {loan.type}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {loan.interestRate}% p.a.
                                                </p>
                                            </div>
                                            <Badge variant="success">
                                                Active
                                            </Badge>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="mb-2">
                                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                                <span>
                                                    Paid: {loan.paidMonths}/
                                                    {loan.tenure} months
                                                </span>
                                                <span>{progress}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-200 dark:bg-bank-border rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary-500 rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${progress}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-between mt-3">
                                            <div>
                                                <p className="text-xs text-gray-400">
                                                    EMI
                                                </p>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                    {formatCurrency(loan.emi)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400">
                                                    Remaining
                                                </p>
                                                <p className="text-sm font-bold text-red-500">
                                                    {formatCurrency(
                                                        loan.remainingAmount,
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-bank-border">
                                            <p className="text-xs text-gray-400">
                                                Next Due:{' '}
                                                <span className="font-medium text-gray-600 dark:text-gray-300">
                                                    {formatDate(
                                                        loan.nextDueDate,
                                                    )}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Apply for loan button */}
                    <Button
                        variant="secondary"
                        fullWidth
                        size="sm"
                        onClick={() => navigate(ROUTES.LOANS)}
                        className="mt-4"
                    >
                        + Apply for Loan
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
