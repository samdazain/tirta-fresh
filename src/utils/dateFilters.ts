import { startOfDay, startOfWeek, startOfMonth, isAfter, isSameDay, parseISO } from 'date-fns';

export interface OrderForFiltering {
    createdAt: string;
}

export const filterOrdersByTimeframe = <T extends OrderForFiltering>(
    orders: T[],
    timeframe: string
): T[] => {
    if (timeframe === 'all') {
        return orders;
    }

    const now = new Date();
    let startDate: Date;

    switch (timeframe) {
        case 'today':
            startDate = startOfDay(now);
            break;
        case 'week':
            startDate = startOfWeek(now, { weekStartsOn: 1 }); // Monday as start of week
            break;
        case 'month':
            startDate = startOfMonth(now);
            break;
        default:
            return orders;
    }

    return orders.filter(order => {
        try {
            const orderDate = parseISO(order.createdAt);
            const orderDateStart = startOfDay(orderDate);

            // Include orders from the start date onwards
            return isAfter(orderDateStart, startDate) || isSameDay(orderDateStart, startDate);
        } catch (error) {
            console.error('Error parsing order date:', error);
            return false;
        }
    });
};

export const getTimeframeLabel = (timeframe: string): string => {
    switch (timeframe) {
        case 'today':
            return 'Hari Ini';
        case 'week':
            return 'Minggu Ini';
        case 'month':
            return 'Bulan Ini';
        case 'all':
        default:
            return 'Semua Waktu';
    }
};
