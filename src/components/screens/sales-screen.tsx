
"use client";

import { useState } from 'react';
import type { Sale, MembershipType, MembershipDuration } from '@/lib/types';
import { membershipTypes, membershipDurations } from '@/lib/membership-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Package, Receipt, Droplet, User, Save, Dumbbell, CreditCard, Clock } from 'lucide-react';
import SaleCard from '@/components/sale-card';


interface SalesScreenProps {
  sales: Sale[];
  onSaveSale: (sale: Omit<Sale, 'id' | 'timestamp'>) => void;
  onMarkAsCharged: (saleId: string) => void;
  onEditSale: (sale: Sale) => void;
  onDeleteSale: (saleId: string) => void;
}

interface QuickSaleItem {
  name: string;
  icon: React.ElementType;
}

const quickSaleItems: QuickSaleItem[] = [
  { name: 'Water Bottle', icon: Droplet },
  { name: 'Snack', icon: Package },
];

export default function SalesScreen({ sales, onSaveSale, onMarkAsCharged, onEditSale, onDeleteSale }: SalesScreenProps) {
  const [customerName, setCustomerName] = useState('');
  const [selectedMembership, setSelectedMembership] = useState<MembershipType | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<MembershipDuration | null>(null);

  const handleQuickSale = (name: string) => {
    onSaveSale({
      type: 'Quick Sale',
      name,
      quantity: 1,
      charged: false,
    });
  };

  const handleSaveMembershipSale = () => {
    if (!customerName || !selectedMembership || !selectedDuration) {
      alert('Please enter a customer name and select a membership type and duration.');
      return;
    }
    onSaveSale({
      type: 'Membership',
      customerName,
      membershipType: selectedMembership,
      membershipDuration: selectedDuration,
      charged: false,
    });
    // Reset form
    setCustomerName('');
    setSelectedMembership(null);
    setSelectedDuration(null);
  };

  const unchargedSales = sales.filter(s => !s.charged);
  const chargedSales = sales.filter(s => s.charged);


  return (
    <div className="w-full">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-primary">Log a Sale</h1>
        <p className="text-muted-foreground">Log a membership or a miscellaneous sale.</p>
      </header>

      <Tabs defaultValue="membership" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="membership"><CreditCard className="mr-2 h-5 w-5"/>Membership</TabsTrigger>
          <TabsTrigger value="quick"><Package className="mr-2 h-5 w-5"/>Quick Sale</TabsTrigger>
        </TabsList>
        <TabsContent value="membership">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="customerName" className="flex items-center text-base"><User className="mr-2 h-4 w-4"/>Customer Name</Label>
                <Input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g., Eric M." />
              </div>
              <div>
                <Label className="text-base flex items-center"><Dumbbell className="mr-2 h-4 w-4"/>Membership Type</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {membershipTypes.map(type => (
                    <Button key={type} variant={selectedMembership === type ? 'default' : 'outline'} onClick={() => setSelectedMembership(type)}>
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
               <div>
                <Label className="text-base flex items-center"><Clock className="mr-2 h-4 w-4"/>Membership Duration</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {membershipDurations.map(duration => (
                    <Button key={duration} variant={selectedDuration === duration ? 'default' : 'outline'} onClick={() => setSelectedDuration(duration)}>
                      {duration}
                    </Button>
                  ))}
                </div>
              </div>
              <Button onClick={handleSaveMembershipSale} className="w-full" disabled={!customerName || !selectedMembership || !selectedDuration}>
                <Save className="mr-2 h-4 w-4"/> Log Membership Sale
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="quick">
           <div className="grid grid-cols-1 gap-4">
            {quickSaleItems.map((item) => (
              <Button
                key={item.name}
                onClick={() => handleQuickSale(item.name)}
                className="h-24 text-xl justify-start p-6 rounded-lg shadow-sm"
                variant="outline"
              >
                <item.icon className="mr-4 h-8 w-8 text-primary" />
                {item.name}
              </Button>
            ))}
          </div>
        </TabsContent>
      </Tabs>


      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Sales Log</h2>
        </div>
        {sales.length > 0 ? (
          <div className="space-y-4">
            {sales.map(sale => (
                <SaleCard key={sale.id} sale={sale} onMarkAsCharged={onMarkAsCharged} onEdit={onEditSale} onDelete={onDeleteSale} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center mt-4 border-2 border-dashed rounded-lg p-8">No sales logged yet.</p>
        )}
      </div>
    </div>
  );
}
