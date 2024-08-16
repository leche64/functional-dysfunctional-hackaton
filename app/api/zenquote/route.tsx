import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        console.log("getting new quote..", new Date().toLocaleString());
        const apiUrl = "https://zenquotes.io/api/random";

        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                pragma: "no-cache",
                expires: "0",
            },
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const severResponse = NextResponse.json(data);
        severResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        severResponse.headers.set('Pragma', 'no-cache');
        severResponse.headers.set('Expires', '0');

        console.log(data[0].q);
        return severResponse;
    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
    }
}
