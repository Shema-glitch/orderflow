
"use client";

import { useState, useEffect } from 'react';
import type { Menu, MenuCategory, OrderItemSelection, Order, Sale, MembershipType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, ShoppingBasket, User, MessageSquare, ChevronLeft } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface NewOrderScreenProps {
  menu: Menu;
  onSaveOrder: (order: Omit<Order, 'id' | 'timestamp' | 'charged'>) => Promise<boolean>;
  editingOrder: Order | null;
}

export default function NewOrderScreen({ menu, onSaveOrder, editingOrder }: NewOrderScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(null);
  const [selections, setSelections] = useState<OrderItemSelection>({});
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [nameError, setNameError] = useState(false);


  useEffect(() => {
    if (editingOrder && menu.categories) {
      const category = menu.categories.find(c => c.name === editingOrder.items.category) || null;
      setSelectedCategory(category);
      setSelections(editingOrder.items.selections || {});
      setCustomerName(editingOrder.customerName || '');
      setNotes(editingOrder.notes || '');
    } else {
      // Reset state when not editing
      if (!editingOrder) {
        handleBack();
      }
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

  const handleSaveOrderClick = async () => {
    if (selectedCategory) {
      const success = await onSaveOrder({
        customerName,
        notes,
        items: {
            category: selectedCategory.name,
            selections: selections,
        }
      });

      if (!success && !customerName) {
        setNameError(true);
        setTimeout(() => setNameError(false), 500); // Remove animation class
      } else if (success) {
        handleBack();
      }
    }
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setSelections({});
    setCustomerName('');
    setNotes('');
    setNameError(false);
  };

  const isItemSelected = (subcategoryName: string, item: string) => {
      const selection = selections[subcategoryName];
      if (Array.isArray(selection)) {
        return selection.includes(item);
      }
      return false;
  }
  
  const getToppingsCount = () => {
    if (selectedCategory?.name === 'Protein Shake' && selections['Toppings']) {
      return selections['Toppings'].length;
    }
    return 0;
  }

  return (
    <ScrollArea className="h-full">
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
                    <Input 
                        id="customerName" 
                        value={customerName} 
                        onChange={(e) => setCustomerName(e.target.value)} 
                        placeholder="e.g., Aline N."
                        className={cn(nameError && 'animate-shake border-destructive focus-visible:ring-destructive')}
                    />
                </div>
                {selectedCategory.subcategories.map(sub => {
                    const isToppings = selectedCategory.name === 'Protein Shake' && sub.name === 'Toppings';
                    const toppingsCount = isToppings ? getToppingsCount() : 0;
                    
                    return (
                        <div key={sub.id}>
                            <div className="flex items-center mb-3 gap-2">
                                <h3 className="text-lg font-semibold">{sub.name}</h3>
                                {isToppings && toppingsCount > 2 && (
                                    <Badge variant="destructive">Additional Cost</Badge>
                                )}
                            </div>
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
                    )
                })}
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
    </ScrollArea>
  );
}
