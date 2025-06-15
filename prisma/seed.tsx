// File seed: prisma/seed.ts
// Script untuk menginisialisasi data admin pada database
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Hash password
    const hashedPassword = await bcrypt.hash('123123123', 10);

    // Membuat data admin default
    await prisma.admin.create({
        data: {
            name: 'Admin Tirta',
            email: 'admin@tirtafresh.com',
            password: hashedPassword,
        },
    });
}

main()
    .then(() => {
        console.log('🌱 Seeding selesai.');
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
