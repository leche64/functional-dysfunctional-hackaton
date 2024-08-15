export async function GET(req: Request): Promise<Response> {
    try {
        const apiUrl =
            "https://zenquotes.io/api/random";

        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const jsonString = JSON.stringify(data);
        return new Response(jsonString, { status: 200, headers: { "Cache-Control": "no-store" } });
    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
    }
}