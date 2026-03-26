// ProveedoresPage.tsx
export default function ProveedoresPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 4 }}>Proveedores</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Gestión de proveedores y órdenes de compra</p>
      </div>
      <div className="card" style={{ padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🚚</div>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Módulo de Proveedores</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 400, margin: '0 auto' }}>
          Este módulo incluye: listado de proveedores, alta/edición, órdenes de compra, historial de recepciones y seguimiento de pagos. Conectar al endpoint <code style={{ fontFamily: 'JetBrains Mono', background: 'var(--bg-surface)', padding: '2px 6px', borderRadius: 4 }}>/api/proveedores</code>
        </p>
      </div>
    </div>
  );
}
