
"use client";

import type { Order } from '@/lib/types';
import OrderCard from '@/components/order-card';
import { ClipboardList, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AllOrdersScreenProps {
  orders: Order[];
  onMarkAsCharged: (orderId: string) => void;
  onDeleteOrder: (orderId: string) => void;
  onEditOrder: (order: Order) => void;
}

export default function AllOrdersScreen({ orders, onMarkAsCharged, onDeleteOrder, onEditOrder }: AllOrdersScreenProps) {

  return (
    <div className="w-full">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">All Orders</h1>
        <div className="flex items-center gap-2">
            <span className="font-bold text-3xl text-muted-foreground">{orders.length}</span>
            <Button variant="outline" size="icon" disabled>
                <Filter className="h-5 w-5"/>
            </Button>
        </div>
      </header>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} onMarkAsCharged={onMarkAsCharged} onDeleteOrder={onDeleteOrder} onEditOrder={onEditOrder} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center text-muted-foreground border-2 border-dashed rounded-lg p-4 bg-card">
          <ClipboardList className="h-16 w-16 mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-foreground">No orders yet</h2>
          <p className="max-w-xs mt-1">Tap the floating '+' button to add your first order.</p>
        </div>
      )}
    </div>
  );
}
