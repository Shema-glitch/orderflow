
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
  // First, find all uncharged orders and sales from previous shifts for this user
  const unchargedOrdersQuery = query(collectionGroup(db, 'orders'), where('userId', '==', userId), where('charged', '==', false));
  const unchargedSalesQuery = query(collectionGroup(db, 'sales'), where('userId', '==', userId), where('charged', '==', false));

  const [unchargedOrdersSnapshot, unchargedSalesSnapshot] = await Promise.all([
    getDocs(unchargedOrdersQuery),
    getDocs(unchargedSalesQuery)
  ]);
  
  // Start a new shift
  const newShiftRef = await addDoc(shiftsCollection, {
    userId,
    isOpen: true,
    startTimestamp: serverTimestamp(),
  });
  
  // Now, batch move the uncharged items to the new shift
  const batch = writeBatch(db);

  unchargedOrdersSnapshot.forEach(doc => {
    const orderData = doc.data() as Order;
    // Copy to new shift's subcollection
    const newOrderRef = collection(db, 'shifts', newShiftRef.id, 'orders');
    batch.set(doc(newOrderRef), orderData);
    // Delete from old location
    batch.delete(doc.ref);
  });

  unchargedSalesSnapshot.forEach(doc => {
    const saleData = doc.data() as Sale;
    // Copy to new shift's subcollection
    const newSaleRef = collection(db, 'shifts', newShiftRef.id, 'sales');
    batch.set(doc(newSaleRef), saleData);
    // Delete from old location
    batch.delete(doc.ref);
  });

  await batch.commit();

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
export const listenToOrders = (shiftId: string, callback: (orders: Order[]) => void) => {
  const ordersCollection = collection(db, 'shifts', shiftId, 'orders');
  const q = query(ordersCollection, orderBy('timestamp', 'desc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    callback(orders);
  }, (error) => {
    console.error("Error listening to orders:", error);
  });
};

export const addOrder = async (shiftId: string, orderData: Omit<Order, 'id' | 'shiftId'>) => {
  const ordersCollection = collection(db, 'shifts', shiftId, 'orders');
  await addDoc(ordersCollection, {...orderData, charged: false, timestamp: serverTimestamp()});
};

export const updateOrder = async (shiftId: string, orderId: string, updates: Partial<Omit<Order, 'id' | 'shiftId'>>) => {
  const orderRef = doc(db, 'shifts', shiftId, 'orders', orderId);
  await updateDoc(orderRef, updates);
};

export const deleteOrder = async (shiftId: string, orderId: string) => {
  const orderRef = doc(db, 'shifts', shiftId, 'orders', orderId);
  await deleteDoc(orderRef);
};


// SALE MANAGEMENT
export const listenToSales = (shiftId: string, callback: (sales: Sale[]) => void) => {
  const salesCollection = collection(db, 'shifts', shiftId, 'sales');
  const q = query(salesCollection, orderBy('timestamp', 'desc'));

  return onSnapshot(q, (querySnapshot) => {
    const sales = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale));
    callback(sales);
  }, (error) => {
    console.error("Error listening to sales:", error);
  });
};

export const addSale = async (shiftId: string, saleData: Omit<Sale, 'id' | 'shiftId'>) => {
  const salesCollection = collection(db, 'shifts', shiftId, 'sales');
  await addDoc(salesCollection, {...saleData, charged: false, timestamp: serverTimestamp()});
};

export const updateSale = async (shiftId: string, saleId: string, updates: Partial<Omit<Sale, 'id' | 'shiftId'>>) => {
    const saleRef = doc(db, 'shifts', shiftId, 'sales', saleId);
    await updateDoc(saleRef, updates);
};

export const deleteSale = async (shiftId: string, saleId: string) => {
  const saleRef = doc(db, 'shifts', shiftId, 'sales', saleId);
  await deleteDoc(saleRef);
};

    