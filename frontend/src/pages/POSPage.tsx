import { useState, useRef, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Scan, Plus, Minus, Trash2, ShoppingCart, CreditCard,
  Banknote, CheckCircle, Search, X, Receipt,
} from 'lucide-react';
import { searchProductos, crearVenta, getProductoByBarras } from '../services/api';
import { CarritoItem, Producto } from '../types';
import { useAuthStore } from '../store/authStore';

const fmt = (n: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

const METODOS_PAGO = [
  { value: 'EFECTIVO',        label: 'Efectivo',        icon: <Banknote size={16} /> },
  { value: 'TARJETA_DEBITO',  label: 'Débito',          icon: <CreditCard size={16} /> },
  { value: 'TARJETA_CREDITO', label: 'Crédito',         icon: <CreditCard size={16} /> },
  { value: 'TRANSFERENCIA',   label: 'Transferencia',   icon: <CheckCircle size={16} /> },
  { value: 'QR',              label: 'QR / MODO',       icon: <Scan size={16} /> },
];

export default function POSPage() {
  const { user } = useAuthStore();
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const [scanInput, setScanInput] = useState('');
  const [searchQ, setSearchQ] = useState('');
  const [metodoPago, setMetodoPago] = useState('EFECTIVO');
  const [montoRecibido, setMontoRecibido] = useState('');
  const [ventaExitosa, setVentaExitosa] = useState<any>(null);
  const scanRef = useRef<HTMLInputElement>(null);

  const total = carrito.reduce((acc, i) => acc + i.subtotal, 0);
  const vuelto = montoRecibido ? parseFloat(montoRecibido) - total : 0;

  // Búsqueda de productos
  const { data: resultados = [] } = useQuery<Producto[]>({
    queryKey: ['search', searchQ],
    queryFn: () => searchProductos(searchQ),
    enabled: searchQ.length > 1,
  });

  // Mutación crear venta
  const ventaMutation = useMutation({
    mutationFn: crearVenta,
    onSuccess: (data) => {
      setVentaExitosa(data);
      setCarrito([]);
      setMontoRecibido('');
      toast.success(`Venta ${data.numeroTicket} registrada!`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Error al registrar la venta');
    },
  });

  const agregarProducto = useCallback((p: Producto) => {
    setCarrito(prev => {
      const existing = prev.find(i => i.productoId === p.id);
      if (existing) {
        return prev.map(i => i.productoId === p.id
          ? { ...i, cantidad: i.cantidad + 1, subtotal: (i.cantidad + 1) * i.precioUnitario }
          : i);
      }
      return [...prev, {
        productoId: p.id,
        nombre: p.nombre,
        cantidad: 1,
        precioUnitario: p.precioVenta,
        subtotal: p.precioVenta,
        codigoBarras: p.codigoBarras,
      }];
    });
    setSearchQ('');
  }, []);

  const handleScan = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    const codigo = scanInput.trim();
    if (!codigo) return;
    setScanInput('');
    try {
      const prod = await getProductoByBarras(codigo);
      agregarProducto(prod);
      toast.success(`${prod.nombre} agregado`, { duration: 1500 });
    } catch {
      toast.error(`Código no encontrado: ${codigo}`);
    }
    scanRef.current?.focus();
  };

  const cambiarCantidad = (id: number, delta: number) => {
    setCarrito(prev => prev.map(i => i.productoId === id
      ? { ...i, cantidad: Math.max(1, i.cantidad + delta), subtotal: Math.max(1, i.cantidad + delta) * i.precioUnitario }
      : i).filter(i => i.cantidad > 0));
  };

  const eliminar = (id: number) => setCarrito(prev => prev.filter(i => i.productoId !== id));

  const confirmarVenta = () => {
    if (!carrito.length) { toast.error('El carrito está vacío'); return; }
    if (!user?.sucursalId) { toast.error('Sin sucursal asignada'); return; }
    ventaMutation.mutate({
      sucursalId: user.sucursalId,
      metodoPago,
      montoRecibido: montoRecibido ? parseFloat(montoRecibido) : total,
      detalles: carrito.map(i => ({
        productoId: i.productoId,
        cantidad: i.cantidad,
        descuentoPct: 0,
      })),
    });
  };

  if (ventaExitosa) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="card" style={{ padding: 40, textAlign: 'center', maxWidth: 400, width: '100%' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'rgba(0,214,143,0.15)', border: '2px solid #00D68F',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <CheckCircle size={36} color="#00D68F" />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>¡Venta completada!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>Ticket: <strong>{ventaExitosa.numeroTicket}</strong></p>
          <p style={{ fontSize: 28, fontWeight: 800, color: '#00D68F', margin: '12px 0' }}>{fmt(ventaExitosa.total)}</p>
          {ventaExitosa.vuelto > 0 && (
            <p style={{ color: 'var(--neon-amber)' }}>Vuelto: {fmt(ventaExitosa.vuelto)}</p>
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setVentaExitosa(null)}>
              <Receipt size={16} /> Nueva venta
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, height: 'calc(100vh - 108px)' }}>
      {/* Panel izquierdo: scanner + búsqueda */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden' }}>
        {/* Scanner input */}
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9, background: 'rgba(233,69,96,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Scan size={18} color="#E94560" />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700 }}>Scanner de código de barras</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Escaneá o escribí el código y presioná Enter</p>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              ref={scanRef}
              value={scanInput}
              onChange={e => setScanInput(e.target.value)}
              onKeyDown={handleScan}
              placeholder="Escanear código de barras..."
              className="input-dark"
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 16, letterSpacing: '0.05em', paddingRight: 40 }}
              autoFocus
            />
            {scanInput && (
              <button onClick={() => setScanInput('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={16} />
              </button>
            )}
          </div>
          {/* Scan line animation */}
          <div style={{ position: 'relative', height: 3, background: 'var(--bg-surface)', borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
            <div className="scan-line" style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '30%', background: 'linear-gradient(90deg, transparent, #E94560, transparent)', borderRadius: 2 }} />
          </div>
        </div>

        {/* Búsqueda manual */}
        <div className="card" style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="Buscar producto por nombre..."
              className="input-dark"
              style={{ paddingLeft: 32 }}
            />
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {resultados.map((p: Producto) => (
              <div
                key={p.id}
                onClick={() => agregarProducto(p)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                  transition: 'background 0.15s', marginBottom: 4,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{p.nombre}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>{p.codigoBarras}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#00D68F' }}>{fmt(p.precioVenta)}</p>
                  <span className="badge-info" style={{ fontSize: 10 }}>{p.unidadMedida}</span>
                </div>
              </div>
            ))}
            {searchQ.length > 1 && resultados.length === 0 && (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0', fontSize: 13 }}>Sin resultados para "{searchQ}"</p>
            )}
          </div>
        </div>
      </div>

      {/* Panel derecho: carrito + cobro */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }} className="card">
        {/* Header carrito */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShoppingCart size={18} color="#E94560" />
            <span style={{ fontWeight: 700, fontSize: 15 }}>Carrito</span>
          </div>
          <span style={{ background: '#E9456020', color: '#E94560', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>
            {carrito.length} ítem{carrito.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {carrito.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <ShoppingCart size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p style={{ fontSize: 13 }}>Escaneá un producto para comenzar</p>
            </div>
          ) : carrito.map(item => (
            <div key={item.productoId} style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <p style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{item.nombre}</p>
                <button onClick={() => eliminar(item.productoId)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0 }}>
                  <Trash2 size={14} />
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={() => cambiarCantidad(item.productoId, -1)} style={{ width: 26, height: 26, borderRadius: 6, background: 'var(--bg-surface)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}>
                    <Minus size={12} />
                  </button>
                  <span style={{ fontSize: 14, fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{item.cantidad}</span>
                  <button onClick={() => cambiarCantidad(item.productoId, 1)} style={{ width: 26, height: 26, borderRadius: 6, background: 'var(--bg-surface)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}>
                    <Plus size={12} />
                  </button>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>× {fmt(item.precioUnitario)}</span>
                </div>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#00D68F' }}>{fmt(item.subtotal)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Total + Cobro */}
        <div style={{ padding: 16, borderTop: '1px solid var(--border)' }}>
          {/* Total */}
          <div style={{ background: 'var(--bg-surface)', borderRadius: 10, padding: '12px 16px', marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Total</span>
              <span style={{ fontSize: 26, fontWeight: 800, color: '#00D68F' }}>{fmt(total)}</span>
            </div>
          </div>

          {/* Método de pago */}
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Método de pago</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {METODOS_PAGO.map(m => (
                <button
                  key={m.value}
                  onClick={() => setMetodoPago(m.value)}
                  style={{
                    padding: '7px 4px', borderRadius: 8, cursor: 'pointer', fontSize: 10, fontWeight: 600,
                    background: metodoPago === m.value ? 'rgba(233,69,96,0.2)' : 'var(--bg-surface)',
                    border: `1px solid ${metodoPago === m.value ? '#E94560' : 'var(--border)'}`,
                    color: metodoPago === m.value ? '#E94560' : 'var(--text-secondary)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                    transition: 'all 0.15s',
                  }}
                >
                  {m.icon}
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Monto recibido (solo efectivo) */}
          {metodoPago === 'EFECTIVO' && (
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Monto recibido</p>
              <input
                type="number"
                value={montoRecibido}
                onChange={e => setMontoRecibido(e.target.value)}
                placeholder={fmt(total)}
                className="input-dark"
                style={{ fontFamily: 'JetBrains Mono', fontWeight: 600, fontSize: 16 }}
              />
              {vuelto > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, padding: '6px 10px', background: 'rgba(255,183,3,0.1)', borderRadius: 6 }}>
                  <span style={{ fontSize: 12, color: '#FFB703' }}>Vuelto</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#FFB703' }}>{fmt(vuelto)}</span>
                </div>
              )}
            </div>
          )}

          {/* Botón cobrar */}
          <button
            className="btn-primary pulse-accent"
            style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: 16, borderRadius: 10 }}
            onClick={confirmarVenta}
            disabled={ventaMutation.isPending || carrito.length === 0}
          >
            <CheckCircle size={20} />
            {ventaMutation.isPending ? 'Procesando...' : `Cobrar ${fmt(total)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
