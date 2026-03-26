// ProductosPage.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import { getProductos, createProducto, updateProducto, deleteProducto } from '../services/api';
import { Producto } from '../types';

const fmt = (n: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

export default function ProductosPage() {
  const qc = useQueryClient();
  const { data: productos = [], isLoading } = useQuery<Producto[]>({ queryKey: ['productos'], queryFn: getProductos });
  const [filtro, setFiltro] = useState('');
  const [modal, setModal] = useState<Partial<Producto> | null>(null);

  const deleteMut = useMutation({
    mutationFn: deleteProducto,
    onSuccess: () => { toast.success('Producto eliminado'); qc.invalidateQueries({ queryKey: ['productos'] }); },
  });

  const saveMut = useMutation({
    mutationFn: (p: any) => p.id ? updateProducto(p.id, p) : createProducto(p),
    onSuccess: () => { toast.success('Producto guardado'); qc.invalidateQueries({ queryKey: ['productos'] }); setModal(null); },
    onError: () => toast.error('Error al guardar'),
  });

  const filtrados = productos.filter(p =>
    !filtro || p.nombre.toLowerCase().includes(filtro.toLowerCase()) || p.codigoBarras?.includes(filtro)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 4 }}>Productos</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{productos.length} productos en catálogo</p>
        </div>
        <button className="btn-primary" onClick={() => setModal({})}>
          <Plus size={16} /> Nuevo producto
        </button>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ position: 'relative', maxWidth: 320 }}>
            <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
            <input value={filtro} onChange={e => setFiltro(e.target.value)} placeholder="Buscar por nombre o código..." className="input-dark" style={{ paddingLeft: 30 }} />
          </div>
        </div>
        {isLoading ? <p style={{ padding: 30, textAlign: 'center', color: 'var(--text-muted)' }}>Cargando...</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Código</th>
                  <th>Categoría</th>
                  <th style={{ textAlign: 'right' }}>Costo</th>
                  <th style={{ textAlign: 'right' }}>Venta</th>
                  <th style={{ textAlign: 'right' }}>Margen</th>
                  <th style={{ textAlign: 'center' }}>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 500 }}>{p.nombre}</td>
                    <td style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--text-muted)' }}>{p.codigoBarras}</td>
                    <td><span className="badge-info">{p.categoriaNombre}</span></td>
                    <td style={{ textAlign: 'right', fontFamily: 'JetBrains Mono' }}>{fmt(p.precioCosto)}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'JetBrains Mono', fontWeight: 700, color: '#00D68F' }}>{fmt(p.precioVenta)}</td>
                    <td style={{ textAlign: 'right', color: p.margenPct >= 30 ? '#00D68F' : '#FFB703', fontWeight: 600 }}>{p.margenPct?.toFixed(1)}%</td>
                    <td style={{ textAlign: 'center' }}><span className={p.activo ? 'badge-ok' : 'badge-danger'}>{p.activo ? 'Activo' : 'Inactivo'}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => setModal(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}><Edit2 size={14} /></button>
                        <button onClick={() => { if (confirm('¿Eliminar producto?')) deleteMut.mutate(p.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E94560', padding: 4 }}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="card" style={{ width: '100%', maxWidth: 480, padding: 28, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>{modal.id ? 'Editar' : 'Nuevo'} producto</h2>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
            </div>
            <form onSubmit={e => { e.preventDefault(); const fd = new FormData(e.currentTarget as HTMLFormElement); saveMut.mutate({ ...modal, nombre: fd.get('nombre'), codigoBarras: fd.get('codigoBarras'), sku: fd.get('sku'), precioCosto: parseFloat(fd.get('precioCosto') as string), precioVenta: parseFloat(fd.get('precioVenta') as string), unidadMedida: fd.get('unidadMedida'), activo: true }); }}>
              <div style={{ display: 'grid', gap: 14 }}>
                {[
                  { name: 'nombre', label: 'Nombre', required: true, defaultValue: modal.nombre },
                  { name: 'codigoBarras', label: 'Código de barras', defaultValue: modal.codigoBarras },
                  { name: 'sku', label: 'SKU', defaultValue: modal.sku },
                  { name: 'precioCosto', label: 'Precio costo', type: 'number', required: true, defaultValue: modal.precioCosto },
                  { name: 'precioVenta', label: 'Precio venta', type: 'number', required: true, defaultValue: modal.precioVenta },
                ].map(f => (
                  <div key={f.name}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 5 }}>{f.label}</label>
                    <input name={f.name} type={f.type || 'text'} required={f.required} defaultValue={f.defaultValue as any} className="input-dark" />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 5 }}>Unidad de medida</label>
                  <select name="unidadMedida" defaultValue={modal.unidadMedida || 'UNIDAD'} className="input-dark">
                    {['UNIDAD','KG','GR','LT','ML','CAJA','PACK'].map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setModal(null)}>Cancelar</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={saveMut.isPending}>
                  {saveMut.isPending ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
