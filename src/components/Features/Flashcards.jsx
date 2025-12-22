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
                    <Layers className="w-16 h-16 text-indigo-500 dark:text-brand-500" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Forging Knowledge...</h3>
                <p className="text-gray-500">Creating flashcards for "{topic}"</p>
            </div>
        );
    }

    if (cards.length === 0) {
        return (
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 min-h-[500px] flex flex-col items-center justify-center text-center dark:bg-dark-800/50 dark:border-white/10 transition-colors duration-300">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6 text-indigo-500 dark:bg-brand-500/10 dark:text-brand-400">
                    <Layers className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4 dark:text-gray-100">AI Flashcards</h2>
                <p className="text-gray-600 mb-8 max-w-md dark:text-gray-400">
                    Master any subject with AI-generated study cards. Just type a topic to begin.
                </p>

                <form onSubmit={handleGenerate} className="w-full max-w-md flex gap-2">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., Spanish Verbs, React Props, World War II..."
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all dark:border-white/10 dark:bg-dark-900/50 dark:text-white dark:placeholder-gray-500 dark:focus:border-brand-500 dark:focus:ring-brand-500"
                    />
                    <button
                        type="submit"
                        disabled={!topic.trim()}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-indigo-200 dark:bg-brand-600 dark:hover:bg-brand-500 dark:hover:shadow-brand-500/20"
                    >
                        <Sparkles className="w-5 h-5" />
                    </button>
                </form>
                {error && <p className="mt-4 text-red-500 bg-red-100 px-4 py-2 rounded-lg border border-red-200 dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/20">{error}</p>}
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 dark:text-gray-100">
                    <Layers className="w-5 h-5 text-indigo-500 dark:text-brand-500" />
                    {topic}
                </h3>
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200 dark:text-gray-400 dark:bg-white/5 dark:border-white/10">
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
                    <div className="absolute inset-0 backface-hidden bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 flex flex-col items-center justify-center p-8 text-center dark:bg-dark-800/80 dark:border-white/10 transition-colors duration-300">
                        <span className="text-sm uppercase tracking-widest text-indigo-500 font-semibold mb-4 opacity-70 dark:text-brand-400">Front</span>
                        <h4 className="text-3xl font-bold text-gray-800 leading-tight dark:text-gray-100">
                            {cards[currentIndex].front}
                        </h4>
                        <p className="absolute bottom-6 text-gray-400 text-sm flex items-center gap-1 dark:text-gray-500">
                            <RotateCw className="w-3 h-3" /> Tap to flip
                        </p>
                    </div>

                    {/* BACK */}
                    <div
                        className="absolute inset-0 backface-hidden bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 text-center text-white border border-white/10 dark:from-brand-600 dark:to-purple-700"
                        style={{ transform: 'rotateY(180deg)' }}
                    >
                        <span className="text-sm uppercase tracking-widest text-white/70 font-semibold mb-4">Back</span>
                        <p className="text-xl font-medium leading-relaxed drop-shadow-md">
                            {cards[currentIndex].back}
                        </p>
                    </div>
                </motion.div>
            </div>

            <div className="flex justify-center gap-4">
                <button
                    onClick={prevCard}
                    disabled={currentIndex === 0}
                    className="px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 transition-all dark:bg-dark-800/50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:border-white/20"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Prev
                </button>
                <button
                    onClick={() => setCards([])}
                    className="px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all dark:bg-dark-800/50 dark:border-white/10 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5 dark:hover:border-white/20"
                >
                    <RotateCw className="w-5 h-5" />
                </button>
                <button
                    onClick={nextCard}
                    disabled={currentIndex === cards.length - 1}
                    className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all dark:bg-brand-600 dark:hover:bg-brand-500 dark:shadow-brand-500/20"
                >
                    Next
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
