"use client";

import { useState } from 'react';
import type { Menu, MenuCategory, OrderItem, OrderItemSelection } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, ShoppingBasket } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NewOrderScreenProps {
  menu: Menu;
  onSave: (order: Omit<OrderItem, 'charged' | 'id' | 'timestamp'>) => void;
  onCancel: () => void;
}

export default function NewOrderScreen({ menu, onSave, onCancel }: NewOrderScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(null);
  const [selections, setSelections] = useState<OrderItemSelection>({});

  const handleSelectCategory = (category: MenuCategory) => {
    setSelectedCategory(category);
    // Initialize selections for the new category
    const initialSelections = category.subcategories.reduce((acc, sub) => {
        acc[sub.name] = sub.items[0]; // Default to the first item
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
        category: selectedCategory.name,
        selections: selections,
      });
    }
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setSelections({});
  };

  if (!selectedCategory) {
    return (
      <Card className="w-full shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Create a New Order</CardTitle>
          <CardDescription>First, select an order type.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
          {menu.categories.map(category => (
            <Button
              key={category.id}
              onClick={() => handleSelectCategory(category)}
              className="h-24 text-xl"
              variant="outline"
            >
              <ShoppingBasket className="mr-4 h-8 w-8"/>
              {category.name}
            </Button>
          ))}
        </CardContent>
        <CardFooter>
            <Button variant="ghost" onClick={onCancel}>
                <ArrowLeft className="mr-2 h-4 w-4"/>
                Back to Orders
            </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" onClick={handleBack} className="flex-shrink-0">
                <ArrowLeft className="h-5 w-5" />
             </Button>
            <div>
              <CardTitle className="text-2xl font-headline">{selectedCategory.name}</CardTitle>
              <CardDescription>Customize the items below.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <ScrollArea className="h-96 pr-4">
        <div className="space-y-6">
          {selectedCategory.subcategories.map(sub => (
            <div key={sub.id}>
              <h3 className="text-lg font-semibold mb-3">{sub.name}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {sub.items.map(item => (
                  <Button
                    key={item}
                    variant={selections[sub.name] === item ? 'default' : 'outline'}
                    onClick={() => handleItemSelect(sub.name, item)}
                    className="justify-start text-left h-auto py-2"
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-end p-6">
        <Button size="lg" onClick={handleSaveOrder} disabled={!selectedCategory || Object.keys(selections).length === 0}>
          <Save className="mr-2 h-5 w-5" />
          Save Order
        </Button>
      </CardFooter>
    </Card>
  );
}
