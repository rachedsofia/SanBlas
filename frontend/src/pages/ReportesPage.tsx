import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area,
} from 'recharts';
import { BarChart3, TrendingUp, Package, Users, Building2 } from 'lucide-react';
import { getVentasPorSucursal, getRankingProductos, getRankingEmpleados } from '../services/api';

const fmt = (n: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);
const COLORS = ['#E94560', '#00D68F', '#00B4D8', '#FFB703', '#a855f7', '#f97316'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px' }}>
      {label && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ fontSize: 13, fontWeight: 600, color: p.color || p.fill }}>
          {p.name}: {typeof p.value === 'number' && p.value > 999 ? fmt(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

const PERIODOS = [
  { label: '7 días', dias: 7 },
  { label: '30 días', dias: 30 },
  { label: '90 días', dias: 90 },
];

export default function ReportesPage() {
  const [dias, setDias] = useState(30);

  const { data: ventasSuc = [] } = useQuery({ queryKey: ['vsuc', dias], queryFn: () => getVentasPorSucursal(dias) });
  const { data: rankProd = [] } = useQuery({ queryKey: ['rprod', dias], queryFn: () => getRankingProductos(dias) });
  const { data: rankEmp = [] } = useQuery({ queryKey: ['remp', dias], queryFn: () => getRankingEmpleados(dias) });

  const top10Prod = rankProd.slice(0, 10);
  const low5Prod  = [...rankProd].sort((a: any, b: any) => a.unidades - b.unidades).slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 4 }}>Reportes & Métricas</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Análisis de ventas, productos y empleados</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {PERIODOS.map(p => (
            <button
              key={p.dias}
              onClick={() => setDias(p.dias)}
              style={{
                padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                background: dias === p.dias ? 'var(--accent)' : 'transparent',
                color: dias === p.dias ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${dias === p.dias ? 'var(--accent)' : 'var(--border)'}`,
                transition: 'all 0.15s',
              }}
            >{p.label}</button>
          ))}
        </div>
      </div>

      {/* Ventas por sucursal */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Building2 size={16} color="var(--text-muted)" /> Ventas por sucursal — últimos {dias} días
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ventasSuc}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="sucursal" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="total" name="Total ventas" radius={[8, 8, 0, 0]}>
                {ventasSuc.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={16} color="var(--text-muted)" /> Distribución
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={ventasSuc} dataKey="total" nameKey="sucursal" cx="50%" cy="50%" outerRadius={80} innerRadius={48} paddingAngle={3}>
                {ventasSuc.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ranking productos */}
      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Package size={16} color="var(--text-muted)" /> Top 10 productos más vendidos
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={top10Prod} layout="vertical" margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
            <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
            <YAxis type="category" dataKey="nombre" width={160} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="ingresos" name="Ingresos" radius={[0, 6, 6, 0]} fill="#E94560">
              {top10Prod.map((_: any, i: number) => <Cell key={i} fill={`${COLORS[0]}${Math.round(255 * (1 - i * 0.07)).toString(16).padStart(2,'0')}`} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Baja rotación + Ranking empleados */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Menor rotación */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Package size={16} color="#FFB703" /> Productos con menor rotación
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {low5Prod.map((p: any, i: number) => (
              <div key={p.productoId} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  width: 28, height: 28, borderRadius: 6,
                  background: 'rgba(255,183,3,0.12)', color: '#FFB703',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, flexShrink: 0,
                }}>{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 500 }}>{p.nombre}</p>
                  <div style={{ height: 4, background: 'var(--bg-surface)', borderRadius: 2, marginTop: 4 }}>
                    <div style={{ width: `${Math.max(5, (p.unidades / (low5Prod[0]?.unidades || 1)) * 100)}%`, height: '100%', background: '#FFB703', borderRadius: 2 }} />
                  </div>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#FFB703', flexShrink: 0 }}>{p.unidades} uds</span>
              </div>
            ))}
            {low5Prod.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Sin datos</p>}
          </div>
        </div>

        {/* Ranking empleados */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={16} color="var(--text-muted)" /> Ranking de empleados
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={rankEmp.slice(0, 6)}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="nombre" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false}
                tickFormatter={(v: string) => v.split(' ')[0]} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="total" name="Total vendido" radius={[6, 6, 0, 0]}>
                {rankEmp.slice(0, 6).map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla ranking empleados */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={16} color="var(--text-muted)" /> Tabla ranking completa — empleados
          </h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th><th>Empleado</th><th style={{ textAlign: 'right' }}>Ventas</th>
              <th style={{ textAlign: 'right' }}>Total vendido</th>
            </tr>
          </thead>
          <tbody>
            {rankEmp.map((e: any, i: number) => (
              <tr key={e.empleadoId}>
                <td>
                  <span style={{
                    width: 24, height: 24, borderRadius: 6, display: 'inline-flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700,
                    background: i === 0 ? '#FFB70320' : 'var(--bg-surface)',
                    color: i === 0 ? '#FFB703' : 'var(--text-muted)',
                  }}>{i + 1}</span>
                </td>
                <td style={{ fontWeight: 500 }}>{e.nombre}</td>
                <td style={{ textAlign: 'right', fontFamily: 'JetBrains Mono' }}>{e.ventas}</td>
                <td style={{ textAlign: 'right', fontWeight: 700, color: '#E94560', fontFamily: 'JetBrains Mono' }}>{fmt(e.total)}</td>
              </tr>
            ))}
            {rankEmp.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 20 }}>Sin datos</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
