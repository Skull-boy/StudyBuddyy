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
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 h-full">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="bg-purple-100 p-2 rounded-lg text-purple-600">📝</span>
                Tasks & Goals
            </h3>

            <form onSubmit={handleSubmit} className="mb-6 relative">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new mission..."
                    className="w-full pl-4 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
                />
                <button
                    type="submit"
                    disabled={!newTask.trim()}
                    className="absolute right-2 top-2 p-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600 transition-colors"
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
                            className="text-center text-gray-400 py-8"
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
                                    ? 'bg-gray-50 border-gray-100 opacity-75'
                                    : 'bg-white border-gray-100 hover:border-purple-200 hover:shadow-md'
                                }`}
                        >
                            <button
                                onClick={() => toggleTask(task.id)}
                                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed
                                        ? 'bg-green-500 border-green-500 text-white'
                                        : 'border-gray-300 hover:border-purple-500 text-transparent'
                                    }`}
                            >
                                <Check className="w-3.5 h-3.5" />
                            </button>

                            <span className={`flex-1 font-medium transition-all ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'
                                }`}>
                                {task.text}
                            </span>

                            <button
                                onClick={() => deleteTask(task.id)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
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
