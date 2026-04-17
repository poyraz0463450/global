import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Search, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Breadcrumb label map
const ROUTE_LABELS = {
  '': 'Dashboard',
  'sales': 'Satış',
  'customers': 'Müşteriler',
  'quotations': 'Teklifler',
  'orders': 'Siparişler',
  'shipping': 'Sevkiyat',
  'purchasing': 'Satın Alma',
  'mrp': 'MRP Analizi',
  'requests': 'Talepler',
  'receipts': 'Mal Kabul',
  'suppliers': 'Tedarikçiler',
  'inventory': 'Envanter',
  'stock': 'Stok',
  'movements': 'Hareketler',
  'grn': 'Mal Kabul (GRN)',
  'parts': 'Malzeme / BOM',
  'production': 'Üretim',
  'work-orders': 'İş Emirleri',
  'work-centers': 'İş Merkezleri',
  'assembly': 'Montaj',
  'gantt': 'Gantt Plan',
  'qc': 'Kalite Kontrol',
  'incoming': 'Giriş QC',
  'process': 'Proses QC',
  'final': 'Atış Testi',
  'ncr': 'NCR Kayıtları',
  'tools': 'Ölçüm Aletleri',
  'reports': 'Raporlar',
  'documents': 'Dokümanlar',
  'admin': 'Yönetim',
  'users': 'Kullanıcılar',
};

export default function Header({ onRefresh }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchVal, setSearchVal] = useState('');

  // Build breadcrumbs from path
  const segments = location.pathname.split('/').filter(Boolean);
  const crumbs = [
    { label: 'ARTEGON', to: '/' },
    ...segments.map((seg, i) => ({
      label: ROUTE_LABELS[seg] || seg.toUpperCase(),
      to: '/' + segments.slice(0, i + 1).join('/'),
    }))
  ];

  const currentLabel = crumbs[crumbs.length - 1]?.label || 'Dashboard';

  return (
    <div className="topbar">
      {/* Breadcrumb */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <div className="breadcrumb">
          {crumbs.slice(0, -1).map((c, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {i > 0 && <span className="breadcrumb-sep">/</span>}
              <a
                href={c.to}
                style={{ color: 'var(--t-muted)', textDecoration: 'none' }}
                onClick={e => { e.preventDefault(); navigate(c.to); }}
              >
                {c.label}
              </a>
            </span>
          ))}
        </div>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--t-primary)' }}>
          {currentLabel}
        </span>
      </div>

      {/* Search */}
      <div className="topbar-search" style={{ marginLeft: 24 }}>
        <Search size={13} color="var(--t-dim)" />
        <input
          placeholder="Sipariş, parça, iş emri ara..."
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
        />
        {searchVal && (
          <kbd style={{ fontSize: 10, padding: '1px 5px', background: 'var(--c-bg-base)', border: '1px solid var(--c-border)', borderRadius: 3, color: 'var(--t-muted)', flexShrink: 0 }}>ESC</kbd>
        )}
      </div>

      {/* Actions */}
      <div className="topbar-actions">
        {/* System status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'var(--c-bg-overlay)', border: '1px solid var(--c-border)', borderRadius: 4 }}>
          <div className="status-dot green" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
          <span style={{ fontSize: 11, color: 'var(--t-muted)', fontFamily: 'var(--font-mono)' }}>LIVE</span>
        </div>

        {onRefresh && (
          <button className="icon-btn" onClick={onRefresh} data-tooltip="Yenile">
            <RefreshCw size={14} />
          </button>
        )}

        <button className="icon-btn" data-tooltip="Bildirimler">
          <Bell size={14} />
          <span className="notif-dot" />
        </button>

        {/* User chip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px', background: 'var(--c-bg-overlay)', border: '1px solid var(--c-border)', borderRadius: 4, cursor: 'pointer' }}>
          <div className="user-avatar" style={{ width: 22, height: 22, fontSize: 9 }}>
            {(user?.displayName || user?.email || 'A').slice(0, 2).toUpperCase()}
          </div>
          <span style={{ fontSize: 12, color: 'var(--t-secondary)', fontWeight: 500 }}>
            {user?.displayName || user?.email?.split('@')[0] || 'Admin'}
          </span>
        </div>
      </div>
    </div>
  );
}
