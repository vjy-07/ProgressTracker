import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [title, setTitle] = useState('');
  const [days, setDays] = useState('');
  const [progress, setProgress] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [Confetti, setConfetti] = useState(null);

  // Load progress and title from localStorage when the app starts
  useEffect(() => {
    const storedProgress = JSON.parse(localStorage.getItem('progress'));
    const storedTitle = localStorage.getItem('title');
    const storedDays = localStorage.getItem('days');
    const isCompleted = localStorage.getItem('completed') === 'true';

    if (storedProgress) setProgress(storedProgress);
    if (storedTitle) setTitle(storedTitle);
    if (storedDays) setDays(storedDays);
    setCompleted(isCompleted);
  }, []);

  // Save progress, title, and days to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('progress', JSON.stringify(progress));
    localStorage.setItem('title', title);
    localStorage.setItem('days', days);
    localStorage.setItem('completed', completed.toString());
  }, [progress, title, days, completed]);

  // Dynamically load the Confetti component when the task is completed
  useEffect(() => {
    if (completed) {
      import('react-confetti').then((module) => {
        setConfetti(module.default);
      });
    }
  }, [completed]);

  const handleStart = () => {
    if (title && days > 0) {
      setProgress(new Array(parseInt(days, 10)).fill(false));
      setCompleted(false);
    }
  };

  const markDay = (index) => {
    if (index === 0 || progress[index - 1]) {
      const updatedProgress = [...progress];
      updatedProgress[index] = true; // Mark the current day as completed
      setProgress(updatedProgress);

      if (updatedProgress.every((day) => day)) {
        setCompleted(true); // Set completed to true when all days are completed
      }
    }
  };

  return (
    <div className="app">
      <h1>Progress Tracker</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter Goal Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Number of Days"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          onInput={(e) => {
            if (e.target.value === '') {
              setDays('');
            }
          }}
        />
        <button onClick={handleStart}>Start Tracking</button>
      </div>

      {progress.length > 0 && (
        <div className="progress-container">
          <h2>{title}</h2>
          <div className="streaks">
            {progress.map((day, index) => (
              <div
                key={index}
                className={`streak ${day ? 'completed' : ''}`}
                onClick={() => markDay(index)}
              >
                <div className={`circle ${day ? 'fill' : ''}`}></div>
                <div className="day-number">Day {index + 1}</div>
              </div>
            ))}
          </div>
          {completed && (
            <>
              <h3 className="congratulations">🎉 Congratulations! 🎉</h3>
              {Confetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
