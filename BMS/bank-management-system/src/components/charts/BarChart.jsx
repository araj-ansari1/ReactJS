import {
    ResponsiveContainer,
    BarChart as RBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-bank-card border border-gray-200 dark:border-bank-border rounded-xl p-3 shadow-lg">
                <p className="text-xs font-semibold text-gray-500 mb-2">
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

const BarChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={280}>
        <RBarChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            barGap={4}
        >
            <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                vertical={false}
            />
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
            <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(59,130,246,0.05)' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }} />
            <Bar
                dataKey="income"
                name="Income"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
            />
            <Bar
                dataKey="expense"
                name="Expense"
                fill="#f87171"
                radius={[6, 6, 0, 0]}
            />
        </RBarChart>
    </ResponsiveContainer>
);

export default BarChart;
