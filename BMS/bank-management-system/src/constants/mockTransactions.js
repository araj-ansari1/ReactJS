export const MOCK_TRANSACTIONS = [
    { id: 'txn001', userId: 'u003', type: 'credit', amount: 25000, description: 'Salary Credit', category: 'salary', date: '2024-11-01', time: '09:15 AM', status: 'completed', fromAccount: 'TechCorp Ltd', toAccount: 'NX-0003-CUST', reference: 'REF001' },
    { id: 'txn002', userId: 'u003', type: 'debit', amount: 4500, description: 'Electricity Bill', category: 'utilities', date: '2024-11-03', time: '02:30 PM', status: 'completed', fromAccount: 'NX-0003-CUST', toAccount: 'UPPCL', reference: 'REF002' },
    { id: 'txn003', userId: 'u003', type: 'debit', amount: 1200, description: 'Swiggy Food Order', category: 'food', date: '2024-11-05', time: '08:45 PM', status: 'completed', fromAccount: 'NX-0003-CUST', toAccount: 'Swiggy', reference: 'REF003' },
    { id: 'txn004', userId: 'u003', type: 'credit', amount: 5000, description: 'Transfer from Sneha', category: 'transfer', date: '2024-11-07', time: '11:00 AM', status: 'completed', fromAccount: 'NX-0004-CUST', toAccount: 'NX-0003-CUST', reference: 'REF004' },
    { id: 'txn005', userId: 'u003', type: 'debit', amount: 15000, description: 'Rent Payment', category: 'housing', date: '2024-11-08', time: '10:00 AM', status: 'completed', fromAccount: 'NX-0003-CUST', toAccount: 'Mohan Lal', reference: 'REF005' },
    { id: 'txn006', userId: 'u003', type: 'debit', amount: 2300, description: 'Amazon Shopping', category: 'shopping', date: '2024-11-10', time: '03:20 PM', status: 'pending', fromAccount: 'NX-0003-CUST', toAccount: 'Amazon Pay', reference: 'REF006' },
    { id: 'txn007', userId: 'u003', type: 'debit', amount: 500, description: 'ATM Withdrawal', category: 'cash', date: '2024-11-12', time: '06:00 PM', status: 'completed', fromAccount: 'NX-0003-CUST', toAccount: 'ATM-SBI', reference: 'REF007' },
    { id: 'txn008', userId: 'u003', type: 'credit', amount: 800, description: 'Cashback Reward', category: 'reward', date: '2024-11-13', time: '12:00 PM', status: 'completed', fromAccount: 'NexaBank', toAccount: 'NX-0003-CUST', reference: 'REF008' },
    { id: 'txn009', userId: 'u003', type: 'debit', amount: 3200, description: 'Mobile Recharge', category: 'utilities', date: '2024-11-15', time: '05:45 PM', status: 'failed', fromAccount: 'NX-0003-CUST', toAccount: 'Airtel', reference: 'REF009' },
    { id: 'txn010', userId: 'u003', type: 'debit', amount: 7500, description: 'LIC Premium', category: 'insurance', date: '2024-11-18', time: '11:30 AM', status: 'completed', fromAccount: 'NX-0003-CUST', toAccount: 'LIC India', reference: 'REF010' },
]

export const MONTHLY_DATA = [
    { month: 'Jun', income: 25000, expense: 18000 },
    { month: 'Jul', income: 28000, expense: 22000 },
    { month: 'Aug', income: 25000, expense: 19500 },
    { month: 'Sep', income: 30000, expense: 24000 },
    { month: 'Oct', income: 25000, expense: 20000 },
    { month: 'Nov', income: 33800, expense: 34200 },
]

export const SPENDING_CATEGORIES = [
    { name: 'Housing', value: 15000, color: '#3b82f6' },
    { name: 'Food', value: 4200, color: '#f59e0b' },
    { name: 'Utilities', value: 7700, color: '#10b981' },
    { name: 'Shopping', value: 2300, color: '#8b5cf6' },
    { name: 'Insurance', value: 7500, color: '#ef4444' },
    { name: 'Others', value: 2500, color: '#6b7280' },
]