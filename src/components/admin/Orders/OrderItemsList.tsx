import React from 'react';

interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
}

interface OrderItemsListProps {
    items: OrderItem[];
    showTotal?: boolean;
    compact?: boolean;
}

const OrderItemsList: React.FC<OrderItemsListProps> = ({
    items,
    showTotal = false,
    compact = false
}) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    if (compact) {
        return (
            <div className="space-y-1">
                {items.map((item, index) => (
                    <div key={index} className="text-sm text-gray-600">
                        {item.quantity}x {item.name}
                    </div>
                ))}
                {items.length > 2 && (
                    <div className="text-xs text-gray-400">
                        +{items.length - 2} item lainnya
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500">
                            {formatCurrency(item.price)} x {item.quantity}
                        </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                    </div>
                </div>
            ))}
            {showTotal && (
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <div className="text-sm font-semibold text-gray-900">Subtotal:</div>
                    <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(calculateTotal())}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderItemsList;
