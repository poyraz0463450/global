import { useState } from 'react';
import { useInventory } from '../../hooks/useERP';
import { 
  Plus, Search, Filter, Download, MoreVertical, 
  Settings, Layers, DollarSign, Package, Tag 
} from 'lucide-react';
import { Button, Badge, Spinner, EmptyState } from '../../components/ui/index';
import AddPartModal from '../../components/modals/AddPartModal';

export default function Parts() {
  const { parts, loading } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filtreleme mantığı
  const filteredParts = parts.filter(p => {
    const matchesSearch = p.partNo?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'ALL' || p.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const categoryColors = {
    'MEKANİK':   'var(--c-info)',
    'ELEKTRONİK': 'var(--c-purple)',
    'OPTİK':      'var(--c-accent)',
    'HAMMADDE':   'var(--c-border-bright)',
    'YAPI':       'var(--c-warning)',
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
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--t-primary)' }}>Malzeme & BOM Listesi</h1>
          <p style={{ fontSize: 13, color: 'var(--t-dim)', margin: '4px 0 0' }}>Tüm parça tanımları, kategoriler ve birim maliyet değerleri.</p>
        </div>
        <div className="gap-flex">
          <Button variant="secondary" icon={<Download size={16} />}>Dışa Aktar</Button>
          <Button 
            variant="primary" 
            icon={<Plus size={16} />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Yeni Parça Tanımla
          </Button>
        </div>
      </div>

      <AddPartModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      {/* Tabs & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 16 }}>
        <div className="glass-capsule" style={{ display: 'flex', gap: 4, padding: 4 }}>
          {['ALL', 'HAMMADDE', 'SATIN_ALINAN', 'İMALAT'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              style={{
                padding: '6px 16px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                background: activeTab === tab ? 'var(--c-accent)' : 'transparent',
                color: activeTab === tab ? '#000' : 'var(--t-dim)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              {tab === 'ALL' ? 'TÜMÜ' : tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--t-dim)' }} />
          <input
            type="text"
            placeholder="Parça no veya isim ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 40px',
              background: 'var(--c-bg-overlay)',
              border: '1px solid var(--c-border)',
              borderRadius: 8,
              color: 'var(--t-primary)',
              fontSize: 13,
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--c-accent-dim)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--c-border)'}
          />
        </div>
      </div>

      {/* Grid View (Professional Table) */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>#</th>
              <th>PARÇA NO</th>
              <th>TANIM</th>
              <th>KATEGORİ</th>
              <th>TİP</th>
              <th>BİRİM</th>
              <th>MALİYET</th>
              <th style={{ textAlign: 'right' }}>İŞLEM</th>
            </tr>
          </thead>
          <tbody>
            {filteredParts.map((p, idx) => (
              <tr key={p.id} className="anim-fade" style={{ animationDelay: `${idx * 0.05}s` }}>
                <td style={{ color: 'var(--t-muted)', fontSize: 11 }}>{idx + 1}</td>
                <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--c-accent)' }}>
                  {p.partNo}
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600, color: 'var(--t-primary)' }}>{p.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--t-dim)' }}>ID: {p.id.slice(0, 8)}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: categoryColors[p.category] || 'var(--c-border)' }} />
                    <span style={{ fontSize: 12, fontWeight: 500 }}>{p.category}</span>
                  </div>
                </td>
                <td>
                   <Badge 
                    variant={p.type === 'İMALAT' ? 'success' : p.type === 'HAMMADDE' ? 'warning' : 'info'}
                  >
                    {p.type}
                  </Badge>
                </td>
                <td style={{ fontSize: 12, color: 'var(--t-secondary)' }}>{p.unit}</td>
                <td style={{ fontWeight: 600, color: 'var(--t-primary)' }}>
                  ₺{p.unitCost?.toLocaleString()}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="icon-btn">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredParts.length === 0 && (
          <EmptyState 
            title="Parça Bulunamadı" 
            desc="Arama kriterlerinize uygun parça bulunmuyor veya sisteme henüz parça tanımlanmadı." 
          />
        )}
      </div>

      {/* Bottom Summary */}
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 24, fontSize: 11, color: 'var(--t-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Package size={12} />
          <span>Toplam: {filteredParts.length} Kalem</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Layers size={12} />
          <span>Kategorize: {new Set(filteredParts.map(p => p.category)).size} Grup</span>
        </div>
      </div>
    </div>
  );
}
