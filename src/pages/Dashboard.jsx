import { useDashboardStats } from '../hooks/useERP';
import { Spinner } from '../components/ui/index';
import {
  Package, AlertTriangle, ShieldCheck, ShoppingCart, 
  TrendingUp, Factory, Target, Zap, Clock, Bell
} from 'lucide-react';

export default function Dashboard() {
  const { stats, loading } = useDashboardStats();

  if (loading) return <Spinner size="lg" />;

  const kpis = [
    { label: 'Toplam Parça',     value: stats.totalParts,     icon: <Package size={18} />,      color: 'var(--c-accent)',   sub: 'Aktif envanter' },
    { label: 'Açık İş Emirleri', value: stats.activeWorkOrders, icon: <Factory size={18} />,      color: 'var(--c-purple)',   sub: 'Üretimde' },
    { label: 'Kritik Stok',      value: stats.criticalStock,    icon: <AlertTriangle size={18} />, color: 'var(--c-danger)',   sub: 'Min altında', critical: stats.criticalStock > 0 },
    { label: 'Bekleyen QC',      value: stats.pendingQC,        icon: <ShieldCheck size={18} />,   color: 'var(--c-warning)',  sub: 'Karantinada' },
    { label: 'Açık Satınalma',   value: stats.pendingPR,        icon: <ShoppingCart size={18} />,  color: 'var(--c-info)',     sub: 'Talep' },
    { label: 'Aktif Siparişler', value: stats.activeOrders,     icon: <TrendingUp size={18} />,    color: 'var(--c-success)',  sub: 'Müşteri Siparişi' },
  ];

  const pipelineStages = [
    { label: 'Sipariş',   icon: <ShoppingCart size={16} />, count: stats.pipeline.sales,      color: 'var(--c-info)' },
    { label: 'MRP',       icon: <Target size={16} />,        count: stats.pipeline.mrp,        color: 'var(--c-purple)' },
    { label: 'Üretim',    icon: <Factory size={16} />,       count: stats.pipeline.production, color: 'var(--c-warning)' },
    { label: 'QC',        icon: <ShieldCheck size={16} />,   count: stats.pipeline.qc,         color: 'var(--c-accent)' },
    { label: 'Sevkiyat',  icon: <Zap size={16} />,           count: stats.pipeline.shipping,   color: 'var(--c-success)' },
  ];

  return (
    <div className="page-content anim-fade">
      
      {/* KPI Row */}
      <div className="grid-6" style={{ marginBottom: 20 }}>
        {kpis.map((k, i) => (
          <div 
            key={i} 
            className={`kpi-card ${k.critical ? 'anim-pulse' : ''}`} 
            style={{ '--kpi-color': k.color }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between' }}>
              <span className="kpi-label" style={{ flex: 1 }}>{k.label}</span>
              <span style={{ color: k.color, opacity: 0.7 }}>{k.icon}</span>
            </div>
            <div className="kpi-value" style={{ color: k.color }}>{k.value}</div>
            <div className="kpi-sub">
              {k.critical && <div className="status-dot red" />}
              {k.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Production Pipeline */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header card-header-accent">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Target size={14} color="var(--c-accent)" />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t-primary)' }}>Üretim Hattı — Canlı Akış</span>
          </div>
          <div className="gap-flex">
             <span className="badge badge-active">
              <span className="status-dot blue anim-pulse" />
              CANLI
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'stretch', padding: '24px 32px', gap: 0 }}>
          {pipelineStages.map((stage, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 0 }}>
              <div style={{ 
                flex: 1, 
                background: stats.loading ? 'var(--c-bg-base)' : 'var(--c-bg-overlay)',
                border: `1px solid ${stage.count > 0 ? stage.color : 'var(--c-border)'}`,
                borderRadius: 8,
                padding: '20px 12px',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                boxShadow: stage.count > 0 ? `0 0 15px ${stage.color}15` : 'none'
              }}>
                <div style={{ color: stage.count > 0 ? stage.color : 'var(--t-dim)', display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                  {stage.icon}
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, fontFamily: 'var(--font-mono)', color: stage.count > 0 ? 'var(--t-primary)' : 'var(--t-dim)', marginBottom: 4 }}>
                  {stage.count}
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: stage.count > 0 ? 'var(--t-secondary)' : 'var(--t-dim)' }}>
                  {stage.label}
                </div>
              </div>
              {i < pipelineStages.length - 1 && (
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px', color: 'var(--c-border-bright)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9,18 15,12 9,6" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid-2" style={{ gap: 20 }}>
        
        {/* Alerts / Activity */}
        <div className="card">
          <div className="card-header card-header-warning">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bell size={14} color="var(--c-warning)" />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t-primary)' }}>Sistem Bildirimleri</span>
            </div>
          </div>
          <div className="card-body" style={{ minHeight: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            {stats.criticalStock > 0 ? (
              <div className="alert alert-danger" style={{ width: '100%', marginBottom: 10 }}>
                <AlertTriangle size={16} />
                <span>{stats.criticalStock} ürün kritik stok seviyesinin altında!</span>
              </div>
            ) : null}
            {!stats.loading && stats.totalParts === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--t-muted)' }}>
                <Clock size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
                <p style={{ fontSize: 13 }}>Henüz veri bulunamadı. Firebase senkronizasyonu bekleniyor.</p>
              </div>
            )}
          </div>
        </div>

        {/* Resources / Centers */}
        <div className="card">
          <div className="card-header card-header-info">
             <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Factory size={14} color="var(--c-info)" />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t-primary)' }}>Kaynak Durumları</span>
            </div>
          </div>
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
             <p style={{ color: 'var(--t-dim)', fontSize: 12, fontStyle: 'italic' }}>Üretim hattı verileri yapılandırılıyor...</p>
          </div>
        </div>

      </div>

      {/* Rules Notice */}
      {stats.totalParts === 0 && (
        <div className="anim-fade" style={{ 
          marginTop: 20, 
          background: 'var(--c-danger-dim)', 
          border: '1px solid rgba(239,68,68,0.2)', 
          borderRadius: 8, 
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <AlertTriangle size={18} color="var(--c-danger)" />
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--c-danger)', margin: 0 }}>
              VERİTABANI ERİŞİM HATASI (PERMISSION_DENIED)
            </p>
            <p style={{ fontSize: 12, color: 'var(--t-secondary)', margin: '4px 0 0' }}>
              Firebase Console &rarr; Firestore &rarr; Rules kısmından erişim izinlerini verdiğinizden emin olun. Kuralları güncelledikten sonra bu uyarı kaybolacaktır.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
