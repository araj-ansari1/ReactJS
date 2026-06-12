import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import { MOCK_TRANSACTIONS } from '../../constants/mockTransactions';
import { formatCurrency } from '../../utils/formatCurrency';
import { isValidAmount } from '../../utils/validators';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

const STEPS = { FORM: 'form', SUCCESS: 'success' };

const DepositPage = () => {
    const { currentUser } = useAuth();
    const { showToast } = useToast();

    const [step, setStep] = useState(STEPS.FORM);
    const [loading, setLoading] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [txnRef, setTxnRef] = useState('');

    const [form, setForm] = useState({
        amount: '',
        method: 'cash',
        source: '',
        note: '',
    });
    const [errors, setErrors] = useState({});

    const update = (field, value) => {
        setForm((p) => ({ ...p, [field]: value }));
        setErrors((p) => ({ ...p, [field]: '' }));
    };

    const validate = () => {
        const e = {};
        if (!form.amount) e.amount = 'Amount required';
        else if (!isValidAmount(form.amount))
            e.amount = 'Valid amount enter karo';
        else if (Number(form.amount) < 100) e.amount = 'Minimum ₹100';
        else if (Number(form.amount) > 1000000) e.amount = 'Maximum ₹10,00,000';
        if (!form.source.trim()) e.source = 'Source of funds required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleDeposit = async () => {
        setLoading(true);
        setConfirmModal(false);
        await new Promise((res) => setTimeout(res, 1500));

        const ref = `DEP${Date.now()}`;
        setTxnRef(ref);

        MOCK_TRANSACTIONS.unshift({
            id: `txn${Date.now()}`,
            userId: currentUser?.id,
            type: 'credit',
            amount: Number(form.amount),
            description: `Cash Deposit — ${form.method.toUpperCase()}`,
            category: 'deposit',
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
            }),
            status: 'completed',
            fromAccount: form.source,
            toAccount: currentUser?.accountNumber,
            reference: ref,
        });

        setLoading(false);
        setStep(STEPS.SUCCESS);
        showToast(
            `₹${Number(form.amount).toLocaleString('en-IN')} deposited! 💰`,
            'success',
        );
    };

    const reset = () => {
        setForm({ amount: '', method: 'cash', source: '', note: '' });
        setErrors({});
        setStep(STEPS.FORM);
    };

    const methods = [
        {
            key: 'cash',
            label: 'Cash',
            icon: '💵',
            desc: 'Branch mein cash jama karo',
        },
        {
            key: 'cheque',
            label: 'Cheque',
            icon: '📄',
            desc: 'Cheque deposit karo',
        },
        {
            key: 'neft',
            label: 'NEFT/RTGS',
            icon: '🏦',
            desc: 'Bank transfer se',
        },
        { key: 'upi', label: 'UPI', icon: '📱', desc: 'UPI se deposit karo' },
    ];

    return (
        <div className="space-y-6 max-w-2xl">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Deposit Money 💰
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Apne account mein paisa jama karo
                </p>
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
                        style={{ backgroundColor: '#f0fdf4' }}
                    >
                        <span className="text-4xl">💰</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                        Deposit Successful!
                    </h2>
                    <p
                        className="text-3xl font-black mb-4"
                        style={{ color: '#16a34a' }}
                    >
                        +{formatCurrency(Number(form.amount))}
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
                            { label: 'Source', value: form.source },
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
                        Make Another Deposit
                    </Button>
                </div>
            )}

            {/* FORM */}
            {step === STEPS.FORM && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        {/* Balance */}
                        <div
                            className="rounded-xl p-4 text-white flex items-center justify-between"
                            style={{
                                background:
                                    'linear-gradient(to right, #16a34a, #15803d)',
                            }}
                        >
                            <div>
                                <p className="text-green-200 text-xs">
                                    Current Balance
                                </p>
                                <p className="text-2xl font-bold">
                                    {formatCurrency(currentUser?.balance || 0)}
                                </p>
                            </div>
                            <span className="text-4xl opacity-80">💰</span>
                        </div>

                        {/* Method */}
                        <div
                            className="rounded-xl border p-4"
                            style={{
                                backgroundColor: '#ffffff',
                                borderColor: '#e5e7eb',
                            }}
                        >
                            <p className="text-sm font-semibold text-gray-700 mb-3">
                                Deposit Method
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {methods.map((m) => (
                                    <button
                                        key={m.key}
                                        onClick={() => update('method', m.key)}
                                        className="p-3 rounded-xl border-2 text-center transition-all duration-200 active:scale-95"
                                        style={{
                                            borderColor:
                                                form.method === m.key
                                                    ? '#16a34a'
                                                    : '#e5e7eb',
                                            backgroundColor:
                                                form.method === m.key
                                                    ? '#f0fdf4'
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
                                                        ? '#16a34a'
                                                        : '#374151',
                                            }}
                                        >
                                            {m.label}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Form fields */}
                        <div
                            className="rounded-xl border p-5 space-y-4"
                            style={{
                                backgroundColor: '#ffffff',
                                borderColor: '#e5e7eb',
                            }}
                        >
                            {/* Amount */}
                            <div>
                                <label className="form-label">
                                    Amount (₹) *
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
                                        className={`input-field pl-8 text-xl font-bold ${errors.amount ? 'border-red-400' : ''}`}
                                    />
                                </div>
                                {errors.amount && (
                                    <p className="form-error">
                                        {errors.amount}
                                    </p>
                                )}

                                {/* Quick amounts */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {[
                                        1000, 5000, 10000, 25000, 50000, 100000,
                                    ].map((amt) => (
                                        <button
                                            key={amt}
                                            onClick={() =>
                                                update('amount', String(amt))
                                            }
                                            className="px-3 py-1.5 text-xs font-medium rounded-lg border transition-all active:scale-95"
                                            style={{
                                                borderColor:
                                                    form.amount === String(amt)
                                                        ? '#16a34a'
                                                        : '#e5e7eb',
                                                backgroundColor:
                                                    form.amount === String(amt)
                                                        ? '#f0fdf4'
                                                        : '#ffffff',
                                                color:
                                                    form.amount === String(amt)
                                                        ? '#16a34a'
                                                        : '#6b7280',
                                            }}
                                        >
                                            ₹{amt.toLocaleString('en-IN')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Source */}
                            <div>
                                <label className="form-label">
                                    Source of Funds *
                                </label>
                                <select
                                    value={form.source}
                                    onChange={(e) =>
                                        update('source', e.target.value)
                                    }
                                    className={`input-field ${errors.source ? 'border-red-400' : ''}`}
                                >
                                    <option value="">
                                        -- Select source --
                                    </option>
                                    <option value="Salary">💼 Salary</option>
                                    <option value="Business Income">
                                        🏪 Business Income
                                    </option>
                                    <option value="Investment Returns">
                                        📈 Investment Returns
                                    </option>
                                    <option value="Rental Income">
                                        🏠 Rental Income
                                    </option>
                                    <option value="Gift">🎁 Gift</option>
                                    <option value="Other">📦 Other</option>
                                </select>
                                {errors.source && (
                                    <p className="form-error">
                                        {errors.source}
                                    </p>
                                )}
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
                                    placeholder="Additional notes..."
                                    className="input-field"
                                />
                            </div>

                            {/* Amount after deposit preview */}
                            {form.amount && isValidAmount(form.amount) && (
                                <div
                                    className="p-3 rounded-xl flex justify-between items-center"
                                    style={{
                                        backgroundColor: '#f0fdf4',
                                        border: '1px solid #bbf7d0',
                                    }}
                                >
                                    <span
                                        className="text-sm font-medium"
                                        style={{ color: '#166534' }}
                                    >
                                        Balance After Deposit
                                    </span>
                                    <span
                                        className="text-lg font-black"
                                        style={{ color: '#16a34a' }}
                                    >
                                        {formatCurrency(
                                            (currentUser?.balance || 0) +
                                                Number(form.amount),
                                        )}
                                    </span>
                                </div>
                            )}

                            <Button
                                fullWidth
                                size="lg"
                                onClick={() => {
                                    if (validate()) setConfirmModal(true);
                                }}
                                loading={loading}
                                variant="success"
                            >
                                Deposit Now 💰
                            </Button>
                        </div>
                    </div>

                    {/* Right — Info */}
                    <div>
                        <div
                            className="rounded-xl border p-5"
                            style={{
                                backgroundColor: '#ffffff',
                                borderColor: '#e5e7eb',
                            }}
                        >
                            <h3 className="font-semibold text-gray-900 mb-4">
                                Deposit Info
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { label: 'Min Amount', value: '₹100' },
                                    {
                                        label: 'Max Amount',
                                        value: '₹10,00,000',
                                    },
                                    { label: 'Processing', value: 'Same day' },
                                    {
                                        label: 'Cash Hours',
                                        value: '10AM - 3PM',
                                    },
                                    {
                                        label: 'Cheque',
                                        value: '1-2 working days',
                                    },
                                    {
                                        label: 'NEFT/RTGS',
                                        value: 'Same day (before 4PM)',
                                    },
                                ].map((info) => (
                                    <div
                                        key={info.label}
                                        className="flex justify-between text-sm"
                                    >
                                        <span className="text-gray-400">
                                            {info.label}
                                        </span>
                                        <span className="font-medium text-gray-700">
                                            {info.value}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Account details for NEFT */}
                            <div
                                className="mt-4 p-3 rounded-xl"
                                style={{
                                    backgroundColor: '#eff6ff',
                                    border: '1px solid #bfdbfe',
                                }}
                            >
                                <p
                                    className="text-xs font-semibold mb-2"
                                    style={{ color: '#1d4ed8' }}
                                >
                                    NEFT/RTGS Details
                                </p>
                                {[
                                    {
                                        label: 'Account No',
                                        value: currentUser?.accountNumber,
                                    },
                                    { label: 'IFSC', value: 'NEXA0001234' },
                                    { label: 'Bank', value: 'NexaBank' },
                                ].map((row) => (
                                    <div
                                        key={row.label}
                                        className="flex justify-between text-xs"
                                    >
                                        <span style={{ color: '#3b82f6' }}>
                                            {row.label}
                                        </span>
                                        <span
                                            className="font-mono font-semibold"
                                            style={{ color: '#1d4ed8' }}
                                        >
                                            {row.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CONFIRM MODAL */}
            <Modal
                isOpen={confirmModal}
                onClose={() => setConfirmModal(false)}
                title="Confirm Deposit"
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
                            { label: 'Source', value: form.source },
                            {
                                label: 'Account',
                                value: currentUser?.accountNumber,
                            },
                            {
                                label: 'Balance After',
                                value: formatCurrency(
                                    (currentUser?.balance || 0) +
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
                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            fullWidth
                            onClick={() => setConfirmModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="success"
                            fullWidth
                            loading={loading}
                            onClick={handleDeposit}
                        >
                            {loading ? 'Processing...' : 'Confirm Deposit 💰'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default DepositPage;
