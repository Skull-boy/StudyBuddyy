import React from 'react';
import Quiz from '../components/Features/Quiz';
import AITutor from '../components/Features/AITutor';

export default function QuizPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-24">
            <h1 className="text-3xl font-bold text-gray-800">Knowledge Check</h1>
            <p className="text-gray-600">Test your understanding and learn new concepts with AI-generated quizzes.</p>

            <div className="min-h-[600px]">
                <Quiz />
            </div>

            {/* AI Tutor can still be helpful here */}
            <AITutor />
        </div>
    );
}
