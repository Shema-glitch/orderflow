
"use client";

import type { Order } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, User, ShoppingBasket, MessageSquare, Clock } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onMarkAsCharged: (orderId: string) => void;
}

export default function OrderCard({ order, onMarkAsCharged }: OrderCardProps) {
  if (!order.items) {
    return null;
  }

  const formattedTime = new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <Card className={`w-full shadow-md transition-all duration-300 border-l-4 ${order.charged ? 'border-success' : 'border-destructive animate-pulse'}`}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
            <div className='flex-1'>
                 <h3 className="font-bold text-lg text-foreground flex items-center">
                    <User className="mr-2 h-5 w-5 text-primary"/>
                    {order.customerName}
                </h3>
                <p className="text-sm text-muted-foreground ml-7 -mt-1">{order.items.category}</p>
            </div>
            <div className="ml-4">
                <Button 
                    variant={order.charged ? 'ghost' : 'default'}
                    size="sm"
                    className={`rounded-full ${order.charged ? 'text-success' : 'bg-destructive text-destructive-foreground hover:bg-destructive/90'}`}
                    onClick={() => !order.charged && onMarkAsCharged(order.id)}
                    disabled={order.charged}
                >
                {order.charged ? <CheckCircle2 className="mr-2"/> : <Circle className="mr-2" />}
                {order.charged ? 'Charged' : 'Charge'}
                </Button>
            </div>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground pl-1">
           <div className="flex items-center">
                <ShoppingBasket className="mr-2 h-4 w-4 text-primary/80"/>
                <div className='flex-1'>
                    {Object.entries(order.items.selections).map(([subcategory, item]) => (
                        <span key={subcategory} className="mr-3">
                           <span className="font-medium text-foreground/80">{subcategory}: </span>
                           <span>{item}</span>
                        </span>
                    ))}
                </div>
           </div>

           {order.notes && (
             <div className="flex items-start">
                <MessageSquare className="mr-2 mt-0.5 h-4 w-4 text-primary/80"/>
                <p className="flex-1 text-foreground/90 italic">"{order.notes}"</p>
             </div>
           )}

            <div className="flex items-center pt-1">
                <Clock className="mr-2 h-4 w-4 text-primary/80"/>
                <span>{formattedTime}</span>
            </div>
        </div>
        
      </CardContent>
    </Card>
  );
}
