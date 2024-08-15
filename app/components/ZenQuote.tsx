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
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache',
                },
            });
            const data = await response.json();
            setQuote(data[0].q);
            setAuthor(data[0].a);
            await new Promise(resolve => setTimeout(resolve, 800));
            setLoading(false);
        };

        fetchQuote();

        const intervalId = setInterval(fetchQuote, 10000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
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