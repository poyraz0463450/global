import { useState } from 'react';
import { Modal, Button, Badge } from '../ui/index';
import { useCustomers, useInventory } from '../../hooks/useERP';
import { salesService } from '../../firebase/firestore';
import toast from 'react-hot-toast';
import { 
  ShoppingCart, User, Calendar, Plus, 
  Trash2, DollarSign, Package, AlertCircle 
} from 'lucide-react';

export default function AddOrderModal({ isOpen, onClose }) {
  const { customers } = useCustomers();
  const { parts } = useInventory();
  
  const [loading, setLoading] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [deadline, setDeadline] = useState('');
  const [items, setItems] = useState([
    { partId: '', qty: 1, unitPrice: 0 }
  ]);

  const addItem = () => {
    setItems([...items, { partId: '', qty: 1, unitPrice: 0 }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    // Auto-fill price if part selected
    if (field === 'partId') {
      const part = parts.find(p => p.id === value);
      if (part) newItems[index].unitPrice = (part.unitCost || 0) * 1.5; // Demo margin
    }
    
    setItems(newItems);
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomerId) return toast.error('Müşteri seçilmelidir.');
    if (items.some(i => !i.partId || i.qty <= 0)) return toast.error('Lütfen tüm kalemleri eksiksiz doldurun.');

    const customer = customers.find(c => c.id === selectedCustomerId);

    setLoading(true);
    try {
      await salesService.createOrder({
        customerId: selectedCustomerId,
        customerName: customer.name,
        deadline,
        items,
        totalAmount,
        currency: 'TRY',
      });
      toast.success('Sipariş taslağı oluşturuldu.');
      onClose();
      setItems([{ partId: '', qty: 1, unitPrice: 0 }]);
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
      title="Yeni Müşteri Siparişi Oluştur"
      size="lg"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* Header Info */}
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label"><User size={12} /> Müşteri / Kurum</label>
            <select 
              className="form-input"
              value={selectedCustomerId}
              onChange={e => setSelectedCustomerId(e.target.value)}
            >
              <option value="">Müşteri Seçin...</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label"><Calendar size={12} /> Hedef Teslim Tarihi</label>
            <input 
              type="date" 
              className="form-input"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
            />
          </div>
        </div>

        {/* Order Items */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: 0, color: 'var(--t-secondary)' }}>Sipariş Kalemleri</h3>
            <Button type="button" variant="secondary" size="sm" onClick={addItem} icon={<Plus size={14} />}>
              Kalem Ekle
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {items.map((item, idx) => (
              <div key={idx} className="glass-card anim-fade" style={{ padding: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ flex: 2 }} className="form-group">
                  <select 
                    className="form-input"
                    value={item.partId}
                    onChange={e => updateItem(idx, 'partId', e.target.value)}
                  >
                    <option value="">Ürün Seçin...</option>
                    {parts.map(p => (
                      <option key={p.id} value={p.id}>{p.partNo} - {p.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1 }} className="form-group">
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="Mktr"
                    value={item.qty}
                    onChange={e => updateItem(idx, 'qty', e.target.value)}
                  />
                </div>
                <div style={{ flex: 1 }} className="form-group">
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="Fiyat"
                    value={item.unitPrice}
                    onChange={e => updateItem(idx, 'unitPrice', e.target.value)}
                  />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, width: 100, textAlign: 'right', color: 'var(--c-accent)' }}>
                  ₺{(item.qty * item.unitPrice).toLocaleString()}
                </div>
                <button 
                  type="button" 
                  className="icon-btn" 
                  style={{ color: 'var(--c-danger)' }}
                  onClick={() => removeItem(idx)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Total Summary */}
        <div style={{ 
          background: 'var(--c-bg-elevated)', 
          padding: '16px 24px', 
          borderRadius: 8, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          border: '1px solid var(--c-border-bright)'
        }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--t-dim)', textTransform: 'uppercase' }}>Toplam Tutar</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--c-accent)', fontFamily: 'var(--font-mono)' }}>
              ₺{totalAmount.toLocaleString()}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
            <Button type="submit" variant="primary" loading={loading}>
              Sipariş Taslağını Kaydet
            </Button>
          </div>
        </div>

      </form>
    </Modal>
  );
}
