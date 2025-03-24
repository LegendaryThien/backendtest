import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ 
       hello: "world",
    });
}

export async function POST(request: Request) {
    const data = await request.json();
    
    // Check if data equals "4"
    if (data === "4") {
        return NextResponse.json({
            success: true,
            message: "You found the secret number!"
        });
    }

    // If data is not "4"
    return NextResponse.json({
        success: false,
        message: "That's not the secret number"
    });
}

