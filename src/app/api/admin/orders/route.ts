import { NextRequest, NextResponse } from 'next/server';

// For demo purposes, we'll use an in-memory store
// In a real application, this would come from a database
const orders = [
    {
        id: 101,
        customerName: 'John Doe',
        items: [
            { id: 1, name: 'Gallon 19L', price: 25000, quantity: 2 },
            { id: 3, name: 'Small Bottle (330ml)', price: 3000, quantity: 5 },
        ],
        total: 65000,
        address: '123 Main St, Jakarta',
        paymentProof: '/uploads/payments/101.jpg',
        status: 'pending',
        createdAt: '2023-11-20T10:23:15Z',
        updatedAt: '2023-11-20T10:23:15Z',
    },
    {
        id: 102,
        customerName: 'Jane Smith',
        items: [
            { id: 2, name: 'Bottle Pack (12 × 600ml)', price: 36000, quantity: 1 },
        ],
        total: 41000, // including shipping
        address: '456 Park Ave, Bandung',
        paymentProof: '/uploads/payments/102.jpg',
        status: 'completed',
        createdAt: '2023-11-19T08:17:32Z',
        updatedAt: '2023-11-19T14:33:05Z',
    },
    {
        id: 103,
        customerName: 'Robert Brown',
        items: [
            { id: 4, name: 'Glass Water (250ml)', price: 8000, quantity: 12 },
            { id: 1, name: 'Gallon 19L', price: 25000, quantity: 1 },
        ],
        total: 126000,
        address: '789 Ocean Blvd, Surabaya',
        paymentProof: '/uploads/payments/103.jpg',
        status: 'shipped',
        createdAt: '2023-11-18T15:45:10Z',
        updatedAt: '2023-11-19T09:12:22Z',
    },
    {
        id: 104,
        customerName: 'Emily Johnson',
        items: [
            { id: 1, name: 'Gallon 19L', price: 25000, quantity: 3 },
        ],
        total: 80000,
        address: '321 River Rd, Medan',
        paymentProof: '/uploads/payments/104.jpg',
        status: 'cancelled',
        createdAt: '2023-11-17T11:32:45Z',
        updatedAt: '2023-11-18T10:15:30Z',
    },
    {
        id: 105,
        customerName: 'Michael Wilson',
        items: [
            { id: 2, name: 'Bottle Pack (12 × 600ml)', price: 36000, quantity: 2 },
            { id: 3, name: 'Small Bottle (330ml)', price: 3000, quantity: 10 },
        ],
        total: 107000,
        address: '567 Mountain View, Bali',
        paymentProof: '/uploads/payments/105.jpg',
        status: 'completed',
        createdAt: '2023-11-16T09:54:21Z',
        updatedAt: '2023-11-17T13:22:10Z',
    },
];

// GET all orders with optional filters
export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');

    let filteredOrders = [...orders];

    // Filter by status if provided
    if (status && status !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === status);
    }

    // Filter by search term if provided
    if (search) {
        const searchLower = search.toLowerCase();
        filteredOrders = filteredOrders.filter(order =>
            order.customerName.toLowerCase().includes(searchLower) ||
            order.id.toString().includes(searchLower)
        );
    }

    // Sort by most recent first
    filteredOrders.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ orders: filteredOrders }, { status: 200 });
}
