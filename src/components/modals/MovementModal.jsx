import { useState } from 'react';
import { Modal, Button } from '../ui/index';
import { inventoryService } from '../../firebase/firestore';
import toast from 'react-hot-toast';
import { ArrowDownLeft, ArrowUpRight, Hash, MessageSquare, Info } from 'lucide-react';

export default function MovementModal({ isOpen, onClose, part }) {
  const [loading, setLoading] = useState(false);
  const [qty, setQty] = useState(0);
  const [type, setType] = useState('IN');
  const [reason, setReason] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (qty <= 0) return toast.error('Miktar 0\'dan büyük olmalıdır.');
    if (!part?.id) return toast.error('Parça seçilmedi.');

    setLoading(true);
    try {
      const movementQty = type === 'IN' ? Number(qty) : -Number(qty);
      await inventoryService.addMovement(
        part.id, 
        movementQty, 
        type, 
        'MANUEL', 
        reason || 'Manuel stok düzenleme'
      );
      toast.success('Stok hareketi başarıyla kaydedildi.');
      onClose();
      setQty(0);
      setReason('');
    } catch (err) {
      toast.error('Hata: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!part) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`${part.partNo} — Stok Hareketi`}
      size="sm"
    >
      <div style={{ marginBottom: 20, padding: 12, background: 'var(--c-bg-base)', borderRadius: 8, borderLeft: '4px solid var(--c-accent)' }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{part.name}</p>
        <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--t-dim)' }}>
          Mevcut Stok: <span style={{ color: 'var(--t-primary)', fontWeight: 700 }}>{part.currentStock} {part.unit}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        
        <div className="glass-capsule" style={{ display: 'flex', gap: 4, padding: 4 }}>
          <button
            type="button"
            onClick={() => setType('IN')}
            style={{
              flex: 1, padding: 10, borderRadius: 6, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: type === 'IN' ? 'var(--c-success-dim)' : 'transparent',
              color: type === 'IN' ? 'var(--c-success)' : 'var(--t-dim)',
              fontWeight: 600, fontSize: 12, transition: '0.2s'
            }}
          >
            <ArrowDownLeft size={14} /> STOK GİRİŞ
          </button>
          <button
            type="button"
            onClick={() => setType('OUT')}
            style={{
              flex: 1, padding: 10, borderRadius: 6, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: type === 'OUT' ? 'var(--c-danger-dim)' : 'transparent',
              color: type === 'OUT' ? 'var(--c-danger)' : 'var(--t-dim)',
              fontWeight: 600, fontSize: 12, transition: '0.2s'
            }}
          >
            <ArrowUpRight size={14} /> STOK ÇIKIŞ
          </button>
        </div>

        <div className="form-group">
          <label className="form-label"><Hash size={12} /> İşlem Miktarı ({part.unit})</label>
          <input 
            type="number" 
            className="form-input" 
            value={qty}
            onChange={e => setQty(e.target.value)}
            style={{ fontSize: 18, fontWeight: 700, textAlign: 'center' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label"><MessageSquare size={12} /> Açıklama / Referans</label>
          <textarea 
            className="form-input" 
            placeholder="Neden bu işlemi yapıyorsunuz?"
            rows={3}
            value={reason}
            onChange={e => setReason(e.target.value)}
            style={{ resize: 'none' }}
          />
        </div>

        <div className="alert alert-info">
          <Info size={14} />
          <span style={{ fontSize: 11 }}>Yeni bakiye: <b>{Number(part.currentStock) + (type === 'IN' ? Number(qty) : -Number(qty))}</b> {part.unit} olacak.</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
          <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
          <Button 
            type="submit" 
            variant="primary" 
            loading={loading}
            style={{ background: type === 'IN' ? 'var(--c-success)' : 'var(--c-danger)' }}
          >
            Hareketi Kaydet
          </Button>
        </div>
      </form>
    </Modal>
  );
}
