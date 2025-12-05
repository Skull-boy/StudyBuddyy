import React from 'react';
import Navbar from './Navbar';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-[#f3f4f6] relative overflow-x-hidden font-sans text-gray-900">
            {/* Dynamic Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-300/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-300/30 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-pink-300/20 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
