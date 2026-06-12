import { createContext, useState } from 'react';
import { MOCK_USERS } from '../constants/mockUsers';
import { generateToken, isTokenExpired } from '../utils/fakeJwt';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // localStorage se user aur token load karo — session persistence
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const saved = localStorage.getItem('bank_user');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const [token, setToken] = useState(() => {
        const t = localStorage.getItem('bank_token');
        // Expired token ko ignore karo
        if (t && !isTokenExpired(t)) return t;
        return null;
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // LOGIN function
    const login = async (email, password) => {
        setLoading(true);
        setError('');

        // Fake API delay — 1 second
        await new Promise((res) => setTimeout(res, 1000));

        // Mock users mein se match dhundho
        const user = MOCK_USERS.find(
            (u) => u.email === email && u.password === password,
        );

        if (!user) {
            setError('Invalid email or password');
            setLoading(false);
            return { success: false };
        }

        if (!user.isActive) {
            setError('Your account has been deactivated');
            setLoading(false);
            return { success: false };
        }

        // Password remove karke save karo — security
        const { password: _, ...safeUser } = user;
        const newToken = generateToken(safeUser);

        setCurrentUser(safeUser);
        setToken(newToken);

        // localStorage mein save karo — page refresh par bhi logged in rahe
        localStorage.setItem('bank_user', JSON.stringify(safeUser));
        localStorage.setItem('bank_token', newToken);

        setLoading(false);
        return { success: true, user: safeUser };
    };

    // SIGNUP function
    const signup = async (userData) => {
        setLoading(true);
        setError('');

        await new Promise((res) => setTimeout(res, 1000));

        // Email already exist karta hai check karo
        const exists = MOCK_USERS.find((u) => u.email === userData.email);
        if (exists) {
            setError('Email already registered');
            setLoading(false);
            return { success: false };
        }

        // Naya user banao
        const newUser = {
            id: `u00${MOCK_USERS.length + 1}`,
            ...userData,
            avatar: userData.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase(),
            accountNumber: `NX-000${MOCK_USERS.length + 1}-CUST`,
            balance: 5000,
            joinDate: new Date().toISOString().split('T')[0],
            kycStatus: 'pending',
            isActive: true,
        };

        // Mock array mein push karo (page refresh par reset hoga — real app mein DB mein save hoga)
        MOCK_USERS.push(newUser);

        const { password: _, ...safeUser } = newUser;
        const newToken = generateToken(safeUser);

        setCurrentUser(safeUser);
        setToken(newToken);
        localStorage.setItem('bank_user', JSON.stringify(safeUser));
        localStorage.setItem('bank_token', newToken);

        setLoading(false);
        return { success: true, user: safeUser };
    };

    // LOGOUT function
    const logout = () => {
        setCurrentUser(null);
        setToken(null);
        localStorage.removeItem('bank_user');
        localStorage.removeItem('bank_token');
    };

    const isAuthenticated = !!currentUser && !!token;

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                token,
                loading,
                error,
                login,
                signup,
                logout,
                isAuthenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
