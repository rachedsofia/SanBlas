import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingCart, Package, Warehouse,
  Truck, Users, Clock, BarChart3, LogOut, Menu, X,
  ShoppingBag, Bell, ChevronRight, Building2,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

interface NavItem { to: string; label: string; icon: React.ReactNode; permiso: string; }

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard',   label: 'Dashboard',    icon: <LayoutDashboard size={18} />, permiso: 'DASHBOARD_FULL' },
  { to: '/pos',         label: 'Punto de Venta',icon: <ShoppingCart size={18} />,   permiso: 'POS_ACCESS' },
  { to: '/stock',       label: 'Stock',         icon: <Warehouse size={18} />,       permiso: 'STOCK_READ' },
  { to: '/productos',   label: 'Productos',     icon: <Package size={18} />,         permiso: 'PRODUCTOS_READ' },
  { to: '/proveedores', label: 'Proveedores',   icon: <Truck size={18} />,           permiso: 'PROVEEDORES_READ' },
  { to: '/usuarios',    label: 'Usuarios',      icon: <Users size={18} />,           permiso: 'USUARIOS_ADMIN' },
  { to: '/horarios',    label: 'Horarios',      icon: <Clock size={18} />,           permiso: 'HORARIOS_ADMIN' },
  { to: '/reportes',    label: 'Reportes',      icon: <BarChart3 size={18} />,       permiso: 'REPORTES_VENTAS' },
];

const ROL_COLORS: Record<string, string> = {
  ADMIN:      '#E94560',
  CAJERO:     '#00D68F',
  REPOSICION: '#00B4D8',
};

export default function MainLayout() {
  const { user, logout, hasPermiso } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada');
    navigate('/login');
  };

  const visibleItems = NAV_ITEMS.filter((i) => hasPermiso(i.permiso));
  const rolColor = ROL_COLORS[user?.rol || 'ADMIN'];

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #E94560, #c73350)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <ShoppingBag size={18} color="white" />
          </div>
          {sidebarOpen && (
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.3px' }}>San Blas</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Building2 size={9} /> {user?.sucursalNombre}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '12px 12px', overflowY: 'auto' }}>
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: sidebarOpen ? '10px 12px' : '10px',
              borderRadius: 9,
              marginBottom: 2,
              textDecoration: 'none',
              transition: 'all 0.15s',
              background: isActive ? `${rolColor}20` : 'transparent',
              color: isActive ? rolColor : 'var(--text-secondary)',
              fontWeight: isActive ? 600 : 400,
              fontSize: 14,
              border: `1px solid ${isActive ? `${rolColor}30` : 'transparent'}`,
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
            })}
          >
            {item.icon}
            {sidebarOpen && <span>{item.label}</span>}
            {sidebarOpen && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.4 }} />}
          </NavLink>
        ))}
      </nav>

      {/* User info + logout */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
        {sidebarOpen ? (
          <div style={{ marginBottom: 10 }}>
            <div style={{
              background: 'var(--bg-surface)', borderRadius: 10,
              padding: '10px 12px', border: '1px solid var(--border)',
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{user?.nombreCompleto}</div>
              <span style={{
                fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.06em', color: rolColor,
                background: `${rolColor}15`, borderRadius: 4, padding: '2px 6px',
              }}>
                {user?.rol}
              </span>
            </div>
          </div>
        ) : null}
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center',
            gap: 8, padding: '9px 12px', borderRadius: 9,
            background: 'rgba(233,69,96,0.08)', border: '1px solid rgba(233,69,96,0.2)',
            color: '#E94560', cursor: 'pointer', fontSize: 13, fontWeight: 500,
            justifyContent: sidebarOpen ? 'flex-start' : 'center',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(233,69,96,0.18)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(233,69,96,0.08)')}
        >
          <LogOut size={16} />
          {sidebarOpen && 'Cerrar sesión'}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Desktop Sidebar */}
      <aside style={{
        width: sidebarOpen ? 240 : 64,
        background: 'var(--bg-card)',
        borderRight: '1px solid var(--border)',
        flexShrink: 0,
        transition: 'width 0.25s ease',
        display: typeof window !== 'undefined' && window.innerWidth < 768 ? 'none' : 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 10,
      }}>
        <SidebarContent />
        {/* Toggle btn */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: 'absolute', top: 24, right: -12,
            width: 24, height: 24, borderRadius: '50%',
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-secondary)', zIndex: 20,
          }}
        >
          {sidebarOpen ? <X size={12} /> : <Menu size={12} />}
        </button>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} onClick={() => setMobileOpen(false)} />
          <aside style={{
            width: 240, height: '100%',
            background: 'var(--bg-card)', borderRight: '1px solid var(--border)',
            position: 'relative', zIndex: 51,
            animation: 'slideIn 0.25s ease',
          }}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <header style={{
          height: 60, background: 'var(--bg-card)', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', flexShrink: 0,
        }}>
          <button
            onClick={() => setMobileOpen(true)}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'none' }}
          >
            <Menu size={20} />
          </button>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: `${rolColor}20`, border: `1px solid ${rolColor}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Bell size={15} color={rolColor} />
            </div>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: `${rolColor}20`, border: `1px solid ${rolColor}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: rolColor,
            }}>
              {user?.nombreCompleto.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
