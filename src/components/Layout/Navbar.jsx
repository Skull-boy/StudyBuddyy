import React from 'react';
import { Trophy, Flame, Star, BookOpen, LayoutDashboard, ListTodo, Layers, Sun, Moon } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const { level, xp, streak, theme, toggleTheme } = useStudy();
    const location = useLocation();

    // Active state styles: Light mode uses clean indigo bg; Dark mode uses brand/glass style
    const isActive = (path) => location.pathname === path
        ? "bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-brand-500/10 dark:text-brand-400 dark:border-brand-500/20"
        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 border-transparent dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-white/5";

    return (
        <nav className="hidden md:flex bg-white/70 border-b border-gray-200 backdrop-blur-xl sticky top-0 z-50 dark:bg-dark-900/50 dark:border-white/5 transition-colors duration-300">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 h-16">
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg shadow-indigo-200 dark:from-brand-600 dark:to-purple-600 dark:shadow-brand-500/20 group-hover:shadow-indigo-300 dark:group-hover:shadow-brand-500/40 transition-all">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-brand-400 dark:to-purple-400 hidden sm:block">
                            StudyBuddyy
                        </h1>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-1">
                        <Link to="/" className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${isActive('/')}`}>
                            <span className="flex items-center gap-2">
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </span>
                        </Link>
                        <Link to="/quiz" className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${isActive('/quiz')}`}>
                            <span className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                Quiz
                            </span>
                        </Link>
                        <Link to="/tasks" className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${isActive('/tasks')}`}>
                            <span className="flex items-center gap-2">
                                <ListTodo className="w-4 h-4" />
                                Tasks
                            </span>
                        </Link>
                        <Link to="/flashcards" className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${isActive('/flashcards')}`}>
                            <span className="flex items-center gap-2">
                                <Layers className="w-4 h-4" />
                                Flashcards
                            </span>
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10 transition-colors"
                        aria-label="Toggle Theme"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    {/* Level Badge */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm dark:bg-dark-800/50 dark:border-white/10"
                    >
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Lvl {level}</span>
                    </motion.div>

                    {/* XP Bar */}
                    <div className="hidden sm:flex flex-col w-32 gap-1.5">
                        <div className="flex justify-between text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                            <span>XP</span>
                            <span>{xp} / {level * 1000}</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 dark:bg-dark-800 rounded-full overflow-hidden border border-gray-100 dark:border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(xp % 1000) / 10}%` }}
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-brand-500 dark:to-purple-500 rounded-full"
                            />
                        </div>
                    </div>

                    {/* Streak */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100 dark:bg-orange-500/10 dark:border-orange-500/20"
                    >
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{streak} Days</span>
                    </motion.div>
                </div>
            </div>
        </nav>
    );
}
