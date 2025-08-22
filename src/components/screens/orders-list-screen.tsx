
"use client";

import type { Order } from '@/lib/types';
import OrderCard from '@/components/order-card';
import { ClipboardList } from 'lucide-react';

interface OrdersListScreenProps {
  orders: Order[];
  onMarkAsCharged: (orderId: string) => void;
  onDeleteOrder: (orderId: string) => void;
}

export default function OrdersListScreen({ orders, onMarkAsCharged, onDeleteOrder }: OrdersListScreenProps) {
  const unchargedOrders = orders.filter(order => !order.charged);
  const chargedOrders = orders.filter(order => order.charged);

  return (
    <div className="w-full">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Uncharged Orders</h1>
        <span className="font-bold text-3xl text-destructive">{unchargedOrders.length}</span>
      </header>

      {unchargedOrders.length > 0 ? (
        <div className="space-y-4">
          {unchargedOrders.map(order => (
            <OrderCard key={order.id} order={order} onMarkAsCharged={onMarkAsCharged} onDeleteOrder={onDeleteOrder} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center text-muted-foreground border-2 border-dashed rounded-lg p-4 bg-card">
          <ClipboardList className="h-16 w-16 mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-foreground">No uncharged orders</h2>
          <p className="max-w-xs mt-1">When you create a new order, it will appear here.</p>
        </div>
      )}
    </div>
  );
}
