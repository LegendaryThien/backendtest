import { NextResponse } from 'next/server'

// Define an interface for leaderboard entries
interface LeaderboardEntry {
    rank: number;
    name: string;
}

// Use const instead of let since the reference isn't reassigned
const leaderboard: LeaderboardEntry[] = [];

// Add CORS headers to response
const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Allow all origins
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', // Allowed methods
    'Access-Control-Allow-Headers': 'Content-Type', // Allowed headers
};

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders })
}

// Add GET handler to fetch the leaderboard
export async function GET() {
    return NextResponse.json(leaderboard, { headers: corsHeaders })
}

export async function POST(request: Request) {
    try {
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
    } catch (error: unknown) {
        console.error('Leaderboard update error:', error);
        return NextResponse.json(
            { error: 'Failed to update leaderboard' },
            { status: 500, headers: corsHeaders }
        )
    }
}