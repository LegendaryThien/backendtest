import { NextResponse } from 'next/server'
import { exec } from 'child_process';
import { promises as fs } from 'fs';
import * as tmp from 'tmp';
import { promisify } from 'util';
import { PythonShell } from 'python-shell';
import path from 'path';

declare module 'tmp';

// all the CORS stuff so localhost can access the server
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400', // 24 hours
};

const execAsync = promisify(exec);

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


    // python
    else if (code.language === "python") {
        let tmpFile;
        try {
            // Create temporary file
            tmpFile = tmp.fileSync({ postfix: '.py' });
            const filePath = tmpFile.name;
            
            const testcase = `
def execute_test():
    l1 = ListNode(0)
    l2 = ListNode(0)
    
    # Get result
    result = addTwoNumbers(l1, l2)
    
    # Convert to array format
    output = []
    current = result
    while current:
        output.append(current.val)
        current = current.next
    
    print(output)

execute_test()
`;
            
            // Combine submission with test case
            const fullCode = `${code.submission}\n\n${testcase}`;
            
            // Write the code to temporary file
            await fs.writeFile(filePath, fullCode);

            // Execute Python code
            const { stdout, stderr } = await execAsync(`python3 "${filePath}"`);

            if (stderr) {
                throw new Error(stderr);
            }

            submissions.push(stdout.trim());
            return NextResponse.json({ 
                success: true, 
                results: stdout.trim() 
            }, { headers: corsHeaders });
            
        } catch (error: unknown) {
            return NextResponse.json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Execution failed'
            }, { headers: corsHeaders });
        } finally {
            // Cleanup temporary file
            if (tmpFile) {
                tmpFile.removeCallback();
            }
        }
    }



    // java
    else if (code.language === "java") {    
        try {
            // Create temporary directory
            const tmpDir = tmp.dirSync();
            const className = 'Solution';
            const javaFile = `${tmpDir.name}/${className}.java`; // Create Solution.java file
            
            // The test case for Java
            const testcase = `
    public static void main(String[] args) {
        ListNode l1 = new ListNode(0);
        ListNode l2 = new ListNode(0);
        
        ListNode result = addTwoNumbers(l1, l2);
        
        // Convert to array format
        java.util.List<Integer> output = new java.util.ArrayList<>();
        while (result != null) {
            output.add(result.val);
            result = result.next;
        }
        
        System.out.println(output.toString());
    }`;

            // Combine submission with test case
            const fullCode = `
public class ${className} {
    ${code.submission}
    
    ${testcase}
}`;

            // Write the code to Solution.java file
            await fs.writeFile(javaFile, fullCode);

            // Compile the Java code
            await execAsync(`javac ${javaFile}`);

            // Execute the compiled program
            const { stdout, stderr } = await execAsync(`java -cp ${tmpDir.name} ${className}`);

            if (stderr) {
                throw new Error(stderr);
            }

            submissions.push(stdout.trim());
            return NextResponse.json({ success: true, results: stdout.trim() }, { headers: corsHeaders });
        } catch (error: unknown) {
            return NextResponse.json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Execution failed'
            }, { headers: corsHeaders });
        }
    }




    
    // c++
    else if (code.language === "c++") {
        try {
            // Create temporary files
            const tmpobj = tmp.fileSync({ postfix: '.cpp' });
            const outputFile = tmp.tmpNameSync();

            // The test case for C++
            const testcase = `
int main() {
    // Call your function here
    ListNode* l1 = new ListNode(0);
    ListNode* l2 = new ListNode(0);
    
    ListNode* result = addTwoNumbers(l1, l2);
    
    // Convert result to output
    vector<int> output;
    while (result) {
        output.push_back(result->val);
        result = result.next;
    }
    
    // Print result
    cout << "[";
    for (size_t i = 0; i < output.size(); ++i) {
        if (i > 0) cout << ",";
        cout << output[i];
    }
    cout << "]" << endl;
    
    return 0;
}`;

            // Combine submission with test case and necessary includes
            const fullCode = `
#include <iostream>
#include <vector>
using namespace std;

${code.submission}

${testcase}`;

            // Write the code to temporary file
            await fs.writeFile(tmpobj.name, fullCode);

            // Compile the code
            await execAsync(`g++ ${tmpobj.name} -o ${outputFile}`);

            // Execute the compiled program
            const { stdout, stderr } = await execAsync(outputFile);

            if (stderr) {
                throw new Error(stderr);
            }

            submissions.push(stdout.trim());
            return NextResponse.json({ success: true, results: stdout.trim() }, { headers: corsHeaders });
        } catch (error: unknown) {
            return NextResponse.json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Execution failed'
            }, { headers: corsHeaders });
        }
    }

    // else
    else {
        return NextResponse.json({ success: false }, { headers: corsHeaders })
    }
}