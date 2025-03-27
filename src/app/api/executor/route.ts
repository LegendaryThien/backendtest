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
interface Submission {
    submission: string;
    language: "javascript" | "python" | "java" | "c++";
}

const submissions: string[] = [];

export async function GET() {
    return NextResponse.json(submissions, { headers: corsHeaders })
}

export async function POST(request: Request) {
    const code = await request.json() as Submission;

    if (code.language === "javascript") {
        const testcase = `
            function executeTest() {
                const l1 = new ListNode(0);
                const l2 = new ListNode(0);

                // Get result
                const result = addTwoNumbers(l1, l2);

                // Convert to array format
                const output = [];
                let current = result;
                while (current) {
                    output.push(current.val);
                    current = current.next;
                }

                return JSON.stringify(output);
            }
            executeTest();
        `;
        const fullcode = code.submission + testcase;
        const result = eval(fullcode) as string;
        submissions.push(JSON.stringify(result));
        return NextResponse.json({ success: true, results: result }, { headers: corsHeaders });
    }
    else if (code.language === "python") {
        const testcase = '';
        // const fullcode = code.submission + testcase;  // Commented out since unused
        // TODO: Implement Python executor
        // submissions.push(result);
        return NextResponse.json({ success: true }, { headers: corsHeaders });
    }
    else if (code.language === "java") {    
        const testcase = '';
        // const fullcode = code.submission + testcase;  // Commented out since unused
        // TODO: Implement Java executor
        // submissions.push(result);
        return NextResponse.json({ success: true }, { headers: corsHeaders });
    }
    else if (code.language === "c++") {
        const testcase = '';
        // const fullcode = code.submission + testcase;  // Commented out since unused
        // TODO: Implement C++ executor
        // submissions.push(result);
        return NextResponse.json({ success: true }, { headers: corsHeaders });
    }
    else {
        return NextResponse.json({ success: false }, { headers: corsHeaders })
    }
}