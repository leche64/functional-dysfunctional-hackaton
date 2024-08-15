"use client";
import { useState, useEffect } from "react";

const MovingButton = () => {
    const [buttonStyle, setButtonStyle] = useState({ left: '50%', top: '50%' });
    const [refreshButtonStyle, setRefreshButtonStyle] = useState({ left: '50%', top: '50%' });
    const [moveCount, setMoveCount] = useState(0);
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isTimerStopped, setIsTimerStopped] = useState(false);
    const [moveCountLimit, setMoveCountLImit] = useState(2);
    const [buttonText, setButtonText] = useState("Click me");
    const [isHoveringRefresh, setIsHoveringRefresh] = useState(false);
    const [maxTime, setMaxTime] = useState(10000);
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const [poopEmojis, setPoopEmojis] = useState<{ id: number; left: string; top: string; directionX: number; directionY: number }[]>([]);
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
                        setIsRunning(false); 
                        return maxTime; 
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
    }, []);

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

    
    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (isButtonClicked) return; 
        setIsButtonClicked(true); 
        setIsRunning(false);
        setIsTimerStopped(true);
        setButtonText("oh sh!t you clicked it..");

        const explosionCount = 169; 
        const newEmojis = Array.from({ length: explosionCount }, (_, index) => {
            const angle = Math.random() * 2 * Math.PI; 
            const speed = Math.random() * 2 + 2; 
            return {
                id: index,
                left: `${e.clientX}px`, 
                top: `${e.clientY}px`,   
                directionX: Math.cos(angle) * speed, 
                directionY: Math.sin(angle) * speed, 
            };
        });
        setPoopEmojis(newEmojis);

        // db
        try {
            const response = await fetch('/api/click', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ timer }), 
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error calling /api/click:', error);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setPoopEmojis(prevEmojis => 
                prevEmojis.map(emoji => ({
                    ...emoji,
                    left: `${parseFloat(emoji.left) + emoji.directionX}px`, 
                    top: `${parseFloat(emoji.top) + emoji.directionY}px`, 
                })).filter(emoji => 
                    parseFloat(emoji.top) < window.innerHeight && parseFloat(emoji.left) < window.innerWidth 
                )
            );
        }, 100);
        return () => clearInterval(interval);
    }, [poopEmojis]);

    const handleRefresh = () => {
        setMoveCount(0);
        setTimer(0);
        setIsTimerStopped(false);
        setButtonText("Click me");
        setIsRunning(false);
        setIsButtonClicked(false); 
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
                    disabled={isButtonClicked} 
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
            {poopEmojis.map(emoji => (
                <div key={emoji.id} style={{ position: 'absolute', left: emoji.left, top: emoji.top, fontSize: '2rem' }}>
                    💩
                </div>
            ))}
        </div>
    );
};

export default MovingButton;