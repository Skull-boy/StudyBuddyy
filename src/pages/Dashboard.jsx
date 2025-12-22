import React from 'react';
import Timer from '../components/Features/Timer';
import TaskList from '../components/Features/TaskList';
import Quiz from '../components/Features/Quiz';
import Stats from '../components/Features/Stats';
import AmbientPlayer from '../components/Features/AmbientPlayer';
import AITutor from '../components/Features/AITutor';
import DemoVideos from '../components/Features/DemoVideos';

export default function Dashboard() {
    return (
        <div className="space-y-8 pb-24">
            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-fr">

                {/* 1. Timer: Hero Feature (2x1) */}
                <div className="md:col-span-2 lg:col-span-2 min-h-[300px]">
                    <Timer />
                </div>

                {/* 2. Stats: Activity (1x1) */}
                <div className="md:col-span-1 lg:col-span-1 min-h-[300px]">
                    <Stats />
                </div>

                {/* 3. Ambient Player: Sound (1x1) */}
                <div className="md:col-span-1 lg:col-span-1 min-h-[300px] flex flex-col">
                    <AmbientPlayer />
                    <div className="mt-4 flex-1 bg-indigo-50 rounded-3xl border border-indigo-100 p-4 flex items-center justify-center text-indigo-500 text-sm font-medium dark:bg-brand-500/5 dark:border-brand-500/10 dark:text-brand-400 transition-colors">
                        🎵 Focus Zone Active
                    </div>
                </div>

                {/* 4. Task List: Missions (2x1) */}
                <div className="md:col-span-2 lg:col-span-2 min-h-[400px]">
                    <TaskList />
                </div>

                {/* 5. Quiz: Learning (2x1) */}
                <div className="md:col-span-2 lg:col-span-2 min-h-[400px]">
                    <Quiz />
                </div>

            </div>

            {/* Learning Resources */}
            <div>
                <DemoVideos />
            </div>

            {/* AI Tutor Overlay */}
            <AITutor />
        </div>
    );
}
