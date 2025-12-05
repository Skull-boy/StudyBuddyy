import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const StudyContext = createContext();

export const useStudy = () => useContext(StudyContext);

export const StudyProvider = ({ children }) => {
  // Timer State
  const [studyTime, setStudyTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [currentTime, setCurrentTime] = useState(25 * 60);
  const [isStudying, setIsStudying] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  // User Stats & Gamification
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem('studyXP')) || 0);
  const [level, setLevel] = useState(() => parseInt(localStorage.getItem('studyLevel')) || 1);
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem('studyStreak')) || 0);
  const [lastStudyDate, setLastStudyDate] = useState(() => localStorage.getItem('lastStudyDate'));

  // Tasks
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('tasks')) || []);

  // Audio
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  // Persist Stats
  useEffect(() => {
    localStorage.setItem('studyXP', xp);
    localStorage.setItem('studyLevel', level);
    localStorage.setItem('studyStreak', streak);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [xp, level, streak, tasks]);

  // Level Up Logic
  useEffect(() => {
    const nextLevelXp = level * 1000;
    if (xp >= nextLevelXp) {
      setLevel(l => l + 1);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [xp, level]);

  // Timer Logic
  useEffect(() => {
    let interval;
    if (isRunning && currentTime > 0) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev - 1);
        // Gain XP for studying
        if (isStudying) {
          setXp(prev => prev + 1); // 1 XP per second of study
        }
      }, 1000);
    } else if (currentTime === 0) {
      setIsRunning(false);
      if (isStudying) {
        setIsStudying(false);
        setCurrentTime(breakTime);
        updateStreak();
        new Audio('/sounds/success.mp3').play().catch(() => {}); // Simple notification
      } else {
        setIsStudying(true);
        setCurrentTime(studyTime);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, currentTime, isStudying, studyTime, breakTime]);

  const updateStreak = () => {
    const today = new Date().toDateString();
    if (lastStudyDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const newStreak = lastStudyDate === yesterday.toDateString() ? streak + 1 : 1;
      setStreak(newStreak);
      setLastStudyDate(today);
      localStorage.setItem('lastStudyDate', today);
    }
  };

  const addTask = (text) => {
    if (text.trim()) {
      setTasks([...tasks, { id: Date.now(), text, completed: false }]);
      setXp(prev => prev + 10); // XP for adding task
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const completed = !task.completed;
        if (completed) {
          setXp(prev => prev + 50); // XP for completing task
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 }
          });
        }
        return { ...task, completed };
      }
      return task;
    }));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <StudyContext.Provider value={{
      studyTime, setStudyTime,
      breakTime, setBreakTime,
      currentTime, setCurrentTime,
      isStudying, setIsStudying,
      isRunning, setIsRunning,
      xp, level, streak,
      tasks, addTask, toggleTask, deleteTask,
      isAmbientPlaying, setIsAmbientPlaying,
      volume, setVolume,
      formatTime
    }}>
      {children}
    </StudyContext.Provider>
  );
};
