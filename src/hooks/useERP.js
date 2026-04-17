import { useState, useEffect } from 'react';
import { 
  salesService, 
  inventoryService, 
  productionService, 
  purchasingService, 
  qcService 
} from '../firebase/firestore';
import toast from 'react-hot-toast';

// ─── useOrders: Sipariş Takip Hook'u ──────────────────────────────────────────
export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 800);
    const unsub = salesService.subscribeOrders((data) => {
      clearTimeout(timeout);
      setOrders(data);
      setLoading(false);
    });
    return () => { clearTimeout(timeout); unsub(); };
  }, []);

  return { orders, loading };
}

// ─── useCustomers: Müşteri Takip Hook'u ──────────────────────────────────────
export function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 800);
    const unsub = salesService.subscribeCustomers((data) => {
      clearTimeout(timeout);
      setCustomers(data);
      setLoading(false);
    });
    return () => { clearTimeout(timeout); unsub(); };
  }, []);

  return { customers, loading };
}

// ─── useInventory: Stok & Parça Takip Hook'u ──────────────────────────────────
export function useInventory() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 800);
    const unsub = inventoryService.subscribeStock?.((data) => {
      clearTimeout(timeout);
      setParts(data);
      setLoading(false);
    });
    return () => { 
      clearTimeout(timeout); 
      if (typeof unsub === 'function') unsub(); 
    };
  }, []);

  return { parts, loading };
}

// ─── useWorkCenters: İş Merkezleri Hook'u ────────────────────────────────────
export function useWorkCenters() {
  const [workCenters, setWorkCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 800);
    const unsub = productionService.subscribeWorkCenters((data) => {
      clearTimeout(timeout);
      setWorkCenters(data);
      setLoading(false);
    });
    return () => { clearTimeout(timeout); unsub(); };
  }, []);

  return { workCenters, loading };
}

// ─── useWorkOrders: İş Emirleri Hook'u ────────────────────────────────────────
export function useWorkOrders() {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 800);
    const unsub = productionService.subscribeWorkOrders((data) => {
      clearTimeout(timeout);
      setWorkOrders(data);
      setLoading(false);
    });
    return () => { clearTimeout(timeout); unsub(); };
  }, []);

  return { workOrders, loading };
}

// ─── useProduction: Üretim Hattı Takip Hook'u ─────────────────────────────────
export function useProduction() {
  const { workOrders, loading } = useWorkOrders();
  
  // Quick stats computed directly from workOrders
  const stats = {
    pending: workOrders.filter(w => w.status === 'PENDING').length,
    inProgress: workOrders.filter(w => w.status === 'IN_PROGRESS').length,
    completed: workOrders.filter(w => w.status === 'COMPLETED').length,
    waitingMat: workOrders.filter(w => w.status === 'WAITING_MAT').length,
  };

  return { workOrders, stats, loading };
}

// ─── useQC: Kalite Kontrol Hook'u ─────────────────────────────────────────────
export function useQC() {
  const [qcRecords, setQcRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Note: Gerçek Mimaride (Production), doğrudan 'workOrders'dan ziyade QC 
  // koleksiyonundan veri çekilir. Burada onay bekleyen İş Emirlerini 'workOrders'tan
  // filtreleyerek QC panosuna düşürüyoruz.
  const { workOrders, loading: woLoading } = useWorkOrders();

  // İş emri tamamlandığında QC (Kalite) onayına düşer ("COMPLETED" or "QC_PENDING")
  const pendingProcessQC = workOrders.filter(w => w.status === 'COMPLETED');

  // Gerçekte kaydedilen geçmiş QC raporlarını dinlemek için:
  useEffect(() => {
    // Burada qcService olmadığı için şimdilik woLoading dönüyoruz veya dummy state
    setLoading(woLoading);
  }, [woLoading]);

  return { pendingProcessQC, qcRecords, loading };
}

// ─── useDashboardStats: Dashboard için toplu veri ─────────────────────────────
export function useDashboardStats() {
  const { orders,   loading: l1 } = useOrders();
  const { parts,    loading: l2 } = useInventory();
  const { workOrders, loading: l3 } = useProduction();

  const stats = {
    totalParts:    parts.length,
    activeWorkOrders: workOrders.filter(wo => wo.status === 'İşlemde' || wo.status === 'Üretimde').length,
    criticalStock: parts.filter(p => p.currentStock <= (p.minStock || 0)).length,
    pendingQC:     parts.filter(p => p.status === 'KONTROLDE' || p.status === 'KARANTİNA').length,
    pendingPR:     0, // TODO: Purchasing hook eklenince güncellenecek
    activeOrders:  orders.filter(o => o.status !== 'Tamamlandı' && o.status !== 'İptal').length,
    
    // Pipeline counts
    pipeline: {
      sales:      orders.filter(o => o.status === 'Taslak' || o.status === 'Onay Bekliyor').length,
      mrp:        orders.filter(o => o.status === 'Onaylandı').length,
      production: workOrders.length,
      qc:         parts.filter(p => p.status === 'KONTROLDE').length,
      shipping:   0,
    }
  };

  return { stats, loading: l1 || l2 || l3 };
}
