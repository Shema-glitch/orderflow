
"use client";

import { useState } from 'react';
import type { Order } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CheckCircle2, Circle, ShoppingBasket, MessageSquare, Clock, Trash2, Edit, MoreVertical, AlertTriangle, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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


interface OrderCardProps {
  order: Order;
  onMarkAsCharged: (orderId: string) => void;
  onUnchargeOrder: (orderId: string) => void;
  onDeleteOrder: (orderId: string) => void;
  onEditOrder: (order: Order) => void;
  onViewOrder: (order: Order) => void;
}

export default function OrderCard({ order, onMarkAsCharged, onUnchargeOrder, onDeleteOrder, onEditOrder, onViewOrder }: OrderCardProps) {
  if (!order.items) {
    return null;
  }
  const [isUnchargeAlertOpen, setIsUnchargeAlertOpen] = useState(false);

  const formattedTime = new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  const initials = order.customerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  
  const hasExtraToppings = 
    order.items.category === 'Protein Shake' && 
    order.items.selections['Toppings'] && 
    order.items.selections['Toppings'].length > 2;
    
  const handleChargeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!order.charged) {
        onMarkAsCharged(order.id);
    } else {
        setIsUnchargeAlertOpen(true);
    }
  }

  const handleConfirmUncharge = () => {
    onUnchargeOrder(order.id);
    setIsUnchargeAlertOpen(false);
  }

  return (
    <Card 
        className={`w-full shadow-sm transition-all duration-300 border-l-4 ${order.charged ? 'border-success' : 'border-destructive'} cursor-pointer hover:shadow-md`}
        onClick={() => onViewOrder(order)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between space-x-2">
            <div className='flex-1 flex items-center'>
                 <Avatar className="h-10 w-10 mr-4">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">{initials}</AvatarFallback>
                 </Avatar>
                 <div>
                    <h3 className="font-bold text-lg text-foreground">
                        {order.customerName}
                    </h3>
                    <p className="text-sm text-muted-foreground -mt-1">{order.items.category}</p>
                </div>
            </div>
            <div className="flex items-center space-x-1" onClick={e => e.stopPropagation()}>
                <Button 
                    variant={order.charged ? 'outline' : 'destructive'}
                    size="sm"
                    className="rounded-full transition-colors"
                    onClick={handleChargeClick}
                >
                {order.charged ? <RefreshCw className="mr-2 h-4 w-4"/> : <Circle className="mr-2 h-5 w-5" />}
                {order.charged ? 'Uncharge' : 'Charge'}
                </Button>

                 <AlertDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditOrder(order)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                        </DropdownMenuItem>
                         <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                            </DropdownMenuItem>
                         </AlertDialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>
                     <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this order.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDeleteOrder(order.id)} className="bg-destructive hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                 </AlertDialog>
            </div>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground pl-1 mt-3">
           <div className="flex items-start">
                <ShoppingBasket className="mr-3 mt-1 h-4 w-4 text-primary/80"/>
                <div className='flex-1 flex flex-wrap'>
                    {Object.entries(order.items.selections).map(([subcategory, items]) => (
                         Array.isArray(items) && items.length > 0 && (
                            <div key={subcategory} className="mr-4 mb-1">
                               <span className="font-medium text-foreground/80">{subcategory}: </span>
                               <span>{items.join(', ')}</span>
                            </div>
                         )
                    ))}
                </div>
           </div>

           {order.notes && (
             <div className="flex items-start">
                <MessageSquare className="mr-3 mt-0.5 h-4 w-4 text-primary/80"/>
                <p className="flex-1 text-foreground/90 italic">"{order.notes}"</p>
             </div>
           )}

            <div className="flex items-center pt-1 gap-2">
                <Clock className="mr-1 h-4 w-4 text-primary/80"/>
                <span className="text-xs font-mono bg-muted px-2 py-1 rounded-md">{formattedTime}</span>
                {hasExtraToppings && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Additional Cost
                    </Badge>
                )}
            </div>
        </div>
        
      </CardContent>
       <AlertDialog open={isUnchargeAlertOpen} onOpenChange={setIsUnchargeAlertOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Uncharge</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to mark this order as uncharged?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmUncharge}>
                        Yes, Uncharge
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </Card>
  );
}

    