import { useState } from 'react';
import { Modal, Button, Badge } from '../ui/index';
import { inventoryService } from '../../firebase/firestore';
import { useSuppliers, useInventory } from '../../hooks/useERP';
import toast from 'react-hot-toast';
import { Plus, Trash, PackageOpen, LayoutList } from 'lucide-react';

export default function AddGRNModal({ isOpen, onClose }) {
  const { suppliers } = useSuppliers();
  const { parts } = useInventory();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    supplierId: '',
    documentNo: '', // İrsaliye numarası
    notes: ''
  });

  const [items, setItems] = useState([]);

  const handleAddItem = () => {
    setItems([...items, { partId: '', qty: 1 }]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.supplierId || !formData.documentNo) return toast.error('Tedarikçi ve İrsaliye No zorunludur.');
    if (items.length === 0) return toast.error('En az bir malzeme eklemelisiniz.');
    if (items.some(i => !i.partId || i.qty <= 0)) return toast.error('Malzeme seçimi ve miktarlar hatalı.');

    const supplier = suppliers.find(s => s.id === formData.supplierId);
    
    // Zenginleştirilmiş ürün listesi (partNo ve partName eklenerek)
    const enrichedItems = items.map(item => {
      const part = parts.find(p => p.id === item.partId);
      return {
        ...item,
        partNo: part.partNo,
        partName: part.name
      };
    });

    const grnData = {
      ...formData,
      supplierName: supplier.name,
      totalItems: items.length
    };

    setLoading(true);
    try {
      await inventoryService.addGRN(grnData, enrichedItems);
      toast.success('Mal Kabul (GRN) başarılı! Malzemeler Kalite bekleme sırasına alındı.');
      onClose();
      // Reset
      setFormData({ supplierId: '', documentNo: '', notes: '' });
      setItems([]);
    } catch (err) {
      toast.error('Hata: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Yeni Mal Kabul Fişi (GRN)" size="lg">
      <div style={{ marginBottom: 20, padding: 12, background: 'var(--c-bg-base)', borderRadius: 8, borderLeft: '4px solid var(--c-warning)' }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}><PackageOpen size={14} style={{ display: 'inline', marginRight: 4 }}/> ÖNEMLİ BİLGİLENDİRME</p>
        <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--t-dim)' }}>
          Kabul edilen malzemeler doğrudan "Giriş Kalite Kontrol (Incoming QC)" birimine aktarılacak olup, denetçiler tarafından onaylanmadığı sürece envanter (stok) miktarlarına yansımayacaktır.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Tedarikçi Seçimi</label>
            <select 
              className="form-input" 
              value={formData.supplierId}
              onChange={e => setFormData({...formData, supplierId: e.target.value})}
              required
            >
              <option value="">-- Tedarikçi Seçiniz --</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">İrsaliye / Fatura No</label>
            <input 
              className="form-input" 
              placeholder="Örn: IRS-2026-0001" 
              value={formData.documentNo}
              onChange={e => setFormData({...formData, documentNo: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label className="form-label" style={{ margin: 0 }}><LayoutList size={14} /> Gelen Malzemeler</label>
            <Button type="button" variant="secondary" icon={<Plus size={14} />} onClick={handleAddItem} className="btn-sm">
              Kalem Ekle
            </Button>
          </div>
          
          <div style={{ background: 'var(--c-bg-base)', padding: 12, borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.length === 0 && <span style={{ fontSize: 12, color: 'var(--t-muted)' }}>Henüz malzeme eklenmedi. Miktar ve malzemeleri girmek için "Kalem Ekle"ye basın.</span>}
            
            {items.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <select 
                  className="form-input" 
                  style={{ flex: 2 }}
                  value={item.partId}
                  onChange={e => {
                    const newItems = [...items];
                    newItems[index].partId = e.target.value;
                    setItems(newItems);
                  }}
                  required
                >
                  <option value="">-- Parça --</option>
                  {parts.map(p => <option key={p.id} value={p.id}>{p.partNo} - {p.name}</option>)}
                </select>

                <input 
                  type="number" 
                  className="form-input" 
                  style={{ flex: 1 }}
                  placeholder="Miktar"
                  min="1"
                  value={item.qty}
                  onChange={e => {
                    const newItems = [...items];
                    newItems[index].qty = Number(e.target.value);
                    setItems(newItems);
                  }}
                  required
                />
                
                <button 
                  type="button" 
                  onClick={() => handleRemoveItem(index)}
                  style={{ width: 32, height: 32, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-danger)', background: 'transparent', border: '1px solid var(--c-danger-dim)', cursor: 'pointer' }}
                >
                  <Trash size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Ek Notlar / Hasar Bilgisi</label>
          <textarea 
            className="form-input" 
            placeholder="Paketlerde dış hasar var mı?..."
            rows={2}
            value={formData.notes}
            onChange={e => setFormData({...formData, notes: e.target.value})}
            style={{ resize: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
          <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
          <Button type="submit" variant="primary" loading={loading}>Mal Kabul İşlemini Tamamla</Button>
        </div>
      </form>
    </Modal>
  );
}
