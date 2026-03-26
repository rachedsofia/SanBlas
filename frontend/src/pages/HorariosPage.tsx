export default function HorariosPage() {
  const dias = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
  const empleados = ['Diego Fernández', 'Sofía Martínez', 'Julián García', 'Valentina Pérez', 'Matías Sánchez', 'Lucía Torres'];
  const turnos: Record<string, string> = { 'Diego Fernández-0': 'M', 'Diego Fernández-1': 'M', 'Sofía Martínez-0': 'T', 'Sofía Martínez-2': 'T', 'Julián García-1': 'M', 'Julián García-3': 'M', 'Valentina Pérez-0': 'M', 'Valentina Pérez-4': 'M', 'Matías Sánchez-1': 'C', 'Lucía Torres-2': 'C' };
  const colores: Record<string, string> = { M: '#00B4D8', T: '#FFB703', N: '#a855f7', C: '#00D68F' };
  const labels: Record<string, string> = { M: 'Mañana', T: 'Tarde', N: 'Noche', C: 'Completo' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 4 }}>Control de Horarios</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Semana actual · Vista planilla</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {Object.entries(labels).map(([k, v]) => (
            <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: colores[k] }} /> {v}
            </span>
          ))}
        </div>
      </div>

      <div className="card" style={{ overflow: 'auto' }}>
        <table style={{ minWidth: 600 }}>
          <thead>
            <tr>
              <th style={{ minWidth: 140 }}>Empleado</th>
              {dias.map(d => <th key={d} style={{ textAlign: 'center', minWidth: 80 }}>{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {empleados.map(emp => (
              <tr key={emp}>
                <td style={{ fontWeight: 500, fontSize: 13 }}>{emp}</td>
                {dias.map((_, di) => {
                  const turno = turnos[`${emp}-${di}`];
                  return (
                    <td key={di} style={{ textAlign: 'center', padding: '10px 8px' }}>
                      {turno ? (
                        <span style={{
                          display: 'inline-block', padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                          background: `${colores[turno]}20`, color: colores[turno], border: `1px solid ${colores[turno]}40`,
                        }}>
                          {labels[turno]}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: 18 }}>—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
        {[
          { label: 'Turnos hoy', value: '6', color: '#00D68F' },
          { label: 'Ausencias semana', value: '0', color: '#E94560' },
          { label: 'Horas sem. estimadas', value: '264 hs', color: '#00B4D8' },
          { label: 'Empleados activos', value: '6', color: '#FFB703' },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding: 16 }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{k.label}</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
