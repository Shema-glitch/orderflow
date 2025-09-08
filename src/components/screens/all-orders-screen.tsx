
"use client";

import type { Order } from '@/lib/types';
import OrderCard from '@/components/order-card';
import { ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import OrderCardSkeleton from '../order-card-skeleton';


interface AllOrdersScreenProps {
  orders: Order[];
  isLoading: boolean;
  onMarkAsCharged: (orderId: string) => void;
  onUnchargeOrder: (orderId: string) => void;
  onDeleteOrder: (orderId: string) => void;
  onEditOrder: (order: Order) => void;
  onViewOrder: (order: Order) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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
      stiffness: 120,
      damping: 14,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 }
  }
};


export default function AllOrdersScreen({ orders, isLoading, onMarkAsCharged, onUnchargeOrder, onDeleteOrder, onEditOrder, onViewOrder }: AllOrdersScreenProps) {
  // This screen now behaves the same as the "Uncharged" screen, as we are fetching all uncharged orders.
  // In the future, this screen could be adapted to show ALL orders, charged or not.
  return (
    <div className="w-full">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">All Orders</h1>
        {!isLoading && (
            <div className="flex items-center gap-2">
                <span className="font-bold text-3xl text-muted-foreground">{orders.length}</span>
            </div>
        )}
      </header>

       {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <OrderCardSkeleton key={i} />)}
        </div>
      ) : orders.length > 0 ? (
        <motion.div 
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {orders.map(order => (
              <motion.div 
                key={order.id} 
                variants={itemVariants}
                exit="exit"
                layout
              >
                <OrderCard order={order} onMarkAsCharged={onMarkAsCharged} onUnchargeOrder={onUnchargeOrder} onDeleteOrder={onDeleteOrder} onEditOrder={onEditOrder} onViewOrder={onViewOrder} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center text-muted-foreground border-2 border-dashed rounded-lg p-4 bg-card">
          <ClipboardList className="h-16 w-16 mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-foreground">No orders yet</h2>
          <p className="max-w-xs mt-1">Tap the floating '+' button to add your first order.</p>
        </div>
      )}
    </div>
  );
}
