import { useState } from 'react';
import { useSuppliers } from '../../hooks/useERP';
import { Building2, Plus, Search, Mail, Phone, ExternalLink, Network } from 'lucide-react';
import { Button, Badge, Spinner, EmptyState } from '../../components/ui/index';
import AddSupplierModal from '../../components/modals/AddSupplierModal';

export default function Suppliers() {
  const { suppliers, loading } = useSuppliers();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredSuppliers = suppliers.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const typeStyles = {
    'HAMMADDE':   { color: 'var(--c-info)',   label: 'HAMMADDE' },
    'YARI_MAMUL': { color: 'var(--c-accent)', label: 'YARI MAMUL' },
    'HIZMET':     { color: 'var(--c-warning)', label: 'TAŞERON HİZMETİ' },
    'YURTDISI':   { color: 'var(--c-purple)', label: 'İTHALAT' }
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
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--t-primary)' }}>Tedarikçiler Tablosu (Approved Supplier List)</h1>
          <p style={{ fontSize: 13, color: 'var(--t-dim)', margin: '4px 0 0' }}>Savunma Sanayii onaylı tedarikçi ve taşeron ağı.</p>
        </div>
        <div className="gap-flex">
          <Button 
            variant="primary" 
            icon={<Plus size={16} />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Yeni Tedarikçi Ekle
          </Button>
        </div>
      </div>

      <AddSupplierModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      <div style={{ display: 'flex', marginBottom: 20, gap: 16 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--t-dim)' }} />
          <input
            type="text"
            placeholder="Tedarikçi ismi veya kodu ile ara..."
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
              <th>KURUM KODU</th>
              <th>TEDARİKÇİ ÜNVANI</th>
              <th>TEDARİK KATEGORİSİ</th>
              <th>İLETİŞİM BİLGİSİ</th>
              <th>DURUM</th>
              <th style={{ textAlign: 'right' }}>İŞLEMLER</th>
            </tr>
          </thead>
          <tbody>
             {filteredSuppliers.map((c, idx) => {
               const style = typeStyles[c.category] || typeStyles['HAMMADDE'];
               return (
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
                        color: style.color
                      }}>
                        <Network size={16} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, color: 'var(--t-primary)', fontSize: 13 }}>{c.name}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: style.color }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: style.color }}>{style.label}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: 12, fontWeight: 500 }}>{c.contactName || 'Belirtilmedi'}</span>
                      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                         {c.contactEmail && <Mail size={12} className="icon-link" />}
                         {c.contactPhone && <Phone size={12} className="icon-link" />}
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge variant={c.isActive ? 'success' : 'danger'}>
                      {c.isActive ? 'ONAYLI (ASL)' : 'PASİF'}
                    </Badge>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="gap-flex" style={{ justifyContent: 'flex-end' }}>
                      <button className="icon-btn-small" title="Tedarikçi Detayı"><ExternalLink size={14} /></button>
                    </div>
                  </td>
                </tr>
               );
             })}
          </tbody>
        </table>
        {filteredSuppliers.length === 0 && (
          <EmptyState title="Kayıtlı Tedarikçi Yok" desc="Arama kriterlerinize uygun tedarikçi bulunamadı." />
        )}
      </div>
    </div>
  );
}
