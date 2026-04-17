// ─── Shared UI Components ────────────────────────────────────────────────────
// All atomic & reusable components for ARTEGON ERP v2

import { X, AlertTriangle, Info, CheckCircle, XCircle, Inbox } from 'lucide-react';

// ── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ size = 'md' }) {
  const s = size === 'sm' ? 20 : size === 'lg' ? 48 : 32;
  return (
    <div className="spinner-full">
      <div className="spinner" style={{ width: s, height: s }} />
    </div>
  );
}

export function InlineSpinner({ size = 16 }) {
  return (
    <div className="spinner" style={{ width: size, height: size, borderWidth: 1.5 }} />
  );
}

// ── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ message = 'Veri bulunamadı', icon }) {
  return (
    <div className="empty-state">
      {icon || <Inbox className="empty-state-icon" />}
      <p>{message}</p>
    </div>
  );
}

// ── Status Badge ─────────────────────────────────────────────────────────────
const STATUS_MAP = {
  // Orders
  'Taslak':        'badge-draft',
  'Onay Bekliyor': 'badge-pending',
  'Onaylı':        'badge-approved',
  'Aktif':         'badge-active',
  'İşlemde':       'badge-progress',
  'Üretimde':      'badge-progress',
  'Tamamlandı':    'badge-completed',
  'Teslim Edildi': 'badge-completed',
  'İptal':         'badge-cancelled',
  'Başarısız':     'badge-failed',
  'Ret':           'badge-failed',
  // Inventory
  'MÜSAİT':       'badge-available',
  'TAHSİSLI':     'badge-reserved',
  'KONTROLDE':    'badge-pending',
  'KARANTİNA':    'badge-quarantine',
  'ÜRETİMDE':     'badge-progress',
  'SEVK_HAZIR':   'badge-shipped',
  // Purchasing
  'Sipariş Verildi': 'badge-approved',
  'Kısmi Teslim':    'badge-pending',
  'Teslim Alındı':   'badge-completed',
  // QC
  'Geçti':         'badge-completed',
  'Kaldı':         'badge-failed',
  'Muaf':          'badge-draft',
  // Generic
  'Açık':          'badge-active',
  'Kapalı':        'badge-cancelled',
  'Beklemede':     'badge-pending',
  'Kritik':        'badge-critical',
};

export function StatusBadge({ status }) {
  const cls = STATUS_MAP[status] || 'badge-draft';
  return <span className={`badge ${cls}`}>{status}</span>;
}

export function Badge({ children, variant = 'primary', className = '' }) {
  return <span className={`badge badge-${variant} ${className}`}>{children}</span>;
}

