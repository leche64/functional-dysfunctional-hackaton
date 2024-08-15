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