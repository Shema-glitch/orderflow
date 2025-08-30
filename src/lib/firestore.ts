
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
  Timestamp,
  enableIndexedDbPersistence
} from 'firebase/firestore';
import type { Order, Sale, Shift } from './types';

const db = getFirestore(app);

// Enable offline persistence
try {
    enableIndexedDbPersistence(db)
      .catch((err) => {
        if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a time.
          console.warn('Firestore persistence failed: multiple tabs open.');
        } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          console.warn('Firestore persistence not available in this browser.');
        }
      });
} catch(e) {
    console.error("Error enabling firestore persistence", e);
}


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

// Gets ALL uncharged orders for a specific user from the top-level 'orders' collection.
export const listenToAllUnchargedOrders = (userId: string, callback: (orders: Order[]) => void) => {
  const q = query(
    collection(db, 'orders'), 
    where('userId', '==', userId),
    where('charged', '==', false),
    orderBy('timestamp', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    callback(orders);
  }, (error) => {
    console.error("Error listening to all uncharged orders:", error);
  });
};

export const addOrder = async (shiftId: string, userId: string, orderData: Omit<Order, 'id' | 'userId' | 'shiftId'>) => {
  const ordersRootCollection = collection(db, 'orders');
  await addDoc(ordersRootCollection, {...orderData, userId, shiftId, charged: false, timestamp: serverTimestamp()});
};

export const updateOrder = async (orderId: string, updates: Partial<Omit<Order, 'id'>>) => {
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, updates);
};

export const deleteOrder = async (orderId: string) => {
  const orderRef = doc(db, 'orders', orderId);
  await deleteDoc(orderRef);
};


// SALE MANAGEMENT

// Gets ALL uncharged sales for a specific user from the top-level 'sales' collection.
export const listenToAllUnchargedSales = (userId: string, callback: (sales: Sale[]) => void) => {
  const q = query(
    collection(db, 'sales'),
    where('userId', '==', userId),
    where('charged', '==', false),
    orderBy('timestamp', 'desc')
  );

  return onSnapshot(q, (querySnapshot) => {
    const sales = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale));
    callback(sales);
  }, (error) => {
    console.error("Error listening to all uncharged sales:", error);
  });
};

export const addSale = async (shiftId: string, userId: string, saleData: Omit<Sale, 'id' | 'userId' | 'shiftId'>) => {
  const salesRootCollection = collection(db, 'sales');
  await addDoc(salesRootCollection, {...saleData, userId, shiftId, charged: false, timestamp: serverTimestamp()});
};

export const updateSale = async (saleId: string, updates: Partial<Omit<Sale, 'id'>>) => {
    const saleRef = doc(db, 'sales', saleId);
    await updateDoc(saleRef, updates);
};

export const deleteSale = async (saleId: string) => {
  const saleRef = doc(db, 'sales', saleId);
  await deleteDoc(saleRef);
};
