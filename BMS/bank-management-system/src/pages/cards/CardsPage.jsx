import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import { MOCK_CARDS } from '../../constants/mockCards';
import { formatCurrency } from '../../utils/formatCurrency';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

const CARD_TYPES = [
    {
        id: 'visa-debit',
        name: 'Visa Debit Card',
        type: 'debit',
        network: 'visa',
        color: 'from-blue-600 to-blue-800',
        icon: '💳',
        features: [
            'Free ATM withdrawals',
            'Online shopping',
            'Contactless pay',
            'No annual fee',
        ],
        annualFee: 0,
        limit: null,
        desc: 'Basic debit card for everyday use',
    },
    {
        id: 'mastercard-credit',
        name: 'Mastercard Credit Card',
        type: 'credit',
        network: 'mastercard',
        color: 'from-gray-800 to-gray-900',
        icon: '💎',
        features: [
            '₹2L credit limit',
            '1% cashback',
            'EMI facility',
            'Lounge access',
        ],
        annualFee: 999,
        limit: 200000,
        desc: 'Standard credit card with cashback rewards',
    },
    {
        id: 'visa-platinum',
        name: 'Visa Platinum Credit',
        type: 'credit',
        network: 'visa',
        color: 'from-purple-600 to-purple-900',
        icon: '👑',
        features: [
            '₹5L credit limit',
            '2% cashback',
            'Travel insurance',
            'Priority support',
        ],
        annualFee: 2999,
        limit: 500000,
        desc: 'Premium card with exclusive benefits',
    },
    {
        id: 'rupay-debit',
        name: 'RuPay Debit Card',
        type: 'debit',
        network: 'rupay',
        color: 'from-green-600 to-green-800',
        icon: '🏦',
        features: [
            'Zero charges',
            'UPI linked',
            'Govt scheme eligible',
            'Wide acceptance',
        ],
        annualFee: 0,
        limit: null,
        desc: 'Indian payment network card',
    },
];

