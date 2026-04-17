import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Package, ClipboardList, ShoppingCart,
  Warehouse, Factory, Shield, Truck, BarChart3,
  Users, Settings, ChevronDown, ChevronRight,
  Target, FileText, Cpu, GitBranch, Menu
} from 'lucide-react';

const NAV = [
  {
    group: 'Komuta',
    items: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    ]
  },
  {
    group: 'Satış & CRM',
    items: [
      { to: '/sales', label: 'Siparişler', icon: ClipboardList,
        children: [
          { to: '/sales/customers', label: 'Müşteriler' },
          { to: '/sales/quotations', label: 'Teklifler' },
          { to: '/sales/orders', label: 'Siparişler' },
          { to: '/sales/shipping', label: 'Sevkiyat' },
        ]
      },
    ]
  },
  {
    group: 'Tedarik Zinciri',
    items: [
      { to: '/purchasing', label: 'Satın Alma', icon: ShoppingCart,
        children: [
          { to: '/purchasing/mrp', label: 'MRP Analizi' },
          { to: '/purchasing/requests', label: 'Talepler (PR)' },
          { to: '/purchasing/orders', label: 'Siparişler (PO)' },
          { to: '/purchasing/receipts', label: 'Mal Kabul' },
          { to: '/purchasing/suppliers', label: 'Tedarikçiler' },
        ]
      },
    ]
  },
  {
    group: 'Depo & Stok',
    items: [
      { to: '/inventory', label: 'Envanter', icon: Warehouse,
        children: [
          { to: '/inventory/stock', label: 'Stok Listesi' },
          { to: '/inventory/movements', label: 'Hareketler' },
          { to: '/inventory/grn', label: 'Mal Kabul (GRN)' },
        ]
      },
    ]
  },
  {
    group: 'Üretim',
    items: [
      { to: '/parts', label: 'Malzeme / BOM', icon: Package },
      { to: '/production', label: 'Üretim (MES)', icon: Factory,
        children: [
          { to: '/production/work-orders', label: 'İş Emirleri' },
          { to: '/production/work-centers', label: 'İş Merkezleri' },
          { to: '/production/assembly', label: 'Montaj' },
          { to: '/production/gantt', label: 'Gantt Plan' },
        ]
      },
    ]
  },
  {
    group: 'Kalite',
    items: [
      { to: '/qc', label: 'Kalite Kontrol', icon: Shield,
        children: [
          { to: '/qc/incoming', label: 'Giriş QC' },
          { to: '/qc/process', label: 'Proses QC' },
          { to: '/qc/final', label: 'Atış Testi' },
          { to: '/qc/ncr', label: 'NCR Kayıtları' },
          { to: '/qc/tools', label: 'Ölçüm Aletleri' },
        ]
      },
    ]
  },
  {
    group: 'Analitik',
    items: [
      { to: '/reports', label: 'Raporlar', icon: BarChart3 },
      { to: '/documents', label: 'Dokümanlar', icon: FileText },
    ]
  },
  {
    group: 'Sistem',
    items: [
      { to: '/admin/users', label: 'Kullanıcılar', icon: Users },
      { to: '/settings', label: 'Ayarlar', icon: Settings },
    ]
  },
];

function NavGroup({ group, items, collapsed }) {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState(() => {
    const init = {};
    items.forEach(item => {
      if (item.children?.some(c => location.pathname.startsWith(c.to))) init[item.to] = true;
      if (location.pathname === item.to) init[item.to] = true;
    });
    return init;
  });

  const toggle = (to) => setOpenMenus(p => ({ ...p, [to]: !p[to] }));

  return (
    <div style={{ marginBottom: 4 }}>
      {!collapsed && <div className="nav-group-title">{group}</div>}
      {items.map(item => {
        const Icon = item.icon;
        const hasChildren = item.children?.length > 0;
        const isOpen = openMenus[item.to];
        const isParentActive = item.children?.some(c => location.pathname.startsWith(c.to));

        if (hasChildren) {
          return (
            <div key={item.to}>
              <div
                className={`nav-item ${isParentActive ? 'active' : ''}`}
                onClick={() => toggle(item.to)}
              >
                {Icon && <Icon size={16} className="nav-icon" />}
                {!collapsed && (
                  <>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {isOpen ? <ChevronDown size={13} opacity={0.5} /> : <ChevronRight size={13} opacity={0.5} />}
                  </>
                )}
              </div>
              {isOpen && !collapsed && (
                <div className="anim-slide">
                  {item.children.map(child => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      className={({ isActive }) => `sub-nav-item ${isActive ? 'active' : ''}`}
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        }

        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {Icon && <Icon size={16} className="nav-icon" />}
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        );
      })}
    </div>
  );
}

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const initials = (user?.displayName || user?.email || 'A')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">AR</div>
        {!collapsed && (
          <div>
            <div className="sidebar-logo-text">ARTEGON</div>
            <div className="sidebar-logo-sub">Defense ERP v2</div>
          </div>
        )}
        {!collapsed && (
          <button className="icon-btn" onClick={onToggle} style={{ marginLeft: 'auto' }}>
            <Menu size={15} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {collapsed && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
            <button className="icon-btn" onClick={onToggle}>
              <Menu size={15} />
            </button>
          </div>
        )}
        {NAV.map(section => (
          <NavGroup
            key={section.group}
            group={section.group}
            items={section.items}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="user-avatar">{initials}</div>
        {!collapsed && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="user-name truncate">
              {user?.displayName || user?.email?.split('@')[0] || 'Admin'}
            </div>
            <div className="user-role truncate">{user?.role || 'Kullanıcı'}</div>
          </div>
        )}
        {!collapsed && (
          <button className="icon-btn" onClick={logout} data-tooltip="Çıkış">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16,17 21,12 16,7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
