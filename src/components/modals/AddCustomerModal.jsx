import { useState } from 'react';
import { Modal, Button } from '../ui/index';
import { salesService } from '../../firebase/firestore';
import toast from 'react-hot-toast';
import { Building2, User, Mail, Phone, MapPin, CreditCard, Shield } from 'lucide-react';

export default function AddCustomerModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'ÖZEL', // KAMU, ÖZEL, YURTDIŞI
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    taxOffice: '',
    taxNo: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      return toast.error('Müşteri ismi ve kodu zorunludur.');
    }

    setLoading(true);
    try {
      await salesService.addCustomer(formData);
      toast.success('Müşteri başarıyla kaydedildi.');
      onClose();
      setFormData({
        name: '', code: '', type: 'ÖZEL',
        contactName: '', contactEmail: '', contactPhone: '',
        address: '', taxOffice: '', taxNo: ''
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
      title="Yeni Müşteri / Kurum Tanımla"
      size="md"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        {/* Basic Info */}
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label"><Building2 size={12} /> Kurum/Firma İsmi</label>
            <input 
              className="form-input" 
              placeholder="Örn: ASELSAN A.Ş."
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label"><Shield size={12} /> Müşteri Kodu</label>
            <input 
              className="form-input" 
              placeholder="Örn: MST-001"
              value={formData.code}
              onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
            />
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Kurum Tipi</label>
            <select 
              className="form-input"
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value})}
            >
              <option value="KAMU">Kamu Kurumu (MSB, SSB vb.)</option>
              <option value="ÖZEL">Özel Sektör</option>
              <option value="YURTDIŞI">Yurt Dışı / İhracat</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label"><User size={12} /> İlgili Kişi (Kontak)</label>
            <input 
              className="form-input" 
              placeholder="Ad Soyad"
              value={formData.contactName}
              onChange={e => setFormData({...formData, contactName: e.target.value})}
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid-2" style={{ background: 'var(--c-bg-base)', padding: 16, borderRadius: 8 }}>
          <div className="form-group">
            <label className="form-label"><Mail size={12} /> E-posta</label>
            <input 
              type="email"
              className="form-input" 
              placeholder="kurumsal@firma.com"
              value={formData.contactEmail}
              onChange={e => setFormData({...formData, contactEmail: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label"><Phone size={12} /> Telefon</label>
            <input 
              className="form-input" 
              placeholder="+90 5XX XXX XX XX"
              value={formData.contactPhone}
              onChange={e => setFormData({...formData, contactPhone: e.target.value})}
            />
          </div>
        </div>

        {/* Financial Info */}
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label"><CreditCard size={12} /> Vergi Dairesi</label>
            <input 
              className="form-input" 
              value={formData.taxOffice}
              onChange={e => setFormData({...formData, taxOffice: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Vergi Numarası</label>
            <input 
              className="form-input" 
              value={formData.taxNo}
              onChange={e => setFormData({...formData, taxNo: e.target.value})}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label"><MapPin size={12} /> Genel Merkez Adresi</label>
          <textarea 
            className="form-input" 
            rows={2}
            value={formData.address}
            onChange={e => setFormData({...formData, address: e.target.value})}
            style={{ resize: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
          <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
          <Button type="submit" variant="primary" loading={loading} disabled={loading}>
            Müşteriyi Kaydet
          </Button>
        </div>
      </form>
    </Modal>
  );
}
