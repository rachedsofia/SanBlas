export default function UsuariosPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 4 }}>Usuarios</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Gestión de usuarios y roles del sistema</p>
      </div>
      <div className="card" style={{ padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Módulo de Usuarios</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 440, margin: '0 auto' }}>
          Alta, baja y modificación de usuarios. Asignación de roles (Admin, Cajero, Reposición). Asignación de sucursal. Reset de contraseña. Solo visible para administradores.
        </p>
        <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          {['ADMIN', 'CAJERO', 'REPOSICION'].map(r => (
            <span key={r} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 600, color: r === 'ADMIN' ? '#E94560' : r === 'CAJERO' ? '#00D68F' : '#00B4D8' }}>
              {r}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
