import { 
  collection, doc, addDoc, updateDoc, deleteDoc, 
  getDoc, getDocs, query, where, orderBy, 
  serverTimestamp, onSnapshot, limit,
  runTransaction
} from 'firebase/firestore';
import { db } from './config';

// ─── Yardımcı Fonksiyonlar ───────────────────────────────────────────────────
const getCollection = (colName) => collection(db, colName);
const getDocRef = (colName, id) => doc(db, colName, id);

// ─── 1. SATIŞ & SİPARİŞ SERVİSİ ──────────────────────────────────────────────
export const salesService = {
  // Müşterileri Dinle
  subscribeCustomers: (callback) => {
    const q = query(getCollection('customers'), orderBy('name', 'asc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  },

  // Yeni Müşteri Tanımla
  addCustomer: async (customerData) => {
    return addDoc(getCollection('customers'), {
      ...customerData,
      isActive: true,
      balance: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  },

  // Siparişleri dinle
  subscribeOrders: (callback) => {
    const q = query(getCollection('orders'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  },

  // Yeni Sipariş Oluştur (Draft)
  createOrder: async (orderData) => {
    return addDoc(getCollection('orders'), {
      ...orderData,
      status: 'Taslak',
      items: orderData.items.map(item => ({ ...item, producedQty: 0, shippedQty: 0 })),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  // Siparişi Onayla -> MRP Tetikle
  approveOrder: async (orderId) => {
    const ref = getDocRef('orders', orderId);
    return updateDoc(ref, { 
      status: 'Onaylandı', 
      approvedAt: serverTimestamp(),
      updatedAt: serverTimestamp() 
    });
  }
};

// ─── 2. ENVANTER SERVİSİ ─────────────────────────────────────────────────────
export const inventoryService = {
  subscribeStock: (callback) => {
    const q = query(getCollection('parts'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  },

  // Yeni Parça Tanımla
  addPart: async (partData) => {
    return addDoc(getCollection('parts'), {
      ...partData,
      currentStock: Number(partData.currentStock || 0),
      minStock:     Number(partData.minStock || 0),
      unitCost:     Number(partData.unitCost || 0),
      isActive:     true,
      createdAt:    serverTimestamp(),
      updatedAt:    serverTimestamp()
    });
  },

  // Stok Hareket Kaydı (Transaction ile Güvenli Stok Değişimi)
  addMovement: async (partId, qty, type, reference, reason) => {
    return runTransaction(db, async (transaction) => {
      const partRef = getDocRef('parts', partId);
      const partDoc = await transaction.get(partRef);
      
      if (!partDoc.exists()) throw new Error('Parça bulunamadı');
      
      const currentStock = partDoc.data().currentStock || 0;
      const newStock = currentStock + qty;

      if (newStock < 0) throw new Error('Yetersiz stok!');

      // Stok güncelle
      transaction.update(partRef, { 
        currentStock: newStock,
        updatedAt: serverTimestamp() 
      });

      // Hareket kaydı oluştur
      const moveRef = doc(getCollection('inventoryMovements'));
      transaction.set(moveRef, {
        partId,
        partNo: partDoc.data().partNo,
        qty,
        type, // 'IN' or 'OUT'
        reference,
        reason,
        timestamp: serverTimestamp()
      });
    });
  }
};

// ─── 3. ÜRETİM (MES) SERVİSİ ─────────────────────────────────────────────────
export const productionService = {
  // İş Merkezlerini Dinle (Work Centers)
  subscribeWorkCenters: (callback) => {
    const q = query(getCollection('workCenters'), orderBy('name', 'asc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  },

  // Yeni İş Merkezi Ekle
  addWorkCenter: async (centerData) => {
    return addDoc(getCollection('workCenters'), {
      ...centerData,
      status: 'AVAILABLE', // AVAILABLE, MAINTENANCE, OFFLINE
      activeJobs: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  },

  // İş Emirlerini Getir
  subscribeWorkOrders: (callback) => {
    const q = query(getCollection('workOrders'), orderBy('updatedAt', 'desc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  },

  // Yeni İş Emri Oluştur
  createWorkOrder: async (woData) => {
    return addDoc(getCollection('workOrders'), {
      ...woData,
      status: 'Beklemede',
      progress: 0,
      logs: [{ status: 'Beklemede', timestamp: Date.now(), msg: 'İş emri oluşturuldu' }],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  // İş Emri Durum Güncelleme
  updateWOStatus: async (woId, newStatus, msg) => {
    const ref = getDocRef('workOrders', woId);
    const docSnap = await getDoc(ref);
    const logs = docSnap.data().logs || [];
    
    return updateDoc(ref, {
      status: newStatus,
      logs: [...logs, { status: newStatus, timestamp: Date.now(), msg }],
      updatedAt: serverTimestamp(),
      ...(newStatus === 'Tamamlandı' ? { completedAt: serverTimestamp(), progress: 100 } : {})
    });
  }
};

// ─── 4. SATIN ALMA SERVİSİ ───────────────────────────────────────────────────
export const purchasingService = {
  subscribeRequests: (callback) => {
    const q = query(getCollection('purchaseRequests'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  },

  createPR: async (prData) => {
    return addDoc(getCollection('purchaseRequests'), {
      ...prData,
      status: 'Onay Bekliyor',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }
};

// ─── 5. KALİTE KONTROL (QC) SERVİSİ ───────────────────────────────────────────
export const qcService = {
  subscribeIncomingQC: (callback) => {
    const q = query(getCollection('qcRecords'), where('type', '==', 'Giriş'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  },

  addQCRecord: async (qcData) => {
    return addDoc(getCollection('qcRecords'), {
      ...qcData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }
};
