import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import { MOCK_USERS } from '../../constants/mockUsers';
import { MOCK_TRANSACTIONS } from '../../constants/mockTransactions';
import { formatCurrency } from '../../utils/formatCurrency';
import { isValidAmount } from '../../utils/validators';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';

// Transfer steps
const STEPS = {
    FORM: 'form',
    CONFIRM: 'confirm',
    SUCCESS: 'success',
};

const TransferPage = () => {
    const { currentUser } = useAuth();
    const { showToast } = useToast();

    const [step, setStep] = useState(STEPS.FORM);
    const [loading, setLoading] = useState(false);

    // Form state
    const [form, setForm] = useState({
        toAccount: '',
        amount: '',
        note: '',
        type: 'account', // account or mobile
    });
    const [errors, setErrors] = useState({});
    const [recipient, setRecipient] = useState(null);
    const [confirmModal, setConfirmModal] = useState(false);

    // Recent transfers — last 3
    const recentTransfers = MOCK_TRANSACTIONS.filter(
        (t) =>
            t.userId === currentUser?.id &&
            t.type === 'debit' &&
            t.category === 'transfer',
    ).slice(0, 3);

    const update = (field, value) => {
        setForm((p) => ({ ...p, [field]: value }));
        setErrors((p) => ({ ...p, [field]: '' }));
    };

    // Recipient dhundho
    const findRecipient = () => {
        if (!form.toAccount) {
            setErrors({ toAccount: 'Account number required' });
            return;
        }

        const found = MOCK_USERS.find(
            (u) =>
                u.accountNumber === form.toAccount && u.id !== currentUser?.id,
        );

        if (!found) {
            setErrors({ toAccount: 'Account not found. Try: NX-0004-CUST' });
            return;
        }

        setRecipient(found);
        setErrors({});
    };

    // Form validate karo
    const validate = () => {
        const e = {};
        if (!recipient) e.toAccount = 'Find recipient first';
        if (!form.amount) e.amount = 'Amount required';
        else if (!isValidAmount(form.amount)) e.amount = 'Enter valid amount';
        else if (Number(form.amount) > currentUser?.balance)
            e.amount = 'Insufficient balance';
        else if (Number(form.amount) < 1) e.amount = 'Minimum transfer ₹1';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // Confirm modal open karo
    const handleReview = () => {
        if (!validate()) return;
        setConfirmModal(true);
    };

    // Actual transfer
    const handleTransfer = async () => {
        setLoading(true);
        setConfirmModal(false);

        // Fake processing delay
        await new Promise((res) => setTimeout(res, 2000));

        // Mock transaction add karo
        const newTxn = {
            id: `txn${Date.now()}`,
            userId: currentUser.id,
            type: 'debit',
            amount: Number(form.amount),
            description: `Transfer to ${recipient.name}`,
            category: 'transfer',
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
            }),
            status: 'completed',
            fromAccount: currentUser.accountNumber,
            toAccount: recipient.accountNumber,
            reference: `REF${Date.now()}`,
            note: form.note,
        };

        MOCK_TRANSACTIONS.unshift(newTxn);

        setLoading(false);
        setStep(STEPS.SUCCESS);
        showToast(
            `₹${Number(form.amount).toLocaleString('en-IN')} transferred successfully! 🎉`,
            'success',
        );
    };

    // Reset form
    const handleReset = () => {
        setForm({ toAccount: '', amount: '', note: '', type: 'account' });
        setRecipient(null);
        setErrors({});
        setStep(STEPS.FORM);
    };

    return (
        <div className="space-y-6">
            {/* ===== HEADER ===== */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Transfer Money 💸
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Send money instantly to any NexaBank account
                </p>
            </div>

            {/* ===== SUCCESS STATE ===== */}
            {step === STEPS.SUCCESS && (
                <div className="max-w-md mx-auto">
                    <div className="bg-white dark:bg-bank-card rounded-2xl border border-gray-200 dark:border-bank-border p-8 text-center animate-bounce-in">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-4xl">✅</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Transfer Successful!
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-1">
                            You transferred
                        </p>
                        <p className="text-3xl font-black text-green-600 dark:text-green-400 mb-1">
                            {formatCurrency(Number(form.amount))}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            to{' '}
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {recipient?.name}
                            </span>
                        </p>

                        <div className="bg-gray-50 dark:bg-bank-border/30 rounded-xl p-4 text-left space-y-2 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">
                                    To Account
                                </span>
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    {recipient?.accountNumber}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">
                                    Date & Time
                                </span>
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    {new Date().toLocaleString('en-IN')}
                                </span>
                            </div>
                            {form.note && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Note</span>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                        {form.note}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Status</span>
                                <Badge variant="success">Completed</Badge>
                            </div>
                        </div>

                        <Button onClick={handleReset} fullWidth>
                            Make Another Transfer
                        </Button>
                    </div>
                </div>
            )}

            {/* ===== TRANSFER FORM ===== */}
            {step === STEPS.FORM && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main form — 2/3 */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Available balance */}
                        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-4 text-white flex items-center justify-between">
                            <div>
                                <p className="text-primary-200 text-xs">
                                    Available Balance
                                </p>
                                <p className="text-2xl font-bold">
                                    {formatCurrency(currentUser?.balance || 0)}
                                </p>
                            </div>
                            <div className="text-4xl opacity-80">💳</div>
                        </div>

                        {/* Transfer type tabs */}
                        <div className="bg-white dark:bg-bank-card rounded-xl border border-gray-200 dark:border-bank-border p-1 flex gap-1">
                            {[
                                { key: 'account', label: '🏦 Account Number' },
                                { key: 'mobile', label: '📱 Mobile Number' },
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => {
                                        update('type', tab.key);
                                        setRecipient(null);
                                    }}
                                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        form.type === tab.key
                                            ? 'bg-primary-600 text-white'
                                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-bank-border'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Form card */}
                        <div className="bg-white dark:bg-bank-card rounded-xl border border-gray-200 dark:border-bank-border p-6 space-y-5">
                            {/* Account/Mobile input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    {form.type === 'account'
                                        ? 'Recipient Account Number'
                                        : 'Mobile Number'}
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={form.toAccount}
                                        onChange={(e) => {
                                            update('toAccount', e.target.value);
                                            setRecipient(null);
                                        }}
                                        placeholder={
                                            form.type === 'account'
                                                ? 'NX-0004-CUST'
                                                : '9876543210'
                                        }
                                        className={`input-field ${errors.toAccount ? 'border-red-400' : ''}`}
                                    />
                                    <Button
                                        onClick={findRecipient}
                                        variant="secondary"
                                    >
                                        Find
                                    </Button>
                                </div>
                                {errors.toAccount && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.toAccount}
                                    </p>
                                )}

                                {/* Recipient found */}
                                {recipient && (
                                    <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3 animate-fade-in">
                                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                            {recipient.avatar}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                                                ✓ {recipient.name}
                                            </p>
                                            <p className="text-xs text-green-600 dark:text-green-400">
                                                {recipient.accountNumber}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Amount (₹)
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
                                        min="1"
                                        className={`input-field pl-8 ${errors.amount ? 'border-red-400' : ''}`}
                                    />
                                </div>
                                {errors.amount && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.amount}
                                    </p>
                                )}

                                {/* Quick amount buttons */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {[500, 1000, 2000, 5000, 10000].map(
                                        (amt) => (
                                            <button
                                                key={amt}
                                                onClick={() =>
                                                    update(
                                                        'amount',
                                                        String(amt),
                                                    )
                                                }
                                                className="px-3 py-1 text-xs border border-gray-200 dark:border-bank-border rounded-lg hover:bg-gray-50 dark:hover:bg-bank-border text-gray-600 dark:text-gray-400 transition-colors"
                                            >
                                                ₹{amt.toLocaleString('en-IN')}
                                            </button>
                                        ),
                                    )}
                                </div>
                            </div>

                            {/* Note */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Note (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={form.note}
                                    onChange={(e) =>
                                        update('note', e.target.value)
                                    }
                                    placeholder="Rent, EMI, Gift..."
                                    className="input-field"
                                />
                            </div>

                            {/* Submit */}
                            <Button
                                fullWidth
                                size="lg"
                                onClick={handleReview}
                                loading={loading}
                            >
                                Review Transfer →
                            </Button>
                        </div>
                    </div>

                    {/* Right side — info + recent */}
                    <div className="space-y-4">
                        {/* Transfer info */}
                        <div className="bg-white dark:bg-bank-card rounded-xl border border-gray-200 dark:border-bank-border p-5">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                Transfer Info
                            </h3>
                            <div className="space-y-3">
                                {[
                                    {
                                        label: 'Processing Time',
                                        value: 'Instant',
                                    },
                                    {
                                        label: 'Daily Limit',
                                        value: '₹2,00,000',
                                    },
                                    {
                                        label: 'Per Transaction',
                                        value: '₹2,00,000',
                                    },
                                    { label: 'Transfer Fee', value: 'Free' },
                                    { label: 'Min Amount', value: '₹1' },
                                    {
                                        label: 'Available 24/7',
                                        value: 'Yes ✅',
                                    },
                                ].map((info) => (
                                    <div
                                        key={info.label}
                                        className="flex justify-between text-sm"
                                    >
                                        <span className="text-gray-400">
                                            {info.label}
                                        </span>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                            {info.value}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* ATM reminder for customer */}
                            <div
                                className="mt-4 p-3 rounded-xl text-xs"
                                style={{
                                    backgroundColor: '#fffbeb',
                                    border: '1px solid #fde68a',
                                    color: '#92400e',
                                }}
                            >
                                <p className="font-bold mb-1">
                                    💡 Cash Chahiye?
                                </p>
                                <p>
                                    Cash withdrawal ke liye apna ATM card use
                                    karein. App se sirf digital transfer hota
                                    hai.
                                </p>
                            </div>
                        </div>

                        {/* Recent transfers */}
                        {recentTransfers.length > 0 && (
                            <div className="bg-white dark:bg-bank-card rounded-xl border border-gray-200 dark:border-bank-border p-5">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                    Recent Transfers
                                </h3>
                                <div className="space-y-3">
                                    {recentTransfers.map((txn) => (
                                        <div
                                            key={txn.id}
                                            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-bank-border/30 p-2 rounded-lg transition-colors"
                                            onClick={() => {
                                                update(
                                                    'toAccount',
                                                    txn.toAccount,
                                                );
                                                setRecipient(null);
                                            }}
                                        >
                                            <div className="w-9 h-9 bg-gray-100 dark:bg-bank-border rounded-full flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300">
                                                {txn.toAccount.slice(-4)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                                                    {txn.toAccount}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {txn.date}
                                                </p>
                                            </div>
                                            <span className="text-xs font-semibold text-red-500">
                                                -{formatCurrency(txn.amount)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ===== CONFIRM MODAL ===== */}
            <Modal
                isOpen={confirmModal}
                onClose={() => setConfirmModal(false)}
                title="Confirm Transfer"
                size="sm"
            >
                <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-bank-border/30 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">From</span>
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                {currentUser?.accountNumber}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">To</span>
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                {recipient?.name}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Account</span>
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                {recipient?.accountNumber}
                            </span>
                        </div>
                        {form.note && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Note</span>
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    {form.note}
                                </span>
                            </div>
                        )}
                        <div className="pt-3 border-t border-gray-200 dark:border-bank-border flex justify-between">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                                Amount
                            </span>
                            <span className="text-xl font-black text-primary-600 dark:text-primary-400">
                                {formatCurrency(Number(form.amount))}
                            </span>
                        </div>
                    </div>

                    <p className="text-xs text-gray-400 text-center">
                        ⚠️ Please verify all details before confirming
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
                            fullWidth
                            loading={loading}
                            onClick={handleTransfer}
                        >
                            {loading ? 'Processing...' : 'Confirm ✓'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default TransferPage;
