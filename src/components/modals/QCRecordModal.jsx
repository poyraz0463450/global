import { useState } from 'react';
import { Modal, Button, Badge } from '../ui/index';
// Firestore servisinde qcService kullanılacak şekilde planlandı. 
// Burada dummy update veya log simülasyonu yapacağız veya ilgili API'yi çağıracağız.
import { productionService } from '../../firebase/firestore';
import toast from 'react-hot-toast';
import { ShieldCheck, Crosshair, ClipboardList, PenTool, XCircle } from 'lucide-react';

export default function QCRecordModal({ isOpen, onClose, referenceItem, type = 'PROCESS' }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    inspectorName: '',
    certificateNo: '',
    measuredValue: '',
    notes: '',
    decision: 'KABUL', // KABUL, SARTLI_KABUL, RET
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.inspectorName || !formData.decision) {
      return toast.error('Denetçi Adı ve Karar zorunludur.');
    }

    setLoading(true);
    try {
      // İş Emri bazında Final QC onayı
      if (type === 'PROCESS' && referenceItem?.id) {
        let finalStatus = 'COMPLETED'; // On default keep it completed
        
        if (formData.decision === 'KABUL') {
          // Normalde burada stoka pozitif bakiye eklenir
          finalStatus = 'QC_PASSED'; 
        } else if (formData.decision === 'RET') {
           // Hurdaya ayırma mantığı
          finalStatus = 'QC_FAILED';
        }

        await productionService.updateWorkOrderStatus(
          referenceItem.id, 
          finalStatus,
          `QC Kararı: ${formData.decision} (Denetçi: ${formData.inspectorName})`
        );
        toast.success(`Kalite raporu kaydedildi: ${formData.decision}`);
      } else {
        // Incoming QC için farklı işlem (stok artırımı vb.) yapılabilir.
        toast.success('Kalite (Incoming) raporu kaydedildi.');
      }
      
      onClose();
    } catch (err) {
      toast.error('Hata: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!referenceItem) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Kalite Kontrol Raporu (QC)"
      size="md"
    >
      <div style={{ marginBottom: 20, padding: 12, background: 'var(--c-bg-base)', borderRadius: 8, borderLeft: '4px solid var(--c-accent)' }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{referenceItem.partNo} — {referenceItem.partName || referenceItem.name}</p>
        <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--t-dim)' }}>
          Referans: {referenceItem.id.slice(0,8).toUpperCase()} | Üretilen/Gelen Miktar: <span style={{ color: 'var(--t-primary)', fontWeight: 700 }}>{referenceItem.targetQty || referenceItem.qty || 0} ADET</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        
        {/* Karar Devresi */}
        <div style={{ 
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, 
          padding: 8, background: 'var(--c-bg-base)', borderRadius: 8 
        }}>
          <button
            type="button"
            onClick={() => setFormData({...formData, decision: 'KABUL'})}
            style={{
              padding: 10, borderRadius: 6, border: '1px solid', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              background: formData.decision === 'KABUL' ? 'var(--c-success-dim)' : 'transparent',
              borderColor: formData.decision === 'KABUL' ? 'var(--c-success)' : 'var(--c-border)',
              color: formData.decision === 'KABUL' ? 'var(--c-success)' : 'var(--t-dim)',
              fontSize: 12, fontWeight: 700, transition: '0.2s'
            }}
          >
            <ShieldCheck size={14} /> KABUL
          </button>
          
          <button
            type="button"
            onClick={() => setFormData({...formData, decision: 'SARTLI_KABUL'})}
            style={{
               padding: 10, borderRadius: 6, border: '1px solid', cursor: 'pointer',
               display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
               background: formData.decision === 'SARTLI_KABUL' ? 'var(--c-warning-dim)' : 'transparent',
               borderColor: formData.decision === 'SARTLI_KABUL' ? 'var(--c-warning)' : 'var(--c-border)',
               color: formData.decision === 'SARTLI_KABUL' ? 'var(--c-warning)' : 'var(--t-dim)',
               fontSize: 12, fontWeight: 700, transition: '0.2s'
            }}
          >
            <Crosshair size={14} /> ŞARTLI KABUL
          </button>

          <button
            type="button"
            onClick={() => setFormData({...formData, decision: 'RET'})}
            style={{
               padding: 10, borderRadius: 6, border: '1px solid', cursor: 'pointer',
               display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
               background: formData.decision === 'RET' ? 'var(--c-danger-dim)' : 'transparent',
               borderColor: formData.decision === 'RET' ? 'var(--c-danger)' : 'var(--c-border)',
               color: formData.decision === 'RET' ? 'var(--c-danger)' : 'var(--t-dim)',
               fontSize: 12, fontWeight: 700, transition: '0.2s'
            }}
          >
            <XCircle size={14} /> RET (HURDA)
          </button>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label"><PenTool size={12} /> Denetçi Adı</label>
            <input 
              className="form-input" 
              placeholder="Örn: Uğur Can"
              value={formData.inspectorName}
              onChange={e => setFormData({...formData, inspectorName: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label"><ClipboardList size={12} /> Sertifika / Test No</label>
            <input 
              className="form-input" 
              placeholder="EN 10204 3.1"
              value={formData.certificateNo}
              onChange={e => setFormData({...formData, certificateNo: e.target.value})}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Ölçüm Özeti (Opsiyonel)</label>
          <input 
            className="form-input" 
            placeholder="Kritik tolerans değerleri..."
            value={formData.measuredValue}
            onChange={e => setFormData({...formData, measuredValue: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Muayene Notları / Hata Tanımı</label>
          <textarea 
            className="form-input" 
            placeholder="Görsel veya ölçümsel bulgular..."
            rows={3}
            value={formData.notes}
            onChange={e => setFormData({...formData, notes: e.target.value})}
            style={{ resize: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
          <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
          <Button 
            type="submit" 
            variant="primary" 
            loading={loading}
          >
            Raporu Onayla ve İşle
          </Button>
        </div>
      </form>
    </Modal>
  );
}
