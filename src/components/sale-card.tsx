
"use client";

import type { Sale } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, Dumbbell, AlertCircle, Package, Droplet, Circle } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';


interface SaleCardProps {
  sale: Sale;
  onMarkAsCharged: (saleId: string) => void;
}

export default function SaleCard({ sale, onMarkAsCharged }: SaleCardProps) {
  const isMembership = sale.type === 'Membership';
  const name = isMembership ? sale.customerName : sale.name;
  if (!name) return null;

  const formattedTime = new Date(sale.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  
  const getInitials = () => {
    if (isMembership && sale.customerName) {
        return sale.customerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }
    if (sale.name === 'Water Bottle') return 'WB';
    if (sale.name === 'Snack') return 'SN';
    return 'Q';
  }
  
  const getIcon = () => {
      if(isMembership) return <Dumbbell className="mr-2 h-4 w-4" />;
      if(sale.name === 'Water Bottle') return <Droplet className="mr-2 h-4 w-4" />;
      if(sale.name === 'Snack') return <Package className="mr-2 h-4 w-4" />;
      return null;
  }

  return (
    <Card className={`w-full shadow-sm transition-all duration-300 border-l-4 ${sale.charged ? 'border-success' : 'border-destructive'}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
            <div className='flex-1 flex items-center'>
                 <Avatar className="h-10 w-10 mr-4">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">{getInitials()}</AvatarFallback>
                 </Avatar>
                 <div>
                    <h3 className="font-bold text-lg text-foreground">
                        {name}
                    </h3>
                    <p className="text-sm text-muted-foreground -mt-1 flex items-center">
                        {getIcon()}
                        {isMembership ? sale.membershipType : sale.type}
                    </p>
                 </div>
            </div>
            <div className="ml-4">
                <Button 
                    variant={sale.charged ? 'ghost' : 'destructive'}
                    size="sm"
                    className={`rounded-full transition-colors ${sale.charged ? 'text-success' : ''}`}
                    onClick={() => !sale.charged && onMarkAsCharged(sale.id)}
                    disabled={sale.charged}
                >
                {sale.charged ? <CheckCircle2 className="mr-2 h-5 w-5"/> : <Circle className="mr-2 h-5 w-5" />}
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
