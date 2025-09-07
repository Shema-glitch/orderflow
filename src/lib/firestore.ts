
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
  enableIndexedDbPersistence,
  collectionGroup
} from 'firebase/firestore';
import type { Order, Sale, Shift } from './types';

const db = getFirestore(app);

// Enable offline persistence
try {
    enableIndexedDbPersistence(db)
      .catch((err) => {
        if (err.code == 'failed-precondition') {
          console.warn('Firestore persistence failed: multiple tabs open.');
        } else if (err.code == 'unimplemented') {
          console.warn('Firestore persistence not available in this browser.');
        }
      });
} catch(e) {
    console.error("Error enabling firestore persistence", e);
}


// SHIFT MANAGEMENT

const shiftsCollection = collection(db, 'shifts');

export const getCurrentShift = async (userId: string): Promise<Shift | null> => {
  if (!userId) return null;
  
  const q = query(shiftsCollection, where('userId', '==', userId), where('isOpen', '==', true), limit(1));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }
  
  const shiftDoc = querySnapshot.docs[0];
  return { id: shiftDoc.id, ...shiftDoc.data() } as Shift;
};

export const createShift = async (userId: string): Promise<Shift> => {
    if (!userId) {
        throw new Error("User ID is required to create a shift.");
    }

    // First check if an open shift already exists
    const existingShift = await getCurrentShift(userId);
    if (existingShift) {
        return existingShift;
    }

    // If no open shift, create a new one
    const newShiftRef = doc(collection(shiftsCollection));
    const newShiftData = {
        userId,
        isOpen: true,
        startTimestamp: serverTimestamp(),
        endTimestamp: null,
    };
    await addDoc(shiftsCollection, newShiftData);

    return {
        id: newShiftRef.id,
        ...newShiftData,
        startTimestamp: Timestamp.now() // Return a client-side timestamp for immediate use
    } as Shift;
};

export const closeShift = async (shiftId: string): Promise<void> => {
  if (!shiftId) return;
  const shiftRef = doc(db, 'shifts', shiftId);
  await updateDoc(shiftRef, {
    isOpen: false,
    endTimestamp: serverTimestamp(),
  });
};


// ORDER MANAGEMENT
export const listenToOrders = (shiftId: string, callback: (orders: Order[]) => void) => {
  if (!shiftId) return () => {};
  const ordersCollection = collection(db, 'shifts', shiftId, 'orders');
  const q = query(ordersCollection, orderBy('timestamp', 'desc'));
  
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    callback(orders);
  }, (error) => {
    console.error("Error listening to orders:", error);
  });
  return unsubscribe;
};

export const addOrder = async (shiftId: string, userId: string, orderData: Omit<Order, 'id' | 'shiftId' | 'userId'>) => {
  if (!shiftId || !userId) return;
  const ordersCollection = collection(db, 'shifts', shiftId, 'orders');
  await addDoc(ordersCollection, {...orderData, userId, charged: false, timestamp: serverTimestamp()});
};

export const updateOrder = async (shiftId: string, orderId: string, updates: Partial<Omit<Order, 'id' | 'shiftId'>>) => {
  if (!shiftId || !orderId) return;
  const orderRef = doc(db, 'shifts', shiftId, 'orders', orderId);
  await updateDoc(orderRef, updates);
};

export const deleteOrder = async (shiftId: string, orderId: string) => {
  if (!shiftId || !orderId) return;
  const orderRef = doc(db, 'shifts', shiftId, 'orders', orderId);
  await deleteDoc(orderRef);
};


// SALE MANAGEMENT
export const listenToSales = (shiftId: string, callback: (sales: Sale[]) => void) => {
  if (!shiftId) return () => {};
  const salesCollection = collection(db, 'shifts', shiftId, 'sales');
  const q = query(salesCollection, orderBy('timestamp', 'desc'));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const sales = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale));
    callback(sales);
  }, (error) => {
    console.error("Error listening to sales:", error);
  });
  return unsubscribe;
};

export const addSale = async (shiftId: string, userId: string, saleData: Omit<Sale, 'id' | 'shiftId' | 'userId'>) => {
  if (!shiftId || !userId) return;
  const salesCollection = collection(db, 'shifts', shiftId, 'sales');
  await addDoc(salesCollection, {...saleData, userId, charged: false, timestamp: serverTimestamp()});
};

export const updateSale = async (shiftId: string, saleId: string, updates: Partial<Omit<Sale, 'id' | 'shiftId'>>) => {
    if (!shiftId || !saleId) return;
    const saleRef = doc(db, 'shifts', shiftId, 'sales', saleId);
    await updateDoc(saleRef, updates);
};

export const deleteSale = async (shiftId: string, saleId: string) => {
  if (!shiftId || !saleId) return;
  const saleRef = doc(db, 'shifts', shiftId, 'sales', saleId);
  await deleteDoc(saleRef);
};
