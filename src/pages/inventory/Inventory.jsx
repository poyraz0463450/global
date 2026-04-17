import { useState } from 'react';
import { useInventory } from '../../hooks/useERP';
import { 
  History, AlertTriangle, ArrowUpRight, ArrowDownLeft, 
  Warehouse, Filter, Search, RotateCcw 
} from 'lucide-react';
import { Button, Badge, Spinner, EmptyState } from '../../components/ui/index';
import MovementModal from '../../components/modals/MovementModal';

export default function Inventory() {
  const { parts, loading } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPart, setSelectedPart] = useState(null);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);

  const handleOpenMove = (part) => {
    setSelectedPart(part);
    setIsMoveModalOpen(true);
  };

  const filteredInventory = parts.filter(p => 
    p.partNo?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Spinner size="lg" />
    </div>
  );

  return (
    <div className="page-content anim-fade">
      <div className="glass-header" style={{ marginBottom: 20, padding: '16px 24px', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--t-primary)' }}>Anlık Stok Takibi</h1>
          <p style={{ fontSize: 13, color: 'var(--t-dim)', margin: '4px 0 0' }}>Ambar bazlı stok miktarları ve kritik seviye kontrolleri.</p>
        </div>
        <div className="gap-flex">
          <Button variant="secondary" icon={<History size={16} />}>Hareket Geçmişi</Button>
          <Button variant="primary" icon={<RotateCcw size={16} />}>Sayım Başlat</Button>
        </div>
      </div>

      <MovementModal 
        isOpen={isMoveModalOpen} 
        onClose={() => setIsMoveModalOpen(false)} 
        part={selectedPart}
      />

      {/* Stats Cards Row */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        <div className="glass-card" style={{ padding: 16 }}>
          <div style={{ color: 'var(--c-accent)', marginBottom: 8 }}><Warehouse size={20} /></div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{parts.length}</div>
          <div style={{ fontSize: 11, color: 'var(--t-dim)', textTransform: 'uppercase' }}>Kayıtlı Kalem</div>
        </div>
        <div className="glass-card" style={{ padding: 16, borderLeft: '4px solid var(--c-danger)' }}>
          <div style={{ color: 'var(--c-danger)', marginBottom: 8 }}><AlertTriangle size={20} /></div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{parts.filter(p => p.currentStock <= p.minStock).length}</div>
          <div style={{ fontSize: 11, color: 'var(--t-dim)', textTransform: 'uppercase' }}>Kritik Stok Uyarı</div>
        </div>
        <div className="glass-card" style={{ padding: 16 }}>
          <div style={{ color: 'var(--c-info)', marginBottom: 8 }}><ArrowDownLeft size={20} /></div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>12</div>
          <div style={{ fontSize: 11, color: 'var(--t-dim)', textTransform: 'uppercase' }}>Bekleyen Mal Kabul</div>
        </div>
        <div className="glass-card" style={{ padding: 16 }}>
          <div style={{ color: 'var(--c-success)', marginBottom: 8 }}><ArrowUpRight size={20} /></div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>8</div>
          <div style={{ fontSize: 11, color: 'var(--t-dim)', textTransform: 'uppercase' }}>Bugünkü Çıkışlar</div>
        </div>
      </div>

      <div style={{ display: 'flex', marginBottom: 20, gap: 16 }}>
         <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--t-dim)' }} />
          <input
            type="text"
            placeholder="Ürün koduna göre envanter ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            style={{
               width: '100%',
               padding: '10px 12px 10px 40px',
               background: 'var(--c-bg-overlay)',
               border: '1px solid var(--c-border)',
               borderRadius: 8,
               color: 'var(--t-primary)',
               fontSize: 13,
               outline: 'none'
            }}
          />
        </div>
        <Button variant="secondary" icon={<Filter size={16} />}>Filtrele</Button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>MALZEME KODU</th>
              <th>PARÇA İSMİ</th>
              <th>MİKTAR</th>
              <th>BİRİM</th>
              <th>KRİTİK EŞİK</th>
              <th>DURUM</th>
              <th style={{ textAlign: 'right' }}>İŞLEMLER</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item, idx) => {
              const isCritical = item.currentStock <= item.minStock;
              const stockStatus = isCritical ? 'Kritik' : 'Yeterli';
              
              return (
                <tr key={item.id} className="anim-fade" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--t-primary)' }}>
                    {item.partNo}
                  </td>
                  <td>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{item.name}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ 
                        fontSize: 16, 
                        fontWeight: 700, 
                        color: isCritical ? 'var(--c-danger)' : 'var(--c-success)' 
                      }}>
                        {item.currentStock?.toLocaleString()}
                      </span>
                      <div style={{ width: 60, height: 4, background: 'var(--c-bg-base)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${Math.min((item.currentStock / (item.minStock * 3)) * 100, 100)}%`, 
                          height: '100%', 
                          background: isCritical ? 'var(--c-danger)' : 'var(--c-success)',
                          boxShadow: `0 0 8px ${isCritical ? 'var(--c-danger)' : 'var(--c-success)'}40`
                        }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--t-dim)' }}>{item.unit}</td>
                  <td style={{ fontSize: 12, fontWeight: 600 }}>{item.minStock}</td>
                  <td>
                    <Badge variant={isCritical ? 'danger' : 'success'}>
                      {isCritical ? 'KRİTİK STOK' : 'MÜSAİT'}
                    </Badge>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                      <button 
                        className="icon-btn-small" 
                        title="Stok İşlemi"
                        onClick={() => handleOpenMove(item)}
                      >
                        <ArrowDownLeft size={14} color="var(--c-success)" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredInventory.length === 0 && (
          <EmptyState title="Envanter Kaydı Yok" desc="Arama kriterlerinize uygun stok kaydı bulunamadı." />
        )}
      </div>
    </div>
  );
}
