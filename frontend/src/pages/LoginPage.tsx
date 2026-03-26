import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Eye, EyeOff, ShoppingBag, Lock, Mail, Building2 } from 'lucide-react';
import { login } from '../services/api';
import { useAuthStore } from '../store/authStore';

interface FormData { email: string; password: string; }

const ROLES = [
  { label: 'Administrador',   email: 'admin@sanblas.com',          pass: 'Admin123!',  color: '#E94560', icon: '👑' },
  { label: 'Cajero Central',  email: 'cajero1.central@sanblas.com',pass: 'Cajero123!', color: '#00D68F', icon: '🏪' },
  { label: 'Reposición',      email: 'repos.central@sanblas.com',  pass: 'Repos123!',  color: '#00B4D8', icon: '📦' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await login(data.email, data.password);
      setUser(res, res.token);
      toast.success(`Bienvenido, ${res.nombreCompleto}!`);
      if (res.rol === 'CAJERO') navigate('/pos');
      else if (res.rol === 'REPOSICION') navigate('/stock');
      else navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  const fillRole = (r: typeof ROLES[0]) => {
    setValue('email', r.email);
    setValue('password', r.pass);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background orbs */}
      <div style={{
        position: 'absolute', top: '-20%', left: '-10%',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(233,69,96,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,180,216,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 440, padding: '0 20px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 64, height: 64, borderRadius: 16,
            background: 'linear-gradient(135deg, var(--accent) 0%, #c73350 100%)',
            marginBottom: 16, boxShadow: '0 8px 32px rgba(233,69,96,0.35)',
          }}>
            <ShoppingBag size={32} color="white" />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 4 }}>
            San Blas
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Sistema de Gestión Comercial
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 8 }}>
            <Building2 size={14} color="var(--text-muted)" />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>3 sucursales · Multi-rol</span>
          </div>
        </div>

        {/* Form Card */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: 32,
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Iniciar sesión</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  {...register('email', { required: 'Campo requerido', pattern: { value: /\S+@\S+/, message: 'Email inválido' } })}
                  type="email"
                  placeholder="usuario@sanblas.com"
                  className="input-dark"
                  style={{ paddingLeft: 38 }}
                />
              </div>
              {errors.email && <p style={{ color: 'var(--accent)', fontSize: 12, marginTop: 4 }}>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  {...register('password', { required: 'Campo requerido', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-dark"
                  style={{ paddingLeft: 38, paddingRight: 40 }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p style={{ color: 'var(--accent)', fontSize: 12, marginTop: 4 }}>{errors.password.message}</p>}
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15 }} disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar al sistema'}
            </button>
          </form>
        </div>

        {/* Quick access por rol */}
        <div style={{ marginTop: 20 }}>
          <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Acceso rápido (demo)
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {ROLES.map((r) => (
              <button key={r.email} onClick={() => fillRole(r)} style={{
                background: `${r.color}15`,
                border: `1px solid ${r.color}30`,
                borderRadius: 10, padding: '10px 8px',
                cursor: 'pointer', textAlign: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = `${r.color}25`)}
              onMouseLeave={e => (e.currentTarget.style.background = `${r.color}15`)}
              >
                <div style={{ fontSize: 20, marginBottom: 4 }}>{r.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: r.color }}>{r.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
