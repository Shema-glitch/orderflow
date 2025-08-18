"use client";

import type { Order } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onMarkAsCharged: (orderId: string) => void;
}

export default function OrderCard({ order, onMarkAsCharged }: OrderCardProps) {
  const formattedTime = new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <CardTitle className="text-lg font-bold">{order.items.category}</CardTitle>
        <Badge variant={order.charged ? 'default' : 'destructive'} className={order.charged ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
          {order.charged ? <CheckCircle2 className="mr-1 h-4 w-4" /> : <XCircle className="mr-1 h-4 w-4" />}
          {order.charged ? 'Charged' : 'Not Charged'}
        </Badge>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-2 text-sm text-muted-foreground">
          {Object.entries(order.items.selections).map(([subcategory, item]) => (
            <div key={subcategory} className="flex justify-between">
              <span className="font-medium text-foreground">{subcategory}:</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center text-xs text-muted-foreground mt-4">
            <Clock className="h-3 w-3 mr-1.5" />
            Ordered at {formattedTime}
        </div>
      </CardContent>
      {!order.charged && (
        <CardFooter>
          <Button 
            className="w-full bg-primary hover:bg-primary/90" 
            onClick={() => onMarkAsCharged(order.id)}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Mark as Charged
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
