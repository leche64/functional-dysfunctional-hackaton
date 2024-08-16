import { NextResponse } from 'next/server';

export async function GET(req: Request): Promise<Response> {
    try {
        console.log("getting new quote..")
        const apiUrl =
            "https://zenquotes.io/api/random";

        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate, proxy-revalidate",
                pragma: "no-cache",
                expires: "0",
            },
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const severResponse = NextResponse.json(data)
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');
        return severResponse
    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
    }
}