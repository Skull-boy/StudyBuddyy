import React, { useState } from 'react';
import { Brain, CheckCircle, XCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const QUESTIONS = [
    {
        question: "What does 'const' keyword do in JavaScript?",
        options: [
            "Creates a variable that can be reassigned",
            "Creates a variable that cannot be reassigned",
            "Creates a function",
            "Deletes a variable"
        ],
        correct: 1
    },
    {
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        correct: 1
    },
    {
        question: "Which data structure uses LIFO (Last In First Out)?",
        options: ["Queue", "Array", "Stack", "Tree"],
        correct: 2
    },
    {
        question: "What does CSS stand for?",
        options: [
            "Computer Style Sheets",
            "Cascading Style Sheets",
            "Creative Style System",
            "Colorful Style Sheets"
        ],
        correct: 1
    },
    {
        question: "What is a REST API?",
        options: [
            "A sleeping program interface",
            "An architectural style for web services",
            "A type of database",
            "A programming language"
        ],
        correct: 1
    }
];

export default function Quiz() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const handleAnswer = (index) => {
        setSelectedAnswer(index);
        setShowResult(true);
        if (index === QUESTIONS[currentQuestion].correct) {
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
        if (currentQuestion < QUESTIONS.length - 1) {
            setCurrentQuestion(c => c + 1);
            setSelectedAnswer(null);
            setShowResult(false);
        } else {
            setIsFinished(true);
            if (score > QUESTIONS.length / 2) {
                confetti({
                    particleCount: 150,
                    spread: 100,
                    origin: { y: 0.6 }
                });
            }
        }
    };

    const restart = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setScore(0);
        setIsFinished(false);
    };

    if (isFinished) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 text-center h-full flex flex-col items-center justify-center"
            >
                <div className="mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
                        <Trophy className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Quiz Complete!</h3>
                    <p className="text-gray-600">You scored {score} out of {QUESTIONS.length}</p>
                </div>

                <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden mb-8 max-w-xs">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(score / QUESTIONS.length) * 100}%` }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    />
                </div>

                <button
                    onClick={restart}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200"
                >
                    <RefreshCw className="w-5 h-5" />
                    Try Again
                </button>
            </motion.div>
        );
    }

    const question = QUESTIONS[currentQuestion];

    return (
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="bg-indigo-100 p-2 rounded-lg text-indigo-600">🧠</span>
                    Quiz Time
                </h3>
                <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-100">
                    {currentQuestion + 1} / {QUESTIONS.length}
                </span>
            </div>

            <div className="flex-1 flex flex-col justify-center">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 leading-relaxed">
                    {question.question}
                </h4>

                <div className="space-y-3">
                    {question.options.map((option, idx) => {
                        let stateStyle = "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50";
                        if (showResult) {
                            if (idx === question.correct) stateStyle = "border-green-500 bg-green-50 text-green-700";
                            else if (idx === selectedAnswer) stateStyle = "border-red-500 bg-red-50 text-red-700";
                            else stateStyle = "border-gray-100 opacity-50";
                        }

                        return (
                            <button
                                key={idx}
                                disabled={showResult}
                                onClick={() => handleAnswer(idx)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex justify-between items-center ${stateStyle} ${selectedAnswer === idx ? 'ring-2 ring-indigo-200' : ''}`}
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
                            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                        >
                            Next
                            <ArrowRight className="w-4 h-4" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function Trophy(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
    )
}
