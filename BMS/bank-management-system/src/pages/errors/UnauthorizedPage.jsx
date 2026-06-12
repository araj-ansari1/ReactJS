import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { ROUTES } from '../../constants/routes';
import useAuth from '../../hooks/useAuth';

const UnauthorizedPage = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-bank-darker flex items-center justify-center p-4">
            <div className="text-center animate-bounce-in">
                <div className="text-[120px] lg:text-[180px] font-black text-red-50 dark:text-red-900/20 leading-none select-none">
                    403
                </div>

                <div className="text-6xl mb-6 -mt-8">🚫</div>

                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    Access Denied
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mb-2 max-w-md mx-auto">
                    Aapke paas is page ko dekhne ki permission nahi hai.
                </p>
                {currentUser && (
                    <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">
                        Current Role:
                        <span className="ml-1 font-semibold text-primary-600 dark:text-primary-400 capitalize">
                            {currentUser.role}
                        </span>
                    </p>
                )}

                <div className="flex items-center justify-center gap-3">
                    <Button onClick={() => navigate(-1)} variant="secondary">
                        ← Go Back
                    </Button>
                    <Button onClick={() => navigate(ROUTES.DASHBOARD)}>
                        🏠 Dashboard
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
