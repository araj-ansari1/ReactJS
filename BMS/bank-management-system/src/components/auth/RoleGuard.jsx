import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { ROLES } from '../../constants/roles';

const RoleGuard = ({ children, allowedRoles = [] }) => {
    const { currentUser } = useAuth();

    if (!currentUser) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    if (!allowedRoles.includes(currentUser.role)) {
        return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
    }

    return children;
};

export default RoleGuard;
