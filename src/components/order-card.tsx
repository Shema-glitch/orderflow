
"use client";

import type { Order } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onMarkAsCharged: (orderId: string) => void;
}

export default function OrderCard({ order, onMarkAsCharged }: OrderCardProps) {
    if (!order.items) {
      return null;
    }

  const formattedTime = new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <Card className={`w-full shadow-md transition-all duration-300 border-l-4 ${order.charged ? 'border-green-500 bg-green-500/5' : 'border-primary'}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
            <div className='flex-1'>
                <h3 className="font-bold text-lg text-foreground">{order.items.category}</h3>
                <div className="space-y-1 mt-2 text-sm text-muted-foreground">
                {Object.entries(order.items.selections).map(([subcategory, item]) => (
                    <div key={subcategory}>
                    <span className="font-medium text-foreground/80">{subcategory}: </span>
                    <span>{item}</span>
                    </div>
                ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">at {formattedTime}</p>
            </div>
            <div className="ml-4">
                <Button 
                    variant={order.charged ? 'ghost' : 'default'}
                    size="sm"
                    className={`rounded-full ${order.charged ? 'text-green-600' : ''}`}
                    onClick={() => !order.charged && onMarkAsCharged(order.id)}
                    disabled={order.charged}
                >
                {order.charged ? <CheckCircle2 className="mr-2"/> : <Circle className="mr-2" />}
                {order.charged ? 'Charged' : 'Charge'}
                </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
