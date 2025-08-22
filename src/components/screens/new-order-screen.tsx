
"use client";

import { useState } from 'react';
import type { Menu, MenuCategory, OrderItemSelection, Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, ShoppingBasket, ChevronLeft, User, MessageSquare } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NewOrderScreenProps {
  menu: Menu;
  onSave: (order: Omit<Order, 'id' | 'timestamp' | 'charged'>) => void;
}

export default function NewOrderScreen({ menu, onSave }: NewOrderScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(null);
  const [selections, setSelections] = useState<OrderItemSelection>({});
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');

  const handleSelectCategory = (category: MenuCategory) => {
    setSelectedCategory(category);
    const initialSelections = category.subcategories.reduce((acc, sub) => {
        if (sub.items.length > 0) {
          acc[sub.name] = sub.items[0]; // Default to the first item
        }
        return acc;
    }, {} as OrderItemSelection);
    setSelections(initialSelections);
  };

  const handleItemSelect = (subcategoryName: string, item: string) => {
    setSelections(prev => ({ ...prev, [subcategoryName]: item }));
  };

  const handleSaveOrder = () => {
    if (selectedCategory) {
      onSave({
        customerName,
        notes,
        items: {
            category: selectedCategory.name,
            selections: selections,
        }
      });
      // Reset state for next order
      handleBack();
    }
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setSelections({});
    setCustomerName('');
    setNotes('');
  };

  if (!selectedCategory) {
    return (
      <div className="w-full">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-primary">New Order</h1>
          <p className="text-muted-foreground">Select an order type to begin.</p>
        </header>
        <div className="grid grid-cols-1 gap-4">
          {menu.categories.map(category => (
            <Button
              key={category.id}
              onClick={() => handleSelectCategory(category)}
              className="h-28 text-xl justify-start p-6 rounded-lg shadow-md"
              variant="outline"
            >
              <ShoppingBasket className="mr-4 h-8 w-8 text-primary"/>
              {category.name}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
       <header className="flex items-center mb-6 relative">
          <Button variant="ghost" size="icon" onClick={handleBack} className="absolute left-[-12px]">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-primary">{selectedCategory.name}</h1>
            <p className="text-muted-foreground">Build the order below.</p>
          </div>
        </header>
      
      <ScrollArea className="h-[calc(100vh-220px)] pr-2">
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
                    variant={selections[sub.name] === item ? 'default' : 'outline'}
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
        </div>
      </ScrollArea>
      
      <div className="fixed bottom-24 right-6 left-6 max-w-md mx-auto z-50">
        <Button size="lg" onClick={handleSaveOrder} className="w-full text-lg py-6 rounded-full shadow-lg">
          <Save className="mr-2 h-5 w-5" />
          Save Order
        </Button>
      </div>
    </div>
  );
}
