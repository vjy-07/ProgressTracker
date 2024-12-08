import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [title, setTitle] = useState('');
  const [days, setDays] = useState('');
  const [progress, setProgress] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [Confetti, setConfetti] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const [popupMessage, setPopupMessage] = useState(''); // State for the popup message
  const [popupTop, setPopupTop] = useState(0); // Dynamic top position for popup

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
        setShowConfetti(true); // Show confetti when task is completed
        setTimeout(() => setShowConfetti(false), 7000); // Hide confetti after 7 seconds
      });
    }
  }, [completed]);

  const handleStart = () => {
    if (title && days > 0) {
      setProgress(new Array(parseInt(days, 10)).fill(false));
      setCompleted(false);
    }
  };

  const handleClear = () => {
    // Reset the React state without affecting localStorage
    setTitle('');
    setDays('');
    setProgress([]);
    setCompleted(false);
  };

  const markDay = (index) => {
    const updatedProgress = [...progress];

    // Mark the current day as completed or incomplete
    if (updatedProgress[index] === false) {
      if (index === 0 || progress[index - 1]) {
        updatedProgress[index] = true; // Mark the current day as completed

        // Show popup with dynamic position
        setPopupMessage(`Great job on Day ${index + 1}! Keep it up!`);
        setPopupTop(window.scrollY + 20); // Position popup 20px below current scroll position
        setShowPopup(true); // Show popup message
        setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
      }
    } else {
      // Unstreak the last completed day
      if (index === progress.length - 1 || !progress[index + 1]) {
        updatedProgress[index] = false; // Unstreak (mark as incomplete)
      }
    }

    setProgress(updatedProgress);

    // Check if all days are completed to set the "completed" state
    if (updatedProgress.every((day) => day)) {
      setCompleted(true); // Set completed to true when all days are completed
    } else {
      setCompleted(false); // Reset completed to false if not all days are completed
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
        <button onClick={handleClear} className="clear-button">Clear</button>
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
              {showConfetti && Confetti && (
                <Confetti width={window.innerWidth} height={window.innerHeight} />
              )}
            </>
          )}
        </div>
      )}

      {/* Popup Message */}
      {showPopup && (
        <div className="popup-message" style={{ top: `${popupTop}px` }}>
          <p>{popupMessage}</p>
        </div>
      )}
    </div>
  );
};

export default App;
