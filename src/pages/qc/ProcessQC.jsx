import { useState } from 'react';
import { useQC } from '../../hooks/useERP';
import { 
  ShieldCheck, Search, CheckCircle, Crosshair, XCircle, 
  Settings, ClipboardList, Package
} from 'lucide-react';
import { Button, Badge, Spinner, EmptyState } from '../../components/ui/index';
import QCRecordModal from '../../components/modals/QCRecordModal';

export default function ProcessQC() {
  const { pendingProcessQC, loading } = useQC();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isQCModalOpen, setIsQCModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleOpenQC = (item) => {
    setSelectedItem(item);
    setIsQCModalOpen(true);
  };

  const filteredItems = pendingProcessQC.filter(i => 
    i.partNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.id.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--c-accent)' }}>
            Proses Kalite Kontrol (In-Process QC)
          </h1>
          <p style={{ fontSize: 13, color: 'var(--t-dim)', margin: '4px 0 0' }}>
            Üretimden çıkan parçaların nihai teknik denetleme ve sevk/stok onayı.
          </p>
        </div>
      </div>

      <QCRecordModal 
        isOpen={isQCModalOpen}
        onClose={() => setIsQCModalOpen(false)}
        referenceItem={selectedItem}
        type="PROCESS"
      />

      <div style={{ display: 'flex', marginBottom: 20, gap: 16 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--t-dim)' }} />
          <input
            type="text"
            placeholder="İş Emri veya parça kodu ile ara..."
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
              <th>İŞ EMRİ (REF)</th>
              <th>ÜRETİLEN PARÇA</th>
              <th>ÜRETİM HATTI</th>
              <th>MİKTAR</th>
              <th>QC DURUMU</th>
              <th style={{ textAlign: 'right' }}>KARAR & AKSİYON</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item, idx) => (
              <tr key={item.id} className="anim-fade" style={{ animationDelay: `${idx * 0.05}s` }}>
                <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--c-info)' }}>
                  WO-{item.id.slice(0,6).toUpperCase()}
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600, color: 'var(--t-primary)' }}>{item.partNo}</span>
                    <span style={{ fontSize: 11, color: 'var(--t-muted)' }}>{item.partName}</span>
                  </div>
                </td>
                <td>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                     <Settings size={14} color="var(--t-dim)" />
                     <span style={{ fontSize: 12, fontWeight: 500 }}>{item.workCenterName}</span>
                   </div>
                </td>
                <td style={{ fontWeight: 700, fontSize: 14 }}>
                  <Package size={14} style={{ display: 'inline', marginRight: 4, color: 'var(--t-dim)' }}/>
                  {item.targetQty} ADET
                </td>
                <td>
                   <Badge variant="warning">ONAY BEKLİYOR</Badge>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div className="gap-flex" style={{ justifyContent: 'flex-end' }}>
                     <Button 
                       size="sm" 
                       variant="primary" 
                       icon={<ShieldCheck size={14} />}
                       onClick={() => handleOpenQC(item)}
                     >
                       Denetle & Karar Ver
                     </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredItems.length === 0 && (
           <EmptyState 
             title="QC Onayı Bekleyen İş Yok" 
             desc="Üretimden kalite kontrole düşen yeni bir parça bulunmuyor." 
           />
        )}
      </div>

    </div>
  );
}
