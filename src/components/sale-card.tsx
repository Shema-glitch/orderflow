
"use client";

import type { Sale } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, Dumbbell, AlertCircle } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';


interface SaleCardProps {
  sale: Sale;
  onMarkAsCharged: (saleId: string) => void;
}

export default function SaleCard({ sale, onMarkAsCharged }: SaleCardProps) {
    if (sale.type !== 'Membership' || !sale.customerName) return null;

  const formattedTime = new Date(sale.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  const initials = sale.customerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <Card className={`w-full shadow-sm transition-all duration-300 border-l-4 ${sale.charged ? 'border-success' : 'border-destructive'}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
            <div className='flex-1 flex items-center'>
                 <Avatar className="h-10 w-10 mr-4">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">{initials}</AvatarFallback>
                 </Avatar>
                 <div>
                    <h3 className="font-bold text-lg text-foreground">
                        {sale.customerName}
                    </h3>
                    <p className="text-sm text-muted-foreground -mt-1 flex items-center">
                        <Dumbbell className="mr-2 h-4 w-4" />
                        {sale.membershipType}
                    </p>
                 </div>
            </div>
            <div className="ml-4">
                <Button 
                    variant={sale.charged ? 'ghost' : 'default'}
                    size="sm"
                    className={`rounded-full transition-colors ${sale.charged ? 'text-success' : 'bg-destructive text-destructive-foreground hover:bg-destructive/90'}`}
                    onClick={() => !sale.charged && onMarkAsCharged(sale.id)}
                    disabled={sale.charged}
                >
                {sale.charged ? <CheckCircle2 className="mr-2 h-5 w-5"/> : <AlertCircle className="mr-2 h-5 w-5" />}
                {sale.charged ? 'Charged' : 'Charge'}
                </Button>
            </div>
        </div>

        <div className="flex items-center pt-3 text-sm text-muted-foreground pl-1">
            <Clock className="mr-3 h-4 w-4 text-primary/80"/>
             <span className="text-xs font-mono bg-muted px-2 py-1 rounded-md">{formattedTime}</span>
        </div>
        
      </CardContent>
    </Card>
  );
}
