import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const history = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                village: true,
                payment: true,
                invoice: true
            }
        });
        return NextResponse.json(history);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: 'Failed to fetch order history', details: errorMessage }, { status: 500 });
    }
}