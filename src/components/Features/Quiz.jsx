import React, { useState } from 'react';
import { Brain, CheckCircle, XCircle, RefreshCw, ArrowRight, Loader2, Sparkles, BookOpen, AlertCircle, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { generateQuizQuestions } from '../../services/ollama';
import { useStudy } from '../../context/StudyContext';

const INITIAL_QUESTIONS = [
    {
        question: "What does 'const' keyword do in JavaScript?",
        options: [
            "Creates a variable that can be reassigned",
            "Creates a variable that cannot be reassigned",
            "Creates a function",
            "Deletes a variable"
        ],
        correct: 1,
        explanation: "The const declaration creates block-scoped constants. The value of a constant can't be changed through reassignment."
    }
];

export default function Quiz() {
    // Game States: 'menu' | 'loading' | 'quiz' | 'result'
    const [gameMode, setGameMode] = useState('menu');
    const [topic, setTopic] = useState('');
    const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    // Store user answers for review: { questionIndex: optionIndex }
    const [userAnswers, setUserAnswers] = useState({});
    const [error, setError] = useState(null);
    const [debugStatus, setDebugStatus] = useState({ checked: false, ok: false, message: '' });

    const { addQuizResult } = useStudy();

    // Auto-check connection on mount
    React.useEffect(() => {
        const check = async () => {
            try {
                const { checkConnection } = await import('../../services/ollama');
                const result = await checkConnection();
                if (result.ok) {
                    setDebugStatus({ checked: true, ok: true, message: 'Ollama Connected ✅' });
                } else {
                    setDebugStatus({ checked: true, ok: false, message: 'Ollama Connection Failed ❌' });
                }
            } catch (e) {
                setDebugStatus({ checked: true, ok: false, message: 'Connection Error ❌' });
            }
        };
        check();
    }, []);

    const handleGenerateQuiz = async (e) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setGameMode('loading');
        setError(null);

        try {
            // Re-verify connection before generating
            const { checkConnection } = await import('../../services/ollama');
            const conn = await checkConnection();
            if (!conn.ok) {
                throw new Error(`Connection Failed: ${conn.error || 'Server unreachable'}. Is Ollama running?`);
            }

            const newQuestions = await generateQuizQuestions(topic);
            if (newQuestions && newQuestions.length > 0) {
                setQuestions(newQuestions);
                setGameMode('quiz');
                setCurrentQuestion(0);
                setScore(0);
                setSelectedAnswer(null);
                setUserAnswers({});
                setShowResult(false);
            } else {
                throw new Error("No questions generated (Empty response)");
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
            setGameMode('menu');
        }
    };

    const handleAnswer = (index) => {
        setSelectedAnswer(index);
        setShowResult(true);
        setUserAnswers(prev => ({ ...prev, [currentQuestion]: index }));

        if (index === questions[currentQuestion].correct) {
            setScore(s => s + 1);
            confetti({
                particleCount: 30,
                spread: 50,
                origin: { y: 0.8 },
                colors: ['#4ade80', '#22c55e']
            });
        }
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(c => c + 1);
            setSelectedAnswer(null);
            setShowResult(false);
        } else {
            setGameMode('result');
            // Save Result to Context/LocalStorage
            addQuizResult(score, questions.length, topic);

            if (score > questions.length / 2) {
                confetti({
                    particleCount: 150,
                    spread: 100,
                    origin: { y: 0.6 }
                });
            }
        }
    };

    const restartQuiz = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setScore(0);
        setUserAnswers({});
        setGameMode('quiz');
    };

    const returnToMenu = () => {
        setGameMode('menu');
        setTopic('');
        setScore(0);
        setCurrentQuestion(0);
        setUserAnswers({});
    };

    // --- RENDER: MENU ---
    if (gameMode === 'menu') {
        return (
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 h-full flex flex-col items-center justify-center text-center dark:bg-dark-800/50 dark:border-white/10 transition-colors duration-300">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-indigo-200 dark:from-brand-500 dark:to-purple-600 dark:shadow-brand-500/20">
                    <Brain className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2 dark:text-gray-100">AI Quiz Generator</h2>
                <div className={`text-xs px-2 py-1 rounded-full mb-4 inline-flex items-center gap-1 ${debugStatus.ok ? 'bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${debugStatus.ok ? 'bg-green-500' : 'bg-red-500'}`} />
                    {debugStatus.checked ? debugStatus.message : 'Checking endpoint...'}
                </div>
                <p className="text-gray-600 mb-8 max-w-md dark:text-gray-400">
                    Enter any topic, subject, or concept, and I'll generate a custom quiz for you instantly.
                </p>

                <form onSubmit={handleGenerateQuiz} className="w-full max-w-md space-y-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., Quantum Physics, French Revolution, React Hooks..."
                            className="w-full px-6 py-4 rounded-xl border border-gray-200 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-lg outline-none text-gray-800 placeholder-gray-400 dark:bg-dark-900/50 dark:border-white/10 dark:focus:border-brand-500 dark:focus:ring-brand-500/10 dark:text-white dark:placeholder-gray-600"
                        />
                        <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 w-5 h-5 pointer-events-none dark:text-brand-400" />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm bg-red-50 py-2 px-4 rounded-lg border border-red-100 dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/20">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={!topic.trim()}
                        className="w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 dark:bg-brand-600 dark:hover:bg-brand-500 dark:hover:shadow-brand-500/20"
                    >
                        Generate Quiz
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </form>
            </div>
        );
    }

    // --- RENDER: LOADING ---
    if (gameMode === 'loading') {
        return (
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 h-full flex flex-col items-center justify-center text-center dark:bg-dark-800/50 dark:border-white/10 transition-colors duration-300">
                <div className="relative mb-8 w-24 h-24">
                    {/* Outer Ring */}
                    <motion.div
                        className="absolute inset-0 border-4 border-indigo-100 border-t-indigo-600 rounded-full dark:border-brand-900 dark:border-t-brand-500"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                    {/* Inner Ring */}
                    <motion.div
                        className="absolute inset-2 border-4 border-purple-100 border-b-purple-500 rounded-full dark:border-purple-900/50"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    {/* Center Icon */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <Sparkles className="w-8 h-8 text-indigo-600 dark:text-brand-500" />
                    </motion.div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 dark:text-gray-200">Generating Quiz...</h3>
                <p className="text-gray-600 max-w-[80%] mx-auto dark:text-gray-500">
                    Consulting the AI knowledge base about <span className="text-indigo-600 font-medium dark:text-brand-400">"{topic}"</span>
                </p>
            </div>
        );
    }

    // --- RENDER: RESULT ---
    if (gameMode === 'result') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 text-center h-full flex flex-col items-center overflow-auto dark:bg-dark-800/50 dark:border-white/10 transition-colors duration-300"
            >
                <div className="w-full max-w-2xl px-4 pb-8">
                    <div className="mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200 dark:from-brand-500 dark:to-purple-600 dark:shadow-brand-500/20">
                            <Trophy className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-1 dark:text-gray-100">Quiz Complete!</h3>
                        <p className="text-gray-600 text-lg dark:text-gray-400">You scored <span className="font-bold text-indigo-600 dark:text-brand-400">{score}</span> out of {questions.length}</p>
                    </div>

                    <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden mb-8 border border-transparent dark:bg-dark-900 dark:border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(score / questions.length) * 100}%` }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-brand-500 dark:to-purple-500"
                        />
                    </div>

                    {/* Review Section */}
                    <div className="text-left space-y-6 mb-8">
                        <h4 className="text-lg font-bold text-gray-700 border-b border-gray-200 pb-2 dark:text-gray-300 dark:border-white/10">Review Answers</h4>
                        {questions.map((q, idx) => {
                            const userAnsIdx = userAnswers[idx];
                            const notAnswered = userAnsIdx === undefined || userAnsIdx === null;
                            const isCorrect = userAnsIdx === q.correct;

                            return (
                                <div key={idx} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm dark:bg-white/5 dark:border-white/10">
                                    <div className="flex gap-3 mb-2">
                                        <div className="mt-1">
                                            {isCorrect ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                                        </div>
                                        <h5 className="font-medium text-gray-800 dark:text-gray-200">{q.question}</h5>
                                    </div>

                                    <div className="ml-8 text-sm space-y-1">
                                        <p className={`${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 opacity-70 line-through dark:text-red-400'}`}>
                                            Your Answer: {notAnswered ? 'Skipped' : q.options[userAnsIdx]}
                                        </p>
                                        {!isCorrect && (
                                            <p className="text-green-600 font-medium dark:text-green-400">
                                                Correct Answer: {q.options[q.correct]}
                                            </p>
                                        )}

                                        {q.explanation && (
                                            <div className="mt-2 text-indigo-600 bg-indigo-50 p-2 rounded-lg flex items-start gap-2 border border-indigo-100 dark:text-brand-300 dark:bg-brand-500/10 dark:border-brand-500/20">
                                                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                <span>{q.explanation}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex gap-4 justify-center sticky bottom-0 bg-transparent pt-4">
                        <button
                            onClick={restartQuiz}
                            className="px-6 py-3 bg-white text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium dark:bg-white/5 dark:text-gray-300 dark:border-white/10 dark:hover:bg-white/10"
                        >
                            Retry Quiz
                        </button>
                        <button
                            onClick={returnToMenu}
                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 dark:bg-brand-600 dark:hover:bg-brand-500 dark:hover:shadow-brand-500/20"
                        >
                            <RefreshCw className="w-5 h-5" />
                            New Topic
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }

    // --- RENDER: PLAYING ---
    const question = questions[currentQuestion];

    if (!question) {
        return (
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 h-full flex flex-col items-center justify-center text-center dark:bg-dark-800/50 dark:border-white/10 transition-colors duration-300">
                <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2 dark:text-gray-200">Something went wrong</h3>
                <p className="text-gray-600 mb-6 dark:text-gray-400">We couldn't load the question data properly.</p>
                <button
                    onClick={returnToMenu}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-medium dark:bg-brand-600 dark:hover:bg-brand-500"
                >
                    Return to Menu
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 h-full flex flex-col dark:bg-dark-800/50 dark:border-white/10 transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={returnToMenu}
                    className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors flex items-center gap-1 dark:text-gray-500 dark:hover:text-brand-400"
                >
                    <BookOpen className="w-4 h-4" />
                    {topic || 'Quiz'}
                </button>
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200 dark:text-gray-400 dark:bg-white/5 dark:border-white/10">
                    {currentQuestion + 1} / {questions.length}
                </span>
            </div>

            <div className="flex-1 flex flex-col justify-center">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 leading-relaxed dark:text-gray-100">
                    {question.question || "Question text missing"}
                </h4>

                <div className="space-y-3">
                    {(question.options || []).map((option, idx) => {
                        let stateStyle = "border-gray-200 bg-white hover:border-indigo-400 hover:bg-indigo-50 text-gray-600 dark:border-white/10 dark:bg-transparent dark:hover:border-brand-500/50 dark:hover:bg-brand-500/10 dark:text-gray-300";
                        if (showResult) {
                            if (idx === question.correct) stateStyle = "border-green-500 bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400";
                            else if (idx === selectedAnswer) stateStyle = "border-red-500 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400";
                            else stateStyle = "border-gray-100 opacity-50 text-gray-400 dark:border-white/5 dark:text-gray-500";
                        }

                        return (
                            <button
                                key={idx}
                                disabled={showResult}
                                onClick={() => handleAnswer(idx)}
                                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex justify-between items-center ${stateStyle} ${selectedAnswer === idx && !showResult ? 'ring-2 ring-indigo-500/30 dark:ring-brand-500/30' : ''}`}
                            >
                                <span className="font-medium">{option}</span>
                                {showResult && idx === question.correct && <CheckCircle className="w-5 h-5 text-green-500" />}
                                {showResult && idx === selectedAnswer && idx !== question.correct && <XCircle className="w-5 h-5 text-red-500" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="mt-6 h-12 flex items-end justify-end">
                <AnimatePresence>
                    {showResult && (
                        <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onClick={nextQuestion}
                            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-200 dark:bg-brand-600 dark:hover:bg-brand-500 dark:shadow-brand-500/20"
                        >
                            {currentQuestion < questions.length - 1 ? 'Next' : 'Finish'}
                            <ArrowRight className="w-4 h-4" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}


