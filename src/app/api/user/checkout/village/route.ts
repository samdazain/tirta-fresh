import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const body = await req.json();
    const { villageId } = body;

    if (!villageId) return NextResponse.json({ error: 'villageId required' }, { status: 400 });

    try {
        // Check if village exists
        const village = await prisma.village.findUnique({
            where: { id: villageId }
        });

        if (!village) {
            return NextResponse.json({ error: 'Village not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Village selected', village });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: 'Failed to select village', details: errorMessage }, { status: 500 });
    }
}