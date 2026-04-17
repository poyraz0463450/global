import { useState } from 'react';
import { 
  ShieldAlert, Search, ShieldCheck, 
  Truck, ArrowDownToLine, Factory
} from 'lucide-react';
import { Button, Badge, Spinner, EmptyState } from '../../components/ui/index';
import QCRecordModal from '../../components/modals/QCRecordModal';
import { useQC } from '../../hooks/useERP';

export default function IncomingQC() {
  const { incomingQC, loading } = useQC();
  const [searchTerm, setSearchTerm] = useState('');
  const [isQCModalOpen, setIsQCModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Sadece henüz tamamlanmamış ("Bekliyor") olan kayıtları gösteriyoruz
  const pendingIncoming = incomingQC.filter(r => r.status === 'Bekliyor');

  const handleOpenQC = (item) => {
    setSelectedItem(item);
    setIsQCModalOpen(true);
  };

  const filteredItems = pendingIncoming.filter(i => 
    i.partNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.supplierName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.grnNo?.toLowerCase().includes(searchTerm.toLowerCase())
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
            Giriş Kalite Kontrol (Incoming QC)
          </h1>
          <p style={{ fontSize: 13, color: 'var(--t-dim)', margin: '4px 0 0' }}>
            Tedarikçilerden gelen (hammadde & COTS) malzemelerin kabul denetimi.
          </p>
        </div>
      </div>

      <QCRecordModal 
        isOpen={isQCModalOpen}
        onClose={() => setIsQCModalOpen(false)}
        referenceItem={selectedItem}
        type="INCOMING"
      />

      <div style={{ display: 'flex', marginBottom: 20, gap: 16 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--t-dim)' }} />
          <input
            type="text"
            placeholder="Tedarikçi adı veya parça kodu ile ara..."
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
              <th>MAL KABUL (REF)</th>
              <th>TEDARİKÇİ</th>
              <th>GELEN PARÇA / HAMMADDE</th>
              <th>MİKTAR</th>
              <th>DURUM</th>
              <th style={{ textAlign: 'right' }}>KARAR & AKSİYON</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item, idx) => (
              <tr key={item.id} className="anim-fade" style={{ animationDelay: `${idx * 0.05}s` }}>
                <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--t-primary)' }}>
                  {item.grnNo || item.id.slice(0, 8)}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                     <Factory size={14} color="var(--t-dim)" />
                     <span style={{ fontWeight: 600, color: 'var(--t-primary)' }}>{item.supplierName}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600, color: 'var(--t-primary)' }}>{item.partNo}</span>
                    <span style={{ fontSize: 11, color: 'var(--t-muted)' }}>{item.partName}</span>
                  </div>
                </td>
                <td style={{ fontWeight: 700, fontSize: 14 }}>
                  <ArrowDownToLine size={14} style={{ display: 'inline', marginRight: 4, color: 'var(--c-success)' }}/>
                  {item.qty} ADET
                </td>
                <td>
                   <Badge variant="warning">QC BEKLİYOR</Badge>
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
             title="Giriş Yapan Malzeme Yok" 
             desc="Kapıda bekleyen veya kalite kontrole düşen satın alma irsaliyesi bulunmuyor." 
           />
        )}
      </div>

    </div>
  );
}
