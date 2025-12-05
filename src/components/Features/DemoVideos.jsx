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
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-pink-100 p-2 rounded-lg text-pink-600">
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
                        className="block p-3 rounded-xl bg-white border border-gray-100 hover:border-pink-200 hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold text-gray-800 group-hover:text-pink-600 transition-colors">
                                    {video.title}
                                </h4>
                                <p className="text-xs text-gray-500">{video.topic}</p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-pink-400" />
                        </div>
                    </motion.a>
                ))}
            </div>
        </div>
    );
}
