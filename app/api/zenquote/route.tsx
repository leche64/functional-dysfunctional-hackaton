import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        console.log("getting new quote..", new Date().toLocaleString());
        const apiUrl = "https://zenquotes.io/api/quotes";

        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                pragma: "no-cache",
                expires: "0",
                cache: "no-store",
            },
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const randomObject = data[Math.floor(Math.random() * data.length)];
        const severResponse = NextResponse.json(randomObject);
        severResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        severResponse.headers.set('Pragma', 'no-cache');
        severResponse.headers.set('Expires', '0');
        severResponse.headers.set('Cache', 'no-store');

        return severResponse;
    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
    }
}
