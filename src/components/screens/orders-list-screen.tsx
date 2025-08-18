"use client";

import type { Order } from '@/lib/types';
import OrderCard from '@/components/order-card';
import { Button } from '@/components/ui/button';
import { Plus, ClipboardList } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface OrdersListScreenProps {
  orders: Order[];
  onMarkAsCharged: (orderId: string) => void;
  onNewOrder: () => void;
}

export default function OrdersListScreen({ orders, onMarkAsCharged, onNewOrder }: OrdersListScreenProps) {
  return (
    <div className="relative min-h-[80vh] w-full">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold font-headline text-primary">Current Orders</h1>
        <p className="text-muted-foreground">Manage and track all incoming orders for this shift.</p>
      </div>

      {orders.length > 0 ? (
        <ScrollArea className="h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
            {orders.map(order => (
              <OrderCard key={order.id} order={order} onMarkAsCharged={onMarkAsCharged} />
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center text-muted-foreground border-2 border-dashed rounded-lg">
          <ClipboardList className="h-16 w-16 mb-4 text-gray-400" />
          <h2 className="text-2xl font-semibold text-foreground">No orders yet</h2>
          <p>Click the '+' button to create the first order.</p>
        </div>
      )}

      <Button
        size="icon"
        className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-2xl bg-accent hover:bg-accent/90"
        onClick={onNewOrder}
        aria-label="Create New Order"
      >
        <Plus className="h-8 w-8" />
      </Button>
    </div>
  );
}
