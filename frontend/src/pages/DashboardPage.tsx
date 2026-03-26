import { useQuery } from '@tanstack/react-query';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from 'recharts';
import {
  TrendingUp, Package, AlertTriangle, Users, Trophy, ShoppingBag,
  Building2, ArrowUp, ArrowDown,
} from 'lucide-react';
import { getKpi, getVentasPorSucursal, getRankingProductos, getRankingEmpleados } from '../services/api';
import { useAuthStore } from '../store/authStore';

const fmt = (n: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

const COLORS = ['#E94560', '#00D68F', '#00B4D8', '#FFB703', '#a855f7'];

function KpiCard({ label, value, icon, color, sub }: any) {
  return (
    <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            {label}
          </p>
          <p style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px' }}>{value}</p>
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: `${color}20`, border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {icon}
        </div>
      </div>
      {sub && <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{sub}</p>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px' }}>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ fontSize: 14, fontWeight: 600, color: p.color }}>
          {typeof p.value === 'number' && p.value > 1000 ? fmt(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data: kpi } = useQuery({ queryKey: ['kpi'], queryFn: getKpi, refetchInterval: 60_000 });
  const { data: ventasSuc = [] } = useQuery({ queryKey: ['ventas-sucursal'], queryFn: () => getVentasPorSucursal(30) });
  const { data: rankProd = [] } = useQuery({ queryKey: ['ranking-productos'], queryFn: () => getRankingProductos(30) });
  const { data: rankEmp = [] } = useQuery({ queryKey: ['ranking-empleados'], queryFn: () => getRankingEmpleados(30) });

  const top5Prod = rankProd.slice(0, 5);
  const top5Emp  = rankEmp.slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 4 }}>
            Dashboard
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Visión global — últimos 30 días
          </p>
        </div>
        <div className="badge-info" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px' }}>
          <Building2 size={13} /> {user?.sucursalNombre || 'Central'}
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <KpiCard
          label="Ventas hoy"
          value={fmt(kpi?.ventasHoy ?? 0)}
          icon={<TrendingUp size={20} color="#E94560" />}
          color="#E94560"
          sub="Monto total del día"
        />
        <KpiCard
          label="Ventas del mes"
          value={fmt(kpi?.ventasMes ?? 0)}
          icon={<ShoppingBag size={20} color="#00D68F" />}
          color="#00D68F"
          sub="Mes en curso"
        />
        <KpiCard
          label="Alertas de stock"
          value={kpi?.alertasStock ?? 0}
          icon={<AlertTriangle size={20} color="#FFB703" />}
          color="#FFB703"
          sub="Productos bajo mínimo"
        />
        <KpiCard
          label="Sucursales activas"
          value="3"
          icon={<Building2 size={20} color="#00B4D8" />}
          color="#00B4D8"
          sub="Central, Norte, Sur"
        />
      </div>

      {/* Charts row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Ventas por sucursal - Bar */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Building2 size={16} color="var(--text-muted)" /> Ventas por sucursal
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ventasSuc} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="sucursal" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="total" name="Total" radius={[6, 6, 0, 0]}>
                {ventasSuc.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie por sucursal */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={16} color="var(--text-muted)" /> Participación por sucursal
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={ventasSuc} dataKey="total" nameKey="sucursal" cx="50%" cy="50%" outerRadius={75} innerRadius={40}>
                {ventasSuc.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rankings row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Ranking Productos */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Package size={16} color="var(--text-muted)" /> Top 5 productos más vendidos
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {top5Prod.map((p: any, i: number) => (
              <div key={p.productoId} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  width: 24, height: 24, borderRadius: 6,
                  background: i === 0 ? '#FFB70320' : 'var(--bg-surface)',
                  color: i === 0 ? '#FFB703' : 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, flexShrink: 0,
                }}>{i + 1}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.nombre}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.unidades} uds</p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#00D68F', flexShrink: 0 }}>{fmt(p.ingresos)}</span>
              </div>
            ))}
            {top5Prod.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Sin datos</p>}
          </div>
        </div>

        {/* Ranking Empleados */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Trophy size={16} color="var(--text-muted)" /> Top 5 empleados
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {top5Emp.map((e: any, i: number) => (
              <div key={e.empleadoId} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  width: 24, height: 24, borderRadius: 6,
                  background: i === 0 ? '#E9456020' : 'var(--bg-surface)',
                  color: i === 0 ? '#E94560' : 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, flexShrink: 0,
                }}>{i + 1}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.nombre}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{e.ventas} ventas</p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#E94560', flexShrink: 0 }}>{fmt(e.total)}</span>
              </div>
            ))}
            {top5Emp.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Sin datos</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
