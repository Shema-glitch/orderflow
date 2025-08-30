
"use client";

import { useState } from 'react';
import type { Sale, MembershipType, MembershipDuration } from '@/lib/types';
import { membershipTypes, membershipDurations } from '@/lib/membership-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Package, Receipt, Droplet, User, Save, Dumbbell, CreditCard, Clock, ChevronDown, ClipboardList } from 'lucide-react';
import SaleCard from '@/components/sale-card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { motion } from 'framer-motion';
import SaleCardSkeleton from '../sale-card-skeleton';

interface SalesScreenProps {
  sales: Sale[];
  isLoading: boolean;
  onSaveSale: (sale: Omit<Sale, 'id' | 'timestamp' | 'userId' | 'shiftId' | 'charged'>) => void;
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 14,
    },
  },
};

export default function SalesScreen({ sales, isLoading, onSaveSale, onMarkAsCharged, onEditSale, onDeleteSale }: SalesScreenProps) {
  const [customerName, setCustomerName] = useState('');
  const [selectedMembership, setSelectedMembership] = useState<MembershipType | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<MembershipDuration | null>(null);
  const [isMembershipFormOpen, setIsMembershipFormOpen] = useState(false);

  const handleQuickSale = (name: string) => {
    onSaveSale({
      type: 'Quick Sale',
      name,
      quantity: 1
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
      membershipDuration: selectedDuration
    });
    // Reset form
    setCustomerName('');
    setSelectedMembership(null);
    setSelectedDuration(null);
    setIsMembershipFormOpen(false);
  };

  const unchargedSales = sales.filter(s => !s.charged);


  return (
    <div className="w-full">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-primary">Log a Sale</h1>
        <p className="text-muted-foreground">Log a membership or a miscellaneous sale.</p>
      </header>

      <Tabs defaultValue="quick" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="quick"><Package className="mr-2 h-5 w-5"/>Quick Sale</TabsTrigger>
          <TabsTrigger value="membership"><CreditCard className="mr-2 h-5 w-5"/>Membership</TabsTrigger>
        </TabsList>

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
        <TabsContent value="membership">
            <Collapsible open={isMembershipFormOpen} onOpenChange={setIsMembershipFormOpen}>
                <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                        Record New Membership
                        <ChevronDown className={`h-5 w-5 transition-transform ${isMembershipFormOpen ? 'rotate-180' : ''}`} />
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <Card className="mt-2">
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
                </CollapsibleContent>
            </Collapsible>
        </TabsContent>
      </Tabs>


      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Uncharged Sales</h2>
            {!isLoading && (
             <span className="font-bold text-3xl text-destructive">{unchargedSales.length}</span>
            )}
        </div>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => <SaleCardSkeleton key={i} />)}
          </div>
        ) : unchargedSales.length > 0 ? (
          <motion.div 
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {unchargedSales.map(sale => (
                <motion.div key={sale.id} variants={itemVariants}>
                    <SaleCard key={sale.id} sale={sale} onMarkAsCharged={onMarkAsCharged} onEdit={onEditSale} onDelete={onDeleteSale} />
                </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[20vh] text-center text-muted-foreground border-2 border-dashed rounded-lg p-4 bg-card">
              <ClipboardList className="h-12 w-12 mb-4 text-gray-400" />
              <h2 className="text-lg font-semibold text-foreground">No uncharged sales</h2>
              <p className="max-w-xs mt-1 text-sm">When you log a new sale, it will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
