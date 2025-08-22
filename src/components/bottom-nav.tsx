
"use client";

import { Button } from '@/components/ui/button';
import { ListOrdered, ListChecks, Receipt, Clock } from 'lucide-react';
import type { AppView } from '@/lib/types';

interface BottomNavProps {
  activeView: AppView;
  setView: (view: AppView) => void;
}

export default function BottomNav({ activeView, setView }: BottomNavProps) {
  const navItems = [
    { view: 'orders_list', icon: ListOrdered, label: 'Uncharged' },
    { view: 'all_orders', icon: ListChecks, label: 'All Orders' },
    { view: 'sales', icon: Receipt, label: 'Sales' },
    { view: 'shift_summary', icon: Clock, label: 'Shift' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-card border-t z-40">
      <div className="flex justify-around items-center h-full max-w-md mx-auto">
        {navItems.map((item) => (
          <Button
            key={item.view}
            variant={activeView === item.view ? 'secondary' : 'ghost'}
            className="flex flex-col h-auto p-2 gap-1 rounded-lg w-24"
            onClick={() => setView(item.view as AppView)}
          >
            <item.icon className={`h-6 w-6 ${activeView === item.view ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className={`text-xs font-medium text-center ${activeView === item.view ? 'text-primary' : 'text-muted-foreground'}`}>
              {item.label}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
