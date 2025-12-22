import React, { useState } from 'react';
import { Plus, Check, Trash2, Circle } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function TaskList() {
    const { tasks, addTask, toggleTask, deleteTask } = useStudy();
    const [newTask, setNewTask] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        addTask(newTask);
        setNewTask('');
    };

    return (
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 h-full dark:bg-dark-800/50 dark:border-white/10 transition-colors duration-300">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 dark:text-gray-100">
                <span className="bg-purple-100 p-2 rounded-lg text-purple-600 dark:bg-purple-500/10 dark:text-purple-600">📝</span>
                Tasks & Goals
            </h3>

            <form onSubmit={handleSubmit} className="mb-6 relative">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new mission..."
                    className="w-full pl-4 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm text-gray-800 placeholder-gray-400 dark:bg-dark-900/50 dark:border-white/10 dark:focus:ring-brand-500 dark:text-gray-200 dark:placeholder-gray-500"
                />
                <button
                    type="submit"
                    disabled={!newTask.trim()}
                    className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors dark:bg-brand-600 dark:hover:bg-brand-700 dark:disabled:hover:bg-brand-600"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </form>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence mode='popLayout'>
                    {tasks.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center text-gray-500 py-8"
                        >
                            No active missions. Add one to start gaining XP!
                        </motion.div>
                    )}

                    {tasks.map(task => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            layout
                            className={`group flex items-center gap-3 p-3 rounded-xl border transition-all ${task.completed
                                ? 'bg-gray-100 border-gray-200 opacity-50 dark:bg-dark-900/30 dark:border-white/5'
                                : 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-md dark:bg-dark-900/50 dark:border-white/5 dark:hover:border-brand-500/30'
                                }`}
                        >
                            <button
                                onClick={() => toggleTask(task.id)}
                                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : 'border-gray-400 hover:border-indigo-500 text-transparent dark:border-gray-500 dark:hover:border-brand-400'
                                    }`}
                            >
                                <Check className="w-3.5 h-3.5" />
                            </button>

                            <span className={`flex-1 font-medium transition-all ${task.completed ? 'text-gray-500 line-through' : 'text-gray-700 dark:text-gray-300'
                                }`}>
                                {task.text}
                            </span>

                            <button
                                onClick={() => deleteTask(task.id)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all dark:hover:text-red-400 dark:hover:bg-red-500/10"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
