import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleGuard from './components/auth/RoleGuard';
import DashboardLayout from './components/layout/DashboardLayout';
import { ROUTES } from './constants/routes';
import { ROLES } from './constants/roles';

import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import TransactionsPage from './pages/transactions/TransactionsPage';
import TransferPage from './pages/transfer/TransferPage';
import CardsPage from './pages/cards/CardsPage';
import LoansPage from './pages/loans/LoansPage';
import ProfilePage from './pages/profile/ProfilePage';
import AdminPanel from './pages/admin/AdminPanel';
import UserManagement from './pages/admin/UserManagement';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import UnauthorizedPage from './pages/errors/UnauthorizedPage';
import NotFoundPage from './pages/errors/NotFoundPage';

import NotificationsPage from './pages/notifications/NotificationsPage';
import WithdrawPage from './pages/withdraw/WithdrawPage';
import DepositPage from './pages/deposit/DepositPage';
import EmployeeProfile from './pages/employee/EmployeeProfile';

const PageWrapper = ({ children }) => (
    <ProtectedRoute>
        <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
);

const App = () => {
    return (
        <ThemeProvider>
            <ToastProvider>
                <AuthProvider>
                    <BrowserRouter>
                        <Routes>
                            {/* Public Routes */}

                            <Route
                                path={ROUTES.WITHDRAW}
                                element={
                                    <PageWrapper>
                                        <RoleGuard
                                            allowedRoles={[
                                                ROLES.ADMIN,
                                                ROLES.EMPLOYEE,
                                            ]}
                                        >
                                            <WithdrawPage />
                                        </RoleGuard>
                                    </PageWrapper>
                                }
                            />
                            <Route
                                path={ROUTES.DEPOSIT}
                                element={
                                    <PageWrapper>
                                        <RoleGuard
                                            allowedRoles={[
                                                ROLES.ADMIN,
                                                ROLES.EMPLOYEE,
                                            ]}
                                        >
                                            <DepositPage />
                                        </RoleGuard>
                                    </PageWrapper>
                                }
                            />
                            <Route
                                path={ROUTES.EMPLOYEE_PROFILE}
                                element={
                                    <PageWrapper>
                                        <RoleGuard
                                            allowedRoles={[ROLES.EMPLOYEE]}
                                        >
                                            <EmployeeProfile />
                                        </RoleGuard>
                                    </PageWrapper>
                                }
                            />
                            <Route
                                path={ROUTES.LOGIN}
                                element={<LoginPage />}
                            />
                            <Route
                                path={ROUTES.SIGNUP}
                                element={<SignupPage />}
                            />
                            <Route
                                path="/"
                                element={
                                    <Navigate to={ROUTES.DASHBOARD} replace />
                                }
                            />

                            {/* Protected — All Roles */}
                            <Route
                                path={ROUTES.DASHBOARD}
                                element={
                                    <PageWrapper>
                                        <DashboardPage />
                                    </PageWrapper>
                                }
                            />
                            <Route
                                path={ROUTES.TRANSACTIONS}
                                element={
                                    <PageWrapper>
                                        <TransactionsPage />
                                    </PageWrapper>
                                }
                            />
                            <Route
                                path={ROUTES.TRANSFER}
                                element={
                                    <PageWrapper>
                                        <TransferPage />
                                    </PageWrapper>
                                }
                            />
                            <Route
                                path={ROUTES.CARDS}
                                element={
                                    <PageWrapper>
                                        <CardsPage />
                                    </PageWrapper>
                                }
                            />
                            <Route
                                path={ROUTES.LOANS}
                                element={
                                    <PageWrapper>
                                        <LoansPage />
                                    </PageWrapper>
                                }
                            />
                            <Route
                                path={ROUTES.PROFILE}
                                element={
                                    <PageWrapper>
                                        <ProfilePage />
                                    </PageWrapper>
                                }
                            />

                            {/* Admin Only */}
                            <Route
                                path={ROUTES.ADMIN_PANEL}
                                element={
                                    <PageWrapper>
                                        <RoleGuard allowedRoles={[ROLES.ADMIN]}>
                                            <AdminPanel />
                                        </RoleGuard>
                                    </PageWrapper>
                                }
                            />
                            <Route
                                path={ROUTES.USER_MANAGEMENT}
                                element={
                                    <PageWrapper>
                                        <RoleGuard allowedRoles={[ROLES.ADMIN]}>
                                            <UserManagement />
                                        </RoleGuard>
                                    </PageWrapper>
                                }
                            />

                            {/* Employee Only */}
                            <Route
                                path={ROUTES.EMPLOYEE_DASH}
                                element={
                                    <PageWrapper>
                                        <RoleGuard
                                            allowedRoles={[ROLES.EMPLOYEE]}
                                        >
                                            <EmployeeDashboard />
                                        </RoleGuard>
                                    </PageWrapper>
                                }
                            />

                            {/* Error Pages */}
                            <Route
                                path={ROUTES.UNAUTHORIZED}
                                element={<UnauthorizedPage />}
                            />
                            <Route
                                path={ROUTES.NOT_FOUND}
                                element={<NotFoundPage />}
                            />
                            <Route
                                path={ROUTES.NOTIFICATIONS}
                                element={
                                    <PageWrapper>
                                        <NotificationsPage />
                                    </PageWrapper>
                                }
                            />
                        </Routes>
                    </BrowserRouter>
                </AuthProvider>
            </ToastProvider>
        </ThemeProvider>
    );
};

export default App;
