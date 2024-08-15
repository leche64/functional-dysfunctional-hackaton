"use client";
import { useState, useEffect } from "react";

const MovingButton = () => {
    const [buttonStyle, setButtonStyle] = useState({ left: '50%', top: '50%' });
    const [refreshButtonStyle, setRefreshButtonStyle] = useState({ left: '50%', top: '50%' });
    const [moveCount, setMoveCount] = useState(0);
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isTimerStopped, setIsTimerStopped] = useState(false);
    const [moveCountLimit, setMoveCountLImit] = useState(3);
    const [buttonText, setButtonText] = useState("Click me");
    const [isHoveringRefresh, setIsHoveringRefresh] = useState(false);
    const [maxTime, setMaxTime] = useState(60000);
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
                setTimer(prevTimer => prevTimer + 10);
            }, 10);
        }
        return () => clearInterval(interval);
    }, [isRunning, timer]);

    useEffect(() => {
        const moveRefreshButton = () => {
            if (!isHoveringRefresh) {
                const randomX = Math.random() * 100;
                const randomY = Math.random() * 100;
                setRefreshButtonStyle({ left: `${randomX}%`, top: `${randomY}%` });
            }
        };

        const interval = setInterval(moveRefreshButton, 2500);
        return () => clearInterval(interval);
    }, [isTimerStopped, isHoveringRefresh]);

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

    const handleClick = () => {
        setIsRunning(false);
        setIsTimerStopped(true);
        setButtonText("oh sh!t you clicked me..");
    };

    const handleRefresh = () => {
        setMoveCount(0);
        setTimer(0);
        setIsTimerStopped(false);
        setButtonText("Click me");
        setIsRunning(false);
    };

    const formatTime = (time: number) => {
        const milliseconds = Math.floor(time % 1000);
        const seconds = Math.floor((time / 1000) % 60);
        const minutes = Math.floor((time / (1000 * 60)) % 60);
        const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
        return `${hours}h ${minutes}m ${seconds}s ${milliseconds}ms`;
    };

    const isButtonVisible = timer < maxTime;
    const showResetButton = timer >= maxTime || isTimerStopped;

    return (
        <div style={{ textAlign: 'center', position: 'relative', height: '100vh', color: textColor }}>
            <h1 style={{ fontSize: '2rem' }}>{moveCount}</h1>
            <p style={{ fontSize: '1.5rem' }}>
                Elapsed Time: {formatTime(timer)}
            </p>
            {isButtonVisible && (
                <button
                    className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                    style={{ position: 'absolute', ...buttonStyle }}
                    onMouseMove={handleMouseMove}
                    onClick={handleClick}
                    onMouseEnter={() => !isTimerStopped && setIsRunning(true)}
                >
                    {buttonText}
                </button>
            )}
            {showResetButton && (
                <button
                    className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
                    style={{ position: 'absolute', ...refreshButtonStyle }}
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