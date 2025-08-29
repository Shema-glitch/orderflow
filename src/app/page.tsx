
"use client";

import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { AppView, Order, Shift, Sale } from '@/lib/types';
import { menu as initialMenu } from '@/lib/menu-data';
import ShiftScreen from '@/components/screens/shift-screen';
import NewOrderScreen from '@/components/screens/new-order-screen';
import OrdersListScreen from '@/components/screens/orders-list-screen';
import AllOrdersScreen from '@/components/screens/all-orders-screen';
import SalesScreen from '@/components/screens/sales-screen';
import BottomNav from '@/components/bottom-nav';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Info, X, Sun, Moon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ShiftSummaryScreen from '@/components/screens/shift-summary-screen';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from '@/components/ui/alert-dialog';
import { useAuth, signInWithGoogle, signOutUser } from '@/lib/auth';
import type { User } from 'firebase/auth';
import LoginScreen from '@/components/screens/login-screen';


export default function Home() {
  const { toast } = useToast();
  const [shift, setShift] = useLocalStorage<Shift>('shift-status', { isOpen: false, startTimestamp: null });
  const [orders, setOrders] = useLocalStorage<Order[]>('orders', []);
  const [sales, setSales] = useLocalStorage<Sale[]>('sales', []);
  const [view, setView] = useState<AppView | 'loading'>('loading');
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const user = useAuth();
  const [menu, setMenu] = useLocalStorage('menu', initialMenu);

  useEffect(() => {
    // On mount, set theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    if (user !== null) { // Only set view if user is determined
      setView(shift.isOpen ? 'orders_list' : 'shift_closed');
    }
  }, [shift.isOpen, user]);

  const handleOpenShift = () => {
    setShift({ isOpen: true, startTimestamp: new Date().toISOString() });
    setView('orders_list');
  };

  const handleCloseShift = () => {
    setShift({ isOpen: false, startTimestamp: null });
    setOrders([]);
    setSales([]);
    setEditingOrder(null);
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
    const hasSelections = Object.values(orderData.items.selections).some(
      (selection) => Array.isArray(selection) && selection.length > 0
    );

    if (!orderData.items.category || !hasSelections) {
      toast({
        variant: "destructive",
        title: "Cannot Save Empty Order",
        description: "Please make selections before saving.",
      });
      return;
    }

    if (editingOrder) {
      // Update existing order
      setOrders(prevOrders => prevOrders.map(o => o.id === editingOrder.id ? {...o, ...orderData} : o));
      toast({
        title: "Order Updated!",
        description: `Changes to ${orderData.customerName}'s order have been saved.`,
      });
    } else {
      // Create new order
      const newOrder: Order = {
        ...orderData,
        id: `order-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date().toISOString(),
        charged: false,
      };
      setOrders(prevOrders => [newOrder, ...prevOrders]);
      toast({
        title: "Order Saved!",
        description: `Don't forget to mark it as 'Charged' once payment is received.`,
      });
    }
    
    setShowNewEntry(false);
    setEditingOrder(null);
  };
  
  const handleSaveSale = (sale: Omit<Sale, 'id' | 'timestamp'>) => {
    const newSale: Sale = {
      ...sale,
      id: `sale-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
    }
    setSales(prevSales => [newSale, ...prevSales]);
    toast({
      title: "Sale Logged",
      description: `${sale.type === 'Membership' ? sale.membershipType : sale.name} sale logged.`
    });
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setShowNewEntry(true);
  };

  const handleMarkOrderAsCharged = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, charged: true } : order
      )
    );
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
    toast({
      title: "Order Deleted",
      description: "The order has been removed from your list.",
    });
  };

  const handleMarkSaleAsCharged = (saleId: string) => {
    setSales(prevSales =>
      prevSales.map(sale =>
        sale.id === saleId ? { ...sale, charged: true } : sale
      )
    );
  };

  const closeNewEntryScreen = () => {
    setShowNewEntry(false);
    setEditingOrder(null);
  };
  
  const renderView = () => {
    if (user === null) {
      return <LoginScreen onSignIn={signInWithGoogle} />;
    }

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
        return <OrdersListScreen orders={orders} onMarkAsCharged={handleMarkOrderAsCharged} onDeleteOrder={handleDeleteOrder} onEditOrder={handleEditOrder} />;
      case 'all_orders':
        return <AllOrdersScreen orders={orders} onMarkAsCharged={handleMarkOrderAsCharged} onDeleteOrder={handleDeleteOrder} onEditOrder={handleEditOrder} />;
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
          <h1 className="text-2xl font-bold text-primary">{editingOrder ? 'Edit Order' : 'New Order'}</h1>
          <Button variant="ghost" size="icon" onClick={closeNewEntryScreen}>
            <X className="h-6 w-6"/>
          </Button>
        </header>
        <NewOrderScreen menu={menu} onSaveOrder={handleSaveOrder} editingOrder={editingOrder} />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans">
       <header className="w-full max-w-md mx-auto p-4 flex justify-between items-center bg-card shadow-sm z-50">
        <div>
          <h1 className="text-xl font-bold text-primary">OrderFlow Lite</h1>
          {user && <p className="text-xs text-muted-foreground">Current Shift</p>}
        </div>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            <Sun className="h-5 w-5 scale-100 rotate-0 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 scale-0 rotate-90 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          {user && (
            <>
              <Button variant="ghost" size="icon" onClick={() => setIsAboutDialogOpen(true)}>
                <Info className="h-5 w-5"/>
              </Button>
              <Button variant="ghost" size="icon" onClick={signOutUser}>
                <LogOut className="h-5 w-5"/>
              </Button>
            </>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="w-full max-w-md mx-auto">
         {renderView()}
        </div>
      </main>
      
      {showNewEntry && renderNewEntryScreen()}

      {user && shift.isOpen && !showNewEntry && (
        <>
          <BottomNav activeView={view as AppView} setView={setView} />
          <Button
            size="lg"
            className="fixed bottom-24 right-6 h-16 w-16 rounded-full shadow-2xl bg-primary hover:bg-primary/90 text-primary-foreground z-50"
            onClick={() => setShowNewEntry(true)}
            aria-label="Create New Order"
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
              Version 1.1.0
              <br />
              © 2025 Shema Charmant. All Rights Reserved.
              <br /><br />
              This app is a personal workflow assistant designed to help me track orders and sales during my shift.
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
