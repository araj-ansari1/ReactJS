import { ROLES } from './roles'

export const MOCK_USERS = [
    { id: 'u001', name: 'Arjun Sharma', email: 'admin@nexabank.com', password: 'admin123', role: ROLES.ADMIN, avatar: 'AS', phone: '+91 98765 43210', address: 'Lucknow, UP', accountNumber: 'NX-0001-ADMN', balance: 999999, joinDate: '2022-01-15', kycStatus: 'verified', isActive: true },
    { id: 'u002', name: 'Priya Singh', email: 'employee@nexabank.com', password: 'emp123', role: ROLES.EMPLOYEE, avatar: 'PS', phone: '+91 91234 56789', address: 'Kanpur, UP', accountNumber: 'NX-0002-EMPL', balance: 85000, joinDate: '2023-03-10', kycStatus: 'verified', isActive: true, department: 'Loans & Credit', employeeId: 'EMP-2023-042' },
    { id: 'u003', name: 'Rahul Verma', email: 'customer@nexabank.com', password: 'cust123', role: ROLES.CUSTOMER, avatar: 'RV', phone: '+91 99887 76655', address: 'Varanasi, UP', accountNumber: 'NX-0003-CUST', balance: 47500, joinDate: '2023-06-20', kycStatus: 'verified', isActive: true },
    { id: 'u004', name: 'Sneha Gupta', email: 'sneha@nexabank.com', password: 'sneha123', role: ROLES.CUSTOMER, avatar: 'SG', phone: '+91 88776 55443', address: 'Agra, UP', accountNumber: 'NX-0004-CUST', balance: 120000, joinDate: '2023-09-05', kycStatus: 'pending', isActive: true },
    { id: 'u005', name: 'Amit Kumar', email: 'amit@nexabank.com', password: 'amit123', role: ROLES.CUSTOMER, avatar: 'AK', phone: '+91 77665 44332', address: 'Allahabad, UP', accountNumber: 'NX-0005-CUST', balance: 8200, joinDate: '2024-01-12', kycStatus: 'rejected', isActive: false },
]

export const DEMO_CREDENTIALS = [
    { role: 'Admin', email: 'admin@nexabank.com', password: 'admin123', color: 'red', desc: 'Full system access' },
    { role: 'Employee', email: 'employee@nexabank.com', password: 'emp123', color: 'blue', desc: 'Staff dashboard access' },
    { role: 'Customer', email: 'customer@nexabank.com', password: 'cust123', color: 'green', desc: 'Personal banking access' },
]