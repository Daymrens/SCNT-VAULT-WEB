// Firebase Admin API
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { 
    getFirestore, 
    collection, 
    getDocs, 
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query, 
    where,
    orderBy,
    limit
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCTVEb364hJZveBr0iUu5a39TpgcBb63no",
    authDomain: "scnt-vault.firebaseapp.com",
    projectId: "scnt-vault",
    storageBucket: "scnt-vault.firebasestorage.app",
    messagingSenderId: "86926234856",
    appId: "1:86926234856:web:75d5119f0b4f54ff3fe55d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log('✅ Firebase Admin initialized');
console.log('✅ Auth ready:', auth ? 'Yes' : 'No');
console.log('✅ Firestore ready:', db ? 'Yes' : 'No');

// Export Firebase services
export { 
    auth, 
    db,
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    collection,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    limit
};

// Admin API Functions

// Products
export async function getAllProducts() {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getProduct(productId) {
    const productRef = doc(db, 'products', productId);
    const snapshot = await getDoc(productRef);
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

export async function addProduct(productData) {
    const productsRef = collection(db, 'products');
    const docRef = await addDoc(productsRef, {
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
    return docRef.id;
}

export async function updateProduct(productId, productData) {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
        ...productData,
        updatedAt: new Date().toISOString()
    });
}

export async function deleteProduct(productId) {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
}

// Orders (using sales collection) — returns raw Firestore fields
export async function getAllOrders() {
    const salesRef = collection(db, 'sales');
    const q = query(salesRef, orderBy('SaleDate', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getOrder(orderId) {
    const saleRef = doc(db, 'sales', orderId);
    const snapshot = await getDoc(saleRef);
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

// Customers
export async function getAllCustomers() {
    const snap = await getDocs(collection(db, 'customers'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Resellers
export async function getAllResellers() {
    const snap = await getDocs(collection(db, 'resellers'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function updateOrderStatus(orderId, status) {
    // Sales are always completed, but keep this for compatibility
    const saleRef = doc(db, 'sales', orderId);
    await updateDoc(saleRef, {
        status: status,
        updatedAt: new Date().toISOString()
    });
}

// Inventory
export async function updateInventory(productId, quantity, type, reason) {
    // Update product stock
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);
    
    if (productSnap.exists()) {
        const currentStock = productSnap.data().Stock || 0;
        const newStock = type === 'in' ? currentStock + quantity : currentStock - quantity;
        
        await updateDoc(productRef, {
            Stock: newStock,
            updatedAt: new Date().toISOString()
        });
        
        // Log transaction
        const inventoryRef = collection(db, 'inventory');
        await addDoc(inventoryRef, {
            productId: productId,
            type: type,
            quantity: quantity,
            reason: reason,
            previousStock: currentStock,
            newStock: newStock,
            performedBy: auth.currentUser?.email || 'system',
            createdAt: new Date().toISOString()
        });
        
        return newStock;
    }
    
    throw new Error('Product not found');
}

// Analytics
export async function getAnalytics() {
    const orders   = await getAllOrders();
    const products = await getAllProducts();
    const totalRevenue     = orders.reduce((sum, o) => sum + (o.Total || 0), 0);
    const lowStockProducts = products.filter(p => (p.Stock || 0) < (p.LowStockThreshold || 10));
    return {
        totalProducts:    products.length,
        totalOrders:      orders.length,
        totalRevenue,
        lowStockCount:    lowStockProducts.length,
        lowStockProducts
    };
}

console.log('✅ Firebase Admin API ready');
