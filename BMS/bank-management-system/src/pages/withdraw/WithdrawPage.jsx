import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import { MOCK_TRANSACTIONS } from '../../constants/mockTransactions';
import { ROLES } from '../../constants/roles';
import { formatCurrency } from '../../utils/formatCurrency';
import { isValidAmount } from '../../utils/validators';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

const STEPS = { FORM: 'form', SUCCESS: 'success' };

const WithdrawPage = () => {
    const { currentUser } = useAuth();
    const { showToast } = useToast();

    const isCustomer = currentUser?.role === ROLES.CUSTOMER;

    // Customer ke liye limits
    const CUSTOMER_DAILY_LIMIT = 10000;
    const CUSTOMER_MIN_AMOUNT = 100;
    const CUSTOMER_MAX_PER_TXN = 5000;

    // Employee/Admin ke liye limits
    const STAFF_DAILY_LIMIT = 50000;
    const STAFF_MAX_PER_TXN = 50000;

    const dailyLimit = isCustomer ? CUSTOMER_DAILY_LIMIT : STAFF_DAILY_LIMIT;
    const maxPerTxn = isCustomer ? CUSTOMER_MAX_PER_TXN : STAFF_MAX_PER_TXN;

    // Aaj kitna withdraw kiya
    const todayWithdrawn = MOCK_TRANSACTIONS.filter(
        (t) =>
            t.userId === currentUser?.id &&
            t.type === 'debit' &&
            t.category === 'cash' &&
            t.date === new Date().toISOString().split('T')[0],
    ).reduce((s, t) => s + t.amount, 0);

    const remainingDailyLimit = dailyLimit - todayWithdrawn;

    const [step, setStep] = useState(STEPS.FORM);
    const [loading, setLoading] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [txnRef, setTxnRef] = useState('');

    const [form, setForm] = useState({
        amount: '',
        method: isCustomer ? 'atm' : 'atm',
        note: '',
    });
    const [errors, setErrors] = useState({});

    const update = (field, value) => {
        setForm((p) => ({ ...p, [field]: value }));
        setErrors((p) => ({ ...p, [field]: '' }));
    };

    const validate = () => {
        const e = {};
        const amt = Number(form.amount);

        if (!form.amount) e.amount = 'Amount required';
        else if (!isValidAmount(form.amount))
            e.amount = 'Valid amount enter karo';
        else if (amt < CUSTOMER_MIN_AMOUNT)
            e.amount = `Minimum ₹${CUSTOMER_MIN_AMOUNT}`;
        else if (amt > maxPerTxn)
            e.amount = `Maximum ₹${maxPerTxn.toLocaleString('en-IN')} per transaction`;
        else if (amt > remainingDailyLimit)
            e.amount = `Daily limit exceed! Aaj sirf ₹${remainingDailyLimit.toLocaleString('en-IN')} withdraw kar sakte ho`;
        else if (amt > (currentUser?.balance || 0))
            e.amount = 'Insufficient balance';

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleWithdraw = async () => {
        setLoading(true);
        setConfirmModal(false);
        await new Promise((res) => setTimeout(res, 1500));

        const ref = `WD${Date.now()}`;
        setTxnRef(ref);

        MOCK_TRANSACTIONS.unshift({
            id: `txn${Date.now()}`,
            userId: currentUser?.id,
            type: 'debit',
            amount: Number(form.amount),
            description: `Cash Withdrawal — ${form.method.toUpperCase()}`,
            category: 'cash',
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
            }),
            status: 'completed',
            fromAccount: currentUser?.accountNumber,
            toAccount: 'Cash',
            reference: ref,
            note: form.note,
        });

        setLoading(false);
        setStep(STEPS.SUCCESS);
        showToast(
            `₹${Number(form.amount).toLocaleString('en-IN')} withdrawn successfully! 💵`,
            'success',
        );
    };

    const reset = () => {
        setForm({ amount: '', method: 'atm', note: '' });
        setErrors({});
        setStep(STEPS.FORM);
    };

    // Customer ke liye sirf ATM
    // Employee/Admin ke liye sab
    const allMethods = [
        {
            key: 'atm',
            label: 'ATM',
            icon: '🏧',
            desc: 'ATM se nikalo',
            customerAllowed: true,
        },
        {
            key: 'branch',
            label: 'Branch',
            icon: '🏦',
            desc: 'Branch se nikalo',
            customerAllowed: false,
        },
        {
            key: 'upi',
            label: 'UPI',
            icon: '📱',
            desc: 'UPI cashout',
            customerAllowed: true,
        },
        {
            key: 'cheque',
            label: 'Cheque',
            icon: '📄',
            desc: 'Cheque withdrawal',
            customerAllowed: false,
        },
    ];

    const methods = isCustomer
        ? allMethods.filter((m) => m.customerAllowed)
        : allMethods;

    // Quick amount buttons — customer ke liye chhote amounts
    const quickAmounts = isCustomer
        ? [100, 200, 500, 1000, 2000, 5000]
        : [500, 1000, 2000, 5000, 10000, 20000];

    return (
        <div className="space-y-6 max-w-2xl">
            {/* HEADER */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Withdraw Money 💵
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {isCustomer
                            ? 'ATM ya UPI se cash withdraw karo'
                            : 'Cash withdraw karo'}
                    </p>
                </div>
                {/* Customer limit badge */}
                {isCustomer && (
                    <div
                        className="px-3 py-2 rounded-xl text-xs font-semibold text-center"
                        style={{
                            backgroundColor: '#fef3c7',
                            color: '#92400e',
                            border: '1px solid #fde68a',
                        }}
                    >
                        <p>Daily Limit</p>
                        <p className="text-base font-black">
                            ₹{dailyLimit.toLocaleString('en-IN')}
                        </p>
                    </div>
                )}
            </div>

            {/* SUCCESS */}
            {step === STEPS.SUCCESS && (
                <div
                    className="rounded-2xl border p-8 text-center animate-bounce-in"
                    style={{
                        backgroundColor: '#ffffff',
                        borderColor: '#e5e7eb',
                    }}
                >
                    <div
                        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{ backgroundColor: '#fef2f2' }}
                    >
                        <span className="text-4xl">💵</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                        Withdrawal Successful!
                    </h2>
                    <p
                        className="text-3xl font-black mb-4"
                        style={{ color: '#ef4444' }}
                    >
                        -{formatCurrency(Number(form.amount))}
                    </p>
                    <div
                        className="rounded-xl p-4 text-left space-y-2 mb-6"
                        style={{ backgroundColor: '#f9fafb' }}
                    >
                        {[
                            {
                                label: 'Method',
                                value: form.method.toUpperCase(),
                            },
                            {
                                label: 'Account',
                                value: currentUser?.accountNumber,
                            },
                            { label: 'Reference', value: txnRef },
                            { label: 'Status', value: 'Completed ✅' },
                            {
                                label: 'Time',
                                value: new Date().toLocaleString('en-IN'),
                            },
                        ].map((row) => (
                            <div
                                key={row.label}
                                className="flex justify-between text-sm"
                            >
                                <span className="text-gray-400">
                                    {row.label}
                                </span>
                                <span className="font-semibold text-gray-900">
                                    {row.value}
                                </span>
                            </div>
                        ))}
                    </div>
                    <Button fullWidth onClick={reset}>
                        Make Another Withdrawal
                    </Button>
                </div>
            )}

            {/* FORM */}
            {step === STEPS.FORM && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        {/* Balance + Daily Limit Card */}
                        <div
                            className="rounded-xl p-5 text-white"
                            style={{
                                background:
                                    'linear-gradient(135deg, #ef4444, #dc2626)',
                            }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-red-200 text-xs mb-0.5">
                                        Available Balance
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {formatCurrency(
                                            currentUser?.balance || 0,
                                        )}
                                    </p>
                                </div>
                                <span className="text-4xl opacity-80">💵</span>
                            </div>

                            {/* Daily limit progress */}
                            <div>
                                <div
                                    className="flex justify-between text-xs mb-1.5"
                                    style={{ color: '#fca5a5' }}
                                >
                                    <span>Daily Limit Used</span>
                                    <span>
                                        ₹
                                        {todayWithdrawn.toLocaleString('en-IN')}{' '}
                                        / ₹{dailyLimit.toLocaleString('en-IN')}
                                    </span>
                                </div>
                                <div
                                    className="w-full h-2 rounded-full"
                                    style={{
                                        backgroundColor:
                                            'rgba(255,255,255,0.2)',
                                    }}
                                >
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${Math.min((todayWithdrawn / dailyLimit) * 100, 100)}%`,
                                            backgroundColor:
                                                todayWithdrawn >=
                                                dailyLimit * 0.8
                                                    ? '#fbbf24'
                                                    : '#ffffff',
                                        }}
                                    />
                                </div>
                                <p
                                    className="text-xs mt-1.5"
                                    style={{ color: '#fca5a5' }}
                                >
                                    Remaining today:{' '}
                                    <span className="font-bold text-white">
                                        ₹
                                        {remainingDailyLimit.toLocaleString(
                                            'en-IN',
                                        )}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Customer restriction notice */}
                        {isCustomer && (
                            <div
                                className="p-4 rounded-xl border text-sm"
                                style={{
                                    backgroundColor: '#fffbeb',
                                    borderColor: '#fde68a',
                                    color: '#92400e',
                                }}
                            >
                                <p className="font-semibold mb-1">
                                    ⚠️ Customer Withdrawal Limits:
                                </p>
                                <div className="grid grid-cols-2 gap-1 text-xs">
                                    <span>• Max per transaction: ₹5,000</span>
                                    <span>• Daily limit: ₹10,000</span>
                                    <span>• Methods: ATM & UPI only</span>
                                    <span>• Min amount: ₹100</span>
                                </div>
                            </div>
                        )}

                        {/* Method select */}
                        <div
                            className="rounded-xl border p-4"
                            style={{
                                backgroundColor: '#ffffff',
                                borderColor: '#e5e7eb',
                            }}
                        >
                            <p className="text-sm font-semibold text-gray-700 mb-3">
                                Withdrawal Method
                            </p>
                            <div
                                className={`grid gap-2 ${methods.length === 2 ? 'grid-cols-2' : 'grid-cols-4'}`}
                            >
                                {methods.map((m) => (
                                    <button
                                        key={m.key}
                                        onClick={() => update('method', m.key)}
                                        className="p-3 rounded-xl border-2 text-center transition-all duration-200 active:scale-95"
                                        style={{
                                            borderColor:
                                                form.method === m.key
                                                    ? '#2563eb'
                                                    : '#e5e7eb',
                                            backgroundColor:
                                                form.method === m.key
                                                    ? '#eff6ff'
                                                    : '#ffffff',
                                        }}
                                    >
                                        <p className="text-2xl mb-1">
                                            {m.icon}
                                        </p>
                                        <p
                                            className="text-xs font-bold"
                                            style={{
                                                color:
                                                    form.method === m.key
                                                        ? '#2563eb'
                                                        : '#374151',
                                            }}
                                        >
                                            {m.label}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {m.desc}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Amount + quick buttons */}
                        <div
                            className="rounded-xl border p-5 space-y-4"
                            style={{
                                backgroundColor: '#ffffff',
                                borderColor: '#e5e7eb',
                            }}
                        >
                            <div>
                                <label className="form-label">
                                    Amount (₹) * — Max ₹
                                    {maxPerTxn.toLocaleString('en-IN')}
                                    /transaction
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                                        ₹
                                    </span>
                                    <input
                                        type="number"
                                        value={form.amount}
                                        onChange={(e) =>
                                            update('amount', e.target.value)
                                        }
                                        placeholder="0.00"
                                        max={maxPerTxn}
                                        className={`input-field pl-8 text-xl font-bold ${errors.amount ? 'border-red-400' : ''}`}
                                    />
                                </div>
                                {errors.amount && (
                                    <p className="form-error">
                                        {errors.amount}
                                    </p>
                                )}
                            </div>

                            {/* Quick amounts */}
                            <div>
                                <p className="text-xs text-gray-400 mb-2">
                                    Quick Select:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {quickAmounts.map((amt) => (
                                        <button
                                            key={amt}
                                            onClick={() =>
                                                update('amount', String(amt))
                                            }
                                            disabled={amt > remainingDailyLimit}
                                            className="px-3 py-1.5 text-xs font-medium rounded-lg border transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                                            style={{
                                                borderColor:
                                                    form.amount === String(amt)
                                                        ? '#2563eb'
                                                        : '#e5e7eb',
                                                backgroundColor:
                                                    form.amount === String(amt)
                                                        ? '#eff6ff'
                                                        : '#ffffff',
                                                color:
                                                    form.amount === String(amt)
                                                        ? '#2563eb'
                                                        : '#6b7280',
                                            }}
                                        >
                                            ₹{amt.toLocaleString('en-IN')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Note */}
                            <div>
                                <label className="form-label">
                                    Note (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={form.note}
                                    onChange={(e) =>
                                        update('note', e.target.value)
                                    }
                                    placeholder="Withdrawal reason..."
                                    className="input-field"
                                />
                            </div>

                            {/* Disabled if limit exceeded */}
                            {remainingDailyLimit <= 0 ? (
                                <div
                                    className="p-4 rounded-xl text-center"
                                    style={{
                                        backgroundColor: '#fef2f2',
                                        border: '1px solid #fecaca',
                                    }}
                                >
                                    <p className="text-sm font-bold text-red-600">
                                        ⛔ Daily Limit Exceeded!
                                    </p>
                                    <p className="text-xs text-red-400 mt-1">
                                        Aaj ke liye withdrawal limit ₹
                                        {dailyLimit.toLocaleString('en-IN')} use
                                        ho gayi.
                                    </p>
                                    <p className="text-xs text-red-400">
                                        Kal dobara try karo.
                                    </p>
                                </div>
                            ) : (
                                <Button
                                    fullWidth
                                    size="lg"
                                    onClick={() => {
                                        if (validate()) setConfirmModal(true);
                                    }}
                                    loading={loading}
                                    variant="danger"
                                >
                                    Withdraw Now 💵
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Right info */}
                    <div className="space-y-4">
                        <div
                            className="rounded-xl border p-5"
                            style={{
                                backgroundColor: '#ffffff',
                                borderColor: '#e5e7eb',
                            }}
                        >
                            <h3 className="font-semibold text-gray-900 mb-4">
                                Your Limits
                            </h3>
                            <div className="space-y-3">
                                {[
                                    {
                                        label: 'Per Transaction',
                                        value: `₹${maxPerTxn.toLocaleString('en-IN')}`,
                                    },
                                    {
                                        label: 'Daily Limit',
                                        value: `₹${dailyLimit.toLocaleString('en-IN')}`,
                                    },
                                    {
                                        label: 'Used Today',
                                        value: `₹${todayWithdrawn.toLocaleString('en-IN')}`,
                                    },
                                    {
                                        label: 'Remaining',
                                        value: `₹${remainingDailyLimit.toLocaleString('en-IN')}`,
                                    },
                                    { label: 'Min Amount', value: '₹100' },
                                    { label: 'Processing', value: 'Instant' },
                                ].map((info) => (
                                    <div
                                        key={info.label}
                                        className="flex justify-between text-sm"
                                    >
                                        <span className="text-gray-400">
                                            {info.label}
                                        </span>
                                        <span
                                            className="font-semibold"
                                            style={{
                                                color:
                                                    info.label === 'Remaining'
                                                        ? remainingDailyLimit <=
                                                          0
                                                            ? '#ef4444'
                                                            : remainingDailyLimit <
                                                                dailyLimit * 0.3
                                                              ? '#f59e0b'
                                                              : '#16a34a'
                                                        : '#374151',
                                            }}
                                        >
                                            {info.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Customer upgrade notice */}
                        {isCustomer && (
                            <div
                                className="rounded-xl p-4 text-sm"
                                style={{
                                    backgroundColor: '#eff6ff',
                                    border: '1px solid #bfdbfe',
                                }}
                            >
                                <p
                                    className="font-semibold mb-1"
                                    style={{ color: '#1d4ed8' }}
                                >
                                    💡 Higher Limits Chahiye?
                                </p>
                                <p
                                    className="text-xs"
                                    style={{ color: '#3b82f6' }}
                                >
                                    Branch visit karein ya Premium account
                                    upgrade karein for higher withdrawal limits.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* CONFIRM MODAL */}
            <Modal
                isOpen={confirmModal}
                onClose={() => setConfirmModal(false)}
                title="Confirm Withdrawal"
                size="sm"
            >
                <div className="space-y-4">
                    <div
                        className="rounded-xl p-4 space-y-3"
                        style={{ backgroundColor: '#f9fafb' }}
                    >
                        {[
                            {
                                label: 'Amount',
                                value: formatCurrency(Number(form.amount)),
                            },
                            {
                                label: 'Method',
                                value: form.method.toUpperCase(),
                            },
                            {
                                label: 'Account',
                                value: currentUser?.accountNumber,
                            },
                            {
                                label: 'Balance After',
                                value: formatCurrency(
                                    (currentUser?.balance || 0) -
                                        Number(form.amount),
                                ),
                            },
                        ].map((row) => (
                            <div
                                key={row.label}
                                className="flex justify-between text-sm"
                            >
                                <span className="text-gray-400">
                                    {row.label}
                                </span>
                                <span className="font-semibold text-gray-900">
                                    {row.value}
                                </span>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 text-center">
                        ⚠️ Confirm karne ke baad reverse nahi hoga
                    </p>
                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            fullWidth
                            onClick={() => setConfirmModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            fullWidth
                            loading={loading}
                            onClick={handleWithdraw}
                        >
                            {loading ? 'Processing...' : 'Confirm Withdraw 💵'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default WithdrawPage;
