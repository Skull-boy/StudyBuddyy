import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, ListTodo, Layers, BookOpen, Sun, Moon } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

export default function BottomNav() {
    const { theme, toggleTheme } = useStudy();
    const location = useLocation();

    const tabs = [
        { path: '/', icon: LayoutDashboard, label: 'Home' },
        { path: '/tasks', icon: ListTodo, label: 'Tasks' },
        { path: '/flashcards', icon: Layers, label: 'Cards' },
        { path: '/quiz', icon: BookOpen, label: 'Quiz' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe">
            {/* Glass Container */}
            <div className="bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl border-t border-gray-200 dark:border-white/10 px-6 py-3 pb-5">
                <div className="flex justify-between items-center max-w-sm mx-auto">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.path}
                            to={tab.path}
                            className="relative flex flex-col items-center gap-1 min-w-[3.5rem]"
                        >
                            {isActive(tab.path) && (
                                <motion.div
                                    layoutId="bottom-nav-indicator"
                                    className="absolute -top-3 w-8 h-1 bg-indigo-500 dark:bg-brand-500 rounded-full"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}

                            <motion.div
                                animate={{
                                    scale: isActive(tab.path) ? 1.1 : 1,
                                    y: isActive(tab.path) ? -2 : 0,
                                    color: isActive(tab.path)
                                        ? (theme === 'dark' ? '#a78bfa' : '#6366f1')
                                        : (theme === 'dark' ? '#9ca3af' : '#6b7280')
                                }}
                                className="flex flex-col items-center"
                            >
                                <tab.icon className="w-6 h-6" strokeWidth={isActive(tab.path) ? 2.5 : 2} />
                            </motion.div>
                        </Link>
                    ))}

                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className="flex flex-col items-center gap-1 min-w-[3.5rem] text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                    >
                        {theme === 'dark' ? (
                            <Sun className="w-6 h-6" />
                        ) : (
                            <Moon className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
