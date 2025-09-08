
"use client";

import type { Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { X, Clock, ShoppingBasket, MessageSquare, Edit, Trash2, Circle, RefreshCw, AlertTriangle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface OrderDetailScreenProps {
  order: Order;
  onClose: () => void;
  onMarkAsCharged: (orderId: string) => void;
  onUnchargeOrder: (orderId: string) => void;
  onDeleteOrder: (orderId: string) => void;
  onEditOrder: (order: Order) => void;
}

export default function OrderDetailScreen({ order, onClose, onMarkAsCharged, onUnchargeOrder, onDeleteOrder, onEditOrder }: OrderDetailScreenProps) {
  const formattedTime = order.timestamp ? new Date(order.timestamp.toDate()).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }) : '...';
  
  const hasExtraToppings = 
    order.items.category === 'Protein Shake' && 
    order.items.selections['Toppings'] && 
    order.items.selections['Toppings'].length > 2;
  
  const getOrderDetail = () => {
    const { category, selections } = order.items;
    let detail = category;

    if (category === 'Coffee' || category === 'Tea') {
      const type = selections['Type']?.[0];
      if (type) detail = `${category} - ${type}`;
    } else if (category === 'Protein Shake') {
      const flavor = selections['Flavour']?.[0];
      if (flavor) detail = `${category} - ${flavor}`;
    } else if (category === 'Build Your Own Sandwich') {
        const protein = selections['Protein']?.[0];
        if (protein) detail = `${category} - ${protein}`;
    } else {
        const type = selections['Type']?.[0];
        if (type) detail = `${category} - ${type}`;
    }
    
    return detail;
  };

  const orderTitle = `${order.quantity > 1 ? `${order.quantity}x ` : ''}${order.customerName}`;

  return (
    <div className="fixed inset-0 bg-background z-[100] p-4 flex flex-col">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Order Details</h1>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6"/>
        </Button>
      </header>
      <ScrollArea className="flex-1">
        <Card>
          <CardHeader>
            <CardTitle>{orderTitle}</CardTitle>
            <CardDescription>{getOrderDetail()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-2 h-4 w-4" />
              <span>{formattedTime}</span>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold flex items-center"><ShoppingBasket className="mr-2 h-4 w-4"/>Selections</h4>
              {Object.entries(order.items.selections).map(([subcategory, items]) => (
                Array.isArray(items) && items.length > 0 && (
                  <div key={subcategory} className="pl-6">
                    <p className="font-medium text-foreground">{subcategory}</p>
                    <p className="text-muted-foreground">{items.join(', ')}</p>
                  </div>
                )
              ))}
            </div>

            {order.notes && (
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center"><MessageSquare className="mr-2 h-4 w-4"/>Notes</h4>
                <p className="pl-6 text-muted-foreground italic">"{order.notes}"</p>
              </div>
            )}
            
            {hasExtraToppings && (
                <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                    <AlertTriangle className="h-3 w-3" />
                    Additional Cost
                </Badge>
            )}

          </CardContent>
        </Card>
      </ScrollArea>
      <footer className="mt-4 grid grid-cols-2 gap-4">
         <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone. This will permanently delete this order.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDeleteOrder(order.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        <Button onClick={() => onEditOrder(order)}>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </Button>
      </footer>
      <div className="mt-2">
        {order.charged ? (
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full py-6 text-lg">
                        <RefreshCw className="mr-2 h-5 w-5"/> Uncharge
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Uncharge</AlertDialogTitle>
                        <AlertDialogDescription>Are you sure you want to mark this order as uncharged?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onUnchargeOrder(order.id)}>Yes, Uncharge</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        ) : (
             <Button size="lg" onClick={() => onMarkAsCharged(order.id)} className="w-full py-6 text-lg">
                <Circle className="mr-2 h-5 w-5" /> Mark as Charged
            </Button>
        )}
      </div>
    </div>
  );
}
