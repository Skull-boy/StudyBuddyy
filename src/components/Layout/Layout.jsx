import React from 'react';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-dark-900 dark:text-gray-100 transition-colors duration-300 relative overflow-x-hidden font-sans selection:bg-brand-500/30">
            {/* Dynamic Background */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Light Mode Blobs */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/40 dark:hidden rounded-full blur-[120px] animate-blob" />
                <div className="absolute top-[0%] right-[-10%] w-[40%] h-[40%] bg-purple-200/40 dark:hidden rounded-full blur-[120px] animate-blob animation-delay-2000" />

                {/* Dark Mode Blobs */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] hidden dark:block bg-brand-600/20 rounded-full blur-[120px] animate-blob" />
                <div className="absolute top-[0%] right-[-10%] w-[40%] h-[40%] hidden dark:block bg-purple-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000" />
                <div className="absolute bottom-[-20%] left-[20%] w-[40%] h-[40%] hidden dark:block bg-pink-600/10 rounded-full blur-[120px] animate-blob animation-delay-4000" />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
                    {children}
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