const CardsPage = () => {
    const { currentUser } = useAuth();
    const { showToast } = useToast();

    const [cards, setCards] = useState(MOCK_CARDS);
    const [selectedCard, setSelectedCard] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [freezeModal, setFreezeModal] = useState(false);
    const [cardToFreeze, setCardToFreeze] = useState(null);
    const [applyModal, setApplyModal] = useState(false);
    const [selectedType, setSelectedType] = useState(null);
    const [confirmModal, setConfirmModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [newCardData, setNewCardData] = useState(null);

    // Apply form
    const [applyForm, setApplyForm] = useState({
        purpose: '',
        income: '',
        agreeTerms: false,
    });
    const [applyErrors, setApplyErrors] = useState({});

    const myCards = cards.filter((c) => c.userId === currentUser?.id);

    // ===== FREEZE =====
    const handleFreeze = (card) => {
        setCardToFreeze(card);
        setFreezeModal(true);
    };

    const confirmFreeze = () => {
        setCards((prev) =>
            prev.map((c) =>
                c.id === cardToFreeze.id ? { ...c, isActive: !c.isActive } : c,
            ),
        );
        showToast(
            cardToFreeze.isActive ? `Card frozen 🥶` : `Card activated ✅`,
            cardToFreeze.isActive ? 'warning' : 'success',
        );
        setFreezeModal(false);
    };

    // ===== SELECT CARD TYPE =====
    const handleSelectType = (cardType) => {
        setSelectedType(cardType);
        setApplyForm({ purpose: '', income: '', agreeTerms: false });
        setApplyErrors({});
    };

    // ===== VALIDATE APPLY FORM =====
    const validateApply = () => {
        const e = {};
        if (!applyForm.purpose.trim()) e.purpose = 'Purpose required';
        if (!applyForm.income) e.income = 'Income required';
        else if (Number(applyForm.income) < 10000)
            e.income = 'Min income ₹10,000';
        if (!applyForm.agreeTerms) e.terms = 'Terms agree karna zaroori hai';
        setApplyErrors(e);
        return Object.keys(e).length === 0;
    };

    // ===== SUBMIT APPLICATION =====
    const handleApplySubmit = async () => {
        if (!validateApply()) return;
        setLoading(true);
        await new Promise((res) => setTimeout(res, 1500));

        // New card generate karo
        const cardNum = `${Math.floor(1000 + Math.random() * 9000)} •••• •••• ${Math.floor(1000 + Math.random() * 9000)}`;
        const expYear = new Date().getFullYear() + 4;
        const expMonth = String(new Date().getMonth() + 1).padStart(2, '0');

        const newCard = {
            id: `card${Date.now()}`,
            userId: currentUser?.id,
            type: selectedType.type,
            cardNumber: cardNum,
            holderName: currentUser?.name?.toUpperCase(),
            expiry: `${expMonth}/${String(expYear).slice(2)}`,
            cvv: '***',
            network: selectedType.network,
            color: selectedType.color,
            isActive: true,
            balance: selectedType.type === 'debit' ? currentUser?.balance : 0,
            limit: selectedType.limit,
            usedAmount: selectedType.type === 'credit' ? 0 : undefined,
        };

        setNewCardData(newCard);
        setCards((prev) => [...prev, newCard]);
        setLoading(false);
        setConfirmModal(false);
        setApplyModal(false);
        setSuccessModal(true);
        showToast(`${selectedType.name} approved! 🎉`, 'success');
    };

    return (
        <div className="space-y-6">
            {/* ===== HEADER ===== */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        My Cards 💳
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {myCards.length} card(s) — click to manage
                    </p>
                </div>
                <Button
                    onClick={() => {
                        setSelectedType(null);
                        setApplyModal(true);
                    }}
                >
                    + Apply New Card
                </Button>
            </div>

            {/* ===== MY CARDS ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myCards.map((card) => (
                    <div key={card.id} className="space-y-4">
                        {/* Card Visual */}
                        <div
                            className={`relative w-full rounded-2xl bg-gradient-to-br ${card.color} p-6 text-white shadow-xl cursor-pointer transition-transform duration-300 hover:scale-105 ${!card.isActive ? 'opacity-60 grayscale' : ''}`}
                            style={{ aspectRatio: '1.586 / 1' }}
                            onClick={() => {
                                setSelectedCard(card);
                                setShowDetails(true);
                            }}
                        >
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                {/* Top */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-white/70 text-xs font-medium uppercase tracking-widest">
                                            NexaBank
                                        </p>
                                        <p className="text-white font-bold text-sm capitalize mt-0.5">
                                            {card.type} Card
                                        </p>
                                    </div>
                                    <div>
                                        {card.network === 'visa' ? (
                                            <span className="text-white font-black text-xl italic">
                                                VISA
                                            </span>
                                        ) : card.network === 'mastercard' ? (
                                            <div className="flex items-center">
                                                <div className="w-7 h-7 bg-red-500 rounded-full opacity-90" />
                                                <div className="w-7 h-7 bg-yellow-400 rounded-full -ml-3 opacity-90" />
                                            </div>
                                        ) : (
                                            <span className="text-white font-black text-sm">
                                                RuPay
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {/* Chip */}
                                <div className="w-10 h-8 bg-yellow-300/80 rounded-md flex items-center justify-center">
                                    <div className="grid grid-cols-2 gap-0.5">
                                        {[...Array(4)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-2 h-2 bg-yellow-600/60 rounded-sm"
                                            />
                                        ))}
                                    </div>
                                </div>
                                {/* Card number */}
                                <p className="text-white font-mono text-lg tracking-widest font-bold">
                                    {card.cardNumber}
                                </p>
                                {/* Bottom */}
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-white/60 text-xs uppercase tracking-wider mb-0.5">
                                            Card Holder
                                        </p>
                                        <p className="text-white font-semibold text-sm tracking-wider">
                                            {card.holderName}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white/60 text-xs uppercase tracking-wider mb-0.5">
                                            Expires
                                        </p>
                                        <p className="text-white font-semibold text-sm">
                                            {card.expiry}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {!card.isActive && (
                                <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center">
                                    <div className="text-center">
                                        <p className="text-4xl mb-1">🥶</p>
                                        <p className="text-white font-bold text-sm">
                                            Card Frozen
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Card Info */}
                        <div className="section-card p-4">
                            {card.type === 'credit' ? (
                                <div className="mb-3">
                                    <div className="flex justify-between text-sm mb-1.5">
                                        <span className="text-gray-400">
                                            Credit Used
                                        </span>
                                        <span className="font-semibold text-gray-700">
                                            {formatCurrency(
                                                card.usedAmount || 0,
                                            )}{' '}
                                            / {formatCurrency(card.limit)}
                                        </span>
                                    </div>
                                    <div
                                        className="w-full h-2.5 rounded-full overflow-hidden"
                                        style={{ backgroundColor: '#f3f4f6' }}
                                    >
                                        <div
                                            className="h-full rounded-full transition-all"
                                            style={{
                                                width: `${((card.usedAmount || 0) / card.limit) * 100}%`,
                                                backgroundColor:
                                                    (card.usedAmount || 0) /
                                                        card.limit >
                                                    0.8
                                                        ? '#ef4444'
                                                        : (card.usedAmount ||
                                                                0) /
                                                                card.limit >
                                                            0.5
                                                          ? '#f59e0b'
                                                          : '#22c55e',
                                            }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                                        <span>
                                            Available:{' '}
                                            {formatCurrency(card.balance || 0)}
                                        </span>
                                        <span>
                                            {Math.round(
                                                ((card.usedAmount || 0) /
                                                    card.limit) *
                                                    100,
                                            )}
                                            % used
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm text-gray-400">
                                        Balance
                                    </span>
                                    <span className="font-bold text-gray-900">
                                        {formatCurrency(card.balance || 0)}
                                    </span>
                                </div>
                            )}
                            <div
                                className="flex items-center justify-between pt-3"
                                style={{ borderTop: '1px solid #f3f4f6' }}
                            >
                                <Badge
                                    variant={
                                        card.isActive ? 'success' : 'failed'
                                    }
                                >
                                    {card.isActive ? '● Active' : '● Frozen'}
                                </Badge>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => {
                                            setSelectedCard(card);
                                            setShowDetails(true);
                                        }}
                                    >
                                        Details
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={
                                            card.isActive ? 'danger' : 'success'
                                        }
                                        onClick={() => handleFreeze(card)}
                                    >
                                        {card.isActive
                                            ? '🥶 Freeze'
                                            : '✅ Unfreeze'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ===== FEATURES ===== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    {
                        icon: '🛡️',
                        title: 'Secure Payments',
                        desc: '256-bit encryption on all transactions',
                    },
                    {
                        icon: '🌍',
                        title: 'Global Acceptance',
                        desc: 'Use anywhere Visa/Mastercard accepted',
                    },
                    {
                        icon: '📱',
                        title: 'Contactless Pay',
                        desc: 'Tap & pay with NFC technology',
                    },
                    {
                        icon: '🔔',
                        title: 'Instant Alerts',
                        desc: 'Real-time SMS & email notifications',
                    },
                ].map((f) => (
                    <div key={f.title} className="stat-card text-center">
                        <div className="text-3xl mb-3">{f.icon}</div>
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">
                            {f.title}
                        </h3>
                        <p className="text-xs text-gray-400">{f.desc}</p>
                    </div>
                ))}
            </div>

            {/* ===========================
          APPLY NEW CARD MODAL
      =========================== */}
            <Modal
                isOpen={applyModal}
                onClose={() => {
                    setApplyModal(false);
                    setSelectedType(null);
                }}
                title="Apply for New Card"
                size="lg"
            >
                <div className="space-y-5">
                    {/* Step indicator */}
                    <div className="flex items-center gap-2">
                        <div
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                            style={{
                                backgroundColor: !selectedType
                                    ? '#eff6ff'
                                    : '#f0fdf4',
                                color: !selectedType ? '#2563eb' : '#16a34a',
                            }}
                        >
                            {!selectedType
                                ? '1️⃣ Card Type Choose Karo'
                                : '✅ Card Selected'}
                        </div>
                        <div
                            className="h-px flex-1"
                            style={{ backgroundColor: '#e5e7eb' }}
                        />
                        <div
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                            style={{
                                backgroundColor: selectedType
                                    ? '#eff6ff'
                                    : '#f9fafb',
                                color: selectedType ? '#2563eb' : '#9ca3af',
                            }}
                        >
                            2️⃣ Details Fill Karo
                        </div>
                    </div>

                    {/* ===== STEP 1 — Choose Card Type ===== */}
                    {!selectedType && (
                        <div>
                            <p className="text-sm text-gray-500 mb-4">
                                Apni zaroorat ke hisaab se card choose karo:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {CARD_TYPES.map((cardType) => (
                                    <button
                                        key={cardType.id}
                                        onClick={() =>
                                            handleSelectType(cardType)
                                        }
                                        className="text-left p-4 rounded-xl border-2 transition-all duration-200 active:scale-95 group"
                                        style={{
                                            borderColor: '#e5e7eb',
                                            backgroundColor: '#ffffff',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor =
                                                '#2563eb';
                                            e.currentTarget.style.backgroundColor =
                                                '#eff6ff';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor =
                                                '#e5e7eb';
                                            e.currentTarget.style.backgroundColor =
                                                '#ffffff';
                                        }}
                                    >
                                        {/* Card preview mini */}
                                        <div
                                            className={`w-full h-16 rounded-xl bg-gradient-to-br ${cardType.color} mb-3 flex items-center justify-center`}
                                        >
                                            <span className="text-2xl">
                                                {cardType.icon}
                                            </span>
                                        </div>

                                        <p className="font-bold text-gray-900 text-sm">
                                            {cardType.name}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5 mb-2">
                                            {cardType.desc}
                                        </p>

                                        <div className="space-y-1">
                                            {cardType.features.map((f, i) => (
                                                <p
                                                    key={i}
                                                    className="text-xs text-gray-500 flex items-center gap-1"
                                                >
                                                    <span
                                                        style={{
                                                            color: '#22c55e',
                                                        }}
                                                    >
                                                        ✓
                                                    </span>{' '}
                                                    {f}
                                                </p>
                                            ))}
                                        </div>

                                        <div
                                            className="mt-3 pt-2 flex justify-between items-center"
                                            style={{
                                                borderTop: '1px solid #f3f4f6',
                                            }}
                                        >
                                            <span className="text-xs text-gray-400">
                                                Annual Fee
                                            </span>
                                            <span
                                                className="text-sm font-bold"
                                                style={{
                                                    color:
                                                        cardType.annualFee === 0
                                                            ? '#16a34a'
                                                            : '#111827',
                                                }}
                                            >
                                                {cardType.annualFee === 0
                                                    ? 'FREE'
                                                    : `₹${cardType.annualFee}`}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ===== STEP 2 — Fill Details ===== */}
                    {selectedType && (
                        <div className="space-y-4">
                            {/* Selected card preview */}
                            <div
                                className="flex items-center gap-3 p-3 rounded-xl border"
                                style={{
                                    backgroundColor: '#f9fafb',
                                    borderColor: '#e5e7eb',
                                }}
                            >
                                <div
                                    className={`w-14 h-10 rounded-lg bg-gradient-to-br ${selectedType.color} flex items-center justify-center flex-shrink-0`}
                                >
                                    <span className="text-lg">
                                        {selectedType.icon}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-900">
                                        {selectedType.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {selectedType.annualFee === 0
                                            ? 'No annual fee'
                                            : `₹${selectedType.annualFee}/year`}
                                        {selectedType.limit &&
                                            ` • ₹${(selectedType.limit / 100000).toFixed(0)}L limit`}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedType(null)}
                                    className="text-xs font-medium px-2 py-1 rounded-lg transition-colors"
                                    style={{
                                        color: '#2563eb',
                                        backgroundColor: '#eff6ff',
                                    }}
                                >
                                    Change
                                </button>
                            </div>

                            {/* Purpose */}
                            <div>
                                <label className="form-label">
                                    Purpose of Card *
                                </label>
                                <select
                                    value={applyForm.purpose}
                                    onChange={(e) => {
                                        setApplyForm((p) => ({
                                            ...p,
                                            purpose: e.target.value,
                                        }));
                                        setApplyErrors((p) => ({
                                            ...p,
                                            purpose: '',
                                        }));
                                    }}
                                    className={`input-field ${applyErrors.purpose ? 'border-red-400' : ''}`}
                                >
                                    <option value="">
                                        -- Select purpose --
                                    </option>
                                    <option value="shopping">
                                        🛒 Online Shopping
                                    </option>
                                    <option value="travel">
                                        ✈️ Travel & Hotels
                                    </option>
                                    <option value="bills">
                                        💡 Bill Payments
                                    </option>
                                    <option value="business">
                                        💼 Business Expenses
                                    </option>
                                    <option value="daily">🏪 Daily Use</option>
                                    <option value="emergency">
                                        🚨 Emergency Fund
                                    </option>
                                </select>
                                {applyErrors.purpose && (
                                    <p className="form-error">
                                        {applyErrors.purpose}
                                    </p>
                                )}
                            </div>

                            {/* Monthly Income */}
                            <div>
                                <label className="form-label">
                                    Monthly Income (₹) *
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
                                        value={applyForm.income}
                                        onChange={(e) => {
                                            setApplyForm((p) => ({
                                                ...p,
                                                income: e.target.value,
                                            }));
                                            setApplyErrors((p) => ({
                                                ...p,
                                                income: '',
                                            }));
                                        }}
                                        placeholder="25000"
                                        min="0"
                                        className={`input-field pl-8 ${applyErrors.income ? 'border-red-400' : ''}`}
                                    />
                                </div>
                                {applyErrors.income && (
                                    <p className="form-error">
                                        {applyErrors.income}
                                    </p>
                                )}
                                <p className="text-xs text-gray-400 mt-1">
                                    Minimum ₹10,000 monthly income required
                                </p>
                            </div>

                            {/* Terms */}
                            <div>
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={applyForm.agreeTerms}
                                        onChange={(e) => {
                                            setApplyForm((p) => ({
                                                ...p,
                                                agreeTerms: e.target.checked,
                                            }));
                                            setApplyErrors((p) => ({
                                                ...p,
                                                terms: '',
                                            }));
                                        }}
                                        className="mt-0.5 w-4 h-4 accent-blue-600"
                                    />
                                    <span className="text-sm text-gray-600">
                                        Main NexaBank ke{' '}
                                        <span style={{ color: '#2563eb' }}>
                                            Terms & Conditions
                                        </span>{' '}
                                        aur{' '}
                                        <span style={{ color: '#2563eb' }}>
                                            Privacy Policy
                                        </span>{' '}
                                        se agree karta/karti hoon
                                    </span>
                                </label>
                                {applyErrors.terms && (
                                    <p className="form-error">
                                        {applyErrors.terms}
                                    </p>
                                )}
                            </div>

                            {/* Summary */}
                            <div
                                className="p-4 rounded-xl"
                                style={{
                                    backgroundColor: '#f0fdf4',
                                    border: '1px solid #bbf7d0',
                                }}
                            >
                                <p
                                    className="text-xs font-semibold mb-2"
                                    style={{ color: '#15803d' }}
                                >
                                    Application Summary
                                </p>
                                <div className="space-y-1">
                                    {[
                                        {
                                            label: 'Card Type',
                                            value: selectedType.name,
                                        },
                                        {
                                            label: 'Network',
                                            value: selectedType.network.toUpperCase(),
                                        },
                                        {
                                            label: 'Annual Fee',
                                            value:
                                                selectedType.annualFee === 0
                                                    ? 'FREE'
                                                    : `₹${selectedType.annualFee}`,
                                        },
                                        {
                                            label: 'Approval',
                                            value: 'Instant (Mock)',
                                        },
                                    ].map((row) => (
                                        <div
                                            key={row.label}
                                            className="flex justify-between text-xs"
                                        >
                                            <span style={{ color: '#166534' }}>
                                                {row.label}
                                            </span>
                                            <span
                                                className="font-semibold"
                                                style={{ color: '#15803d' }}
                                            >
                                                {row.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="secondary"
                                    fullWidth
                                    onClick={() => {
                                        setApplyModal(false);
                                        setSelectedType(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    fullWidth
                                    loading={loading}
                                    onClick={handleApplySubmit}
                                >
                                    {loading ? 'Processing...' : '🚀 Apply Now'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>

            {/* ===========================
          SUCCESS MODAL
      =========================== */}
            <Modal
                isOpen={successModal}
                onClose={() => setSuccessModal(false)}
                title="Card Approved! 🎉"
                size="sm"
            >
                {newCardData && (
                    <div className="space-y-4 text-center">
                        <div
                            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
                            style={{ backgroundColor: '#f0fdf4' }}
                        >
                            <span className="text-4xl">🎉</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900">
                                Congratulations!
                            </h3>
                            <p className="text-gray-400 text-sm mt-1">
                                Aapka {selectedType?.name} approve ho gaya!
                            </p>
                        </div>

                        {/* New card preview */}
                        <div
                            className={`w-full rounded-2xl bg-gradient-to-br ${newCardData.color} p-5 text-white text-left shadow-xl`}
                            style={{ aspectRatio: '1.586 / 1' }}
                        >
                            <div className="h-full flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-white/70 text-xs uppercase tracking-widest">
                                            NexaBank
                                        </p>
                                        <p className="text-white font-bold text-sm capitalize mt-0.5">
                                            {newCardData.type} Card
                                        </p>
                                    </div>
                                    <span className="text-white font-black text-lg italic">
                                        {newCardData.network === 'visa'
                                            ? 'VISA'
                                            : newCardData.network ===
                                                'mastercard'
                                              ? 'MC'
                                              : 'RuPay'}
                                    </span>
                                </div>
                                <div className="w-10 h-7 bg-yellow-300/80 rounded-md" />
                                <p className="text-white font-mono text-base tracking-widest font-bold">
                                    {newCardData.cardNumber}
                                </p>
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-white/60 text-xs uppercase">
                                            Card Holder
                                        </p>
                                        <p className="text-white font-semibold text-sm">
                                            {newCardData.holderName}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white/60 text-xs uppercase">
                                            Expires
                                        </p>
                                        <p className="text-white font-semibold text-sm">
                                            {newCardData.expiry}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            className="p-3 rounded-xl text-left space-y-2"
                            style={{ backgroundColor: '#f9fafb' }}
                        >
                            {[
                                {
                                    label: 'Card Number',
                                    value: newCardData.cardNumber,
                                },
                                { label: 'Expiry', value: newCardData.expiry },
                                { label: 'Status', value: 'Active ✅' },
                                {
                                    label: 'Delivery',
                                    value: '3-5 business days',
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

                        <Button
                            fullWidth
                            onClick={() => {
                                setSuccessModal(false);
                                setSelectedType(null);
                            }}
                        >
                            View My Cards 💳
                        </Button>
                    </div>
                )}
            </Modal>

            {/* ===========================
          CARD DETAILS MODAL
      =========================== */}
            <Modal
                isOpen={showDetails}
                onClose={() => setShowDetails(false)}
                title="Card Details"
                size="sm"
            >
                {selectedCard && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            {[
                                {
                                    label: 'Card Type',
                                    value: `${selectedCard.type} Card`.toUpperCase(),
                                },
                                {
                                    label: 'Card Number',
                                    value: selectedCard.cardNumber,
                                },
                                {
                                    label: 'Card Holder',
                                    value: selectedCard.holderName,
                                },
                                { label: 'Expiry', value: selectedCard.expiry },
                                { label: 'CVV', value: '***' },
                                {
                                    label: 'Network',
                                    value: selectedCard.network.toUpperCase(),
                                },
                                {
                                    label: 'Status',
                                    value: selectedCard.isActive
                                        ? 'Active'
                                        : 'Frozen',
                                },
                            ].map((row) => (
                                <div
                                    key={row.label}
                                    className="flex justify-between py-2"
                                    style={{
                                        borderBottom: '1px solid #f3f4f6',
                                    }}
                                >
                                    <span className="text-sm text-gray-400">
                                        {row.label}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-900 font-mono">
                                        {row.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Button
                                fullWidth
                                variant="secondary"
                                onClick={() =>
                                    showToast('Card blocked!', 'warning')
                                }
                            >
                                🚫 Block
                            </Button>
                            <Button
                                fullWidth
                                onClick={() =>
                                    showToast('PIN change OTP sent!', 'success')
                                }
                            >
                                🔑 Change PIN
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* ===========================
          FREEZE CONFIRM MODAL
      =========================== */}
            <Modal
                isOpen={freezeModal}
                onClose={() => setFreezeModal(false)}
                title={
                    cardToFreeze?.isActive ? 'Freeze Card?' : 'Unfreeze Card?'
                }
                size="sm"
            >
                {cardToFreeze && (
                    <div className="space-y-4">
                        <div
                            className="p-4 rounded-xl text-center"
                            style={{
                                backgroundColor: cardToFreeze.isActive
                                    ? '#eff6ff'
                                    : '#f0fdf4',
                            }}
                        >
                            <p className="text-4xl mb-2">
                                {cardToFreeze.isActive ? '🥶' : '✅'}
                            </p>
                            <p className="text-sm font-medium text-gray-700">
                                {cardToFreeze.isActive
                                    ? 'Card freeze karne se saari transactions temporarily block ho jaengi.'
                                    : 'Card unfreeze karne se saari transactions restore ho jaengi.'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1 font-mono">
                                {cardToFreeze.cardNumber}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="secondary"
                                fullWidth
                                onClick={() => setFreezeModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                fullWidth
                                variant={
                                    cardToFreeze.isActive ? 'danger' : 'success'
                                }
                                onClick={confirmFreeze}
                            >
                                {cardToFreeze.isActive
                                    ? 'Yes, Freeze 🥶'
                                    : 'Yes, Unfreeze ✅'}
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CardsPage;
