import React from 'react';
import { Trophy, Flame, Star, BookOpen } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { motion } from 'framer-motion';

export default function Navbar() {
    const { level, xp, streak } = useStudy();

    return (
        <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
                        <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 hidden sm:block">
                        StudyBuddyy
                    </h1>
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                    {/* Level Badge */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 shadow-sm"
                    >
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-bold text-gray-700">Lvl {level}</span>
                    </motion.div>

                    {/* XP Bar */}
                    <div className="hidden sm:flex flex-col w-32 gap-1">
                        <div className="flex justify-between text-xs font-medium text-gray-500">
                            <span>XP</span>
                            <span>{xp} / {level * 1000}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(xp % 1000) / 10}%` }}
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                            />
                        </div>
                    </div>

                    {/* Streak */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100"
                    >
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-bold text-orange-600">{streak} Days</span>
                    </motion.div>
                </div>
            </div>
        </nav>
    );
}
