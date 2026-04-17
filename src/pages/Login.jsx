import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Lock, Mail, AlertTriangle } from 'lucide-react';
import { InlineSpinner } from '../components/ui/index';

export default function Login() {
  const { user, login, loading } = useAuth();
  const [email, setEmail]     = useState('');
  const [password, setPass]   = useState('');
  const [show, setShow]       = useState(false);
  const [err, setErr]         = useState('');
  const [isLoading, setLoad]  = useState(false);

  if (!loading && user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoad(true);
    try {
      await login(email.trim(), password);
    } catch (error) {
      const msgs = {
        'auth/invalid-credential': 'E-posta veya şifre hatalı.',
        'auth/user-not-found':     'Kullanıcı bulunamadı.',
        'auth/wrong-password':     'Şifre hatalı.',
        'auth/too-many-requests':  'Çok fazla deneme. Lütfen bekleyin.',
        'auth/network-request-failed': 'Ağ bağlantısı hatası.',
      };
      setErr(msgs[error.code] || 'Giriş başarısız. Tekrar deneyin.');
    } finally {
      setLoad(false);
    }
  };

  return (
    <div style={{
      height: '100vh',
      width: '100%',
      background: 'var(--c-bg-base)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background grid */}
      <div className="bg-grid" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      {/* Glow orb */}
      <div style={{
        position: 'absolute',
        top: '30%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 480, height: 480,
        background: 'radial-gradient(circle, rgba(0,200,232,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Login Card */}
      <div className="anim-fade" style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: 400,
        padding: '0 20px',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 52, height: 52,
            background: 'var(--c-accent)',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 24px rgba(0,200,232,0.3)',
          }}>
            <Shield size={24} color="#000" strokeWidth={2.5} />
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--t-primary)' }}>
            ARTEGON
          </div>
          <div style={{ fontSize: 11, color: 'var(--t-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4 }}>
            Defense ERP System
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--c-bg-surface)',
          border: '1px solid var(--c-border-bright)',
          borderRadius: 'var(--r-xl)',
          padding: '32px 32px',
          boxShadow: 'var(--shadow-lg)',
        }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--t-primary)', margin: '0 0 4px' }}>
              Sisteme Giriş
            </h2>
            <p style={{ fontSize: 12, color: 'var(--t-muted)', margin: 0 }}>
              Yetkili personel erişimi · Güvenli bağlantı
            </p>
          </div>

          {err && (
            <div style={{
              display: 'flex', gap: 8, alignItems: 'flex-start',
              background: 'var(--c-danger-dim)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 'var(--r-md)',
              padding: '10px 12px',
              marginBottom: 20,
              fontSize: 12,
              color: 'var(--c-danger)',
            }}>
              <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
              {err}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Email */}
            <div>
              <label className="form-label">E-posta <span style={{ color: 'var(--c-danger)' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <Mail size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--t-dim)', pointerEvents: 'none' }} />
                <input
                  type="email"
                  className="form-input"
                  placeholder="kullanici@artegon.com.tr"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  style={{ paddingLeft: 34 }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="form-label">Şifre <span style={{ color: 'var(--c-danger)' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <Lock size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--t-dim)', pointerEvents: 'none' }} />
                <input
                  type={show ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPass(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={{ paddingLeft: 34, paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShow(p => !p)}
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--t-dim)', padding: 2
                  }}
                >
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || !email || !password}
              style={{ width: '100%', justifyContent: 'center', height: 40, marginTop: 4, fontSize: 14 }}
            >
              {isLoading ? <InlineSpinner size={14} /> : null}
              {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <p style={{ fontSize: 11, color: 'var(--t-dim)' }}>
            ARTEGON Defense ERP v2.0 · Tüm hakları saklıdır
          </p>
        </div>
      </div>
    </div>
  );
}
