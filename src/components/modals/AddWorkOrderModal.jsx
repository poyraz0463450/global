import { useState, useMemo } from 'react';
import { Modal, Button, Badge } from '../ui/index';
import { useInventory, useOrders, useWorkCenters } from '../../hooks/useERP';
import { productionService } from '../../firebase/firestore';
import toast from 'react-hot-toast';
import { Package, Calendar, Settings, AlertTriangle, CheckCircle, Factory, ShieldAlert } from 'lucide-react';

export default function AddWorkOrderModal({ isOpen, onClose }) {
  const { parts } = useInventory();
  const { orders } = useOrders();
  const { workCenters } = useWorkCenters();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    relatedOrderId: '', // Opsiyonel (Siparişe bağlı üretim)
    partId: '',
    targetQty: 1,
    workCenterId: '',
    dueDate: '',
  });

  // Hızlı MRP Analizi (Seçilen parçadan yeterli var mı?)
  const mrpAnalysis = useMemo(() => {
    if (!formData.partId || !formData.targetQty) return null;
    const part = parts.find(p => p.id === formData.partId);
    if (!part) return null;

    // TODO: İleride alt bileşen (BOM) analizi eklenecek. 
    // Şu an için parça stoğunu kontrol ediyoruz.
    const isMaterialAvailable = part.currentStock >= formData.targetQty;
    
    return {
      part,
      isMaterialAvailable,
      shortage: isMaterialAvailable ? 0 : formData.targetQty - part.currentStock
    };
  }, [formData.partId, formData.targetQty, parts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.partId || !formData.workCenterId) {
      return toast.error('Üretilecek parça ve iş merkezi seçimi zorunludur.');
    }

    setLoading(true);
    try {
      const selectedPart = parts.find(p => p.id === formData.partId);
      const selectedCenter = workCenters.find(c => c.id === formData.workCenterId);

      await productionService.createWorkOrder({
        ...formData,
        partNo: selectedPart?.partNo,
        partName: selectedPart?.name,
        workCenterName: selectedCenter?.name,
        materialAvailable: mrpAnalysis?.isMaterialAvailable || false
      });
      
      toast.success(
        mrpAnalysis?.isMaterialAvailable 
          ? 'İş Emri üretime aktarıldı.' 
          : 'Stok yetersiz. İş Emri BEKLEMEDE (Kilitli) olarak kaydedildi.'
      );
      
      onClose();
      setFormData({ relatedOrderId: '', partId: '', targetQty: 1, workCenterId: '', dueDate: '' });
    } catch (err) {
      toast.error('Hata: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Yeni İş Emri & Görev (Work Order)"
      size="md"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        {/* Bağlantılı Sipariş */}
        <div className="form-group">
           <label className="form-label">Sipariş Referansı (Opsiyonel)</label>
           <select 
             className="form-input"
             value={formData.relatedOrderId}
             onChange={e => setFormData({...formData, relatedOrderId: e.target.value})}
           >
             <option value="">-- Bağımsız Üretim (Stok için) --</option>
             {orders.filter(o => o.status === 'APPROVED').map(o => (
               <option key={o.id} value={o.id}>
                 ORD-{o.id.slice(0,6).toUpperCase()} - {o.customerName}
               </option>
             ))}
           </select>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label"><Package size={12} /> Üretilecek Parça / Mamül</label>
            <select 
              className="form-input"
              value={formData.partId}
              onChange={e => setFormData({...formData, partId: e.target.value})}
            >
              <option value="">Seçiniz...</option>
              {parts.filter(p => p.type === 'İMALAT' || p.type === 'SATIN_ALINAN').map(p => (
                <option key={p.id} value={p.id}>{p.partNo} - {p.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Hedef Miktar</label>
            <input 
              type="number" 
              className="form-input"
              value={formData.targetQty}
              onChange={e => setFormData({...formData, targetQty: Number(e.target.value)})}
            />
          </div>
        </div>

        <div className="grid-2">
           <div className="form-group">
            <label className="form-label"><Factory size={12} /> Hedef İş Merkezi</label>
            <select 
              className="form-input"
              value={formData.workCenterId}
              onChange={e => setFormData({...formData, workCenterId: e.target.value})}
            >
              <option value="">İş İstasyonu Seçin...</option>
              {workCenters.map(c => (
                <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label"><Calendar size={12} /> Hedef Tamamlanma</label>
            <input 
              type="date" 
              className="form-input"
              value={formData.dueDate}
              onChange={e => setFormData({...formData, dueDate: e.target.value})}
            />
          </div>
        </div>

        {/* MRP Analysis Board */}
        {mrpAnalysis && (
          <div style={{
            background: mrpAnalysis.isMaterialAvailable ? 'var(--c-success-dim)' : 'var(--c-danger-dim)',
            border: `1px solid ${mrpAnalysis.isMaterialAvailable ? 'var(--c-success)' : 'var(--c-danger)'}`,
            padding: 16, borderRadius: 8
          }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, color: mrpAnalysis.isMaterialAvailable ? 'var(--c-success)' : 'var(--c-danger)' }}>
              {mrpAnalysis.isMaterialAvailable ? <CheckCircle size={16} /> : <ShieldAlert size={16} />}
              MRP Stok Analizi
            </h4>
            
            {mrpAnalysis.isMaterialAvailable ? (
               <p style={{ margin: 0, fontSize: 12, color: 'var(--c-success)' }}>
                 Malzemeler üretime hazır. Stokta <b>{mrpAnalysis.part.currentStock}</b> adet bulunuyor.
               </p>
            ) : (
               <div>
                  <p style={{ margin: '0 0 8px', fontSize: 12, color: 'var(--c-danger)', fontWeight: 600 }}>
                    Kritik Stok Uyarısı! Üretime başlanamaz.
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--t-danger)' }}>
                    Gereken: {formData.targetQty} &mdash; Mevcut: {mrpAnalysis.part.currentStock} <br/>
                    <b>Açık Miktar: {mrpAnalysis.shortage}</b> (Satın alma talebine düşecek)
                  </p>
               </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
          <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
          <Button 
            type="submit" 
            variant="primary" 
            loading={loading}
            style={!mrpAnalysis?.isMaterialAvailable ? { background: 'var(--c-warning)', color: '#000' } : {}}
          >
            {mrpAnalysis?.isMaterialAvailable ? 'İş Emri Oluştur' : 'Eksikle Oluştur (Kilitli)'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
