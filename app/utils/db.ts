interface CartItem {
  id: string;
  category: string;
  price: number;
  increment: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  timestamp: number;
}

const DB_NAME = 'GroceryPOS';
const DB_VERSION = 1;
const ORDERS_STORE = 'orders';

let db: IDBDatabase | null = null;

export async function initDB(): Promise<IDBDatabase> {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      
      if (!database.objectStoreNames.contains(ORDERS_STORE)) {
        const objectStore = database.createObjectStore(ORDERS_STORE, { keyPath: 'id' });
        objectStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

export async function saveOrder(order: Order): Promise<void> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([ORDERS_STORE], 'readwrite');
    const store = transaction.objectStore(ORDERS_STORE);
    const request = store.add(order);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getAllOrders(): Promise<Order[]> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([ORDERS_STORE], 'readonly');
    const store = transaction.objectStore(ORDERS_STORE);
    const request = store.getAll();

    request.onsuccess = () => {
      const orders = request.result as Order[];
      // Sort by timestamp descending (newest first)
      resolve(orders.sort((a, b) => b.timestamp - a.timestamp));
    };
    request.onerror = () => reject(request.error);
  });
}

export async function deleteOrder(id: string): Promise<void> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([ORDERS_STORE], 'readwrite');
    const store = transaction.objectStore(ORDERS_STORE);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
