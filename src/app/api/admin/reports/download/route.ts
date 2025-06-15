import { NextRequest, NextResponse } from 'next/server';
import { generateReportPDF } from '@/utils/pdfReport';

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const type = url.searchParams.get('type') || 'daily';
        const periods = parseInt(url.searchParams.get('periods') || '7');
        const year = parseInt(url.searchParams.get('year') || new Date().getFullYear().toString());

        // Fetch the report data
        const reportResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/admin/reports?type=${type}&periods=${periods}&year=${year}`,
            { headers: { 'Cookie': request.headers.get('Cookie') || '' } }
        );

        if (!reportResponse.ok) {
            throw new Error('Failed to fetch report data');
        }

        const reportData = await reportResponse.json();

        // Generate PDF
        const pdfBuffer = generateReportPDF(reportData);

        // Set headers for PDF download
        const headers = new Headers();
        const filename = `tirta-fresh-report-${type}-${new Date().toISOString().split('T')[0]}.pdf`;
        headers.set('Content-Disposition', `attachment; filename="${filename}"`);
        headers.set('Content-Type', 'application/pdf');
        headers.set('Content-Length', pdfBuffer.byteLength.toString());

        return new NextResponse(Buffer.from(pdfBuffer), {
            status: 200,
            headers
        });

    } catch (error) {
        console.error('Error generating PDF report:', error);
        return NextResponse.json(
            { error: 'Failed to generate PDF report' },
            { status: 500 }
        );
    }
}
