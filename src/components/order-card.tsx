
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
  DropdownMenuSeparator
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

  const formattedTime = new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  const initials = order.customerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  
  const hasExtraToppings = 
    order.items.category === 'Protein Shake' && 
    order.items.selections['Toppings'] && 
    order.items.selections['Toppings'].length > 2;

  const [isDeleting, setIsDeleting] = useState(false);
  const [isUncharging, setIsUncharging] = useState(false);

  return (
    <Card 
        className={`w-full shadow-md transition-all duration-300 border-l-4 ${order.charged ? 'border-success' : 'border-destructive'} cursor-pointer hover:shadow-lg dark:shadow-none dark:hover:bg-white/5`}
        onClick={() => onViewOrder(order)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between space-x-4">
          <div className="flex items-center space-x-4 flex-1">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-xl text-foreground">
                    {order.customerName}
                  </h3>
                  <p className="text-sm text-muted-foreground -mt-1">{order.items.category}</p>
                </div>
                <div className="text-xs text-muted-foreground font-mono text-right pl-2">
                  {formattedTime}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center" onClick={e => e.stopPropagation()}>
            <AlertDialog open={isDeleting || isUncharging} onOpenChange={isUncharging ? setIsUncharging : setIsDeleting}>
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
                  {order.charged && (
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={() => setIsUncharging(true)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            <span>Uncharge</span>
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                  )}
                  <DropdownMenuSeparator />
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={() => setIsDeleting(true)}>
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
                    {isDeleting ? "This action cannot be undone. This will permanently delete this order." : "Please confirm you want to mark this order as uncharged."}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => {
                      if (isDeleting) onDeleteOrder(order.id);
                      if (isUncharging) onUnchargeOrder(order.id);
                  }} className={isDeleting ? 'bg-destructive hover:bg-destructive/90' : ''}>
                      {isDeleting ? 'Yes, Delete' : 'Yes, Uncharge'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="space-y-3 text-sm text-muted-foreground mt-4 pl-1">
           {Object.entries(order.items.selections).some(([_, items]) => Array.isArray(items) && items.length > 0) &&
              <div className="flex items-start">
                <ShoppingBasket className="mr-3 mt-1 h-4 w-4 flex-shrink-0 text-primary/80"/>
                <div className='flex-1 flex flex-wrap'>
                  {Object.entries(order.items.selections).map(([subcategory, items]) => (
                    Array.isArray(items) && items.length > 0 && (
                      <div key={subcategory} className="mr-4 mb-1">
                        <span className="font-semibold text-foreground/90">{subcategory}: </span>
                        <span>{items.join(', ')}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            }

          {order.notes && (
            <div className="flex items-start">
              <MessageSquare className="mr-3 mt-0.5 h-4 w-4 flex-shrink-0 text-primary/80"/>
              <p className="flex-1 text-foreground/90 italic">"{order.notes}"</p>
            </div>
          )}

          {hasExtraToppings && (
            <div className="pt-1">
              <Badge variant="destructive" className="flex items-center gap-1.5 w-fit">
                <AlertTriangle className="h-3.5 w-3.5" />
                Additional Topping Cost
              </Badge>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex justify-end" onClick={e => e.stopPropagation()}>
            {order.charged ? (
                <Button variant="ghost" size="sm" className="text-success pointer-events-none">
                    <CheckCircle2 className="mr-2 h-5 w-5"/>
                    Charged
                </Button>
            ) : (
                <Button size="sm" onClick={() => onMarkAsCharged(order.id)}>
                    <Circle className="mr-2 h-5 w-5"/>
                    Charge
                </Button>
            )}
        </div>

      </CardContent>
    </Card>
  );
}
