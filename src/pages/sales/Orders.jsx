import { useState } from 'react';
import { useOrders } from '../../hooks/useERP';
import { 
  ShoppingCart, Plus, Search, Calendar, 
  CheckCircle, FileText, MoreVertical, DollarSign,
  ArrowRight, Clock, AlertCircle
} from 'lucide-react';
import { Button, Badge, Spinner, EmptyState } from '../../components/ui/index';
import AddOrderModal from '../../components/modals/AddOrderModal';
import { salesService } from '../../firebase/firestore';
import toast from 'react-hot-toast';

export default function Orders() {
  const { orders, loading } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleApprove = async (orderId) => {
    try {
      await salesService.approveOrder(orderId);
      toast.success('Sipariş onaylandı ve üretime aktarıldı.');
    } catch (err) {
      toast.error('Hata: ' + err.message);
    }
  };

  const filteredOrders = orders.filter(o => 
    o.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusStyles = {
    'DRAFT':    { variant: 'secondary', label: 'TASLAK' },
    'APPROVED': { variant: 'success',   label: 'ONAYLANDI' },
    'PROD':     { variant: 'info',      label: 'ÜRETİMDE' },
    'SHIPPED':  { variant: 'warning',   label: 'SEVK EDİLDİ' },
  };

  if (loading) return (
    <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Spinner size="lg" />
    </div>
  );

  return (
    <div className="page-content anim-fade">
      <div className="glass-header" style={{ marginBottom: 20, padding: '16px 24px', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--t-primary)' }}>Müşteri Siparişleri</h1>
          <p style={{ fontSize: 13, color: 'var(--t-dim)', margin: '4px 0 0' }}>Aktif sipariş döngüsü, onay mekanizması ve teslimat takvimi.</p>
        </div>
        <div className="gap-flex">
          <Button 
            variant="primary" 
            icon={<Plus size={16} />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Yeni Sipariş Oluştur
          </Button>
        </div>
      </div>

      <AddOrderModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      {/* Stats Quick View */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        <div className="glass-card" style={{ padding: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--t-dim)', textTransform: 'uppercase', marginBottom: 4 }}>Aktif Sipariş</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--t-primary)' }}>{orders.length}</div>
        </div>
        <div className="glass-card" style={{ padding: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--t-dim)', textTransform: 'uppercase', marginBottom: 4 }}>Ciro (Bekleyen)</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--c-accent)' }}>
            ₺{orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString()}
          </div>
        </div>
        <div className="glass-card" style={{ padding: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--t-dim)', textTransform: 'uppercase', marginBottom: 4 }}>Yaklaşan Teslimat</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--c-warning)' }}>
            {orders.filter(o => o.status === 'APPROVED').length}
          </div>
        </div>
        <div className="glass-card" style={{ padding: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--t-dim)', textTransform: 'uppercase', marginBottom: 4 }}>Üretimdeki İşler</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--c-info)' }}>
             {orders.filter(o => o.status === 'PROD').length}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', marginBottom: 20, gap: 16 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--t-dim)' }} />
          <input
            type="text"
            placeholder="Müşteri ismi veya sipariş no ile ara..."
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
              <th>SİPARİŞ NO</th>
              <th>MÜŞTERİ / PROJE</th>
              <th>TERMİN (DEADLINE)</th>
              <th>TOPLAM TUTAR</th>
              <th>DURUM</th>
              <th style={{ textAlign: 'right' }}>AKSİYON</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o, idx) => (
              <tr key={o.id} className="anim-fade" style={{ animationDelay: `${idx * 0.05}s` }}>
                <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--c-accent)' }}>
                  ORD-{o.id.slice(0,6).toUpperCase()}
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600, color: 'var(--t-primary)' }}>{o.customerName}</span>
                    <span style={{ fontSize: 11, color: 'var(--t-muted)' }}>{o.items?.length || 0} Kalem Ürün</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={14} color="var(--t-dim)" />
                    <span style={{ fontSize: 12 }}>{o.deadline || 'Belirtilmedi'}</span>
                  </div>
                </td>
                <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  ₺{(o.totalAmount || 0).toLocaleString()}
                </td>
                <td>
                   <Badge variant={statusStyles[o.status || 'DRAFT'].variant}>
                      {statusStyles[o.status || 'DRAFT'].label}
                   </Badge>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div className="gap-flex" style={{ justifyContent: 'flex-end' }}>
                    {o.status === 'DRAFT' && (
                      <Button 
                        size="sm" 
                        variant="primary" 
                        onClick={() => handleApprove(o.id)}
                        icon={<CheckCircle size={14} />}
                      >
                        Onayla
                      </Button>
                    )}
                    <button className="icon-btn-small" title="Detaylar"><FileText size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <EmptyState title="Sipariş Bulunamadı" desc="Henüz bir sipariş oluşturulmamış veya filtreye uygun kayıt yok." />
        )}
      </div>
    </div>
  );
}
