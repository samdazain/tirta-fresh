// Seed file: prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // Admin
    await prisma.admin.create({
        data: {
            name: 'Admin Tirta',
            email: 'admin@tirtafresh.com',
            password: '123123123',
        },
    });

    // Villages
    await prisma.village.createMany({
        data: [
            { name: 'Desa D' },
            { name: 'Desa E' },
            { name: 'Desa F' },
        ],
    });

    // Products
    await prisma.product.createMany({
        data: [
            {
                name: 'Galon 19L', category: 'GALON', price: 15000, imageUrl: 'blob://galon.jpg',
                stock: 100
            },
            {
                name: 'Botol 1L', category: 'BOTOL', price: 7000, imageUrl: 'blob://botol.jpg',
                stock: 100
            },
            {
                name: 'Gelas 240ml', category: 'GELAS', price: 2000, imageUrl: 'blob://gelas.jpg',
                stock: 100
            },
            {
                name: 'Tissue', category: 'LAINNYA', price: 3000, imageUrl: 'blob://tissue.jpg',
                stock: 100
            },
        ],
    });

    // Dummy Order
    const village = await prisma.village.findFirst();
    const order = await prisma.order.create({
        data: {
            customerName: 'Budi',
            fullAddress: 'Jl. Raya 123',
            items: [{ productId: 1, quantity: 2 }],
            villageId: village?.id || 1,
            status: 'SELESAI',
        },
    });

    // Payment
    await prisma.payment.create({
        data: {
            orderId: order.id,
            blobData: Buffer.from(String(123132123)),
        },
    });

    // Invoice
    await prisma.invoice.create({
        data: {
            orderId: order.id,
            total: 30000,
        },
    });

}

main()
    .then(() => {
        console.log('🌱 Seeding completed.');
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
