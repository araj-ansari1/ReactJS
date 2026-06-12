import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { ROUTES } from '../../constants/routes';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-bank-darker flex items-center justify-center p-4">
            <div className="text-center animate-bounce-in">
                {/* 404 big text */}
                <div className="text-[120px] lg:text-[180px] font-black text-gray-100 dark:text-bank-card leading-none select-none">
                    404
                </div>

                {/* Icon */}
                <div className="text-6xl mb-6 -mt-8">🔍</div>

                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    Page Not Found
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    Aap jis page ko dhundh rahe hain woh exist nahi karta ya
                    move ho gaya hai.
                </p>

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

export default NotFoundPage;
