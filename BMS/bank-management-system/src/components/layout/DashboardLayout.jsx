import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import ToastContainer from '../ui/Toast';

// Yeh layout wrapper hai — Sidebar + Navbar + Page content
// Har protected page is layout ke andar render hoga

const DashboardLayout = ({ children }) => {
    // Mobile sidebar open/close state
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-bank-darker overflow-hidden">
            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main content area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Navbar */}
                <Navbar onMenuClick={() => setSidebarOpen(true)} />

                {/* Page content — scrollable */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-6 animate-fade-in">
                    {children}
                </main>
            </div>

            {/* Toast notifications */}
            <ToastContainer />
        </div>
    );
};

export default DashboardLayout;
