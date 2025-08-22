
export interface OrderItemSelection {
  [subcategoryName: string]: string;
}

export interface OrderItem {
  category: string;
  selections: OrderItemSelection;
}

export interface Order {
  id: string;
  timestamp: string;
  charged: boolean;
  items: OrderItem;
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
    isOpen: boolean;
    startTimestamp: string | null;
}

export interface Sale {
  id: string;
  timestamp: string;
  name: string;
  quantity: number;
  price?: number;
}

export type AppView = 'shift' | 'new_order' | 'orders_list' | 'sales';
