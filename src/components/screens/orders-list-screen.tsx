
"use client";

import type { Order } from '@/lib/types';
import OrderCard from '@/components/order-card';
import { Button } from '@/components/ui/button';
import { Plus, ClipboardList, LogOut } from 'lucide-react';

interface OrdersListScreenProps {
  orders: Order[];
  onMarkAsCharged: (orderId: string) => void;
}

export default function OrdersListScreen({ orders, onMarkAsCharged }: OrdersListScreenProps) {
  return (
    <div className="w-full">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Live Orders</h1>
      </header>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} onMarkAsCharged={onMarkAsCharged} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center text-muted-foreground border-2 border-dashed rounded-lg p-4">
          <ClipboardList className="h-16 w-16 mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-foreground">No orders yet</h2>
          <p className="max-w-xs">Tap the floating '+' button to create the first order for this shift.</p>
        </div>
      )}
    </div>
  );
}
