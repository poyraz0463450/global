import { useState } from 'react';
import { useWorkCenters } from '../../hooks/useERP';
import { 
  Factory, Plus, Search, Settings, 
  Activity, Zap, Clock, ShieldAlert 
} from 'lucide-react';
import { Button, Badge, Spinner, EmptyState } from '../../components/ui/index';
import AddWorkCenterModal from '../../components/modals/AddWorkCenterModal';

export default function WorkCenters() {
  const { workCenters, loading } = useWorkCenters();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredCenters = workCenters.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const typeStyles = {
    'MACHINE':   { label: 'ÜRETİM (MAKİNE)' },
    'ASSEMBLY':  { label: 'MONTAJ HATTI' },
    'QC':        { label: 'KALİTE KONTROL' },
    'PACKAGING': { label: 'PAKETLEME' },
  };

  const statusStyles = {
    'AVAILABLE':   { variant: 'success', label: 'MÜSAİT' },
    'RUNNING':     { variant: 'primary', label: 'ÇALIŞIYOR' },
    'MAINTENANCE': { variant: 'warning', label: 'BAKIMDA' },
    'OFFLINE':     { variant: 'danger',  label: 'KAPALI' },
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
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--t-primary)' }}>İş Merkezleri & Kapasite</h1>
          <p style={{ fontSize: 13, color: 'var(--t-dim)', margin: '4px 0 0' }}>Fabrika yerleşimi, makine envanteri ve anlık istasyon yükleri.</p>
        </div>
        <div className="gap-flex">
          <Button 
            variant="primary" 
            icon={<Plus size={16} />}
            onClick={() => setIsAddModalOpen(true)}
          >
            İş Merkezi Tanımla
          </Button>
        </div>
      </div>

      <AddWorkCenterModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      {/* Stats Quick View */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
         <div className="glass-card" style={{ padding: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--t-dim)', textTransform: 'uppercase', marginBottom: 4 }}>Toplam İstasyon</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--t-primary)' }}>{workCenters.length}</div>
        </div>
        <div className="glass-card" style={{ padding: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--t-dim)', textTransform: 'uppercase', marginBottom: 4 }}>Aktif Çalışan (Running)</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--c-accent)' }}>
            {workCenters.filter(c => c.status === 'RUNNING').length}
          </div>
        </div>
        <div className="glass-card" style={{ padding: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--t-dim)', textTransform: 'uppercase', marginBottom: 4 }}>Boşta (Available)</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--c-success)' }}>
            {workCenters.filter(c => c.status === 'AVAILABLE').length}
          </div>
        </div>
        <div className="glass-card" style={{ padding: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--c-danger)', textTransform: 'uppercase', marginBottom: 4 }}>Bakım & Arıza</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--c-warning)' }}>
            {workCenters.filter(c => c.status === 'MAINTENANCE' || c.status === 'OFFLINE').length}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', marginBottom: 20, gap: 16 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--t-dim)' }} />
          <input
            type="text"
            placeholder="İstasyon kodu veya adı ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ width: '100%', paddingLeft: 40 }}
          />
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>MERKEZ KODU</th>
              <th>İSTASYON ADI</th>
              <th>OPERASYON TİPİ</th>
              <th>KAPASİTE</th>
              <th>BEKLEYEN İŞ (WO)</th>
              <th>DURUM</th>
              <th style={{ textAlign: 'right' }}>YÖNETİM</th>
            </tr>
          </thead>
          <tbody>
            {filteredCenters.map((c, idx) => (
              <tr key={c.id} className="anim-fade" style={{ animationDelay: `${idx * 0.05}s` }}>
                <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--c-accent)' }}>
                  {c.code}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ 
                      width: 32, height: 32, borderRadius: 6, 
                      background: 'var(--c-bg-base)', display: 'flex', 
                      alignItems: 'center', justifyContent: 'center',
                      color: 'var(--t-primary)'
                    }}>
                      <Factory size={16} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600, color: 'var(--t-primary)', fontSize: 13 }}>{c.name}</span>
                      <span style={{ fontSize: 11, color: 'var(--t-muted)' }}>₺{c.costPerHour}/Sa Maliyet</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--t-secondary)' }}>
                    {typeStyles[c.type]?.label || c.type}
                  </span>
                </td>
                <td style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Zap size={14} color="var(--c-warning)" />
                    {c.capacityPerHour} BR/Sa
                  </div>
                </td>
                <td>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{c.activeJobs || 0}</span>
                </td>
                <td>
                  <Badge variant={statusStyles[c.status || 'OFFLINE'].variant}>
                    {statusStyles[c.status || 'OFFLINE'].label}
                  </Badge>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div className="gap-flex" style={{ justifyContent: 'flex-end' }}>
                     <button className="icon-btn-small" title="Bakım Moduna Al"><ShieldAlert size={14} /></button>
                     <button className="icon-btn-small" title="Ayarlar"><Settings size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCenters.length === 0 && (
          <EmptyState title="İş Merkezi Bulunamadı" desc="Henüz bir istasyon tanımlanmamış veya filtreye uygun kayıt yok." />
        )}
      </div>
    </div>
  );
}
