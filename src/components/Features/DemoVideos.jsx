import React from 'react';
import { Video, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const DEMO_VIDEOS = [
    { title: "JavaScript Basics", topic: "Variables, Functions, and Scope", url: "https://www.youtube.com/results?search_query=javascript+basics+tutorial" },
    { title: "Data Structures", topic: "Arrays, Stacks, Queues, Trees", url: "https://www.youtube.com/results?search_query=data+structures+tutorial" },
    { title: "Algorithms", topic: "Sorting, Searching, Recursion", url: "https://www.youtube.com/results?search_query=algorithms+tutorial" },
    { title: "Web Development", topic: "HTML, CSS, JavaScript", url: "https://www.youtube.com/results?search_query=web+development+tutorial" },
    { title: "React Fundamentals", topic: "Components, Props, State, Hooks", url: "https://www.youtube.com/results?search_query=react+tutorial" }
];

export default function DemoVideos() {
    return (
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 dark:bg-dark-800/50 dark:border-white/10 transition-colors duration-300">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 dark:text-gray-100">
                <span className="bg-pink-100 p-2 rounded-lg text-pink-500 dark:bg-pink-500/10 dark:text-pink-500">
                    <Video className="w-5 h-5" />
                </span>
                Learning Resources
            </h3>

            <div className="space-y-3">
                {DEMO_VIDEOS.map((video, index) => (
                    <motion.a
                        key={index}
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="block p-3 rounded-xl bg-white border border-gray-100 hover:border-pink-300 hover:shadow-md transition-all group dark:bg-dark-900/50 dark:border-white/5 dark:hover:border-pink-500/30"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold text-gray-700 group-hover:text-pink-600 transition-colors dark:text-gray-200 dark:group-hover:text-pink-400">
                                    {video.title}
                                </h4>
                                <p className="text-xs text-gray-500 group-hover:text-gray-400">{video.topic}</p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-pink-500 transition-colors dark:text-gray-500 dark:group-hover:text-pink-400" />
                        </div>
                    </motion.a>
                ))}
            </div>
        </div>
    );
}
