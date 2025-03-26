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
    const body = await request.json() as { name: string }
    const { name } = body

    // Check if user already exists
    const existingUser = leaderboard.find(user => user.name === name)
    
    if (!existingUser) {
        // If new user, add them to leaderboard
        leaderboard.push({ name, rank: leaderboard.length + 1 })
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders })
}