import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import { ROUTES } from '../../constants/routes';
import { ROLES } from '../../constants/roles';
import Button from '../../components/ui/Button';
import {
    isValidEmail,
    isValidPassword,
    isValidName,
} from '../../utils/validators';

const SignupPage = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: ROLES.CUSTOMER,
    });
    const [errors, setErrors] = useState({});
    const [showPass, setShowPass] = useState(false);

    const { signup, loading } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const update = (field, value) => {
        setForm((p) => ({ ...p, [field]: value }));
        setErrors((p) => ({ ...p, [field]: '' }));
    };

    const validate = () => {
        const e = {};
        if (!isValidName(form.name))
            e.name = 'Name must be at least 2 characters';
        if (!isValidEmail(form.email)) e.email = 'Invalid email format';
        if (!isValidPassword(form.password))
            e.password = 'Password must be at least 6 characters';
        if (!form.phone) e.phone = 'Phone number required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const result = await signup(form);

        if (result.success) {
            showToast(
                `Account created! Welcome, ${result.user.name} 🎉`,
                'success',
            );
            navigate(ROUTES.DASHBOARD);
        } else {
            showToast('Email already registered. Please login.', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-bank-dark flex items-center justify-center p-4">
            <div className="w-full max-w-md animate-bounce-in">
                {/* Logo */}
                <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                        <span className="text-primary-600 font-black text-xl">
                            N
                        </span>
                    </div>
                    <h1 className="text-2xl font-black text-white">
                        Create Account
                    </h1>
                    <p className="text-primary-200 mt-1 text-sm">
                        Join NexaBank today
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-bank-card rounded-2xl shadow-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => update('name', e.target.value)}
                                placeholder="Rahul Verma"
                                className={`input-field ${errors.name ? 'border-red-400' : ''}`}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) =>
                                    update('email', e.target.value)
                                }
                                placeholder="rahul@email.com"
                                className={`input-field ${errors.email ? 'border-red-400' : ''}`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={form.phone}
                                onChange={(e) =>
                                    update('phone', e.target.value)
                                }
                                placeholder="9876543210"
                                className={`input-field ${errors.phone ? 'border-red-400' : ''}`}
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={(e) =>
                                        update('password', e.target.value)
                                    }
                                    placeholder="Min 6 characters"
                                    className={`input-field pr-12 ${errors.password ? 'border-red-400' : ''}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass((p) => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
                                >
                                    {showPass ? '🙈' : '👁️'}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Role select */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Account Type
                            </label>
                            <select
                                value={form.role}
                                onChange={(e) => update('role', e.target.value)}
                                className="input-field"
                            >
                                <option value={ROLES.CUSTOMER}>Customer</option>
                                <option value={ROLES.EMPLOYEE}>Employee</option>
                                <option value={ROLES.ADMIN}>Admin</option>
                            </select>
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            fullWidth
                            loading={loading}
                            size="lg"
                            className="mt-2"
                        >
                            {loading
                                ? 'Creating Account...'
                                : 'Create Account 🎉'}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                        Already have an account?{' '}
                        <Link
                            to={ROUTES.LOGIN}
                            className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
