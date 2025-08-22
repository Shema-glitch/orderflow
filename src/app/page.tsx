
"use client";

import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { AppView, Order, Shift, OrderItem, Sale } from '@/lib/types';
import { menu } from '@/lib/menu-data';
import ShiftScreen from '@/components/screens/shift-screen';
import NewOrderScreen from '@/components/screens/new-order-screen';
import OrdersListScreen from '@/components/screens/orders-list-screen';
import SalesScreen from '@/components/screens/sales-screen';
import BottomNav from '@/components/bottom-nav';
import { useToast } from "@/hooks/use-toast";
import { Coffee, DollarSign, List, PlayCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { toast } = useToast();
  const [shift, setShift] = useLocalStorage<Shift>('shift-status', { isOpen: false, startTimestamp: null });
  const [orders, setOrders] = useLocalStorage<Order[]>('orders', []);
  const [sales, setSales] = useLocalStorage<Sale[]>('sales', []);
  const [view, setView] = useState<AppView | 'loading'>('loading');

  useEffect(() => {
    setView(shift.isOpen ? 'orders_list' : 'shift');
  }, [shift.isOpen]);

  const handleOpenShift = () => {
    setShift({ isOpen: true, startTimestamp: new Date().toISOString() });
    setView('orders_list');
  };

  const handleCloseShift = () => {
    setShift({ isOpen: false, startTimestamp: null });
    // Optional: Decide if orders/sales should be cleared or archived. Clearing for now.
    setOrders([]);
    setSales([]);
    setView('shift');
  };

  const handleSaveOrder = (orderItems: Omit<OrderItem, 'charged' | 'id' | 'timestamp'>) => {
    if (!orderItems.category || Object.keys(orderItems.selections).length === 0) {
      toast({
        variant: "destructive",
        title: "Cannot Save Empty Order",
        description: "Please make selections before saving.",
      });
      return;
    }

    const orderWithDetails: Order = {
      items: orderItems,
      id: `order-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      charged: false,
    };
    setOrders(prevOrders => [orderWithDetails, ...prevOrders]);
    setView('orders_list');
    toast({
      title: "Order Saved",
    });
  };
  
  const handleSaveSale = (sale: Omit<Sale, 'id' | 'timestamp'>) => {
    const newSale: Sale = {
      ...sale,
      id: `sale-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
    }
    setSales(prevSales => [newSale, ...prevSales]);
    toast({
      title: `${sale.name} Logged`,
    });
  };

  const handleMarkAsCharged = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, charged: true } : order
      )
    );
  };
  
  const renderView = () => {
    if (!shift.isOpen) {
      return <ShiftScreen onOpenShift={handleOpenShift} />;
    }
    
    switch (view) {
      case 'new_order':
        return <NewOrderScreen menu={menu} onSave={handleSaveOrder} />;
      case 'orders_list':
        return <OrdersListScreen orders={orders} onMarkAsCharged={handleMarkAsCharged} onNewOrder={() => setView('new_order')} onCloseShift={handleCloseShift} />;
      case 'sales':
        return <SalesScreen sales={sales} onSaveSale={handleSaveSale} />;
      case 'shift': // Should not be reachable when shift is open, but as a fallback
        return <ShiftScreen onOpenShift={handleOpenShift} />;
      default:
         return (
          <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans">
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="w-full max-w-md mx-auto">
         {renderView()}
        </div>
      </main>
      {shift.isOpen && <BottomNav activeView={view} setView={setView} />}
    </div>
  );
}
