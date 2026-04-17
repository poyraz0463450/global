import { useState } from 'react';
import { Modal, Button } from '../ui/index';
import { productionService } from '../../firebase/firestore';
import toast from 'react-hot-toast';
import { Factory, Activity, Type, DollarSign, Settings } from 'lucide-react';

export default function AddWorkCenterModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'MACHINE', // MACHINE, ASSEMBLY, QC, PACKAGING
    capacityPerHour: 0,
    costPerHour: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      return toast.error('İş merkezi kodu ve adı zorunludur.');
    }

    setLoading(true);
    try {
      await productionService.addWorkCenter(formData);
      toast.success('İş Merkezi başarıyla tanımlandı.');
      onClose();
      setFormData({
        code: '', name: '', type: 'MACHINE',
        capacityPerHour: 0, costPerHour: 0
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
      title="Yeni İş Merkezi / Makine Tanımla"
      size="sm"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label"><Settings size={12} /> Merkez Kodu</label>
            <input 
              className="form-input" 
              placeholder="Örn: CNC-01"
              value={formData.code}
              onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
            />
          </div>
          <div className="form-group">
            <label className="form-label"><Factory size={12} /> Merkez Adı</label>
            <input 
              className="form-input" 
              placeholder="Örn: 5 Eksen Dik İşlem"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label"><Type size={12} /> Operasyon Tipi</label>
          <select 
            className="form-input"
            value={formData.type}
            onChange={e => setFormData({...formData, type: e.target.value})}
          >
            <option value="MACHINE">Makine / İşleme (Talaşlı İmalat)</option>
            <option value="ASSEMBLY">Montaj Hattı</option>
            <option value="QC">Kalite Kontrol / Test</option>
            <option value="PACKAGING">Paketleme & Boya</option>
          </select>
        </div>

        <div className="grid-2" style={{ background: 'var(--c-bg-base)', padding: 16, borderRadius: 8 }}>
          <div className="form-group">
            <label className="form-label"><Activity size={12} /> Saatlik Kapasite</label>
            <input 
              type="number"
              className="form-input" 
              placeholder="Birim/Saat"
              value={formData.capacityPerHour}
              onChange={e => setFormData({...formData, capacityPerHour: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label"><DollarSign size={12} /> Beklenen Maliyet (₺/Saat)</label>
            <input 
              type="number"
              className="form-input" 
              value={formData.costPerHour}
              onChange={e => setFormData({...formData, costPerHour: e.target.value})}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
          <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
          <Button type="submit" variant="primary" loading={loading} disabled={loading}>
            Tanımla
          </Button>
        </div>
      </form>
    </Modal>
  );
}
