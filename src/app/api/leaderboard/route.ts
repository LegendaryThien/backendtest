import { NextResponse } from 'next/server'

// Define an interface for leaderboard entries
interface LeaderboardEntry {
    rank: number;
    name: string;
}

// Use const instead of let since the reference isn't reassigned
const leaderboard: LeaderboardEntry[] = [];

export async function POST(request: Request) {
    try {
        const body = await request.json() as { name: string }
        const { name } = body

        if (!name) {
            return NextResponse.json(
                { error: 'Name is required' },
                { status: 400 }
            )
        }

        // Check if user already exists
        const existingUser = leaderboard.find(user => user.name === name)
        
        if (!existingUser) {
            // If new user, add them to leaderboard
            leaderboard.push({ name, rank: leaderboard.length + 1 })
        }

        return NextResponse.json(leaderboard)
    } catch (error: unknown) {
        console.error('Leaderboard update error:', error);
        return NextResponse.json(
            { error: 'Failed to update leaderboard' },
            { status: 500 }
        )
    }
}