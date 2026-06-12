import {
    ResponsiveContainer,
    LineChart as RLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';

// Custom tooltip styling
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-bank-card border border-gray-200 dark:border-bank-border rounded-xl p-3 shadow-lg">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    {label}
                </p>
                {payload.map((entry, i) => (
                    <p
                        key={i}
                        className="text-sm font-medium"
                        style={{ color: entry.color }}
                    >
                        {entry.name}: ₹{entry.value.toLocaleString('en-IN')}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const LineChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={280}>
        <RLineChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
            />
            <YAxis
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${v / 1000}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }} />
            <Line
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
            />
            <Line
                type="monotone"
                dataKey="expense"
                name="Expense"
                stroke="#ef4444"
                strokeWidth={2.5}
                dot={{ fill: '#ef4444', r: 4 }}
                activeDot={{ r: 6 }}
            />
        </RLineChart>
    </ResponsiveContainer>
);

export default LineChart;
