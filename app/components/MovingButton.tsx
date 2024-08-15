"use client";
import { useState, useEffect } from "react";

const MovingButton = () => {
    const [buttonStyle, setButtonStyle] = useState({ left: '50%', top: '50%' });
    const [refreshButtonStyle, setRefreshButtonStyle] = useState({ left: '50%', top: '50%' });
    const [moveCount, setMoveCount] = useState(0);
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isTimerStopped, setIsTimerStopped] = useState(false);
    const [moveCountLimit, setMoveCountLImit] = useState(20);
    const [buttonText, setButtonText] = useState("Click me");
    const [isHoveringRefresh, setIsHoveringRefresh] = useState(false);
    const [maxTime, setMaxTime] = useState(10000);
    const [isButtonClicked, setIsButtonClicked] = useState(false); // New state for button click status
    const calculateBackgroundColor = () => {
        const darkness = Math.min((timer / maxTime) * 255, 255);
        const blueColor = 0x4983F6;
        const r = (blueColor >> 16) & 0xff;
        const g = (blueColor >> 8) & 0xff;
        const b = blueColor & 0xff;

        const newR = Math.max(255 - darkness, r);
        const newG = Math.max(255 - darkness, g);
        const newB = Math.max(255 - darkness, b);

        return `rgb(${newR}, ${newG}, ${newB})`;
    };
    const textColor = 'black';

    useEffect(() => {
        document.body.style.backgroundColor = calculateBackgroundColor();

        return () => {
            document.body.style.backgroundColor = "";
        };
    }, [timer]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning && timer < 60000) {
            interval = setInterval(() => {
                setTimer(prevTimer => {
                    if (prevTimer + 10 >= maxTime) {
                        setIsRunning(false); // Stop the timer when maxTime is reached
                        return maxTime; // Ensure timer does not exceed maxTime
                    }
                    return prevTimer + 10;
                });
            }, 10);
        }
        return () => clearInterval(interval);
    }, [isRunning, timer, maxTime]);

    useEffect(() => {
        const moveRefreshButton = () => {
            if (!isHoveringRefresh) {
                const buttonWidth = 100; 
                const buttonHeight = 50; 
                const containerWidth = 100; 
                const containerHeight = 100; 

                const randomX = Math.random() * (containerWidth - buttonWidth);
                const randomY = Math.random() * (containerHeight - buttonHeight);
                
                setRefreshButtonStyle({ left: `${randomX}%`, top: `${randomY}%` });
            }
        }; 

        const interval = setInterval(moveRefreshButton, 1700);
        return () => clearInterval(interval);
    }, []); // Keep this dependency to stop moving when hovered
    // }, [isHoveringRefresh]); // Keep this dependency to stop moving when hovered

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (moveCount >= moveCountLimit || isTimerStopped) return;

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

    
    const handleClick = async () => {
        if (isButtonClicked) return; // Prevent further clicks if already clicked
        setIsButtonClicked(true); // Set button as clicked
        setIsRunning(false);
        setIsTimerStopped(true);
        setButtonText("oh sh!t you clicked it..");

        // New code to call the API
        try {
            const response = await fetch('/api/click', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ timer }), // Pass the timer value
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error calling /api/click:', error);
        }
    };

    const handleRefresh = () => {
        setMoveCount(0);
        setTimer(0);
        setIsTimerStopped(false);
        setButtonText("Click me");
        setIsRunning(false);
        setIsButtonClicked(false); // Reset button click status
    };

    const formatTime = (time: number) => {
        const milliseconds = Math.floor(time % 1000);
        const seconds = Math.floor((time / 1000) % 60);
        const minutes = Math.floor((time / (1000 * 60)) % 60);
        const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
        return `${hours}h ${minutes}m ${seconds}s ${milliseconds}ms`;
    };

    const isButtonVisible = timer < maxTime; // Keep the original condition
    const showResetButton = timer >= maxTime || isTimerStopped; // Ensure reset button shows when maxTime is reached

    return (
        <div style={{ textAlign: 'center', position: 'relative', height: '50vh', width: '60vh', color: textColor }}>
            <h1 style={{ fontSize: '2rem' }}>{moveCount}</h1>
            <p style={{ fontSize: '1.5rem' }}>
                Elapsed Time: {formatTime(timer)}
            </p>
            {isButtonVisible && (
                <button
                    className={`px-4 py-2 font-bold text-white bg-blue-500 rounded ${isButtonClicked ? '' : 'hover:bg-blue-700'}`}
                    style={{ position: 'absolute', ...buttonStyle }}
                    onMouseMove={handleMouseMove}
                    onClick={handleClick}
                    onMouseEnter={() => !isTimerStopped && setIsRunning(true)}
                    disabled={isButtonClicked} // Disable button if clicked
                >
                    {buttonText}
                </button>
            )}
            {showResetButton && (
                <button
                    className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
                    style={{ position: 'absolute', ...refreshButtonStyle }} // Ensure it moves
                    onClick={handleRefresh}
                    onMouseEnter={() => setIsHoveringRefresh(true)}
                    onMouseLeave={() => setIsHoveringRefresh(false)}
                >
                    Reset
                </button>
            )}
        </div>
    );
};

export default MovingButton;