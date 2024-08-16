import { NextResponse } from 'next/server';
import { turso } from '../../db';

interface RequestBody {
    timer: string;
}

export async function POST(request: Request) {
    const body: RequestBody = await request.json();
    const timer = body.timer;
    console.log(timer);

    await turso.execute({
        sql: 'INSERT INTO time_table (time) VALUES (?)',
        args: [timer],
    });

    console.log('Timer logged successfully', timer);

    return NextResponse.json({ message: 'Timer logged successfully' });
}

export async function GET(request: Request) {
    const result = await turso.execute(
        'SELECT COUNT(*) FROM time_table'
    );
    console.log('Count retrieved successfully', result.rows[0][0]);

    const count = result.rows[0][0];
    
    // Set cache control headers to prevent caching
    const response = NextResponse.json({ count });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response; 
}