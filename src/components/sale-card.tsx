
"use client";

import type { Sale } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, User, Clock } from 'lucide-react';

// A mapping for membership types to icons would be great here.
// For now, using a generic icon.
import { Dumbbell } from 'lucide-react';

interface SaleCardProps {
  sale: Sale;
  onMarkAsCharged: (saleId: string) => void;
}

export default function SaleCard({ sale, onMarkAsCharged }: SaleCardProps) {
    if (sale.type !== 'Membership') return null;

  const formattedTime = new Date(sale.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <Card className={`w-full shadow-md transition-all duration-300 border-l-4 ${sale.charged ? 'border-green-500 bg-green-500/5' : 'border-primary'}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
            <div className='flex-1'>
                 <h3 className="font-bold text-lg text-foreground flex items-center">
                    <User className="mr-2 h-5 w-5 text-primary"/>
                    {sale.customerName}
                </h3>
                <p className="text-sm text-muted-foreground ml-7 -mt-1 flex items-center">
                    <Dumbbell className="mr-2 h-4 w-4" />
                    {sale.membershipType}
                </p>
            </div>
            <div className="ml-4">
                <Button 
                    variant={sale.charged ? 'ghost' : 'default'}
                    size="sm"
                    className={`rounded-full ${sale.charged ? 'text-green-600' : ''}`}
                    onClick={() => !sale.charged && onMarkAsCharged(sale.id)}
                    disabled={sale.charged}
                >
                {sale.charged ? <CheckCircle2 className="mr-2"/> : <Circle className="mr-2" />}
                {sale.charged ? 'Charged' : 'Charge'}
                </Button>
            </div>
        </div>

        <div className="flex items-center pt-2 text-sm text-muted-foreground pl-1">
            <Clock className="mr-2 h-4 w-4 text-primary/80"/>
            <span>{formattedTime}</span>
        </div>
        
      </CardContent>
    </Card>
  );
}
