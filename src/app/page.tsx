
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
import { Loader2, Plus, LogOut, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ShiftSummaryScreen from '@/components/screens/shift-summary-screen';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from '@/components/ui/alert-dialog';


export default function Home() {
  const { toast } = useToast();
  const [shift, setShift] = useLocalStorage<Shift>('shift-status', { isOpen: false, startTimestamp: null });
  const [orders, setOrders] = useLocalStorage<Order[]>('orders', []);
  const [sales, setSales] = useLocalStorage<Sale[]>('sales', []);
  const [view, setView] = useState<AppView | 'loading'>('loading');
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);


  useEffect(() => {
    setView(shift.isOpen ? 'orders_list' : 'shift_closed');
  }, [shift.isOpen]);

  const handleOpenShift = () => {
    setShift({ isOpen: true, startTimestamp: new Date().toISOString() });
    setView('orders_list');
  };

  const handleCloseShift = () => {
    setShift({ isOpen: false, startTimestamp: null });
    setOrders([]);
    setSales([]);
    setView('shift_closed');
  };

  const handleSaveOrder = (orderData: Omit<Order, 'id' | 'timestamp' | 'charged'>) => {
     if (!orderData.customerName) {
      toast({
        variant: "destructive",
        title: "Customer Name Required",
        description: "Please enter a name for the order.",
      });
      return;
    }
    if (!orderData.items.category || Object.keys(orderData.items.selections).length === 0) {
      toast({
        variant: "destructive",
        title: "Cannot Save Empty Order",
        description: "Please make selections before saving.",
      });
      return;
    }

    const newOrder: Order = {
      ...orderData,
      id: `order-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      charged: false,
    };
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    setShowNewEntry(false);
    toast({
      title: "Order Saved!",
      description: `Don't forget to mark it as 'Charged' once payment is received.`,
    });
  };
  
  const handleSaveSale = (sale: Omit<Sale, 'id' | 'timestamp'>) => {
    const newSale: Sale = {
      ...sale,
      id: `sale-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
    }
    setSales(prevSales => [newSale, ...prevSales]);
    setShowNewEntry(false);
    toast({
      title: "Sale Logged",
      description: `${sale.type === 'Membership' ? sale.membershipType : sale.name} sale logged.`
    });
  };

  const handleMarkOrderAsCharged = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, charged: true } : order
      )
    );
  };

  const handleMarkSaleAsCharged = (saleId: string) => {
    setSales(prevSales =>
      prevSales.map(sale =>
        sale.id === saleId ? { ...sale, charged: true } : sale
      )
    );
  };
  
  const renderView = () => {
    if (view === 'loading') {
      return (
        <div className="flex h-screen w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    if (view === 'shift_closed') {
      return <ShiftScreen onOpenShift={handleOpenShift} />;
    }
    if (!shift.isOpen) {
      return <ShiftScreen onOpenShift={handleOpenShift} />;
    }
    
    switch (view) {
      case 'orders_list':
        return <OrdersListScreen orders={orders} onMarkAsCharged={handleMarkOrderAsCharged} />;
      case 'sales':
        return <SalesScreen sales={sales} onSaveSale={handleSaveSale} onMarkAsCharged={handleMarkSaleAsCharged}/>;
      case 'shift_summary':
        return <ShiftSummaryScreen shift={shift} onCloseShift={handleCloseShift} />;
      default:
        return (
          <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        );
    }
  };

  const renderNewEntryScreen = () => {
    return (
      <div className="fixed inset-0 bg-background z-[100] p-4 flex flex-col">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary">New Entry</h1>
          <Button variant="ghost" size="icon" onClick={() => setShowNewEntry(false)}>
            <X className="h-6 w-6"/>
          </Button>
        </header>
        <NewOrderScreen menu={menu} onSaveOrder={handleSaveOrder} onSaveSale={handleSaveSale} />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans">
      <header className="w-full max-w-md mx-auto p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-primary">OrderFlow Lite</h1>
          <p className="text-xs text-muted-foreground">Current Shift</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsAboutDialogOpen(true)}>
          <Info className="h-5 w-5"/>
        </Button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="w-full max-w-md mx-auto">
         {renderView()}
        </div>
      </main>
      
      {showNewEntry && renderNewEntryScreen()}

      {shift.isOpen && !showNewEntry && (
        <>
          <BottomNav activeView={view as AppView} setView={setView} />
          <Button
            size="lg"
            className="fixed bottom-20 right-6 h-16 w-16 rounded-full shadow-2xl bg-accent hover:bg-accent/90 text-accent-foreground z-50"
            onClick={() => setShowNewEntry(true)}
            aria-label="Create New Entry"
          >
            <Plus className="h-8 w-8" />
          </Button>
        </>
      )}

      <AlertDialog open={isAboutDialogOpen} onOpenChange={setIsAboutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>About OrderFlow Lite</AlertDialogTitle>
            <AlertDialogDescription>
              Version 1.0.0
              <br />
              © 2024 Your Company Name. All Rights Reserved.
              <br /><br />
              This app is a personal workflow assistant designed to help you track orders and sales during your shift.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsAboutDialogOpen(false)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
