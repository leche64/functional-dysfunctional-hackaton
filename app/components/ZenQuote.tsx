"use client";
import React, { useEffect, useState } from 'react';

const ZenQuote: React.FC = () => {
    const [quote, setQuote] = useState<string>('');
    const [author, setAuthor] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchQuote = async (): Promise<void> => {
            setLoading(true);
            const response = await fetch('/api/zenquote', {
                cache: 'no-store',
            });
            const data = await response.json();
            setQuote(data.q);
            setAuthor(data.a);
            // Generate a random wait time between 300ms (0.3s) and 1000ms (1s)
            const randomDelay = Math.random() * (1000 - 300) + 300;
            await new Promise(resolve => setTimeout(resolve, randomDelay));
            setLoading(false);
        };

        fetchQuote();

        const intervalId = setInterval(fetchQuote, 30000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="pt-[6rem] pl-[6rem] pr-[6rem]">
            {loading ? (
                <p style={{ fontSize: '1.5rem' }}>
                    Loading...
                </p>
            ) : (
                <>
                    <p style={{ fontSize: '1.5rem' }}>{quote}</p>
                    <p style={{ fontSize: '1.0rem', fontStyle: 'italic' }}>- {author}</p>
                </>
            )}
        </div>
    );
};

export default ZenQuote;