import Badge from './Badge';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

// Transaction table — reusable
const Table = ({ transactions = [] }) => {
    const statusVariant = {
        completed: 'success',
        pending: 'pending',
        failed: 'failed',
    };

    if (transactions.length === 0) {
        return (
            <div className="text-center py-12 text-gray-400 dark:text-gray-500">
                <p className="text-4xl mb-3">📭</p>
                <p className="font-medium">No transactions found</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-200 dark:border-bank-border">
                        {[
                            'Description',
                            'Date',
                            'Amount',
                            'Status',
                            'Reference',
                        ].map((h) => (
                            <th
                                key={h}
                                className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-bank-border">
                    {transactions.map((txn) => (
                        <tr
                            key={txn.id}
                            className="hover:bg-gray-50 dark:hover:bg-bank-border/20 transition-colors"
                        >
                            {/* Description + category */}
                            <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm ${txn.type === 'credit' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-red-100 dark:bg-red-900/30 text-red-500'}`}
                                    >
                                        {txn.type === 'credit' ? '↓' : '↑'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {txn.description}
                                        </p>
                                        <p className="text-xs text-gray-400 capitalize">
                                            {txn.category}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            {/* Date */}
                            <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(txn.date)}
                                <p className="text-xs text-gray-400">
                                    {txn.time}
                                </p>
                            </td>
                            {/* Amount */}
                            <td className="py-4 px-4">
                                <span
                                    className={`text-sm font-semibold ${txn.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                                >
                                    {txn.type === 'credit' ? '+' : '-'}
                                    {formatCurrency(txn.amount)}
                                </span>
                            </td>
                            {/* Status */}
                            <td className="py-4 px-4">
                                <Badge
                                    variant={
                                        statusVariant[txn.status] || 'gray'
                                    }
                                >
                                    {txn.status}
                                </Badge>
                            </td>
                            {/* Reference */}
                            <td className="py-4 px-4 text-xs text-gray-400 font-mono">
                                {txn.reference}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
