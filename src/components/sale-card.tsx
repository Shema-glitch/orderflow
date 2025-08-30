
"use client";

import { useRef } from 'react';
import type { Sale } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Dumbbell, Package, Droplet, Circle, Edit, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { motion, useAnimation, useMotionValue } from 'framer-motion';

interface SaleCardProps {
  sale: Sale;
  onMarkAsCharged: (saleId: string) => void;
  onEdit: (sale: Sale) => void;
  onDelete: (saleId: string) => void;
}

export default function SaleCard({ sale, onMarkAsCharged, onEdit, onDelete }: SaleCardProps) {
  const isMembership = sale.type === 'Membership';
  const name = isMembership ? sale.customerName : sale.name;
  if (!name) return null;

  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const controls = useAnimation();
  
  const SWIPE_THRESHOLD_RIGHT = 100; // For edit
  const SWIPE_THRESHOLD_LEFT = -100; // For delete

  const handleDragEnd = (event: any, info: any) => {
    const offset = info.offset.x;
    if (offset < SWIPE_THRESHOLD_LEFT) {
      // Swiped far left (for delete)
      controls.start({ x: SWIPE_THRESHOLD_LEFT });
    } else if (offset > SWIPE_THRESHOLD_RIGHT) {
      // Swiped far right (for edit)
      controls.start({ x: SWIPE_THRESHOLD_RIGHT });
    } else {
      // Not swiped far enough, snap back
      controls.start({ x: 0 });
    }
  };
  
  const handleActionClick = (action: 'edit' | 'delete') => {
    controls.start({ x: 0 });
    if(action === 'edit') onEdit(sale);
    if(action === 'delete') onDelete(sale.id);
  }

  const formattedTime = new Date(sale.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  const getInitials = () => {
    if (isMembership && sale.customerName) {
      return sale.customerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }
    if (sale.name === 'Water Bottle') return 'W';
    if (sale.name === 'Snack') return 'S';
    return '?';
  };

  const getIcon = () => {
    if (isMembership) return <Dumbbell className="h-4 w-4 text-muted-foreground" />;
    if (sale.name === 'Water Bottle') return <Droplet className="h-4 w-4 text-muted-foreground" />;
    if (sale.name === 'Snack') return <Package className="h-4 w-4 text-muted-foreground" />;
    return null;
  };

  return (
    <div className="relative w-full overflow-hidden rounded-lg">
        {/* Background Actions Container */}
        <div className="absolute inset-0 flex justify-between items-center">
            {/* Edit Action (Left) */}
            <div 
                className="bg-blue-500 h-full flex items-center justify-center pl-4 pr-2"
                style={{ width: `${SWIPE_THRESHOLD_RIGHT}px` }}
            >
                 <Button onClick={() => handleActionClick('edit')} variant="ghost" size="icon" className="text-white hover:bg-blue-600 hover:text-white">
                    <Edit className="h-5 w-5"/>
                </Button>
            </div>
            {/* Delete Action (Right) */}
            <div 
                className="bg-destructive h-full flex items-center justify-center pr-4 pl-2"
                style={{ width: `${-SWIPE_THRESHOLD_LEFT}px` }}
            >
                <Button onClick={() => handleActionClick('delete')} variant="ghost" size="icon" className="text-white hover:bg-destructive/90 hover:text-white">
                    <Trash2 className="h-5 w-5"/>
                </Button>
            </div>
        </div>

      <motion.div
        ref={cardRef}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        style={{ x }}
        animate={controls}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative z-10"
      >
        <Card className="w-full shadow-md transition-all duration-300 dark:shadow-none bg-card rounded-lg border-0">
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
                    <span>{isMembership ? `${sale.membershipType} - ${sale.membershipDuration}` : sale.type}</span>
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
                  <Circle className="mr-2 h-5 w-5" />
                  Mark as Charged
                </Button>
              ) : (
                <Button variant="ghost" size="sm" className="text-success pointer-events-none w-full justify-start p-0 h-auto">
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  <span className="font-semibold">Paid</span>
                </Button>
              )}
            </div>

          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
