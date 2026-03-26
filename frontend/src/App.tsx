import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import LoginPage from './pages/LoginPage';
import MainLayout from './components/layout/MainLayout';
import DashboardPage from './pages/DashboardPage';
import POSPage from './pages/POSPage';
import ProductosPage from './pages/ProductosPage';
import StockPage from './pages/StockPage';
import ProveedoresPage from './pages/ProveedoresPage';
import UsuariosPage from './pages/UsuariosPage';
import HorariosPage from './pages/HorariosPage';
import ReportesPage from './pages/ReportesPage';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RequirePermiso({ permiso, children }: { permiso: string; children: React.ReactNode }) {
  const { hasPermiso } = useAuthStore();
  if (!hasPermiso(permiso)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  const { user } = useAuthStore();

  // Redirect to home por rol al entrar
  const homeByRol = () => {
    if (!user) return '/login';
    if (user.rol === 'CAJERO') return '/pos';
    if (user.rol === 'REPOSICION') return '/stock';
    return '/dashboard';
  };

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={homeByRol()} /> : <LoginPage />} />

      <Route path="/" element={<RequireAuth><MainLayout /></RequireAuth>}>
        <Route index element={<Navigate to={homeByRol()} replace />} />

        {/* Admin */}
        <Route path="dashboard" element={
          <RequirePermiso permiso="DASHBOARD_FULL"><DashboardPage /></RequirePermiso>
        } />
        <Route path="usuarios" element={
          <RequirePermiso permiso="USUARIOS_ADMIN"><UsuariosPage /></RequirePermiso>
        } />
        <Route path="horarios" element={
          <RequirePermiso permiso="HORARIOS_ADMIN"><HorariosPage /></RequirePermiso>
        } />
        <Route path="reportes" element={
          <RequirePermiso permiso="REPORTES_VENTAS"><ReportesPage /></RequirePermiso>
        } />

        {/* Cajero */}
        <Route path="pos" element={
          <RequirePermiso permiso="POS_ACCESS"><POSPage /></RequirePermiso>
        } />

        {/* Reposición + Admin */}
        <Route path="productos" element={
          <RequirePermiso permiso="PRODUCTOS_READ"><ProductosPage /></RequirePermiso>
        } />
        <Route path="stock" element={
          <RequirePermiso permiso="STOCK_READ"><StockPage /></RequirePermiso>
        } />
        <Route path="proveedores" element={
          <RequirePermiso permiso="PROVEEDORES_READ"><ProveedoresPage /></RequirePermiso>
        } />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
