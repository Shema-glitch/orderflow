
"use client";

import type { Sale } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, MinusCircle, Package, Receipt, Droplet } from 'lucide-react';

interface SalesScreenProps {
  sales: Sale[];
  onSaveSale: (sale: Omit<Sale, 'id' | 'timestamp'>) => void;
}

interface QuickSaleItem {
  name: string;
  icon: React.ElementType;
}

const quickSaleItems: QuickSaleItem[] = [
  { name: 'Membership', icon: Receipt },
  { name: 'Water Bottle', icon: Droplet },
  { name: 'Snack', icon: Package },
];

export default function SalesScreen({ sales, onSaveSale }: SalesScreenProps) {
  
  const handleQuickSale = (name: string) => {
    onSaveSale({
      name,
      quantity: 1,
    });
  };

  const salesSummary = sales.reduce((acc, sale) => {
    acc[sale.name] = (acc[sale.name] || 0) + sale.quantity;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="w-full">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-primary">Log a Sale</h1>
        <p className="text-muted-foreground">Quickly log miscellaneous sales.</p>
      </header>
      
      <div className="grid grid-cols-1 gap-4 mb-8">
        {quickSaleItems.map((item) => (
          <Button
            key={item.name}
            onClick={() => handleQuickSale(item.name)}
            className="h-24 text-xl justify-start p-6 rounded-lg shadow-md"
            variant="outline"
          >
            <item.icon className="mr-4 h-8 w-8 text-primary" />
            {item.name}
          </Button>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Shift Summary</h2>
        {Object.keys(salesSummary).length > 0 ? (
          <Card>
            <CardContent className="p-4 space-y-2">
              {Object.entries(salesSummary).map(([name, quantity]) => (
                <div key={name} className="flex justify-between items-center text-md">
                  <span className="font-semibold">{name}</span>
                  <span className="text-muted-foreground font-mono bg-muted px-2 py-1 rounded-md">{quantity} sold</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <p className="text-muted-foreground text-center mt-4">No miscellaneous sales logged yet.</p>
        )}
      </div>
    </div>
  );
}
