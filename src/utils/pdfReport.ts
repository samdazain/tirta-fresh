import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface ReportData {
    reportType: string;
    period: string;
    reports: Array<{
        period: string;
        totalRevenue: number;
        totalItems: number;
        totalOrders: number;
        itemBreakdown: Array<{
            name: string;
            quantity: number;
            revenue: number;
            category: string;
        }>;
    }>;
    summary: {
        totalRevenue: number;
        totalItems: number;
        totalOrders: number;
        averageOrderValue: number;
    };
    productSales: Array<{
        name: string;
        quantity: number;
        revenue: number;
        category: string;
    }>;
    metadata: {
        generatedAt: string;
    };
}

export const generateReportPDF = (reportData: ReportData): Uint8Array => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let currentY = 20;

    // Colors
    const primaryColor = '#1E40AF';
    const grayColor = '#6B7280';
    const darkColor = '#111827';

    // Helper function to format currency
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Helper function to add new page if needed
    const checkPageSpace = (spaceNeeded: number) => {
        if (currentY + spaceNeeded > 280) {
            doc.addPage();
            currentY = 20;
        }
    };

    // Header
    doc.setFontSize(24);
    doc.setTextColor(primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Tirta Fresh', 20, currentY);

    doc.setFontSize(16);
    doc.setTextColor(darkColor);
    doc.text('Laporan Penjualan', 20, currentY + 12);

    // Report details
    doc.setFontSize(10);
    doc.setTextColor(grayColor);
    doc.setFont('helvetica', 'normal');
    doc.text(`Jenis Laporan: ${reportData.reportType.toUpperCase()}`, 20, currentY + 24);
    doc.text(`Periode: ${reportData.period}`, 20, currentY + 32);
    doc.text(`Dibuat: ${format(new Date(reportData.metadata.generatedAt), 'dd MMMM yyyy HH:mm', { locale: id })}`, 20, currentY + 40);

    currentY += 55;

    // Summary Section
    checkPageSpace(40);
    doc.setFontSize(14);
    doc.setTextColor(darkColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Ringkasan', 20, currentY);

    currentY += 10;

    // Summary boxes
    const summaryData = [
        { label: 'Total Penjualan', value: formatCurrency(reportData.summary.totalRevenue) },
        { label: 'Total Pesanan', value: reportData.summary.totalOrders.toLocaleString() },
        { label: 'Total Item Terjual', value: reportData.summary.totalItems.toLocaleString() },
        { label: 'Rata-rata Nilai Pesanan', value: formatCurrency(reportData.summary.averageOrderValue) }
    ];

    summaryData.forEach((item, index) => {
        const x = 20 + (index % 2) * 85;
        const y = currentY + Math.floor(index / 2) * 25;

        doc.setFillColor(249, 250, 251);
        doc.rect(x, y, 80, 20, 'F');
        doc.setDrawColor(229, 231, 235);
        doc.rect(x, y, 80, 20);

        doc.setFontSize(8);
        doc.setTextColor(grayColor);
        doc.text(item.label, x + 5, y + 8);

        doc.setFontSize(10);
        doc.setTextColor(darkColor);
        doc.setFont('helvetica', 'bold');
        doc.text(item.value, x + 5, y + 16);
    });

    currentY += 55;

    // Period Details Table
    checkPageSpace(60);
    doc.setFontSize(14);
    doc.setTextColor(darkColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Detail per Periode', 20, currentY);

    currentY += 15;

    // Table header
    doc.setFillColor(243, 244, 246);
    doc.rect(20, currentY - 5, pageWidth - 40, 12, 'F');

    doc.setFontSize(9);
    doc.setTextColor(darkColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Periode', 25, currentY + 3);
    doc.text('Pesanan', 80, currentY + 3);
    doc.text('Item Terjual', 110, currentY + 3);
    doc.text('Total Penjualan', 150, currentY + 3);

    currentY += 15;

    // Table data
    reportData.reports.forEach((report, index) => {
        checkPageSpace(10);

        if (index % 2 === 1) {
            doc.setFillColor(249, 250, 251);
            doc.rect(20, currentY - 3, pageWidth - 40, 10, 'F');
        }

        doc.setFontSize(8);
        doc.setTextColor(darkColor);
        doc.setFont('helvetica', 'normal');
        doc.text(report.period, 25, currentY + 3);
        doc.text(report.totalOrders.toString(), 80, currentY + 3);
        doc.text(report.totalItems.toString(), 110, currentY + 3);
        doc.text(formatCurrency(report.totalRevenue), 150, currentY + 3);

        currentY += 12;
    });

    // Top Products Section
    checkPageSpace(80);
    currentY += 10;

    doc.setFontSize(14);
    doc.setTextColor(darkColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Produk Terlaris', 20, currentY);

    currentY += 15;

    // Products table header
    doc.setFillColor(243, 244, 246);
    doc.rect(20, currentY - 5, pageWidth - 40, 12, 'F');

    doc.setFontSize(9);
    doc.setTextColor(darkColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Nama Produk', 25, currentY + 3);
    doc.text('Kategori', 90, currentY + 3);
    doc.text('Terjual', 125, currentY + 3);
    doc.text('Pendapatan', 155, currentY + 3);

    currentY += 15;

    // Top 10 products
    const topProducts = reportData.productSales.slice(0, 10);
    topProducts.forEach((product, index) => {
        checkPageSpace(10);

        if (index % 2 === 1) {
            doc.setFillColor(249, 250, 251);
            doc.rect(20, currentY - 3, pageWidth - 40, 10, 'F');
        }

        doc.setFontSize(8);
        doc.setTextColor(darkColor);
        doc.setFont('helvetica', 'normal');

        // Truncate long product names
        const productName = product.name.length > 20 ?
            product.name.substring(0, 20) + '...' : product.name;

        doc.text(productName, 25, currentY + 3);
        doc.text(product.category, 90, currentY + 3);
        doc.text(product.quantity.toString(), 125, currentY + 3);
        doc.text(formatCurrency(product.revenue), 155, currentY + 3);

        currentY += 12;
    });

    // Footer
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(grayColor);
        doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth - 40, 285);
        doc.text('Tirta Fresh - Laporan Penjualan', 20, 285);
    }

    return new Uint8Array(doc.output('arraybuffer') as ArrayBuffer);
};
