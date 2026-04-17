import { useState } from 'react';
import { Modal, Button } from '../ui/index';
import { purchasingService } from '../../firebase/firestore';
import toast from 'react-hot-toast';

export default function AddSupplierModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: 'HAMMADDE',
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return toast.error('İsim ve Kod zorunludur.');
    
    setLoading(true);
    try {
      await purchasingService.addSupplier(formData);
      toast.success('Tedarikçi başarıyla oluşturuldu.');
      setFormData({ name: '', code: '', category: 'HAMMADDE', contactName: '', contactEmail: '', contactPhone: '' });
      onClose();
    } catch (err) {
      toast.error('Hata: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Yeni Tedarikçi / Taşeron Ekle" size="md">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Tedarikçi Adı / Ünvan</label>
            <input 
              className="form-input" 
              placeholder="Örn: Aselsan A.Ş." 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label">Kurum Kodu</label>
            <input 
              className="form-input" 
              placeholder="Örn: VND-001" 
              value={formData.code}
              onChange={e => setFormData({...formData, code: e.target.value})}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Tedarik Kategorisi</label>
          <select 
            className="form-input"
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value})}
          >
            <option value="HAMMADDE">Hammadde (Metal, Kompozit, COTS)</option>
            <option value="YARI_MAMUL">Yarı Mamul / İşlenmiş Parça</option>
            <option value="HIZMET">Hizmet / Kaplama / Test Taşıronu</option>
            <option value="YURTDISI">Yurt Dışı İthalat</option>
          </select>
        </div>

        <div className="grid-2">
           <div className="form-group">
              <label className="form-label">Kontak Kişi</label>
              <input 
                className="form-input" 
                placeholder="İsim Soyisim"
                value={formData.contactName}
                onChange={e => setFormData({...formData, contactName: e.target.value})}
              />
           </div>
           <div className="form-group">
              <label className="form-label">Telefon</label>
              <input 
                className="form-input" 
                placeholder="+90 ..."
                value={formData.contactPhone}
                onChange={e => setFormData({...formData, contactPhone: e.target.value})}
              />
           </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
          <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
          <Button type="submit" variant="primary" loading={loading}>Kaydet</Button>
        </div>
      </form>
    </Modal>
  );
}
