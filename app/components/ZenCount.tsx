"use client"
import React, { useEffect, useState } from 'react';

const ZenCount: React.FC = () => {
    const [count, setCount] = useState<number | null>(null);
    const [position, setPosition] = useState({ top: 0, right: 0 });

    useEffect(() => {
        const fetchCount = async () => {
            const response = await fetch('/api/click', { cache: 'no-store' });
            const data = await response.json();
            setCount(data.count);
        };

        fetchCount();
        const intervalFetch = setInterval(fetchCount, 30000);
        const moveText = () => {
            setPosition((prevPosition) => ({
                ...prevPosition,
                top: Math.random() * (window.innerHeight - 50),
                right: Math.random() * (window.innerWidth - 100),
            }));
        };

        const intervalMove = setInterval(moveText, 2000);
        return () => {
            clearInterval(intervalFetch);
            clearInterval(intervalMove);
        };
    }, []);
    return (
        <div style={{ position: 'absolute', top: position.top, right: position.right, fontSize: '24px' }}>
            {count !== null ? "Total Zen Achieved: " + count : "loading zen counter.."}
        </div>
    );
};

export default ZenCount;