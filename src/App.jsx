import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StudyProvider } from './context/StudyContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import QuizPage from './pages/QuizPage';
import TasksPage from './pages/TasksPage';
import FlashcardsPage from './pages/FlashcardsPage';

export default function App() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <StudyProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/flashcards" element={<FlashcardsPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </StudyProvider>
  );
}