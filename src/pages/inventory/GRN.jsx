import { useState } from 'react';
import { useGRN } from '../../hooks/useERP';
import { PackageOpen, Plus, Search, CheckSquare, Clock } from 'lucide-react';
import { Button, Badge, Spinner, EmptyState } from '../../components/ui/index';
import AddGRNModal from '../../components/modals/AddGRNModal';

export default function GRN() {
  const { grnRecords, loading } = useGRN();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredRecords = grnRecords.filter(r => 
    r.documentNo?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.supplierName?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--t-primary)' }}>Mal Kabul (GRN)</h1>
          <p style={{ fontSize: 13, color: 'var(--t-dim)', margin: '4px 0 0' }}>Satın alma irsaliyelerinin ve depo giriş formlarının listesi.</p>
        </div>
        <div className="gap-flex">
          <Button 
            variant="primary" 
            icon={<Plus size={16} />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Yeni Mal Kabul Fişi
          </Button>
        </div>
      </div>

      <AddGRNModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      <div style={{ display: 'flex', marginBottom: 20, gap: 16 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--t-dim)' }} />
          <input
            type="text"
            placeholder="İrsaliye No veya Tedarikçi ara..."
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
              <th>İRSALİYE NO</th>
              <th>TEDARİKÇİ</th>
              <th>KALEM SAYISI</th>
              <th>DURUM</th>
              <th>TARİH</th>
              <th style={{ textAlign: 'right' }}>İŞLEMLER</th>
            </tr>
          </thead>
          <tbody>
             {filteredRecords.map((r, idx) => {
               const isPending = r.status === 'Kalite Bekliyor';
               return (
                <tr key={r.id} className="anim-fade" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--t-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <PackageOpen size={16} style={{ color: 'var(--c-accent)' }} />
                      {r.documentNo}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--t-secondary)', fontSize: 13 }}>{r.supplierName}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{r.totalItems} Kalem</span>
                  </td>
                  <td>
                    <Badge variant={isPending ? 'warning' : 'success'}>
                      {isPending ? <Clock size={12}/> : <CheckSquare size={12}/>}
                      {r.status}
                    </Badge>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--t-muted)' }}>
                    {r.createdAt ? new Date(r.createdAt.seconds * 1000).toLocaleDateString('tr-TR') : '-'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="gap-flex" style={{ justifyContent: 'flex-end' }}>
                      <Button variant="secondary" className="btn-sm">Görüntüle</Button>
                    </div>
                  </td>
                </tr>
               );
             })}
          </tbody>
        </table>
        {filteredRecords.length === 0 && (
          <EmptyState title="GRN Kaydı Yok" desc="Arama kriterlerinize uygun mal kabul fişi bulunamadı." />
        )}
      </div>
    </div>
  );
}
