import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import { Spinner } from './components/ui/index';
import Login from './pages/Login';

// ── Lazy-ready page imports ──────────────────────────────────────────────────
// Dashboard
// Pages
import Dashboard from './pages/Dashboard';
import     Parts from './pages/parts/Parts';
import     Inventory from './pages/inventory/Inventory';
import     Customers from './pages/sales/Customers';
import     Orders from './pages/sales/Orders';
import     WorkCenters from './pages/production/WorkCenters';
import     WorkOrders from './pages/production/WorkOrders';
import     ProcessQC from './pages/qc/ProcessQC';
import     IncomingQC from './pages/qc/IncomingQC';
import     Suppliers from './pages/purchasing/Suppliers';
import     GRN from './pages/inventory/GRN';

// ComingSoon placeholder for unbuilt pages
const ComingSoon = ({ title }) => (
  <div className="page-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 }}>
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 48, fontWeight: 700, color: 'var(--c-border-bright)' }}>02</div>
    <h2 style={{ color: 'var(--t-secondary)', fontWeight: 500 }}>{title || 'Yapım Aşamasında'}</h2>
    <p style={{ color: 'var(--t-muted)', fontSize: 13 }}>Bu modül bir sonraki fazda eklenecek.</p>
  </div>
);

// ── Route Guards ─────────────────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user)   return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (user)    return <Navigate to="/" replace />;
  return children;
}

// ── Routes ────────────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

      {/* Protected — behind Layout */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />

        {/* Satış */}
        <Route path="sales/customers"  element={<Customers />} />
        <Route path="sales/quotations" element={<ComingSoon title="Teklifler" />} />
        <Route path="sales/orders"     element={<Orders />} />
        <Route path="sales/orders/:id" element={<ComingSoon title="Sipariş Detayı" />} />
        <Route path="sales/shipping"   element={<ComingSoon title="Sevkiyat" />} />

        {/* Satın Alma */}
        <Route path="purchasing/mrp"       element={<ComingSoon title="MRP Analizi" />} />
        <Route path="purchasing/requests"  element={<ComingSoon title="Satın Alma Talepleri" />} />
        <Route path="purchasing/orders"    element={<ComingSoon title="Satın Alma Siparişleri" />} />
        <Route path="purchasing/receipts"  element={<ComingSoon title="Satın Alma Girişleri" />} />
        <Route path="purchasing/suppliers" element={<Suppliers />} />

        {/* Depo */}
        <Route path="inventory/stock"     element={<Inventory />} />
        <Route path="inventory/movements" element={<ComingSoon title="Stok Hareketleri" />} />
        <Route path="inventory/grn"       element={<GRN />} />

        {/* Parçalar / BOM */}
        <Route path="parts"     element={<Parts />} />
        <Route path="parts/:id" element={<ComingSoon title="Parça Detayı" />} />

        {/* Üretim */}
        <Route path="production/work-orders"     element={<WorkOrders />} />
        <Route path="production/work-orders/:id" element={<ComingSoon title="İş Emri Detayı" />} />
        <Route path="production/work-centers"    element={<WorkCenters />} />
        <Route path="production/assembly"        element={<ComingSoon title="Montaj" />} />
        <Route path="production/gantt"           element={<ComingSoon title="Gantt Plan" />} />

        {/* Kalite */}
        <Route path="qc/incoming" element={<IncomingQC />} />
        <Route path="qc/process"  element={<ProcessQC />} />
        <Route path="qc/reports"  element={<ComingSoon title="QC Raporları" />} />
        <Route path="qc/ncr"      element={<ComingSoon title="NCR Kayıtları" />} />
        <Route path="qc/ncr/:id"  element={<ComingSoon title="NCR Detayı" />} />
        <Route path="qc/tools"    element={<ComingSoon title="Ölçüm Aletleri" />} />

        {/* Diğer */}
        <Route path="reports"    element={<ComingSoon title="Raporlar" />} />
        <Route path="documents"  element={<ComingSoon title="Dokümanlar" />} />
        <Route path="admin/users" element={<ComingSoon title="Kullanıcı Yönetimi" />} />
        <Route path="settings"   element={<ComingSoon title="Ayarlar" />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// ── App Root ──────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--c-bg-elevated)',
              color: 'var(--t-primary)',
              border: '1px solid var(--c-border-bright)',
              fontSize: 13,
              fontFamily: 'var(--font-body)',
            },
            success: { iconTheme: { primary: 'var(--c-success)', secondary: '#000' } },
            error:   { iconTheme: { primary: 'var(--c-danger)',  secondary: '#000' } },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
