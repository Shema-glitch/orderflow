"use client";

import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { AppView, Order, Shift } from '@/lib/types';
import { menu } from '@/lib/menu-data';
import ShiftScreen from '@/components/screens/shift-screen';
import NewOrderScreen from '@/components/screens/new-order-screen';
import OrdersListScreen from '@/components/screens/orders-list-screen';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { toast } = useToast();
  const [shift, setShift] = useLocalStorage<Shift>('shift-status', { isOpen: false, startTimestamp: null });
  const [orders, setOrders] = useLocalStorage<Order[]>('orders', []);
  const [view, setView] = useState<AppView | 'loading'>('loading');

  useEffect(() => {
    if (shift.isOpen) {
      setView('orders_list');
    } else {
      setView('shift');
    }
  }, [shift.isOpen]);

  const handleOpenShift = () => {
    setShift({ isOpen: true, startTimestamp: new Date().toISOString() });
    setView('new_order');
    toast({
      title: "Shift Opened",
      description: "You can now start taking orders.",
    });
  };

  const handleCloseShift = () => {
    setShift({ isOpen: false, startTimestamp: null });
    setOrders([]); // Clear orders on shift close as per common practice
    setView('shift');
    toast({
      title: "Shift Closed",
      description: "All orders have been cleared.",
    });
  };

  const handleSaveOrder = (newOrder: Omit<Order, 'id' | 'timestamp' | 'charged'>) => {
    const orderWithDetails: Order = {
      ...newOrder,
      id: `order-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      charged: false,
    };
    setOrders(prevOrders => [orderWithDetails, ...prevOrders]);
    setView('orders_list');
    toast({
      title: "Order Saved",
      description: "The new order has been added to the list.",
    });
  };

  const handleMarkAsCharged = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, charged: true } : order
      )
    );
    toast({
      title: "Order Charged",
      description: "The order has been marked as paid.",
    });
  };
  
  const renderView = () => {
    switch (view) {
      case 'loading':
        return (
          <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )
      case 'shift':
        return <ShiftScreen isShiftOpen={shift.isOpen} onOpenShift={handleOpenShift} onCloseShift={handleCloseShift} />;
      case 'new_order':
        return <NewOrderScreen menu={menu} onSave={handleSaveOrder} onCancel={() => setView('orders_list')} />;
      case 'orders_list':
        return <OrdersListScreen orders={orders} onMarkAsCharged={handleMarkAsCharged} onNewOrder={() => setView('new_order')} />;
      default:
        return <ShiftScreen isShiftOpen={shift.isOpen} onOpenShift={handleOpenShift} onCloseShift={handleCloseShift} />;
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-background">
      <div className="w-full max-w-4xl mx-auto">
        {renderView()}
      </div>
    </main>
  );
}