// ── KPI Card ─────────────────────────────────────────────────────────────────
export function KPICard({ label, value, icon, sub, color, onClick }) {
  return (
    <div
      className="kpi-card"
      style={{ '--kpi-color': color || 'var(--c-accent)', cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="kpi-label">{label}</span>
        {icon && (
          <span style={{ color: color || 'var(--c-accent)', opacity: 0.7 }}>{icon}</span>
        )}
      </div>
      <div className="kpi-value" style={{ color: color || 'var(--t-primary)' }}>{value}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </div>
  );
}

// ── Page Header ──────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, icon, actions, breadcrumb }) {
  return (
    <div className="page-header anim-fade">
      <div>
        {breadcrumb && (
          <div className="breadcrumb">
            {breadcrumb.map((b, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {i > 0 && <span className="breadcrumb-sep">/</span>}
                {b.href ? <a href={b.href}>{b.label}</a> : <span style={{ color: 'var(--t-secondary)' }}>{b.label}</span>}
              </span>
            ))}
          </div>
        )}
        <div className="page-title">
          {icon && <span style={{ color: 'var(--c-accent)', display: 'flex' }}>{icon}</span>}
          {title}
        </div>
        {subtitle && <div className="page-subtitle">{subtitle}</div>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>{actions}</div>}
    </div>
  );
}

// ── Button ───────────────────────────────────────────────────────────────────
export function Button({ children, variant = 'secondary', size, onClick, disabled, type = 'button', icon, loading, style }) {
  const cls = [
    'btn',
    `btn-${variant}`,
    size ? `btn-${size}` : '',
  ].filter(Boolean).join(' ');
  return (
    <button className={cls} onClick={onClick} disabled={disabled || loading} type={type} style={style}>
      {loading ? <InlineSpinner size={13} /> : icon}
      {children}
    </button>
  );
}

// ── Form Field ───────────────────────────────────────────────────────────────
export function FormField({ label, error, required, children, hint }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && (
        <label className="form-label">
          {label}{required && <span style={{ color: 'var(--c-danger)', marginLeft: 3 }}>*</span>}
        </label>
      )}
      {children}
      {hint && !error && <span style={{ fontSize: 11, color: 'var(--t-muted)' }}>{hint}</span>}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

export function Input({ className = '', ...props }) {
  return <input className={`form-input ${className}`} {...props} />;
}

export function Select({ className = '', children, ...props }) {
  return <select className={`form-select ${className}`} {...props}>{children}</select>;
}

export function Textarea({ className = '', ...props }) {
  return <textarea className={`form-textarea ${className}`} {...props} />;
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className={`modal-box ${size}`}>
        <div className="modal-header">
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--t-primary)' }}>{title}</span>
          <button className="icon-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

// ── Alert ─────────────────────────────────────────────────────────────────────
export function Alert({ type = 'info', children, onClose }) {
  const icons = { info: <Info size={16} />, warning: <AlertTriangle size={16} />, danger: <XCircle size={16} />, success: <CheckCircle size={16} /> };
  return (
    <div className={`alert alert-${type}`}>
      {icons[type]}
      <div style={{ flex: 1, fontSize: 13 }}>{children}</div>
      {onClose && <button className="icon-btn" onClick={onClose} style={{ color: 'inherit', width: 20, height: 20 }}><X size={14} /></button>}
    </div>
  );
}

// ── Workflow Stepper ──────────────────────────────────────────────────────────
export function WorkflowStepper({ steps, currentStep }) {
  return (
    <div className="stepper">
      {steps.map((step, i) => {
        const isDone   = i < currentStep;
        const isActive = i === currentStep;
        return (
          <div key={i} className="step">
            <div className="step-node">
              <div className={`step-circle ${isDone ? 'done' : isActive ? 'active' : ''}`}>
                {isDone ? <CheckCircle size={14} /> : i + 1}
              </div>
              <span className={`step-label ${isActive ? 'active' : isDone ? 'done' : ''}`}>{step}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`step-connector ${isDone ? 'done' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, accent, className = '', style }) {
  return (
    <div className={`card ${className}`} style={style}>
      {children}
    </div>
  );
}

export function CardHeader({ title, icon, actions, accent = 'accent' }) {
  return (
    <div className={`card-header card-header-${accent}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon && <span style={{ color: 'var(--c-accent)', display: 'flex' }}>{icon}</span>}
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t-primary)' }}>{title}</span>
      </div>
      {actions && <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{actions}</div>}
    </div>
  );
}

// ── Filter Bar ────────────────────────────────────────────────────────────────
export function FilterBar({ filters, active, onChange, children }) {
  return (
    <div className="filter-bar">
      {filters.map(f => (
        <button
          key={f.value}
          className={`filter-chip ${active === f.value ? 'active' : ''}`}
          onClick={() => onChange(f.value)}
        >
          {f.label}
          {f.count !== undefined && (
            <span style={{ marginLeft: 4, fontFamily: 'var(--font-mono)' }}>({f.count})</span>
          )}
        </button>
      ))}
      {children}
    </div>
  );
}

// ── Tab Bar ───────────────────────────────────────────────────────────────────
export function TabBar({ tabs, active, onChange }) {
  return (
    <div className="tab-bar">
      {tabs.map(t => (
        <div
          key={t.value}
          className={`tab ${active === t.value ? 'active' : ''}`}
          onClick={() => onChange(t.value)}
        >
          {t.label}
        </div>
      ))}
    </div>
  );
}

// ── Data Table ────────────────────────────────────────────────────────────────
export function DataTable({ columns, data, loading, emptyMessage, onRowClick }) {
  if (loading) return <Spinner />;
  if (!data || data.length === 0) return <EmptyState message={emptyMessage} />;
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i} style={{ textAlign: col.align || 'left', width: col.width }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, ri) => (
            <tr key={row.id || ri} onClick={() => onRowClick?.(row)} style={{ cursor: onRowClick ? 'pointer' : 'default' }}>
              {columns.map((col, ci) => (
                <td key={ci} style={{ textAlign: col.align || 'left' }}>
                  {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Timeline ──────────────────────────────────────────────────────────────────
export function Timeline({ items }) {
  return (
    <div className="timeline">
      {items.map((item, i) => (
        <div key={i} className="timeline-item">
          <div className="timeline-line">
            <div className={`timeline-dot ${item.color || 'blue'}`} />
            {i < items.length - 1 && <div className="timeline-bar" />}
          </div>
          <div className="timeline-content">
            <div className="timeline-title">{item.title}</div>
            {item.meta && <div className="timeline-meta">{item.meta}</div>}
            {item.content && <div style={{ marginTop: 6, fontSize: 12, color: 'var(--t-muted)' }}>{item.content}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Confirm Dialog ────────────────────────────────────────────────────────────
export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Onayla', variant = 'danger', loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>İptal</Button>
          <Button variant={variant} onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
        </>
      }
    >
      <p style={{ fontSize: 13, color: 'var(--t-secondary)', lineHeight: 1.6 }}>{message}</p>
    </Modal>
  );
}
