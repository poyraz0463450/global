import { useDashboardStats } from '../hooks/useERP';
import { SpotlightCard, Skeleton, Spinner } from '../components/ui/index';
import CountUp from '../components/ui/CountUp';
import {
  Package, AlertTriangle, ShieldCheck, ShoppingCart, 
  TrendingUp, Factory, Target, Zap, Clock, Bell, Activity
} from 'lucide-react';

export default function Dashboard() {
  const { stats, loading } = useDashboardStats();

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

  const chartData = [45, 78, 32, 59, 88, 42, 67]; // Ornek haftalik uretim verisi

  return (
    <div className="page-content anim-fade">
      
      {/* ── KPI Row ────────────────────────────────────────────────────────── */}
      <div className="grid-6" style={{ marginBottom: 20 }}>
        {kpis.map((k, i) => (
          <SpotlightCard 
            key={i} 
            className={`kpi-card glass ${k.critical ? 'anim-pulse' : ''}`} 
            style={{ '--spotlight-color': `${k.color}15`, '--kpi-color': k.color }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="kpi-label" style={{ flex: 1 }}>{k.label}</span>
              <span style={{ color: k.color, opacity: 0.7 }}>{k.icon}</span>
            </div>
            
            {loading ? (
              <Skeleton height={32} style={{ margin: '8px 0' }} />
            ) : (
              <div className="kpi-value" style={{ color: k.color }}>
                <CountUp end={k.value} />
              </div>
            )}
            
            <div className="kpi-sub">
              {k.critical && <div className="status-dot red" />}
              {loading ? <Skeleton width={80} height={12} /> : k.sub}
            </div>
          </SpotlightCard>
        ))}
      </div>

      {/* ── Production Pipeline (Live Tracker) ─────────────────────────────── */}
      <SpotlightCard className="glass" style={{ marginBottom: 20, '--spotlight-color': 'rgba(0, 200, 232, 0.05)' }}>
        <div className="card-header card-header-accent" style={{ background: 'transparent' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={16} color="var(--c-accent)" />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Hat Görüntüleme Sistemi — L.I.V.E
            </span>
          </div>
          <div className="gap-flex">
             <span className="badge badge-active" style={{ background: 'rgba(0, 200, 232, 0.1)', backdropFilter: 'blur(4px)' }}>
              <span className="status-dot blue anim-pulse" />
              SİSTEM AKTİF
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'stretch', padding: '24px 32px', gap: 0, position: 'relative' }}>
          
          {loading ? (
             <div style={{ display: 'flex', gap: 20, width: '100%', padding: '10px 0' }}>
               {[1,2,3,4,5].map(i => <Skeleton key={i} height={80} />)}
             </div>
          ) : (
            pipelineStages.map((stage, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 0, zIndex: 1 }}>
                <div style={{ 
                  flex: 1, 
                  background: 'rgba(13, 17, 23, 0.4)',
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${stage.count > 0 ? stage.color : 'rgba(255,255,255,0.05)'}`,
                  borderRadius: 8,
                  padding: '20px 12px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  boxShadow: stage.count > 0 ? `0 0 20px ${stage.color}15, inset 0 0 10px ${stage.color}05` : 'none'
                }}>
                  <div style={{ color: stage.count > 0 ? stage.color : 'var(--t-dim)', display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                    {stage.icon}
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 700, fontFamily: 'var(--font-mono)', color: stage.count > 0 ? 'var(--t-primary)' : 'var(--t-dim)', marginBottom: 4, textShadow: stage.count > 0 ? `0 0 10px ${stage.color}40` : 'none' }}>
                    <CountUp end={stage.count} />
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: stage.count > 0 ? 'var(--t-secondary)' : 'var(--t-dim)' }}>
                    {stage.label}
                  </div>
                </div>
                {i < pipelineStages.length - 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px', color: 'rgba(255,255,255,0.1)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray={stage.count > 0 ? "4 4" : "0"} style={{ animation: stage.count > 0 ? 'scanline 2s linear infinite reverse' : 'none' }}>
                      <polyline points="9,18 15,12 9,6" />
                    </svg>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </SpotlightCard>

      {/* ── Bottom Grid ────────────────────────────────────────────────────── */}
      <div className="grid-2" style={{ gap: 20 }}>
        
        {/* Alerts / Activity */}
        <SpotlightCard className="glass" style={{ '--spotlight-color': 'rgba(245, 158, 11, 0.05)' }}>
          <div className="card-header card-header-warning" style={{ background: 'transparent' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bell size={14} color="var(--c-warning)" />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t-primary)' }}>Sistem Bildirimleri</span>
            </div>
          </div>
          <div className="card-body" style={{ minHeight: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            {loading ? (
              <div style={{ width: '100%', gap: 10, display: 'flex', flexDirection: 'column' }}>
                <Skeleton height={40} />
                <Skeleton height={40} />
              </div>
            ) : stats.criticalStock > 0 ? (
              <div className="alert alert-danger" style={{ width: '100%', marginBottom: 10, background: 'rgba(239, 68, 68, 0.1)', backdropFilter: 'blur(4px)' }}>
                <AlertTriangle size={16} />
                <span><CountUp end={stats.criticalStock} /> ürün kritik stok seviyesinin altında!</span>
              </div>
            ) : null}
            {!loading && stats.totalParts === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--t-muted)' }}>
                <Clock size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
                <p style={{ fontSize: 13 }}>Henüz veri bulunamadı. Firebase senkronizasyonu bekleniyor.</p>
              </div>
            )}
          </div>
        </SpotlightCard>

        {/* Resources / Mini-Chart */}
        <SpotlightCard className="glass" style={{ '--spotlight-color': 'rgba(59, 130, 246, 0.05)' }}>
          <div className="card-header card-header-info" style={{ background: 'transparent' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Factory size={14} color="var(--c-info)" />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t-primary)' }}>Haftalık Üretim Eğilimi</span>
            </div>
          </div>
          <div className="card-body" style={{ minHeight: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, padding: '24px 32px' }}>
             {chartData.map((val, idx) => (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 10, color: 'var(--t-dim)', fontFamily: 'var(--font-mono)' }}>{val}</span>
                  <div style={{ 
                    width: '100%', 
                    height: `${val}px`, 
                    background: 'linear-gradient(to top, rgba(0, 200, 232, 0.1), rgba(0, 200, 232, 0.8))',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 1s cubic-bezier(0.1, 0.7, 0.1, 1)',
                    boxShadow: '0 -4px 12px rgba(0, 200, 232, 0.2)'
                  }} />
                  <span style={{ fontSize: 10, color: 'var(--t-muted)' }}>{['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'][idx]}</span>
                </div>
             ))}
          </div>
        </SpotlightCard>

      </div>

      {/* Rules Notice */}
      {!loading && stats.totalParts === 0 && (
        <SpotlightCard className="anim-fade glass" style={{ 
          marginTop: 20, 
          background: 'rgba(239,68,68,0.1)', 
          border: '1px solid rgba(239,68,68,0.2)', 
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <AlertTriangle size={18} color="var(--c-danger)" />
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--c-danger)', margin: 0 }}>
              VERİTABANI ERİŞİM HATASI (PERMISSION_DENIED) VEYA VERİ YOK
            </p>
            <p style={{ fontSize: 12, color: 'var(--t-secondary)', margin: '4px 0 0' }}>
              Firebase Console ayarlarınızı kontrol edin veya yeni kayıtlar ekleyin. Veri alımı aktif ancak kayıtlı değerler sıfır.
            </p>
          </div>
        </SpotlightCard>
      )}
    </div>
  );
}
