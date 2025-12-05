import React from 'react';
import { StudyProvider } from './context/StudyContext';
import Layout from './components/Layout/Layout';
import Timer from './components/Features/Timer';
import TaskList from './components/Features/TaskList';
import Quiz from './components/Features/Quiz';
import Stats from './components/Features/Stats';
import AmbientPlayer from './components/Features/AmbientPlayer';
import AITutor from './components/Features/AITutor';
import DemoVideos from './components/Features/DemoVideos';

function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Top Section: Main Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Core Study Tools */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Timer />
            <div className="h-full">
              <Stats />
            </div>
          </div>
          <TaskList />
        </div>

        {/* Right Column (4 cols): Sidebar Tools */}
        <div className="lg:col-span-4 space-y-6">
          <AmbientPlayer />
          <div className="h-[500px]">
            <Quiz />
          </div>
        </div>
      </div>

      {/* Bottom Section: Learning Resources */}
      <div>
        <DemoVideos />
      </div>

      {/* AI Tutor Overlay */}
      <AITutor />
    </div>
  );
}

export default function App() {
  return (
    <StudyProvider>
      <Layout>
        <Dashboard />
      </Layout>
    </StudyProvider>
  );
}