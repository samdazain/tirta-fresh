import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const villages = await prisma.village.findMany({
            orderBy: { name: 'asc' }
        });

        return NextResponse.json(villages);
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to fetch villages',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
