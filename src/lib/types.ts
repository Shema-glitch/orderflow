
import type { Timestamp } from 'firebase/firestore';

export interface OrderItemSelection {
  [subcategoryName: string]: string[];
}

export interface OrderItem {
  category: string;
  selections: OrderItemSelection;
}

export interface Order {
  id: string;
  userId: string;
  shiftId: string; // The shift in which the order was created
  timestamp: Timestamp;
  charged: boolean;
  items: OrderItem;
  customerName: string;
  notes?: string;
}

export interface Subcategory {
  id:string;
  name: string;
  items: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

export interface Menu {
  categories: MenuCategory[];
}

export interface Shift {
    id: string;
    isOpen: boolean;
    startTimestamp: Timestamp;
    endTimestamp?: Timestamp;
    userId: string;
}

export type SaleType = 'Quick Sale' | 'Membership';
export type MembershipType = 'Semi-Private' | 'CrossFit' | 'PT' | 'Boxing' | '5-Class Pass';
export type MembershipDuration = '1 Month' | '3 Months' | '1 Year';

export interface Sale {
  id: string;
  userId: string;
  shiftId: string;
  timestamp: Timestamp;
  type: SaleType;
  name?: string; 
  quantity?: number;
  customerName?: string;
  membershipType?: MembershipType;
  membershipDuration?: MembershipDuration;
  charged: boolean;
}

export type AppView = 'loading' | 'shift_closed' | 'new_order' | 'orders_list' | 'all_orders' | 'sales' | 'shift_summary' | 'order_detail';
