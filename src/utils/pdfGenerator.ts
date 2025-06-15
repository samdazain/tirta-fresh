import jsPDF from 'jspdf';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

interface InvoiceItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
}

interface InvoiceData {
    invoiceNumber: string;
    orderId: number;
    customerName: string;
    customerAddress: string;
    village: string;
    items: InvoiceItem[];
    total: number;
    dateCreated: string;
    datePaid?: string;
    status: string;
}

export const generateInvoicePDF = (invoiceData: InvoiceData): Uint8Array => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Colors
    const primaryColor = '#1E40AF'; // Blue-700
    const grayColor = '#6B7280'; // Gray-500
    const darkColor = '#111827'; // Gray-900

    // Helper function to format currency
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Helper function to add text with auto wrap
    const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10): number => {
        doc.setFontSize(fontSize);
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y);
        return y + (lines.length * (fontSize * 0.4));
    };

    let currentY = 20;

    // Header - Company Info
    doc.setFontSize(24);
    doc.setTextColor(primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Tirta Fresh', 20, currentY);

    doc.setFontSize(10);
    doc.setTextColor(grayColor);
    doc.setFont('helvetica', 'normal');
    doc.text('Depot Air Mineral Terbaik', 20, currentY + 8);
    doc.text('Kalianyar, Desa Jogoroto', 20, currentY + 16);
    doc.text('Jombang, Jawa Timur 62319', 20, currentY + 24);
    doc.text('Indonesia', 20, currentY + 32);

    // Invoice Title & Number (Right aligned)
    doc.setFontSize(20);
    doc.setTextColor(darkColor);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', pageWidth - 20, currentY, { align: 'right' });

    doc.setFontSize(10);
    doc.setTextColor(grayColor);
    doc.setFont('helvetica', 'normal');
    doc.text(invoiceData.invoiceNumber, pageWidth - 20, currentY + 10, { align: 'right' });
    doc.text(`Pesanan: #${invoiceData.orderId}`, pageWidth - 20, currentY + 18, { align: 'right' });
    doc.text(`Tanggal: ${format(parseISO(invoiceData.dateCreated), 'dd MMMM yyyy', { locale: id })}`, pageWidth - 20, currentY + 26, { align: 'right' });

    currentY += 50;

    // Bill To Section
    doc.setFontSize(12);
    doc.setTextColor(darkColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Tagihan untuk:', 20, currentY);

    currentY += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(invoiceData.customerName, 20, currentY);

    currentY += 6;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(grayColor);
    doc.text(invoiceData.village, 20, currentY);

    currentY += 6;
    currentY = addWrappedText(invoiceData.customerAddress, 20, currentY, 100, 10);

    currentY += 15;

    // Items Table Header
    const tableStartY = currentY;
    // const colWidths = [90, 25, 35, 35]; // Description, Qty, Price, Subtotal
    const colPositions = [20, 110, 135, 170];

    // Table header background
    doc.setFillColor(243, 244, 246); // Gray-100
    doc.rect(20, currentY - 3, pageWidth - 40, 12, 'F');

    doc.setFontSize(9);
    doc.setTextColor(darkColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Deskripsi', colPositions[0], currentY + 5);
    doc.text('Jumlah', colPositions[1], currentY + 5);
    doc.text('Harga Satuan', colPositions[2], currentY + 5);
    doc.text('Subtotal', colPositions[3], currentY + 5);

    currentY += 15;

    // Table Items
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(darkColor);

    let subtotal = 0;
    invoiceData.items.forEach((item, index) => {
        const itemSubtotal = item.price * item.quantity;
        subtotal += itemSubtotal;

        // Alternate row background
        if (index % 2 === 1) {
            doc.setFillColor(249, 250, 251); // Gray-50
            doc.rect(20, currentY - 3, pageWidth - 40, 10, 'F');
        }

        doc.setFontSize(9);
        doc.text(item.name, colPositions[0], currentY + 3);
        doc.text(item.quantity.toString(), colPositions[1], currentY + 3);
        doc.text(formatCurrency(item.price), colPositions[2], currentY + 3);
        doc.text(formatCurrency(itemSubtotal), colPositions[3], currentY + 3);

        currentY += 12;
    });

    // Table border
    doc.setDrawColor(229, 231, 235); // Gray-200
    doc.setLineWidth(0.5);
    doc.rect(20, tableStartY - 3, pageWidth - 40, currentY - tableStartY + 3);

    // Horizontal lines for table
    for (let i = 0; i <= invoiceData.items.length; i++) {
        const lineY = tableStartY + 12 + (i * 12);
        doc.line(20, lineY, pageWidth - 20, lineY);
    }

    // Vertical lines for table
    colPositions.forEach((pos, index) => {
        if (index > 0) {
            doc.line(pos - 5, tableStartY - 3, pos - 5, currentY + 3);
        }
    });

    currentY += 10;

    // Total Section
    doc.setDrawColor(75, 85, 99); // Gray-600
    doc.setLineWidth(1);
    doc.line(pageWidth - 90, currentY, pageWidth - 20, currentY);

    currentY += 8;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Total:', pageWidth - 90, currentY);
    doc.text(formatCurrency(subtotal), pageWidth - 20, currentY, { align: 'right' });

    currentY += 20;

    // Payment Information Box
    doc.setFillColor(249, 250, 251); // Gray-50
    doc.setDrawColor(229, 231, 235); // Gray-200
    doc.rect(20, currentY, pageWidth - 40, 25, 'FD');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(darkColor);
    doc.text('Informasi Pembayaran:', 25, currentY + 8);

    doc.setFont('helvetica', 'normal');
    const statusText = invoiceData.status === 'paid' ? 'LUNAS' :
        invoiceData.status === 'pending' ? 'MENUNGGU' : 'DIBATALKAN';
    const statusColor = invoiceData.status === 'paid' ? '#059669' : // Green-600
        invoiceData.status === 'pending' ? '#D97706' : '#DC2626'; // Yellow-600 : Red-600

    doc.text('Status: ', 25, currentY + 16);
    doc.setTextColor(statusColor);
    doc.setFont('helvetica', 'bold');
    doc.text(statusText, 45, currentY + 16);

    if (invoiceData.datePaid) {
        doc.setTextColor(darkColor);
        doc.setFont('helvetica', 'normal');
        doc.text(`Tanggal Pembayaran: ${format(parseISO(invoiceData.datePaid), 'dd MMMM yyyy', { locale: id })}`, 25, currentY + 22);
    }

    // Footer
    currentY = pageHeight - 30;
    doc.setFontSize(8);
    doc.setTextColor(grayColor);
    doc.setFont('helvetica', 'normal');
    doc.text('Terima kasih atas kepercayaan Anda kepada Tirta Fresh', pageWidth / 2, currentY, { align: 'center' });

    // Page number
    doc.text('Halaman 1 dari 1', pageWidth - 20, pageHeight - 10, { align: 'right' });

    return new Uint8Array(doc.output('arraybuffer'));
};
