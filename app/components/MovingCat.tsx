"use client";
import React, { useEffect, useState } from 'react';

const MovingCat = () => {
  const [position, setPosition] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => {
        let newPos = prev + direction * 5;
        if (newPos > window.innerWidth - 100 || newPos < 0) {
          setDirection(-direction);
        }
        return newPos;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [direction]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100px', overflow: 'hidden' }}>
      <svg
        style={{
          position: 'absolute',
          left: `${position}px`,
          bottom: '0',
          transition: 'transform 0.3s ease',
          transform: `scaleX(${direction})`,
        }}
        width="100"
        height="100"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="40" fill="orange" />
        <circle cx="35" cy="35" r="5" fill="white" />
        <circle cx="65" cy="35" r="5" fill="white" />
        <circle cx="35" cy="35" r="2" fill="black" />
        <circle cx="65" cy="35" r="2" fill="black" />
        <path d="M30 70 Q50 90, 70 70" stroke="black" strokeWidth="5" fill="transparent" />
        <path d="M20 30 L10 10 L30 20 Z" fill="orange" />
        <path d="M80 30 L90 10 L70 20 Z" fill="orange" />
        <path d="M70 60 Q90 50, 80 70" stroke="orange" strokeWidth="5" fill="transparent" />
      </svg>
    </div>
  );
};

export default MovingCat;