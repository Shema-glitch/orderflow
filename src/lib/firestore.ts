
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
    const batch = writeBatch(db);

    // 1. Find all uncharged orders and sales from previous shifts for the user
    const unchargedOrdersQuery = query(
        collectionGroup(db, 'orders'), 
        where('userId', '==', userId), 
        where('charged', '==', false)
    );
    const unchargedSalesQuery = query(
        collectionGroup(db, 'sales'),
        where('userId', '==', userId),
        where('charged', '==', false)
    );
    
    const [unchargedOrdersSnapshot, unchargedSalesSnapshot] = await Promise.all([
        getDocs(unchargedOrdersQuery),
        getDocs(unchargedSalesQuery)
    ]);

    // 2. Create a new shift document
    const newShiftRef = doc(collection(shiftsCollection));
    batch.set(newShiftRef, {
        userId,
        isOpen: true,
        startTimestamp: serverTimestamp(),
    });

    // 3. Copy uncharged orders to the new shift and delete the old ones
    unchargedOrdersSnapshot.forEach(doc => {
        const orderData = doc.data() as Omit<Order, 'id'>;
        const newOrderRef = doc(db, 'shifts', newShiftRef.id, 'orders', doc.id);
        batch.set(newOrderRef, orderData);
        batch.delete(doc.ref); // Delete the old order
    });

    // 4. Copy uncharged sales to the new shift and delete the old ones
    unchargedSalesSnapshot.forEach(doc => {
        const saleData = doc.data() as Omit<Sale, 'id'>;
        const newSaleRef = doc(db, 'shifts', newShiftRef.id, 'sales', doc.id);
        batch.set(newSaleRef, saleData);
        batch.delete(doc.ref); // Delete the old sale
    });

    // 5. Commit the batch write
    await batch.commit();

    // 6. Return the newly created shift object
    return {
        id: newShiftRef.id,
        userId,
        isOpen: true,
        startTimestamp: Timestamp.now()
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

export const addOrder = async (shiftId: string, userId: string, orderData: Omit<Order, 'id' | 'shiftId' | 'userId'>) => {
  const ordersCollection = collection(db, 'shifts', shiftId, 'orders');
  await addDoc(ordersCollection, {...orderData, userId, charged: false, timestamp: serverTimestamp()});
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

export const addSale = async (shiftId: string, userId: string, saleData: Omit<Sale, 'id' | 'shiftId' | 'userId'>) => {
  const salesCollection = collection(db, 'shifts', shiftId, 'sales');
  await addDoc(salesCollection, {...saleData, userId, charged: false, timestamp: serverTimestamp()});
};

export const updateSale = async (shiftId: string, saleId: string, updates: Partial<Omit<Sale, 'id' | 'shiftId'>>) => {
    const saleRef = doc(db, 'shifts', shiftId, 'sales', saleId);
    await updateDoc(saleRef, updates);
};

export const deleteSale = async (shiftId: string, saleId: string) => {
  const saleRef = doc(db, 'shifts', shiftId, 'sales', saleId);
  await deleteDoc(saleRef);
};

    