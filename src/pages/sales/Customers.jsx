import { useState } from 'react';
import { useCustomers } from '../../hooks/useERP';
import { 
  Building2, Plus, Search, Mail, Phone, 
  ExternalLink, MoreVertical, CreditCard, Shield 
} from 'lucide-react';
import { Button, Badge, Spinner, EmptyState } from '../../components/ui/index';
import AddCustomerModal from '../../components/modals/AddCustomerModal';

export default function Customers() {
  const { customers, loading } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const typeStyles = {
    'KAMU':     { color: 'var(--c-accent)',   label: 'KAMU KURUMU' },
    'ÖZEL':     { color: 'var(--c-info)',     label: 'ÖZEL SEKTÖR' },
    'YURTDIŞI': { color: 'var(--c-purple)',   label: 'İHRACAT / GLOBAL' },
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
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--t-primary)' }}>Müşteri & Paydaş Yönetimi</h1>
          <p style={{ fontSize: 13, color: 'var(--t-dim)', margin: '4px 0 0' }}>CRM veri tabanı: Savunma Sanayii paydaşları ve yurt dışı müşteriler.</p>
        </div>
        <div className="gap-flex">
          <Button 
            variant="primary" 
            icon={<Plus size={16} />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Yeni Müşteri Ekle
          </Button>
        </div>
      </div>

      <AddCustomerModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      {/* Stats Quick View */}
      <div className="grid-3" style={{ marginBottom: 20 }}>
        <div className="glass-card" style={{ padding: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--t-dim)', textTransform: 'uppercase', marginBottom: 4 }}>Toplam Paydaş</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--t-primary)' }}>{customers.length}</div>
        </div>
        <div className="glass-card" style={{ padding: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--t-dim)', textTransform: 'uppercase', marginBottom: 4 }}>Aktif Kamu Projeleri</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--c-accent)' }}>
            {customers.filter(c => c.type === 'KAMU').length}
          </div>
        </div>
        <div className="glass-card" style={{ padding: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--t-dim)', textTransform: 'uppercase', marginBottom: 4 }}>Global İhracat</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--c-purple)' }}>
            {customers.filter(c => c.type === 'YURTDIŞI').length}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', marginBottom: 20, gap: 16 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--t-dim)' }} />
          <input
            type="text"
            placeholder="Müşteri ismi veya kodu ile ara..."
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
              <th>KURUM KODU</th>
              <th>MÜŞTERİ / PAYDAŞ</th>
              <th>KURUM TİPİ</th>
              <th>KONTAK KİŞİ</th>
              <th>AÇIK BAKİYE</th>
              <th>DURUM</th>
              <th style={{ textAlign: 'right' }}>İŞLEMLER</th>
            </tr>
          </thead>
          <tbody>
             {filteredCustomers.map((c, idx) => {
               const style = typeStyles[c.type] || typeStyles['ÖZEL'];
               return (
                <tr key={c.id} className="anim-fade" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--c-accent)' }}>
                    {c.code}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ 
                        width: 32, height: 32, borderRadius: 6, 
                        background: 'var(--c-bg-base)', display: 'flex', 
                        alignItems: 'center', justifyContent: 'center',
                        color: style.color
                      }}>
                        <Building2 size={16} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, color: 'var(--t-primary)', fontSize: 13 }}>{c.name}</span>
                        <span style={{ fontSize: 11, color: 'var(--t-muted)' }}>ID: {c.id.slice(0,8)}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: style.color }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: style.color }}>{style.label}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: 12, fontWeight: 500 }}>{c.contactName || 'Belirtilmedi'}</span>
                      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                         {c.contactEmail && <Mail size={12} className="icon-link" />}
                         {c.contactPhone && <Phone size={12} className="icon-link" />}
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                    ₺{(c.balance || 0).toLocaleString()}
                  </td>
                  <td>
                    <Badge variant={c.isActive ? 'success' : 'danger'}>
                      {c.isActive ? 'AKTİF' : 'PASİF'}
                    </Badge>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="gap-flex" style={{ justifyContent: 'flex-end' }}>
                      <button className="icon-btn-small" title="Proje Detayları"><ExternalLink size={14} /></button>
                      <button className="icon-btn-small" title="Mali Kayıtlar"><CreditCard size={14} /></button>
                    </div>
                  </td>
                </tr>
               );
             })}
          </tbody>
        </table>
        {filteredCustomers.length === 0 && (
          <EmptyState title="Kayıtlı Müşteri Yok" desc="Arama kriterlerinize uygun müşteri bulunamadı." />
        )}
      </div>
    </div>
  );
}
