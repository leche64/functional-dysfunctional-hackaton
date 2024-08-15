"use client";
import { useState, useEffect } from "react";

const MovingButton = () => {
  const [buttonStyle, setButtonStyle] = useState({ left: '50%', top: '50%' });
  const [moveCount, setMoveCount] = useState(0);
  const [timer, setTimer] = useState(0); 
  const [isRunning, setIsRunning] = useState(false);
  const [isTimerStopped, setIsTimerStopped] = useState(false); 
  const [moveCountLimit, setMoveCountLImit] = useState(69);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 10); // Increment by 10 milliseconds for higher precision
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (moveCount >= moveCountLimit || isTimerStopped) return; // Stop moving after 5 times or if timer is stopped

    const button = e.currentTarget;
    const buttonRect = button.getBoundingClientRect();
    const offsetX = e.clientX - (buttonRect.left + buttonRect.width / 2);
    const offsetY = e.clientY - (buttonRect.top + buttonRect.height / 2);
    const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

    const moveDistance = 50;
    setButtonStyle({
      left: `${50 + (offsetX / distance) * moveDistance}%`,
      top: `${50 + (offsetY / distance) * moveDistance}%`,
    });

    setMoveCount(prevCount => prevCount + 1);
  };

  const handleClick = () => {
    setIsRunning(false); // Stop the timer when the button is clicked
    setIsTimerStopped(true); // Mark the timer as stopped
  };

  const formatTime = (time: number) => {
    const milliseconds = Math.floor(time % 1000);
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    return `${hours}h ${minutes}m ${seconds}s ${milliseconds}ms`;
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem' }}>{moveCount}</h1>
      <p style={{ fontSize: '1.5rem' }}>
        Elapsed Time: {formatTime(timer)} {/* Display formatted timer */}
      </p>
      <button 
        className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700" 
        style={{ position: 'absolute', ...buttonStyle }}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onMouseEnter={() => !isTimerStopped && setIsRunning(true)} // Start the timer only if it hasn't been stopped
      >
        Click me
      </button>
    </div>
  );
};

export default MovingButton;