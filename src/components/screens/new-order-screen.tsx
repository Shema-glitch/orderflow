
"use client";

import { useState, useEffect } from 'react';
import type { Menu, MenuCategory, OrderItemSelection, Order, Sale, MembershipType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, ShoppingBasket, User, MessageSquare, Dumbbell, Package, Droplet, ChevronLeft, CreditCard, Receipt } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { membershipTypes } from '@/lib/membership-data';

interface NewOrderScreenProps {
  menu: Menu;
  onSaveOrder: (order: Omit<Order, 'id' | 'timestamp' | 'charged'>) => void;
  onSaveSale: (sale: Omit<Sale, 'id' | 'timestamp'>) => void;
  editingOrder: Order | null;
}

const quickSaleItems = [
  { name: 'Water Bottle', icon: Droplet },
  { name: 'Snack', icon: Package },
];

export default function NewOrderScreen({ menu, onSaveOrder, onSaveSale, editingOrder }: NewOrderScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(null);
  const [selections, setSelections] = useState<OrderItemSelection>({});
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');

  const [membershipCustomerName, setMembershipCustomerName] = useState('');
  const [selectedMembership, setSelectedMembership] = useState<MembershipType | null>(null);

  useEffect(() => {
    if (editingOrder && menu.categories) {
      const category = menu.categories.find(c => c.name === editingOrder.items.category) || null;
      setSelectedCategory(category);
      setSelections(editingOrder.items.selections || {});
      setCustomerName(editingOrder.customerName || '');
      setNotes(editingOrder.notes || '');
    } else {
      // Reset state when editingOrder is null (i.e., for a new order)
      setSelectedCategory(null);
      setSelections({});
      setCustomerName('');
      setNotes('');
    }
  }, [editingOrder, menu.categories]);


  const handleSelectCategory = (category: MenuCategory) => {
    setSelectedCategory(category);
    // Reset selections for the new category
    const initialSelections = category.subcategories.reduce((acc, sub) => {
        acc[sub.name] = []; // Initialize with empty array for multiple selections
        return acc;
    }, {} as OrderItemSelection);
    setSelections(initialSelections);
  };

  const handleItemSelect = (subcategoryName: string, item: string) => {
    setSelections(prev => {
        const currentSelection = Array.isArray(prev[subcategoryName]) ? prev[subcategoryName] : [];
        const newSelection = currentSelection.includes(item)
            ? currentSelection.filter(i => i !== item) // Deselect if already selected
            : [...currentSelection, item]; // Select if not selected
        return { ...prev, [subcategoryName]: newSelection };
    });
  };

  const handleSaveOrderClick = () => {
    if (selectedCategory) {
      onSaveOrder({
        customerName,
        notes,
        items: {
            category: selectedCategory.name,
            selections: selections,
        }
      });
      handleBack();
    }
  };

  const handleSaveMembershipSale = () => {
    if (!membershipCustomerName || !selectedMembership) {
      alert('Please enter a customer name and select a membership type.');
      return;
    }
    onSaveSale({
      type: 'Membership',
      customerName: membershipCustomerName,
      membershipType: selectedMembership,
      charged: false,
    });
    setMembershipCustomerName('');
    setSelectedMembership(null);
  };

  const handleQuickSale = (name: string) => {
    onSaveSale({
      type: 'Quick Sale',
      name,
      quantity: 1,
      charged: true,
    });
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setSelections({});
    setCustomerName('');
    setNotes('');
  };

  const isItemSelected = (subcategoryName: string, item: string) => {
      const selection = selections[subcategoryName];
      if (Array.isArray(selection)) {
        return selection.includes(item);
      }
      return false;
  }

  return (
    <ScrollArea className="h-full">
    <Tabs defaultValue="order" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="order"><ShoppingBasket className="mr-2 h-5 w-5"/>Order</TabsTrigger>
          <TabsTrigger value="sale"><Receipt className="mr-2 h-5 w-5"/>Sale</TabsTrigger>
        </TabsList>
        <TabsContent value="order">
          {!selectedCategory ? (
            <div className="grid grid-cols-1 gap-4">
              {menu.categories.map(category => (
                <Button
                  key={category.id}
                  onClick={() => handleSelectCategory(category)}
                  className="h-28 text-xl justify-start p-6 rounded-lg shadow-sm"
                  variant="outline"
                >
                  <ShoppingBasket className="mr-4 h-8 w-8 text-primary"/>
                  {category.name}
                </Button>
              ))}
            </div>
          ) : (
             <div className="w-full">
                <header className="flex items-center mb-6 relative">
                    <Button variant="ghost" size="icon" onClick={handleBack} className="absolute left-[-12px]">
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <div className="text-center flex-1">
                        <h1 className="text-2xl font-bold text-primary">{selectedCategory.name}</h1>
                    </div>
                </header>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="customerName" className="flex items-center text-base"><User className="mr-2 h-4 w-4"/>Customer Name</Label>
                        <Input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g., Aline N." />
                    </div>
                    {selectedCategory.subcategories.map(sub => (
                        <div key={sub.id}>
                        <h3 className="text-lg font-semibold mb-3">{sub.name}</h3>
                        <div className="flex flex-wrap gap-2">
                            {sub.items.map(item => (
                            <Button
                                key={item}
                                variant={isItemSelected(sub.name, item) ? 'default' : 'outline'}
                                onClick={() => handleItemSelect(sub.name, item)}
                                className="flex-grow sm:flex-grow-0"
                            >
                                {item}
                            </Button>
                            ))}
                        </div>
                        </div>
                    ))}
                    <div className="space-y-2">
                        <Label htmlFor="notes" className="flex items-center text-base"><MessageSquare className="mr-2 h-4 w-4"/>Custom Notes (Optional)</Label>
                        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g., No banana, extra whey" />
                    </div>
                    <Button size="lg" onClick={handleSaveOrderClick} className="w-full text-lg py-6 rounded-full shadow-lg">
                        <Save className="mr-2 h-5 w-5" />
                        {editingOrder ? 'Update Order' : 'Save Order'}
                    </Button>
                </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="sale">
            <Tabs defaultValue="membership" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="membership"><CreditCard className="mr-2 h-5 w-5"/>Membership</TabsTrigger>
                    <TabsTrigger value="quick"><Package className="mr-2 h-5 w-5"/>Quick Sale</TabsTrigger>
                </TabsList>
                <TabsContent value="membership" className="pt-4">
                    <Card>
                        <CardContent className="pt-6 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="membershipCustomerName" className="flex items-center text-base"><User className="mr-2 h-4 w-4"/>Customer Name</Label>
                            <Input id="membershipCustomerName" value={membershipCustomerName} onChange={(e) => setMembershipCustomerName(e.target.value)} placeholder="e.g., Eric M." />
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
                        <Button onClick={handleSaveMembershipSale} className="w-full" disabled={!membershipCustomerName || !selectedMembership}>
                            <Save className="mr-2 h-4 w-4"/> Log Membership
                        </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="quick" className="pt-4">
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
        </TabsContent>
    </Tabs>
    </ScrollArea>
  );
}
