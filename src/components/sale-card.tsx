
"use client";

import type { Sale } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Dumbbell, Package, Droplet, Circle } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';


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
    if (sale.name === 'Water Bottle') return 'W';
    if (sale.name === 'Snack') return 'S';
    return '?';
  }
  
  const getIcon = () => {
      if(isMembership) return <Dumbbell className="h-4 w-4 text-muted-foreground" />;
      if(sale.name === 'Water Bottle') return <Droplet className="h-4 w-4 text-muted-foreground" />;
      if(sale.name === 'Snack') return <Package className="h-4 w-4 text-muted-foreground" />;
      return null;
  }

  return (
    <Card className="w-full shadow-md transition-all duration-300 hover:shadow-lg dark:shadow-none dark:hover:bg-white/5">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
            <div className='flex-1 flex items-center space-x-4'>
                 <Avatar className="h-12 w-12 text-lg">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">{getInitials()}</AvatarFallback>
                 </Avatar>
                 <div className="flex-1">
                    <h3 className="font-bold text-lg text-foreground">
                        {name}
                    </h3>
                    <div className="text-sm text-muted-foreground -mt-1 flex items-center gap-2">
                        {getIcon()}
                        <span>{isMembership ? sale.membershipType : sale.type}</span>
                    </div>
                 </div>
            </div>
            <p className="text-xs text-muted-foreground font-mono">
                {formattedTime}
            </p>
        </div>

        <div className="mt-4 flex justify-between items-center">
            {!sale.charged ? (
              <Button size="sm" onClick={() => onMarkAsCharged(sale.id)} className="w-full">
                  <Circle className="mr-2 h-5 w-5"/>
                  Mark as Charged
              </Button>
            ) : (
                 <Button variant="ghost" size="sm" className="text-success pointer-events-none w-full justify-start p-0 h-auto">
                    <CheckCircle2 className="mr-2 h-5 w-5"/>
                    <span className="font-semibold">Paid</span>
                </Button>
            )}
        </div>
        
      </CardContent>
    </Card>
  );
}
