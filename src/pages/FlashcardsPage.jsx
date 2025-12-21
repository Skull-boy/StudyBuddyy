import React from 'react';
import Flashcards from '../components/Features/Flashcards';
import AITutor from '../components/Features/AITutor';

export default function FlashcardsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-24">
            <h1 className="text-3xl font-bold text-gray-800">Flashcards Master</h1>
            <p className="text-gray-600">Memorize concepts efficiently with AI-generated cards.</p>

            <div className="min-h-[600px]">
                <Flashcards />
            </div>

            <AITutor />
        </div>
    );
}
