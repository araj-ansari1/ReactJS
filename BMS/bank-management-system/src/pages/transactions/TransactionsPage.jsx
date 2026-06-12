import { useState, useMemo } from 'react';
import useAuth from '../../hooks/useAuth';
import { MOCK_TRANSACTIONS } from '../../constants/mockTransactions';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const TransactionsPage = () => {
    const { currentUser } = useAuth();

    // Filter states
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all'); // all, credit, debit
    const [statusFilter, setStatusFilter] = useState('all'); // all, completed, pending, failed
    const [catFilter, setCatFilter] = useState('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    // Current user ki saari transactions
    const myTransactions = MOCK_TRANSACTIONS.filter(
        (t) => t.userId === currentUser?.id,
    );

    // Unique categories
    const categories = [
        'all',
        ...new Set(myTransactions.map((t) => t.category)),
    ];

    // Filtered transactions — useMemo se unnecessary recalculation rokein
    const filtered = useMemo(() => {
        return myTransactions.filter((t) => {
            const matchSearch =
                !search ||
                t.description.toLowerCase().includes(search.toLowerCase()) ||
                t.reference.toLowerCase().includes(search.toLowerCase());

            const matchType = typeFilter === 'all' || t.type === typeFilter;
            const matchStatus =
                statusFilter === 'all' || t.status === statusFilter;
            const matchCat = catFilter === 'all' || t.category === catFilter;

            const matchFrom = !dateFrom || t.date >= dateFrom;
            const matchTo = !dateTo || t.date <= dateTo;

            return (
                matchSearch &&
                matchType &&
                matchStatus &&
                matchCat &&
                matchFrom &&
                matchTo
            );
        });
    }, [
        myTransactions,
        search,
        typeFilter,
        statusFilter,
        catFilter,
        dateFrom,
        dateTo,
    ]);

    // Summary stats
    const totalCredit = filtered
        .filter((t) => t.type === 'credit')
        .reduce((s, t) => s + t.amount, 0);

    const totalDebit = filtered
        .filter((t) => t.type === 'debit')
        .reduce((s, t) => s + t.amount, 0);

    const resetFilters = () => {
        setSearch('');
        setTypeFilter('all');
        setStatusFilter('all');
        setCatFilter('all');
        setDateFrom('');
        setDateTo('');
    };

    const hasFilters =
        search ||
        typeFilter !== 'all' ||
        statusFilter !== 'all' ||
        catFilter !== 'all' ||
        dateFrom ||
        dateTo;

    return (
        <div className="space-y-6">
            {/* ===== HEADER ===== */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Transactions 📋
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {filtered.length} transactions found
                    </p>
                </div>
            </div>

            {/* ===== SUMMARY CARDS ===== */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="stat-card">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Total Transactions
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {filtered.length}
                    </p>
                </div>
                <div className="stat-card">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Total Credit
                    </p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        +{formatCurrency(totalCredit)}
                    </p>
                </div>
                <div className="stat-card">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Total Debit
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                        -{formatCurrency(totalDebit)}
                    </p>
                </div>
            </div>

            {/* ===== FILTERS ===== */}
            <div className="bg-white dark:bg-bank-card rounded-xl border border-gray-200 dark:border-bank-border p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                    {/* Search */}
                    <div className="xl:col-span-2">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="🔍 Search transactions..."
                            className="input-field"
                        />
                    </div>

                    {/* Type filter */}
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="input-field"
                    >
                        <option value="all">All Types</option>
                        <option value="credit">Credit</option>
                        <option value="debit">Debit</option>
                    </select>

                    {/* Status filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="input-field"
                    >
                        <option value="all">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                    </select>

                    {/* Category filter */}
                    <select
                        value={catFilter}
                        onChange={(e) => setCatFilter(e.target.value)}
                        className="input-field capitalize"
                    >
                        {categories.map((c) => (
                            <option key={c} value={c} className="capitalize">
                                {c === 'all' ? 'All Categories' : c}
                            </option>
                        ))}
                    </select>

                    {/* Reset button */}
                    <Button
                        variant={hasFilters ? 'danger' : 'secondary'}
                        onClick={resetFilters}
                        disabled={!hasFilters}
                        size="md"
                    >
                        {hasFilters ? '✕ Reset' : 'Filter'}
                    </Button>
                </div>

                {/* Date range */}
                <div className="flex flex-col sm:flex-row gap-3 mt-3">
                    <div className="flex items-center gap-2 flex-1">
                        <label className="text-xs text-gray-500 whitespace-nowrap">
                            From:
                        </label>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                        <label className="text-xs text-gray-500 whitespace-nowrap">
                            To:
                        </label>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="input-field"
                        />
                    </div>
                </div>
            </div>

            {/* ===== TRANSACTIONS TABLE ===== */}
            <div className="bg-white dark:bg-bank-card rounded-xl border border-gray-200 dark:border-bank-border p-6">
                <Table transactions={filtered} />
            </div>
        </div>
    );
};

export default TransactionsPage;
