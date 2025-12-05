import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudy } from '../../context/StudyContext';

// Simple "AI" Knowledge Base
const KNOWLEDGE_BASE = {
    greetings: {
        patterns: ['hello', 'hi', 'hey', 'morning', 'evening'],
        responses: ["Hello! Ready to study?", "Hi there! How can I help you learn today?", "Greetings! Let's crush some code."]
    },
    motivation: {
        patterns: ['tired', 'bored', 'hard', 'give up', 'motivate'],
        responses: ["You got this! Every line of code makes you stronger.", "Take a deep breath. You're doing great.", "Remember why you started. Keep pushing!", "Coding is hard, but so are you."]
    },
    concepts: {
        'variable': "A variable is like a container for storing data values. In JavaScript, we use let, const, or var.",
        'loop': "Loops are used to repeat a block of code. Common types are for loops and while loops.",
        'function': "A function is a block of code designed to perform a particular task. It is executed when 'invoked'.",
        'array': "An array is a special variable, which can hold more than one value at a time.",
        'object': "Objects are variables too. But objects can contain many values written as name:value pairs.",
        'react': "React is a JavaScript library for building user interfaces, maintained by Meta.",
        'hook': "Hooks are functions that let you 'hook into' React state and lifecycle features from function components.",
        'motivation': "Make study a fun for you , Dont stressed out I am here to help you and make it more interactive & effective"
    },
    commands: {
        'start': (actions) => { actions.startTimer(); return "Starting the timer. Focus mode on!"; },
        'stop': (actions) => { actions.stopTimer(); return "Timer paused."; },
        'break': (actions) => { actions.startBreak(); return "Taking a break. You earned it."; },
        'quiz': (actions) => { return "You can start the quiz from the dashboard panel."; }
    }
};

export default function AITutor() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [response, setResponse] = useState("Hi! I'm your AI Tutor. Click the mic to chat.");
    const [isSpeaking, setIsSpeaking] = useState(false);

    const { setIsRunning, setIsStudying, setStudyTime, setBreakTime, setCurrentTime, studyTime, breakTime } = useStudy();

    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);

    // Initialize Speech Recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onstart = () => setIsListening(true);
            recognitionRef.current.onend = () => setIsListening(false);

            recognitionRef.current.onresult = (event) => {
                const text = event.results[0][0].transcript.toLowerCase();
                setTranscript(text);
                processInput(text);
            };
        } else {
            setResponse("Sorry, your browser doesn't support voice recognition.");
        }
    }, []);

    const speak = (text) => {
        if (synthRef.current.speaking) synthRef.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        // Select a nice voice if available
        const voices = synthRef.current.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha'));
        if (preferredVoice) utterance.voice = preferredVoice;

        synthRef.current.speak(utterance);
    };

    const processInput = (text) => {
        let reply = "I'm not sure about that yet. Try asking about variables, loops, or for motivation!";

        // Check Greetings
        if (KNOWLEDGE_BASE.greetings.patterns.some(p => text.includes(p))) {
            const opts = KNOWLEDGE_BASE.greetings.responses;
            reply = opts[Math.floor(Math.random() * opts.length)];
        }

        // Check Motivation
        else if (KNOWLEDGE_BASE.motivation.patterns.some(p => text.includes(p))) {
            const opts = KNOWLEDGE_BASE.motivation.responses;
            reply = opts[Math.floor(Math.random() * opts.length)];
        }

        // Check Concepts
        else {
            for (const [key, value] of Object.entries(KNOWLEDGE_BASE.concepts)) {
                if (text.includes(key)) {
                    reply = value;
                    break;
                }
            }
        }

        // Check Commands
        if (text.includes('start') || text.includes('begin')) {
            reply = KNOWLEDGE_BASE.commands.start({ startTimer: () => setIsRunning(true) });
        } else if (text.includes('stop') || text.includes('pause')) {
            reply = KNOWLEDGE_BASE.commands.stop({ stopTimer: () => setIsRunning(false) });
        } else if (text.includes('break')) {
            reply = KNOWLEDGE_BASE.commands.break({
                startBreak: () => {
                    setIsStudying(false);
                    setCurrentTime(breakTime);
                    setIsRunning(true);
                }
            });
        }

        setResponse(reply);
        speak(reply);
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
            setTranscript("Listening...");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 z-50"
        >
            <div className="relative group">
                {/* Chat Bubble */}
                <AnimatePresence>
                    {(isListening || isSpeaking || response) && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 10 }}
                            className="absolute bottom-full right-0 mb-4 w-72 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/50"
                        >
                            <div className="flex items-start gap-3">
                                <div className="bg-indigo-100 p-2 rounded-full">
                                    <Sparkles className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div className="flex-1">
                                    {transcript && isListening && (
                                        <p className="text-sm text-gray-500 italic mb-2">"{transcript}"</p>
                                    )}
                                    <p className="text-gray-800 text-sm font-medium leading-relaxed">
                                        {response}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setResponse(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Button */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleListening}
                    className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${isListening
                        ? 'bg-red-500 shadow-red-300 animate-pulse'
                        : isSpeaking
                            ? 'bg-indigo-500 shadow-indigo-300 ring-4 ring-indigo-200'
                            : 'bg-white text-indigo-600 shadow-xl hover:shadow-2xl'
                        }`}
                >
                    {isListening ? (
                        <MicOff className="w-8 h-8 text-white" />
                    ) : (
                        <Mic className={`w-8 h-8 ${isSpeaking ? 'text-white' : 'text-indigo-600'}`} />
                    )}
                </motion.button>

                {/* Visualizer Ring when Speaking */}
                {isSpeaking && (
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-400 opacity-50 animate-ping pointer-events-none" />
                )}
            </div>
        </motion.div>
    );
}
