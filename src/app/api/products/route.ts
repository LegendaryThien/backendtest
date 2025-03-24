import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ 
        products: [
            { id: 1, name: "Strawberries" },
            { id: 2, name: "Blueberries" },
            { id: 3, name: "Raspberries" },
        ],
    });
}

