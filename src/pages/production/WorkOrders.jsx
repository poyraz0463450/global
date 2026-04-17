import { useState } from 'react';
import { useWorkOrders } from '../../hooks/useERP';
import { 
  ClipboardList, Plus, Search, CheckCircle, 
  PlayCircle, AlertTriangle, Clock, Settings 
} from 'lucide-react';
import { Button, Badge, Spinner, EmptyState } from '../../components/ui/index';
import AddWorkOrderModal from '../../components/modals/AddWorkOrderModal';
import { productionService } from '../../firebase/firestore';
import toast from 'react-hot-toast';

export default function WorkOrders() {
  const { workOrders, loading } = useWorkOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredWO = workOrders.filter(w => 
    w.partNo?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusStyles = {
    'WAITING_MAT': { variant: 'danger',  label: 'STOK BEKLİYOR' },
    'PENDING':     { variant: 'warning', label: 'PLANLANDI' },
    'IN_PROGRESS': { variant: 'primary', label: 'ÜRETİMDE' },
    'COMPLETED':   { variant: 'success', label: 'BİTTİ' },
  };

  const startProduction = async (woId) => {
    try {
      await productionService.updateWorkOrderStatus(woId, 'IN_PROGRESS');
      toast.success('Üretim başlatıldı.');
    } catch (err) {
      toast.error('Hata: ' + err.message);
    }
  };

  const completeProduction = async (woId) => {
    try {
      await productionService.updateWorkOrderStatus(woId, 'COMPLETED');
      toast.success('Üretim tamamlandı. Kalite Kontrol onayına gönderildi.');
    } catch (err) {
      toast.error('Hata: ' + err.message);
    }
  };

  if (loading) return (
    <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Spinner size="lg" />
    </div>
  );

  return (
    <div className="page-content anim-fade">
      <div className="glass-header" style={{ marginBottom: 20, padding: '16px 24px', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--t-primary)' }}>İş Emirleri & Üretim Takip (MES)</h1>
          <p style={{ fontSize: 13, color: 'var(--t-dim)', margin: '4px 0 0' }}>Planlı üretimler, açık iş emirleri ve anlık atölye durumu.</p>
        </div>
        <div className="gap-flex">
          <Button 
             variant="primary" 
             icon={<Plus size={16} />}
             onClick={() => setIsAddModalOpen(true)}
          >
            İş Emri Oluştur
          </Button>
        </div>
      </div>

      <AddWorkOrderModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      {/* MES Board Stats */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        <div className="glass-card" style={{ padding: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--c-danger)', textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <AlertTriangle size={12} /> Malzeme Bekleyen
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--c-danger)' }}>
            {workOrders.filter(w => w.status === 'WAITING_MAT').length}
          </div>
        </div>
        <div className="glass-card" style={{ padding: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--c-warning)', textTransform: 'uppercase', marginBottom: 4 }}>Sıradaki İşler (Queue)</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--c-warning)' }}>
            {workCenters.filter(w => w.status === 'PENDING').length || 0} {/* Fallback if missing payload */}
          </div>
        </div>
        <div className="glass-card" style={{ padding: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--c-info)', textTransform: 'uppercase', marginBottom: 4 }}>Aktif Üretim</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--c-info)' }}>
             {workOrders.filter(w => w.status === 'IN_PROGRESS').length}
          </div>
        </div>
        <div className="glass-card" style={{ padding: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--c-success)', textTransform: 'uppercase', marginBottom: 4 }}>Bugün Tamamlanan</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--c-success)' }}>
             {workOrders.filter(w => w.status === 'COMPLETED').length}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>WO KODU</th>
              <th>ÜRETİLECEK PARÇA</th>
              <th>İŞ MERKEZİ</th>
              <th>MİKTAR</th>
              <th>DURUM</th>
              <th style={{ textAlign: 'right' }}>AKSİYON</th>
            </tr>
          </thead>
          <tbody>
            {filteredWO.map((w, idx) => {
              const status = statusStyles[w.status || 'PENDING'];
              return (
                <tr key={w.id} className="anim-fade" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--c-accent)' }}>
                    WO-{w.id.slice(0,6).toUpperCase()}
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600, color: 'var(--t-primary)' }}>{w.partNo}</span>
                      <span style={{ fontSize: 11, color: 'var(--t-muted)' }}>{w.partName}</span>
                    </div>
                  </td>
                  <td>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                       <Settings size={14} color="var(--t-dim)" />
                       <span style={{ fontSize: 12, fontWeight: 500 }}>{w.workCenterName || 'Atanmadı'}</span>
                     </div>
                  </td>
                  <td style={{ fontWeight: 700, fontSize: 14 }}>
                    {w.progress > 0 && w.progress < 100 ? `${w.targetQty / 2} / ` : ''}{w.targetQty} ADET
                  </td>
                  <td>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="gap-flex" style={{ justifyContent: 'flex-end' }}>
                       {w.status === 'WAITING_MAT' && (
                         <Button size="sm" variant="secondary" icon={<ShoppingCart size={14} />}>Talep Aç</Button>
                       )}
                       {w.status === 'PENDING' && (
                         <Button size="sm" variant="primary" onClick={() => startProduction(w.id)} icon={<PlayCircle size={14} />}>Başlat</Button>
                       )}
                       {w.status === 'IN_PROGRESS' && (
                         <Button size="sm" variant="success" onClick={() => completeProduction(w.id)} icon={<CheckCircle size={14} />}>Bitir</Button>
                       )}
                       <button className="icon-btn-small" title="Operasyon Detayı"><ClipboardList size={14} /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filteredWO.length === 0 && (
          <EmptyState title="İş Emri Yok" desc="Şu anda aktif bir üretim planı bulunmamaktadır." />
        )}
      </div>
    </div>
  );
}
