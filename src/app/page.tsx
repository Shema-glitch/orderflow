
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
import OrderDetailScreen from '@/components/screens/order-detail-screen';
import { ToastAction } from "@/components/ui/toast"
import { createShift, closeShift, listenToOrders, addOrder, updateOrder, deleteOrder, listenToSales, addSale, deleteSale, updateSale } from '@/lib/firestore';
import { Badge } from '@/components/ui/badge';
import isEqual from 'lodash.isequal';


export default function Home() {
  const { toast } = useToast();
  const [shift, setShift] = useState<Shift | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [view, setView] = useState<AppView | 'loading'>('loading');
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const { user, loading: authLoading } = useAuth();
  const [menu, setMenu] = useLocalStorage('menu', initialMenu);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [salesLoading, setSalesLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [isOfflineDialogOpen, setIsOfflineDialogOpen] = useState(false);
  const [isShiftLoading, setIsShiftLoading] = useState(true);
  

  useEffect(() => {
    // Handle online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
        setIsOnline(false);
        setIsOfflineDialogOpen(true);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial status
    if (typeof window.navigator.onLine !== 'undefined') {
        setIsOnline(window.navigator.onLine);
    }
    
    // Cleanup function
    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
  }, []);

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

  // Fetch/Create shift and then listen for data
  useEffect(() => {
    if (authLoading) {
      setView('loading');
      return;
    }
  
    // This is the cleanup function that will be called when the component unmounts
    // or when the dependencies (user, authLoading) change.
    let ordersUnsubscribe: (() => void) | null = null;
    let salesUnsubscribe: (() => void) | null = null;
  
    const setupShiftAndListeners = async () => {
      if (!user) {
        // Clear all state when user logs out
        setShift(null);
        setOrders([]);
        setSales([]);
        setView('shift_closed');
        setIsShiftLoading(false);
        return;
      }
  
      try {
        setIsShiftLoading(true);
        setView('loading');
        setOrdersLoading(true);
        setSalesLoading(true);
  
        const newShift = await createShift(user.uid);
        setShift(newShift);
  
        // Now that we have a valid shift, start listening for data.
        if (newShift?.id) {
          ordersUnsubscribe = listenToOrders(newShift.id, (loadedOrders) => {
            setOrders(loadedOrders);
            setOrdersLoading(false);
          });
          
          salesUnsubscribe = listenToSales(newShift.id, (loadedSales) => {
            setSales(loadedSales);
            setSalesLoading(false);
          });
        } else {
          // This case might happen if createShift returns null or an invalid shift
          setOrdersLoading(false);
          setSalesLoading(false);
        }
  
        setView('orders_list');
      } catch (error) {
        console.error("Error setting up shift:", error);
        toast({
            variant: "destructive",
            title: "Could Not Start Shift",
            description: "There was a problem starting the session. Please check your connection and try again."
        });
        signOutUser(); // Log out on critical failure
      } finally {
        setIsShiftLoading(false);
      }
    };
  
    setupShiftAndListeners();
  
    // Return a cleanup function for this effect
    return () => {
      if (ordersUnsubscribe) {
        ordersUnsubscribe();
      }
      if (salesUnsubscribe) {
        salesUnsubscribe();
      }
    };
  }, [user, authLoading]);


  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  const handleOpenShift = async () => {
    if (!user) return;
    
    // The main useEffect hook already handles shift creation.
    // This function can be simplified or removed if not needed for a manual "start new shift" button
    // during an active session. For now, we'll assume the main useEffect is sufficient.
    // If you need a manual refresh, we can re-implement this safely.
    toast({ title: "Shift is already active."});
  };

  const handleCloseShift = async (force = false) => {
    if (shift) {
      const unchargedOrdersCount = orders.filter(o => !o.charged).length;
      const unchargedSalesCount = sales.filter(s => !s.charged).length;
      
      if (!force && (unchargedOrdersCount > 0 || unchargedSalesCount > 0)) {
        return;
      }
      
      await closeShift(shift.id);
      // Let the main useEffect handle state cleanup when user is logged out (or if we re-trigger it)
    }
  };

  const handleSaveOrder = async (orderData: Omit<Order, 'id' | 'timestamp' | 'charged' | 'shiftId' | 'userId'>): Promise<boolean> => {
     if (!shift || !user) {
        toast({
            variant: "destructive",
            title: "No Active Shift",
            description: "Cannot save order because there is no active shift.",
        });
        return false;
     }

     if (!orderData.customerName) {
      toast({
        variant: "destructive",
        title: "Customer Name Required",
        description: "Please enter a name for the order.",
      });
      return false; // Indicate failure
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
      return false; // Indicate failure
    }

    // Check for duplicates
    if (!editingOrder) {
      const isDuplicate = orders.some(order => 
        order.customerName.trim().toLowerCase() === orderData.customerName.trim().toLowerCase() &&
        isEqual(order.items, orderData.items)
      );
      if (isDuplicate) {
        toast({
          variant: "destructive",
          title: "Duplicate Order",
          description: "This exact order for this customer already exists.",
        });
        return false;
      }
    }


    try {
      if (editingOrder) {
        // Update existing order
        await updateOrder(shift.id, editingOrder.id, orderData);
        toast({
          title: "Order Updated!",
          description: `Changes to ${orderData.customerName}'s order have been saved.`,
        });
      } else {
        await addOrder(shift.id, user.uid, orderData);
        toast({
          title: "Order Saved!",
          description: `Don't forget to mark it as 'Charged' once payment is received.`,
        });
      }
      setShowNewEntry(false);
      setEditingOrder(null);
      return true; 
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not save the order. Please try again.",
      });
      console.error("Error saving order: ", error);
      return false;
    }
  };
  
  const handleSaveSale = async (sale: Omit<Sale, 'id' | 'timestamp' | 'shiftId' | 'charged' | 'userId'>) => {
    if (!shift || !user) return;
    try {
        await addSale(shift.id, user.uid, sale);
        toast({
            title: "Sale Logged",
            description: `${sale.type === 'Membership' ? sale.customerName : sale.name} sale logged.`
        });
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Log Sale Failed",
            description: "Could not log the sale. Please try again.",
        });
        console.error("Error logging sale: ", error);
    }
  };
  
  const handleEditSale = (sale: Sale) => {
    console.log('Editing sale:', sale);
    toast({
      title: "Edit Sale (Not Implemented)",
      description: "The UI for editing sales is not yet built.",
    });
  };

  const handleDeleteSale = async (saleId: string) => {
    if (!shift) return;
    const saleToDelete = sales.find(s => s.id === saleId);
    if (!saleToDelete) return;

    try {
        await deleteSale(shift.id, saleId);
        toast({
            title: "Sale Deleted",
            description: `${saleToDelete.type === 'Membership' ? saleToDelete.customerName : saleToDelete.name} sale has been removed.`,
        });
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Delete Failed",
            description: "Could not delete the sale. Please try again.",
        });
        console.error("Error deleting sale: ", error);
    }
  };


  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setViewingOrder(null); // Close detail view if open
    setShowNewEntry(true);
  };

  const handleMarkOrderAsCharged = async (orderId: string) => {
    if (!shift) return;
    try {
      await updateOrder(shift.id, orderId, { charged: true });
      setViewingOrder(prev => prev && prev.id === orderId ? { ...prev, charged: true } : prev);
    } catch (error) {
      console.error("Error marking order as charged: ", error);
    }
  };
  
  const handleUnchargeOrder = async (orderId: string) => {
    if (!shift) return;
    try {
      await updateOrder(shift.id, orderId, { charged: false });
      setViewingOrder(prev => prev && prev.id === orderId ? { ...prev, charged: false } : prev);
    } catch (error) {
       console.error("Error uncharging order: ", error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!shift) return;
    try {
      await deleteOrder(shift.id, orderId);
      setViewingOrder(null);
      toast({
        title: "Order Deleted",
        description: "The order has been removed from your list.",
      });
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Delete Failed",
            description: "Could not delete the order. Please try again.",
        });
        console.error("Error deleting order: ", error);
    }
  };

  const handleMarkSaleAsCharged = async (saleId: string) => {
    if (!shift) return;
    try {
        await updateSale(shift.id, saleId, { charged: true });
    } catch (error) {
        console.error("Error marking sale as charged: ", error);
    }
  };

  const closeNewEntryScreen = () => {
    setShowNewEntry(false);
    setEditingOrder(null);
  };

  const handleViewOrder = (order: Order) => {
    setViewingOrder(order);
  };
  
  const renderView = () => {
    if (authLoading || isShiftLoading || view === 'loading') {
      return (
        <div className="flex h-screen w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!user) {
      return <LoginScreen onSignIn={signInWithGoogle} />;
    }

    if (!shift) {
      return <ShiftScreen onOpenShift={handleOpenShift} />;
    }
    
    switch (view) {
      case 'orders_list':
        return <OrdersListScreen orders={orders} isLoading={ordersLoading} onMarkAsCharged={handleMarkOrderAsCharged} onDeleteOrder={handleDeleteOrder} onEditOrder={handleEditOrder} onUnchargeOrder={handleUnchargeOrder} onViewOrder={handleViewOrder} />;
      case 'all_orders':
        return <AllOrdersScreen orders={orders} isLoading={ordersLoading} onMarkAsCharged={handleMarkOrderAsCharged} onDeleteOrder={handleDeleteOrder} onEditOrder={handleEditOrder} onUnchargeOrder={handleUnchargeOrder} onViewOrder={handleViewOrder} />;
      case 'sales':
        return <SalesScreen sales={sales} isLoading={salesLoading} onSaveSale={handleSaveSale} onMarkAsCharged={handleMarkSaleAsCharged} onEditSale={handleEditSale} onDeleteSale={handleDeleteSale} />;
      case 'shift_summary':
        return <ShiftSummaryScreen shift={shift} orders={orders} sales={sales} onCloseShift={handleCloseShift} />;
      default:
        return <OrdersListScreen orders={orders} isLoading={ordersLoading} onMarkAsCharged={handleMarkOrderAsCharged} onDeleteOrder={handleDeleteOrder} onEditOrder={handleEditOrder} onUnchargeOrder={handleUnchargeOrder} onViewOrder={handleViewOrder} />;
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

  const renderOrderDetailScreen = () => {
    if (!viewingOrder) return null;
    return (
      <OrderDetailScreen
        order={viewingOrder}
        onClose={() => setViewingOrder(null)}
        onMarkAsCharged={handleMarkOrderAsCharged}
        onUnchargeOrder={handleUnchargeOrder}
        onDeleteOrder={handleDeleteOrder}
        onEditOrder={handleEditOrder}
      />
    );
  };
  
  if (authLoading || isShiftLoading) {
     return (
        <div className="flex h-screen w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans">
      <header className="w-full max-w-md mx-auto p-4 flex justify-between items-center bg-card shadow-sm z-50">
        <div>
          <h1 className="text-xl font-bold text-primary">OrderFlow Lite</h1>
          {user && shift && (
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-muted-foreground">Current Shift</p>
                <Badge variant={isOnline ? "success" : "destructive"} className={`transition-colors ${isOnline ? 'animate-ring' : ''}`}>
                    {isOnline ? 'Online' : 'Offline'}
                </Badge>
              </div>
          )}
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
      {renderOrderDetailScreen()}

      {user && shift && !showNewEntry && !viewingOrder && (
        <>
          <BottomNav activeView={view as AppView} setView={setView} />
          <Button
            size="lg"
            className="fixed bottom-24 right-6 h-16 w-16 rounded-full shadow-2xl bg-primary hover:bg-primary/90 text-primary-foreground z-50 ring-4 ring-primary/30 hover:ring-primary/40 dark:ring-offset-background"
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

       <AlertDialog open={isOfflineDialogOpen} onOpenChange={setIsOfflineDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You are Offline</AlertDialogTitle>
            <AlertDialogDescription>
              Your internet connection was lost. You can continue to work as normal. All changes will be saved locally and will sync automatically when you reconnect.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsOfflineDialogOpen(false)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


    