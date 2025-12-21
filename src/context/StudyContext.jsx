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

  // Quiz History
  const [quizHistory, setQuizHistory] = useState(() => JSON.parse(localStorage.getItem('quizHistory')) || []);

  // Ambient Sound State
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [soundVolumes, setSoundVolumes] = useState(() =>
    JSON.parse(localStorage.getItem('soundVolumes')) || { rain: 0.5, ambient: 0.5 }
  );

  // Analytics State
  const [dailyStats, setDailyStats] = useState(() => JSON.parse(localStorage.getItem('dailyStats')) || {});

  const updateTrackVolume = (trackId, val) => {
    setSoundVolumes(prev => ({ ...prev, [trackId]: val }));
  };

  // Persist User Stats (Frequent Updates)
  useEffect(() => {
    localStorage.setItem('studyXP', xp);
    localStorage.setItem('studyLevel', level);
    localStorage.setItem('studyStreak', streak);
    localStorage.setItem('dailyStats', JSON.stringify(dailyStats));
  }, [xp, level, streak, dailyStats]);

  // Persist Tasks & History (Infrequent Updates)
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('quizHistory', JSON.stringify(quizHistory));
    localStorage.setItem('soundVolumes', JSON.stringify(soundVolumes));
  }, [tasks, quizHistory, soundVolumes]);

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
        // Gain XP for studying & Track Stats
        if (isStudying) {
          setXp(prev => prev + 1); // 1 XP per second of study

          // Update Daily Stats (Seconds)
          const todayKey = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
          setDailyStats(prev => ({
            ...prev,
            [todayKey]: (prev[todayKey] || 0) + 1
          }));
        }
      }, 1000);
    } else if (currentTime === 0) {
      setIsRunning(false);
      if (isStudying) {
        setIsStudying(false);
        setCurrentTime(breakTime);
        updateStreak();
        new Audio('/sounds/success.mp3').play().catch(() => { }); // Simple notification
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

  const addQuizResult = (score, total, topic) => {
    const newResult = {
      id: Date.now(),
      date: new Date().toISOString(),
      score,
      total,
      topic
    };
    setQuizHistory([newResult, ...quizHistory]);
    // Gain XP based on score
    const xpGain = score * 20;
    if (xpGain > 0) {
      setXp(prev => prev + xpGain);
      confetti({
        particleCount: score * 10,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
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
      quizHistory, addQuizResult,
      isAmbientPlaying, setIsAmbientPlaying,
      soundVolumes, updateTrackVolume,
      dailyStats,
      formatTime
    }}>
      {children}
    </StudyContext.Provider>
  );
};
