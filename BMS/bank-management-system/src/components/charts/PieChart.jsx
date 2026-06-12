import {
    ResponsiveContainer,
    PieChart as RPieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-bank-card border border-gray-200 dark:border-bank-border rounded-xl p-3 shadow-lg">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {payload[0].name}
                </p>
                <p className="text-sm text-gray-500">
                    ₹{payload[0].value.toLocaleString('en-IN')}
                </p>
            </div>
        );
    }
    return null;
};

const PieChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={280}>
        <RPieChart>
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={3}
                dataKey="value"
            >
                {data.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
                formatter={(value) => (
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                        {value}
                    </span>
                )}
            />
        </RPieChart>
    </ResponsiveContainer>
);

export default PieChart;
