import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
    try {
        const villages = await prisma.village.findMany({
            orderBy: { name: 'asc' }
        });

        return NextResponse.json({ villages });
    } catch (error) {
        console.error('Error fetching villages:', error);
        return NextResponse.json(
            { error: 'Failed to fetch villages' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
