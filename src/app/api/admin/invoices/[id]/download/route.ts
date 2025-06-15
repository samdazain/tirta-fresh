import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateInvoicePDF } from '@/utils/pdfGenerator';

const prisma = new PrismaClient();

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const orderId = parseInt(id);

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                village: true,
                invoice: true
            }
        });

        if (!order) {
            return NextResponse.json(
                { error: 'Invoice not found' },
                { status: 404 }
            );
        }

        // Prepare invoice data for PDF generation
        const invoiceData = {
            invoiceNumber: `INV-${String(order.id).padStart(6, '0')}`,
            orderId: order.id,
            customerName: order.customerName,
            customerAddress: order.fullAddress,
            village: order.village.name,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            items: order.items as any[], // Type assertion for JSON field
            total: order.invoice?.total || 0,
            dateCreated: order.createdAt.toISOString(),
            datePaid: order.status === 'SELESAI' ? order.updatedAt.toISOString() : undefined,
            status: order.status === 'SELESAI' ? 'paid' : 'pending'
        };

        // Generate PDF
        const pdfBuffer = generateInvoicePDF(invoiceData);

        // Set headers for PDF download
        const headers = new Headers();
        headers.set('Content-Disposition', `attachment; filename="invoice-${invoiceData.invoiceNumber}.pdf"`);
        headers.set('Content-Type', 'application/pdf');
        headers.set('Content-Length', pdfBuffer.byteLength.toString());

        return new NextResponse(Buffer.from(pdfBuffer), {
            status: 200,
            headers
        });

    } catch (error) {
        console.error('Error generating PDF:', error);
        return NextResponse.json(
            { error: 'Failed to generate PDF' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
