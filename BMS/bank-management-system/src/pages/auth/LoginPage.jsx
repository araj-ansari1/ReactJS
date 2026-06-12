import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import { ROUTES } from '../../constants/routes';
import { DEMO_CREDENTIALS } from '../../constants/mockUsers';
import Button from '../../components/ui/Button';
import { isValidEmail } from '../../utils/validators';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [showPass, setShowPass] = useState(false);

    const { login, loading, isAuthenticated } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    // Agar already logged in hai toh dashboard par bhejo
    useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from?.pathname || ROUTES.DASHBOARD;
            navigate(from, { replace: true });
        }
    }, [isAuthenticated]);

    // Form validation
    const validate = () => {
        const newErrors = {};
        if (!email) newErrors.email = 'Email required';
        else if (!isValidEmail(email)) newErrors.email = 'Invalid email format';
        if (!password) newErrors.password = 'Password required';
        else if (password.length < 6) newErrors.password = 'Min 6 characters';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const result = await login(email, password);

        if (result.success) {
            showToast(`Welcome back, ${result.user.name}! 👋`, 'success');
            const from = location.state?.from?.pathname || ROUTES.DASHBOARD;
            navigate(from, { replace: true });
        } else {
            showToast('Invalid credentials. Please try again.', 'error');
        }
    };

    // Demo credential card click — auto fill karo
    const handleDemoLogin = (cred) => {
        setEmail(cred.email);
        setPassword(cred.password);
        setErrors({});
    };

    const demoColors = {
        red: 'border-red-200   dark:border-red-800   hover:bg-red-50   dark:hover:bg-red-900/20   text-red-700   dark:text-red-400',
        blue: 'border-blue-200  dark:border-blue-800  hover:bg-blue-50  dark:hover:bg-blue-900/20  text-blue-700  dark:text-blue-400',
        green: 'border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/20 text-green-700 dark:text-green-400',
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-bank-dark flex items-center justify-center p-4">
            <div className="w-full max-w-md animate-bounce-in">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-primary-600 font-black text-2xl">
                            N
                        </span>
                    </div>
                    <h1 className="text-3xl font-black text-white">NexaBank</h1>
                    <p className="text-primary-200 mt-1 text-sm">
                        Secure Modern Banking
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-bank-card rounded-2xl shadow-2xl p-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                        Sign in to your account
                    </h2>

                    {/* Demo credentials */}
                    <div className="mb-6">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                            Quick Demo Login
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            {DEMO_CREDENTIALS.map((cred) => (
                                <button
                                    key={cred.role}
                                    onClick={() => handleDemoLogin(cred)}
                                    className={`p-2.5 rounded-xl border-2 text-center transition-all duration-200 active:scale-95 ${demoColors[cred.color]}`}
                                >
                                    <p className="text-xs font-bold">
                                        {cred.role}
                                    </p>
                                    <p className="text-xs opacity-70 mt-0.5">
                                        {cred.desc}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1 h-px bg-gray-200 dark:bg-bank-border" />
                        <span className="text-xs text-gray-400">
                            or enter manually
                        </span>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-bank-border" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setErrors((p) => ({ ...p, email: '' }));
                                }}
                                placeholder="you@nexabank.com"
                                className={`input-field ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.email}
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
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setErrors((p) => ({
                                            ...p,
                                            password: '',
                                        }));
                                    }}
                                    placeholder="••••••••"
                                    className={`input-field pr-12 ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
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

                        {/* Submit */}
                        <Button
                            type="submit"
                            fullWidth
                            loading={loading}
                            size="lg"
                            className="mt-2"
                        >
                            {loading ? 'Signing in...' : 'Sign In →'}
                        </Button>
                    </form>

                    {/* Signup link */}
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                        Don't have an account?{' '}
                        <Link
                            to={ROUTES.SIGNUP}
                            className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
                        >
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
