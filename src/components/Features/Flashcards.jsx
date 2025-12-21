import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft, RotateCw, Brain, Layers } from 'lucide-react';
import { generateFlashcards } from '../../services/ollama';

export default function Flashcards() {
    const [topic, setTopic] = useState('');
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [error, setError] = useState(null);

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!topic.trim()) return;
        setLoading(true);
        setError(null);
        setCards([]);

        try {
            const newCards = await generateFlashcards(topic);
            setCards(newCards);
            setCurrentIndex(0);
            setIsFlipped(false);
        } catch (err) {
            setError(err.message || "Failed to generate cards");
        } finally {
            setLoading(false);
        }
    };

    const nextCard = () => {
        if (currentIndex < cards.length - 1) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(c => c + 1), 200);
        }
    };

    const prevCard = () => {
        if (currentIndex > 0) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(c => c - 1), 200);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-[500px]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="mb-6"
                >
                    <Layers className="w-16 h-16 text-indigo-500" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-700">Forging Knowledge...</h3>
                <p className="text-gray-500">Creating flashcards for "{topic}"</p>
            </div>
        );
    }

    if (cards.length === 0) {
        return (
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 min-h-[500px] flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6 text-indigo-600">
                    <Layers className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">AI Flashcards</h2>
                <p className="text-gray-600 mb-8 max-w-md">
                    Master any subject with AI-generated study cards. Just type a topic to begin.
                </p>

                <form onSubmit={handleGenerate} className="w-full max-w-md flex gap-2">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., Spanish Verbs, React Props, World War II..."
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-indigo-100 focus:border-indigo-500 outline-none"
                    />
                    <button
                        type="submit"
                        disabled={!topic.trim()}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                        <Sparkles className="w-5 h-5" />
                    </button>
                </form>
                {error && <p className="mt-4 text-red-500">{error}</p>}
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-500" />
                    {topic}
                </h3>
                <span className="text-sm font-medium text-gray-500">
                    {currentIndex + 1} / {cards.length}
                </span>
            </div>

            <div className="h-[400px] perspective-1000 relative mb-8">
                <motion.div
                    className="w-full h-full relative preserve-3d cursor-pointer"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                    onClick={() => setIsFlipped(!isFlipped)}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* FRONT */}
                    <div className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-2xl border border-indigo-50 flex flex-col items-center justify-center p-8 text-center">
                        <span className="text-sm uppercase tracking-widest text-indigo-400 font-semibold mb-4">Front</span>
                        <h4 className="text-3xl font-bold text-gray-800">
                            {cards[currentIndex].front}
                        </h4>
                        <p className="absolute bottom-6 text-gray-400 text-sm flex items-center gap-1">
                            <RotateCw className="w-3 h-3" /> Tap to flip
                        </p>
                    </div>

                    {/* BACK */}
                    <div
                        className="absolute inset-0 backface-hidden bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 text-center text-white"
                        style={{ transform: 'rotateY(180deg)' }}
                    >
                        <span className="text-sm uppercase tracking-widest text-indigo-200 font-semibold mb-4">Back</span>
                        <p className="text-xl font-medium leading-relaxed">
                            {cards[currentIndex].back}
                        </p>
                    </div>
                </motion.div>
            </div>

            <div className="flex justify-center gap-4">
                <button
                    onClick={prevCard}
                    disabled={currentIndex === 0}
                    className="px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Prev
                </button>
                <button
                    onClick={() => setCards([])}
                    className="px-4 py-3 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200"
                >
                    <RotateCw className="w-5 h-5" />
                </button>
                <button
                    onClick={nextCard}
                    disabled={currentIndex === cards.length - 1}
                    className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-indigo-200"
                >
                    Next
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
