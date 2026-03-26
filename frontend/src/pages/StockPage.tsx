import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Scan, AlertTriangle, Package, Plus, Minus, RotateCcw, Search } from 'lucide-react';
import { getStockBySucursal, getAlertas, ajustarStock, getProductoByBarras } from '../services/api';
import { useAuthStore } from '../store/authStore';

const fmt = (n: number) => new Intl.NumberFormat('es-AR', { maximumFractionDigits: 2 }).format(n);

export default function StockPage() {
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const sucursalId = user?.sucursalId ?? 1;
  const [tab, setTab] = useState<'stock' | 'alertas' | 'carga'>('stock');
  const [scanInput, setScanInput] = useState('');
  const [scanProd, setScanProd] = useState<any>(null);
  const [scanCant, setScanCant] = useState('1');
  const [scanTipo, setScanTipo] = useState('ENTRADA');
  const [filtro, setFiltro] = useState('');
  const scanRef = useRef<HTMLInputElement>(null);

  const { data: stock = [] } = useQuery({
    queryKey: ['stock', sucursalId],
    queryFn: () => getStockBySucursal(sucursalId),
  });
  const { data: alertas = [] } = useQuery({
    queryKey: ['alertas'],
    queryFn: getAlertas,
    refetchInterval: 60_000,
  });

  const ajusteMut = useMutation({
    mutationFn: ajustarStock,
    onSuccess: () => {
      toast.success('Stock actualizado correctamente');
      qc.invalidateQueries({ queryKey: ['stock'] });
      qc.invalidateQueries({ queryKey: ['alertas'] });
      setScanProd(null);
      setScanInput('');
      setScanCant('1');
      scanRef.current?.focus();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Error al ajustar stock'),
  });

  const handleScan = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    const codigo = scanInput.trim();
    if (!codigo) return;
    try {
      const prod = await getProductoByBarras(codigo);
      setScanProd(prod);
      toast.success(`Producto encontrado: ${prod.nombre}`, { duration: 1500 });
    } catch {
      toast.error(`Código no encontrado: ${codigo}`);
    }
  };

  const confirmarCarga = () => {
    if (!scanProd) return;
    ajusteMut.mutate({
      productoId: scanProd.id,
      sucursalId,
      cantidad: parseFloat(scanCant),
      tipo: scanTipo,
      motivo: `Ajuste manual desde sistema`,
    });
  };

  const stockFiltrado = stock.filter((s: any) =>
    !filtro || s.producto?.nombre?.toLowerCase().includes(filtro.toLowerCase()) || s.producto?.codigoBarras?.includes(filtro)
  );

  const Tab = ({ id, label, count }: any) => (
    <button
      onClick={() => setTab(id)}
      style={{
        padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
        background: tab === id ? 'var(--accent)' : 'transparent',
        color: tab === id ? 'white' : 'var(--text-secondary)',
        border: `1px solid ${tab === id ? 'var(--accent)' : 'var(--border)'}`,
        display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s',
      }}
    >
      {label}
      {count != null && (
        <span style={{ background: tab === id ? 'rgba(255,255,255,0.25)' : 'var(--bg-surface)', borderRadius: 20, padding: '0 6px', fontSize: 11 }}>
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 4 }}>Gestión de Stock</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Sucursal: <strong>{user?.sucursalNombre}</strong></p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Tab id="stock"   label="Stock actual"  count={stock.length} />
          <Tab id="alertas" label="Alertas"       count={alertas.length} />
          <Tab id="carga"   label="Carga scanner" count={null} />
        </div>
      </div>

      {/* TAB: Carga con scanner */}
      {tab === 'carga' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Scanner */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(0,180,216,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Scan size={20} color="#00B4D8" />
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 15 }}>Scanner de carga</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Escaneá el código de barras del producto</p>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
                Código de barras
              </label>
              <input
                ref={scanRef}
                value={scanInput}
                onChange={e => setScanInput(e.target.value)}
                onKeyDown={handleScan}
                placeholder="Escanear o escribir código..."
                className="input-dark"
                style={{ fontFamily: 'JetBrains Mono', fontSize: 16, letterSpacing: '0.05em' }}
                autoFocus
              />
            </div>

            {/* Scan line */}
            <div style={{ height: 4, background: 'var(--bg-surface)', borderRadius: 2, overflow: 'hidden', marginBottom: 20 }}>
              <div className="scan-line" style={{ height: '100%', width: '40%', background: 'linear-gradient(90deg, transparent, #00B4D8, transparent)', borderRadius: 2 }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Tipo</label>
                <select value={scanTipo} onChange={e => setScanTipo(e.target.value)} className="input-dark">
                  <option value="ENTRADA">Entrada</option>
                  <option value="SALIDA">Salida</option>
                  <option value="AJUSTE">Ajuste (absoluto)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Cantidad</label>
                <input
                  type="number"
                  value={scanCant}
                  onChange={e => setScanCant(e.target.value)}
                  min="0"
                  step="1"
                  className="input-dark"
                  style={{ fontFamily: 'JetBrains Mono', fontWeight: 700 }}
                />
              </div>
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: 12 }}
              onClick={confirmarCarga}
              disabled={!scanProd || ajusteMut.isPending}
            >
              <Package size={16} />
              {ajusteMut.isPending ? 'Guardando...' : 'Confirmar movimiento'}
            </button>
          </div>

          {/* Producto escaneado */}
          <div className="card" style={{ padding: 24 }}>
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Producto detectado</p>
            {scanProd ? (
              <div>
                <div style={{ background: 'var(--bg-surface)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
                  <p style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{scanProd.nombre}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>{scanProd.codigoBarras}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8 }}>{scanProd.categoriaNombre}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: 12 }}>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Precio venta</p>
                    <p style={{ fontSize: 16, fontWeight: 700, color: '#00D68F' }}>
                      ${scanProd.precioVenta?.toLocaleString('es-AR')}
                    </p>
                  </div>
                  <div style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: 12 }}>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Unidad</p>
                    <p style={{ fontSize: 16, fontWeight: 700 }}>{scanProd.unidadMedida}</p>
                  </div>
                </div>
                <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(0,180,216,0.08)', borderRadius: 8, border: '1px solid rgba(0,180,216,0.2)' }}>
                  <p style={{ fontSize: 13, color: '#00B4D8', fontWeight: 600 }}>
                    {scanTipo === 'ENTRADA' ? '▲ Ingreso de' : scanTipo === 'SALIDA' ? '▼ Egreso de' : '↺ Ajuste a'} {scanCant} {scanProd.unidadMedida}
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                <Scan size={48} style={{ margin: '0 auto 12px', opacity: 0.2 }} />
                <p style={{ fontSize: 13 }}>Esperando escaneo...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: Stock actual */}
      {tab === 'stock' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ position: 'relative', maxWidth: 320 }}>
              <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
              <input value={filtro} onChange={e => setFiltro(e.target.value)} placeholder="Buscar producto..." className="input-dark" style={{ paddingLeft: 30 }} />
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Código</th>
                  <th>Ubicación</th>
                  <th style={{ textAlign: 'right' }}>Stock</th>
                  <th style={{ textAlign: 'right' }}>Mínimo</th>
                  <th style={{ textAlign: 'right' }}>Máximo</th>
                  <th style={{ textAlign: 'center' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {stockFiltrado.map((s: any) => {
                  const bajo = s.cantidad <= s.stockMinimo;
                  const pct = Math.min(100, (s.cantidad / s.stockMaximo) * 100);
                  return (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 500 }}>{s.producto?.nombre}</td>
                      <td style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--text-muted)' }}>{s.producto?.codigoBarras}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.ubicacion}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, fontFamily: 'JetBrains Mono', color: bajo ? '#E94560' : '#00D68F' }}>
                        {fmt(s.cantidad)}
                      </td>
                      <td style={{ textAlign: 'right', fontFamily: 'JetBrains Mono', color: 'var(--text-muted)' }}>{fmt(s.stockMinimo)}</td>
                      <td style={{ textAlign: 'right', fontFamily: 'JetBrains Mono', color: 'var(--text-muted)' }}>{fmt(s.stockMaximo)}</td>
                      <td style={{ textAlign: 'center' }}>
                        <div>
                          <span className={bajo ? 'badge-danger' : 'badge-ok'}>{bajo ? 'Bajo' : 'OK'}</span>
                          <div style={{ width: '100%', height: 3, background: 'var(--bg-surface)', borderRadius: 2, marginTop: 6 }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: bajo ? '#E94560' : '#00D68F', borderRadius: 2, transition: 'width 0.3s' }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {stockFiltrado.length === 0 && (
              <p style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>Sin resultados</p>
            )}
          </div>
        </div>
      )}

      {/* TAB: Alertas */}
      {tab === 'alertas' && (
        <div>
          {alertas.length === 0 ? (
            <div className="card" style={{ padding: 40, textAlign: 'center' }}>
              <Package size={48} style={{ margin: '0 auto 12px', color: '#00D68F', opacity: 0.6 }} />
              <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Sin alertas de stock</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Todos los productos están sobre el mínimo configurado</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
              {alertas.map((a: any) => (
                <div key={a.id} className="card" style={{ padding: 16, borderColor: 'rgba(233,69,96,0.3)', borderLeftWidth: 3 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <AlertTriangle size={18} color="#E94560" />
                    <span className="badge-danger">Bajo mínimo</span>
                  </div>
                  <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{a.producto?.nombre}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', marginBottom: 12 }}>{a.producto?.codigoBarras}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                    <div>
                      <p style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>Actual</p>
                      <p style={{ fontSize: 18, fontWeight: 800, color: '#E94560' }}>{fmt(a.cantidad)}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>Mínimo</p>
                      <p style={{ fontSize: 18, fontWeight: 800 }}>{fmt(a.stockMinimo)}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>Faltan</p>
                      <p style={{ fontSize: 18, fontWeight: 800, color: '#FFB703' }}>{fmt(a.stockMinimo - a.cantidad)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
