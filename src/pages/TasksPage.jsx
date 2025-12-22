import React from 'react';
import TaskList from '../components/Features/TaskList';
import AITutor from '../components/Features/AITutor';

export default function TasksPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-24">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 transition-colors">Mission Control</h1>
            <p className="text-gray-600 dark:text-gray-400 transition-colors">Track your assignments, homework, and study goals.</p>

            <div className="min-h-[600px]">
                <TaskList />
            </div>

            <AITutor />
        </div>
    );
}
