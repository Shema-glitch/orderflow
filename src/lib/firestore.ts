
'use client';

import { app } from './firebase';
import { 
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  getDocs,
  serverTimestamp,
  orderBy,
  limit,
  writeBatch,
  Timestamp
} from 'firebase/firestore';
import type { Order, Sale, Shift } from './types';

const db = getFirestore(app);

// SHIFT MANAGEMENT

const shiftsCollection = collection(db, 'shifts');

export const getCurrentShift = async (userId: string): Promise<Shift | null> => {
  try {
    const q = query(shiftsCollection, where('userId', '==', userId), where('isOpen', '==', true), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const shiftDoc = querySnapshot.docs[0];
    return { id: shiftDoc.id, ...shiftDoc.data() } as Shift;
  } catch (error) {
    console.error("Error getting current shift:", error);
    return null;
  }
};

export const createShift = async (userId: string): Promise<Shift> => {
  const newShiftRef = await addDoc(shiftsCollection, {
    userId,
    isOpen: true,
    startTimestamp: serverTimestamp(),
  });
  return {
      id: newShiftRef.id,
      userId,
      isOpen: true,
      startTimestamp: Timestamp.now() // Use client-side timestamp temporarily
  };
};

export const closeShift = async (shiftId: string): Promise<void> => {
  const shiftRef = doc(db, 'shifts', shiftId);
  await updateDoc(shiftRef, {
    isOpen: false,
    endTimestamp: serverTimestamp(),
  });
};


// ORDER MANAGEMENT

export const listenToOrders = (shiftId: string, userId: string, callback: (orders: Order[]) => void) => {
  const ordersCollection = collection(db, 'shifts', shiftId, 'orders');
  // The security rules already enforce that a user can only access a shift they own,
  // so we don't need to query by userId here again.
  const q = query(ordersCollection, orderBy('timestamp', 'desc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    callback(orders);
  }, (error) => {
    console.error("Error listening to orders:", error);
  });
};

export const addOrder = async (shiftId: string, userId: string, orderData: Omit<Order, 'id' | 'userId'>) => {
  const ordersCollection = collection(db, 'shifts', shiftId, 'orders');
  await addDoc(ordersCollection, {...orderData, userId});
};

export const updateOrder = async (shiftId: string, orderId: string, updates: Partial<Order>) => {
  const orderRef = doc(db, 'shifts', shiftId, 'orders', orderId);
  await updateDoc(orderRef, updates);
};

export const deleteOrder = async (shiftId: string, orderId: string) => {
  const orderRef = doc(db, 'shifts', shiftId, 'orders', orderId);
  await deleteDoc(orderRef);
};


// SALE MANAGEMENT

export const listenToSales = (shiftId: string, userId: string, callback: (sales: Sale[]) => void) => {
  const salesCollection = collection(db, 'shifts', shiftId, 'sales');
  // The security rules already enforce that a user can only access a shift they own,
  // so we don't need to query by userId here again.
  const q = query(salesCollection, orderBy('timestamp', 'desc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const sales = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale));
    callback(sales);
  }, (error) => {
    console.error("Error listening to sales:", error);
  });
};

export const addSale = async (shiftId: string, userId: string, saleData: Omit<Sale, 'id' | 'userId'>) => {
  const salesCollection = collection(db, 'shifts', shiftId, 'sales');
  await addDoc(salesCollection, {...saleData, userId});
};

export const updateSale = async (shiftId: string, saleId: string, updates: Partial<Sale>) => {
    const saleRef = doc(db, 'shifts', shiftId, 'sales', saleId);
    await updateDoc(saleRef, updates);
};

export const deleteSale = async (shiftId: string, saleId: string) => {
  const saleRef = doc(db, 'shifts', shiftId, 'sales', saleId);
  await deleteDoc(saleRef);
};
