import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import Spinner from '../ui/Spinner';

// Agar user logged in nahi hai toh login page par bhejo
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!isAuthenticated) {
        // Current location save karo — login ke baad wapas aane ke liye
        return (
            <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
        );
    }

    return children;
};

export default ProtectedRoute;
