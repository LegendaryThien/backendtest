import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ 
        exampleProblem: {
            name: "Add Two Numbers",
            description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
            solution: "[0]",
            parameter: "l1: ListNode, l2: ListNode",
            hints: [
                "Draw out the addition process to understand how to handle carry-over digits.",
                "Remember that the numbers are stored in reverse order in the linked lists.",
                "Don't forget to handle cases where one list is longer than the other."
            ]
        }
    });
}