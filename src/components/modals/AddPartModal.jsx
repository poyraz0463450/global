import { useState } from 'react';
import { Modal, Button } from '../ui/index';
import { inventoryService } from '../../firebase/firestore';
import toast from 'react-hot-toast';
import { Package, Hash, Tag, Layers, Ruler, DollarSign, AlertTriangle } from 'lucide-react';

export default function AddPartModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    partNo: '',
    name: '',
    category: 'MEKANİK',
    type: 'SATIN_ALINAN',
    unit: 'ADET',
    unitCost: 0,
    minStock: 0,
    currentStock: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.partNo || !formData.name) {
      return toast.error('Parça no ve isim zorunludur.');
    }

    setLoading(true);
    try {
      await inventoryService.addPart(formData);
      toast.success('Parça başarıyla tanımlandı.');
      onClose();
      setFormData({
        partNo: '', name: '', category: 'MEKANİK',
        type: 'SATIN_ALINAN', unit: 'ADET', unitCost: 0,
        minStock: 0, currentStock: 0
      });
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
      title="Yeni Parça Tanımla"
      size="md"
    >
      <form onSubmit={handleSubmit} className="gap-flex" style={{ flexDirection: 'column', gap: 20 }}>
        
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label"><Hash size={12} /> Parça Numarası</label>
            <input 
              className="form-input" 
              placeholder="Örn: PRÇ-00XX"
              value={formData.partNo}
              onChange={e => setFormData({...formData, partNo: e.target.value.toUpperCase()})}
            />
          </div>
          <div className="form-group">
            <label className="form-label"><Tag size={12} /> Parça İsmi</label>
            <input 
              className="form-input" 
              placeholder="Teknik Tanım"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
        </div>

        <div className="grid-3">
          <div className="form-group">
            <label className="form-label"><Layers size={12} /> Kategori</label>
            <select 
              className="form-input"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option>MEKANİK</option>
              <option>ELEKTRONİK</option>
              <option>OPTİK</option>
              <option>HAMMADDE</option>
              <option>YAPI</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label"><Package size={12} /> Tipi</label>
            <select 
              className="form-input"
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value})}
            >
              <option value="HAMMADDE">Hammadde</option>
              <option value="SATIN_ALINAN">Satın Alınan</option>
              <option value="İMALAT">İmalat</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label"><Ruler size={12} /> Birim</label>
            <select 
              className="form-input"
              value={formData.unit}
              onChange={e => setFormData({...formData, unit: e.target.value})}
            >
              <option>ADET</option>
              <option>KG</option>
              <option>METRE</option>
              <option>SET</option>
              <option>LİTRE</option>
            </select>
          </div>
        </div>

        <div className="grid-3" style={{ background: 'var(--c-bg-base)', padding: 16, borderRadius: 8 }}>
          <div className="form-group">
            <label className="form-label"><DollarSign size={12} /> Birim Maliyet</label>
            <input 
              type="number" 
              className="form-input"
              value={formData.unitCost}
              onChange={e => setFormData({...formData, unitCost: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label"><AlertTriangle size={12} /> Min. Stok</label>
            <input 
              type="number" 
              className="form-input"
              value={formData.minStock}
              onChange={e => setFormData({...formData, minStock: e.target.value})}
            />
          </div>
          <div className="form-group">
             <label className="form-label"><Package size={12} /> Açılış Stoğu</label>
             <input 
              type="number" 
              className="form-input"
              value={formData.currentStock}
              onChange={e => setFormData({...formData, currentStock: e.target.value})}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
          <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
          <Button type="submit" variant="primary" loading={loading} disabled={loading}>
            Parçayı Kaydet
          </Button>
        </div>
      </form>
    </Modal>
  );
}
