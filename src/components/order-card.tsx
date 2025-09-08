
"use client";

import { useState } from 'react';
import type { Order } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CheckCircle2, Circle, Trash2, Edit, MoreVertical, RefreshCw, Link } from 'lucide-react';
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

  const formattedTime = order.timestamp ? new Date(order.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : '...';
  const initials = order.customerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  
  const hasExtraToppings = 
    order.items.category === 'Protein Shake' && 
    order.items.selections['Toppings'] && 
    order.items.selections['Toppings'].length > 2;

  const [isDeleting, setIsDeleting] = useState(false);
  const [isUncharging, setIsUncharging] = useState(false);

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
  
  const orderDetail = getOrderDetail();

  return (
    <Card 
        className="w-full shadow-md transition-all duration-300 hover:shadow-lg dark:shadow-none dark:hover:bg-white/5"
        onClick={() => onViewOrder(order)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between space-x-4">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative">
              <Avatar className="h-12 w-12 text-lg">
                <AvatarFallback className="bg-primary/10 text-primary font-bold">{initials}</AvatarFallback>
              </Avatar>
              {order.quantity > 1 && (
                  <Badge variant="default" className="absolute -top-1 -right-2 z-10 rounded-full h-6 w-6 flex items-center justify-center text-sm">{order.quantity}</Badge>
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-foreground">
                    {order.customerName}
                  </h3>
                  <p className="text-sm text-muted-foreground -mt-1 flex items-center gap-1">
                     {order.isContinuation && <Link className="h-3 w-3 text-muted-foreground" />}
                    <span>{orderDetail}</span>
                  </p>
                </div>
                 <div className="text-right pl-2">
                    <p className="text-xs text-muted-foreground font-mono">
                      {formattedTime}
                    </p>
                    {hasExtraToppings && (
                      <Badge variant="destructive" className="mt-1">
                        Add. Cost
                      </Badge>
                    )}
                 </div>
              </div>
            </div>
          </div>

          <div className="flex items-center -mr-2" onClick={e => e.stopPropagation()}>
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
                     <DropdownMenuItem onSelect={() => setIsUncharging(true)}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        <span>Uncharge</span>
                    </DropdownMenuItem>
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
        
        <div className="mt-4 flex justify-between items-center" onClick={e => e.stopPropagation()}>
            {order.charged ? (
                <Button variant="ghost" size="sm" className="text-success pointer-events-none w-full justify-start p-0 h-auto">
                    <CheckCircle2 className="mr-2 h-5 w-5"/>
                    <span className="font-semibold">Paid</span>
                </Button>
            ) : (
                <Button size="sm" onClick={() => onMarkAsCharged(order.id)} className="w-full">
                    <Circle className="mr-2 h-5 w-5"/>
                    Mark as Charged
                </Button>
            )}
        </div>

      </CardContent>
    </Card>
  );
}
