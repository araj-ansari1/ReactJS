import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import { MOCK_LOANS } from '../../constants/mockLoans';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

const LOAN_TYPES = [
    {
        type: 'Personal Loan',
        icon: '👤',
        rate: '10.5%',
        maxAmount: '₹10L',
        tenure: '12-60 months',
    },
    {
        type: 'Home Loan',
        icon: '🏠',
        rate: '8.5%',
        maxAmount: '₹1Cr',
        tenure: '12-240 months',
    },
    {
        type: 'Car Loan',
        icon: '🚗',
        rate: '9.0%',
        maxAmount: '₹20L',
        tenure: '12-84 months',
    },
    {
        type: 'Education Loan',
        icon: '🎓',
        rate: '9.5%',
        maxAmount: '₹50L',
        tenure: '12-120 months',
    },
    {
        type: 'Gold Loan',
        icon: '💎',
        rate: '7.5%',
        maxAmount: '₹5L',
        tenure: '3-24 months',
    },
    {
        type: 'Business Loan',
        icon: '💼',
        rate: '11.0%',
        maxAmount: '₹50L',
        tenure: '12-60 months',
    },
];

const LoansPage = () => {
    const { currentUser } = useAuth();
    const { showToast } = useToast();
    const [applyModal, setApplyModal] = useState(false);
    const [detailModal, setDetailModal] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [loading, setLoading] = useState(false);

    // Apply form
    const [applyForm, setApplyForm] = useState({
        amount: '',
        tenure: '12',
        purpose: '',
    });

    const myLoans = MOCK_LOANS.filter((l) => l.userId === currentUser?.id);
    const activeLoans = myLoans.filter((l) => l.status === 'active');
    const closedLoans = myLoans.filter((l) => l.status === 'closed');

    const totalOutstanding = activeLoans.reduce(
        (s, l) => s + l.remainingAmount,
        0,
    );
    const totalEmi = activeLoans.reduce((s, l) => s + l.emi, 0);

    const handleApply = async () => {
        if (!applyForm.amount || Number(applyForm.amount) < 1000) {
            showToast('Please enter valid amount (min ₹1000)', 'error');
            return;
        }
        setLoading(true);
        await new Promise((res) => setTimeout(res, 1500));
        setLoading(false);
        setApplyModal(false);
        showToast(
            `${selectedType?.type} application submitted! We'll review it in 2-3 days. 🎉`,
            'success',
        );
        setApplyForm({ amount: '', tenure: '12', purpose: '' });
    };

    // EMI Calculator
    const calcEmi = () => {
        const P = Number(applyForm.amount);
        const r = parseFloat(selectedType?.rate) / 100 / 12;
        const n = Number(applyForm.tenure);
        if (!P || !r || !n) return 0;
        return Math.round(
            (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1),
        );
    };

    return (
        <div className="space-y-6">
            {/* ===== HEADER ===== */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Loans 🏦
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Manage your loans and apply for new ones
                    </p>
                </div>
            </div>

            {/* ===== LOAN SUMMARY CARDS ===== */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="stat-card">
                    <p className="text-sm text-gray-400 mb-1">Active Loans</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {activeLoans.length}
                    </p>
                </div>
                <div className="stat-card">
                    <p className="text-sm text-gray-400 mb-1">
                        Total Outstanding
                    </p>
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                        {formatCurrency(totalOutstanding)}
                    </p>
                </div>
                <div className="stat-card">
                    <p className="text-sm text-gray-400 mb-1">Monthly EMI</p>
                    <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                        {formatCurrency(totalEmi)}
                    </p>
                </div>
            </div>

            {/* ===== MY ACTIVE LOANS ===== */}
            {activeLoans.length > 0 && (
                <div className="bg-white dark:bg-bank-card rounded-xl border border-gray-200 dark:border-bank-border p-6">
                    <h2 className="font-semibold text-gray-900 dark:text-white mb-5">
                        Active Loans
                    </h2>
                    <div className="space-y-4">
                        {activeLoans.map((loan) => {
                            const progress = Math.round(
                                (loan.paidMonths / loan.tenure) * 100,
                            );
                            return (
                                <div
                                    key={loan.id}
                                    className="border border-gray-200 dark:border-bank-border rounded-xl p-5 hover:shadow-md transition-all duration-200"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-gray-900 dark:text-white">
                                                    {loan.type}
                                                </h3>
                                                <Badge variant="success">
                                                    Active
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-400">
                                                {loan.interestRate}% p.a. •{' '}
                                                {loan.tenure} months tenure
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 mb-0.5">
                                                Loan Amount
                                            </p>
                                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                {formatCurrency(loan.amount)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Progress */}
                                    <div className="mb-4">
                                        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                                            <span>Repayment Progress</span>
                                            <span>
                                                {loan.paidMonths}/{loan.tenure}{' '}
                                                months ({progress}%)
                                            </span>
                                        </div>
                                        <div className="w-full h-3 bg-gray-100 dark:bg-bank-border rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-700"
                                                style={{
                                                    width: `${progress}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Stats row */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                                        {[
                                            {
                                                label: 'Monthly EMI',
                                                value: formatCurrency(loan.emi),
                                                color: 'text-primary-600 dark:text-primary-400',
                                            },
                                            {
                                                label: 'Remaining',
                                                value: formatCurrency(
                                                    loan.remainingAmount,
                                                ),
                                                color: 'text-red-600 dark:text-red-400',
                                            },
                                            {
                                                label: 'Paid',
                                                value: formatCurrency(
                                                    loan.amount -
                                                        loan.remainingAmount,
                                                ),
                                                color: 'text-green-600 dark:text-green-400',
                                            },
                                            {
                                                label: 'Next Due',
                                                value: formatDate(
                                                    loan.nextDueDate,
                                                ),
                                                color: 'text-gray-900 dark:text-white',
                                            },
                                        ].map((stat) => (
                                            <div
                                                key={stat.label}
                                                className="text-center p-3 bg-gray-50 dark:bg-bank-border/30 rounded-lg"
                                            >
                                                <p className="text-xs text-gray-400 mb-1">
                                                    {stat.label}
                                                </p>
                                                <p
                                                    className={`text-sm font-bold ${stat.color}`}
                                                >
                                                    {stat.value}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100 dark:border-bank-border">
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                setSelectedLoan(loan);
                                                setDetailModal(true);
                                            }}
                                        >
                                            View Details
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="success"
                                            onClick={() =>
                                                showToast(
                                                    'EMI payment initiated! ✅',
                                                    'success',
                                                )
                                            }
                                        >
                                            💳 Pay EMI
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() =>
                                                showToast(
                                                    'Foreclosure request sent!',
                                                    'info',
                                                )
                                            }
                                        >
                                            Foreclose
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ===== CLOSED LOANS ===== */}
            {closedLoans.length > 0 && (
                <div className="bg-white dark:bg-bank-card rounded-xl border border-gray-200 dark:border-bank-border p-6">
                    <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
                        Closed Loans
                    </h2>
                    <div className="space-y-3">
                        {closedLoans.map((loan) => (
                            <div
                                key={loan.id}
                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-bank-border/30 rounded-xl"
                            >
                                <div>
                                    <p className="font-medium text-gray-700 dark:text-gray-300">
                                        {loan.type}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {formatCurrency(loan.amount)} • Closed{' '}
                                        {formatDate(loan.endDate)}
                                    </p>
                                </div>
                                <Badge variant="gray">Closed</Badge>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ===== APPLY FOR LOAN ===== */}
            <div className="bg-white dark:bg-bank-card rounded-xl border border-gray-200 dark:border-bank-border p-6">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Apply for a Loan
                </h2>
                <p className="text-sm text-gray-400 mb-5">
                    Choose from our range of loan products
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {LOAN_TYPES.map((loanType) => (
                        <div
                            key={loanType.type}
                            className="border-2 border-gray-200 dark:border-bank-border rounded-xl p-4 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-md transition-all duration-200 cursor-pointer group"
                            onClick={() => {
                                setSelectedType(loanType);
                                setApplyModal(true);
                            }}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="text-2xl">{loanType.icon}</div>
                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                    {loanType.type}
                                </h3>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400">
                                        Interest Rate
                                    </span>
                                    <span className="font-semibold text-green-600 dark:text-green-400">
                                        {loanType.rate} p.a.
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400">
                                        Max Amount
                                    </span>
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                                        {loanType.maxAmount}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400">
                                        Tenure
                                    </span>
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                                        {loanType.tenure}
                                    </span>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                fullWidth
                                className="mt-3"
                                variant="secondary"
                            >
                                Apply Now →
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* ===== APPLY MODAL ===== */}
            <Modal
                isOpen={applyModal}
                onClose={() => setApplyModal(false)}
                title={`Apply for ${selectedType?.type}`}
                size="md"
            >
                {selectedType && (
                    <div className="space-y-5">
                        {/* Loan type info */}
                        <div className="flex items-center gap-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                            <span className="text-3xl">
                                {selectedType.icon}
                            </span>
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {selectedType.type}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {selectedType.rate} p.a. • Max{' '}
                                    {selectedType.maxAmount} •{' '}
                                    {selectedType.tenure}
                                </p>
                            </div>
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Loan Amount (₹)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    ₹
                                </span>
                                <input
                                    type="number"
                                    value={applyForm.amount}
                                    onChange={(e) =>
                                        setApplyForm((p) => ({
                                            ...p,
                                            amount: e.target.value,
                                        }))
                                    }
                                    placeholder="Enter amount"
                                    className="input-field pl-8"
                                    min="1000"
                                />
                            </div>
                        </div>

                        {/* Tenure */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Tenure:{' '}
                                <span className="text-primary-600">
                                    {applyForm.tenure} months
                                </span>
                            </label>
                            <input
                                type="range"
                                min="6"
                                max="240"
                                step="6"
                                value={applyForm.tenure}
                                onChange={(e) =>
                                    setApplyForm((p) => ({
                                        ...p,
                                        tenure: e.target.value,
                                    }))
                                }
                                className="w-full accent-primary-600"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>6 months</span>
                                <span>240 months</span>
                            </div>
                        </div>

                        {/* Purpose */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Purpose
                            </label>
                            <input
                                type="text"
                                value={applyForm.purpose}
                                onChange={(e) =>
                                    setApplyForm((p) => ({
                                        ...p,
                                        purpose: e.target.value,
                                    }))
                                }
                                placeholder="Purpose of loan..."
                                className="input-field"
                            />
                        </div>

                        {/* EMI Preview */}
                        {applyForm.amount && (
                            <div className="p-4 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-xl border border-primary-100 dark:border-primary-800">
                                <p className="text-xs text-gray-400 mb-1">
                                    Estimated Monthly EMI
                                </p>
                                <p className="text-2xl font-black text-primary-600 dark:text-primary-400">
                                    {formatCurrency(calcEmi())}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    for {applyForm.tenure} months @{' '}
                                    {selectedType.rate} p.a.
                                </p>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <Button
                                variant="secondary"
                                fullWidth
                                onClick={() => setApplyModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                fullWidth
                                loading={loading}
                                onClick={handleApply}
                            >
                                {loading
                                    ? 'Submitting...'
                                    : 'Submit Application 🚀'}
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* ===== LOAN DETAIL MODAL ===== */}
            <Modal
                isOpen={detailModal}
                onClose={() => setDetailModal(false)}
                title="Loan Details"
                size="md"
            >
                {selectedLoan && (
                    <div className="space-y-4">
                        <div className="space-y-3">
                            {[
                                {
                                    label: 'Loan Type',
                                    value: selectedLoan.type,
                                },
                                {
                                    label: 'Loan Amount',
                                    value: formatCurrency(selectedLoan.amount),
                                },
                                {
                                    label: 'Interest Rate',
                                    value: `${selectedLoan.interestRate}% p.a.`,
                                },
                                {
                                    label: 'Tenure',
                                    value: `${selectedLoan.tenure} months`,
                                },
                                {
                                    label: 'Monthly EMI',
                                    value: formatCurrency(selectedLoan.emi),
                                },
                                {
                                    label: 'Paid Months',
                                    value: `${selectedLoan.paidMonths} months`,
                                },
                                {
                                    label: 'Outstanding',
                                    value: formatCurrency(
                                        selectedLoan.remainingAmount,
                                    ),
                                },
                                {
                                    label: 'Start Date',
                                    value: formatDate(selectedLoan.startDate),
                                },
                                {
                                    label: 'End Date',
                                    value: formatDate(selectedLoan.endDate),
                                },
                                {
                                    label: 'Next Due Date',
                                    value: formatDate(selectedLoan.nextDueDate),
                                },
                            ].map((row) => (
                                <div
                                    key={row.label}
                                    className="flex justify-between py-2 border-b border-gray-100 dark:border-bank-border last:border-0"
                                >
                                    <span className="text-sm text-gray-400">
                                        {row.label}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {row.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <Button
                            fullWidth
                            onClick={() => {
                                setDetailModal(false);
                                showToast(
                                    'EMI payment initiated! ✅',
                                    'success',
                                );
                            }}
                        >
                            💳 Pay EMI Now
                        </Button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default LoansPage;
