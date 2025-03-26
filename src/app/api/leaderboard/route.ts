import { NextResponse } from 'next/server'

// all the CORS stuff so localhost can access the server
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders })
}

// the JUICE, the main stuff ahahaha
interface LeaderboardEntry {
    rank: number;
    name: string;
}

const leaderboard: LeaderboardEntry[] = [];

export async function GET() {
    return NextResponse.json(leaderboard, { headers: corsHeaders })
}

export async function POST(request: Request) {
    console.log('Received POST request');
    const body = await request.json() as { name: string }
    console.log('Parsed body:', body);
    const { name } = body

    if (!name) {
        console.log('Name is missing');
        return NextResponse.json(
            { error: 'Name is required' },
            { status: 400, headers: corsHeaders }
        )
    }

    // Check if user already exists
    const existingUser = leaderboard.find(user => user.name === name)
    console.log('Existing user:', existingUser);
    
    if (!existingUser) {
        // If new user, add them to leaderboard
        leaderboard.push({ name, rank: leaderboard.length + 1 })
        console.log('Added new user to leaderboard');
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders })
}