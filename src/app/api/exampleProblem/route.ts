import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ 
        exampleProblem: {
            name: "Add Two Numbers",
            description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
            solution: "[0]",
            parameter: "l1: ListNode, l2: ListNode",
            providedCode: 
            `

            
            function ListNode(val, next) {
                this.val = (val===undefined ? 0 : val)
                this.next = (next===undefined ? null : next)
            }


            `,
            testcase: 
            `
               
            
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


            `
        }
    });
}

