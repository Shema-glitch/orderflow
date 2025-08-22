
"use client";

import { Button } from '@/components/ui/button';
import { List, DollarSign } from 'lucide-react';
import type { AppView } from '@/lib/types';

interface BottomNavProps {
  activeView: AppView;
  setView: (view: AppView) => void;
}

export default function BottomNav({ activeView, setView }: BottomNavProps) {
  const navItems = [
    { view: 'orders_list', icon: List, label: 'Orders' },
    { view: 'sales', icon: DollarSign, label: 'Sales' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-card border-t z-50">
      <div className="flex justify-around items-center h-full max-w-md mx-auto">
        {navItems.map((item) => (
          <Button
            key={item.view}
            variant={activeView === item.view ? 'secondary' : 'ghost'}
            className="flex flex-col h-auto p-2 gap-1 rounded-lg"
            onClick={() => setView(item.view as AppView)}
          >
            <item.icon className={`h-6 w-6 ${activeView === item.view ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className={`text-xs ${activeView === item.view ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
              {item.label}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
