import { NextResponse } from "next/server";


export async function GET() {
    return NextResponse.json({ 
       hello: "world",
    });
}

// interface for post request
interface ApiResponse {
    message: string;
  }

export async function POST(request: Request) {
    const data = await request.json() as string;
    
    const response: ApiResponse = {
        message: data === "4" 
            ? "You found the secret number!"
            : "That's not the secret number"
    };

    return NextResponse.json(response);
}

