import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({ baseURL: '/api', timeout: 15000 });

api.interceptors.request.use((cfg) => {
  const token = useAuthStore.getState().token;
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) useAuthStore.getState().logout();
    return Promise.reject(err);
  }
);

export default api;

// ─── MOCK DATA (activo cuando el backend no está disponible) ───────────────
const MOCK_USERS: Record<string, any> = {
  'admin@sanblas.com': {
    token: 'mock-token-admin',
    email: 'admin@sanblas.com',
    nombreCompleto: 'Carlos Rodríguez',
    rol: 'ADMIN',
    sucursalId: 1,
    sucursalNombre: 'Sucursal Central',
    permisos: ['ADMIN_FULL','POS_ACCESS','STOCK_READ','STOCK_WRITE','PRODUCTOS_READ','PRODUCTOS_WRITE','PROVEEDORES_READ','PROVEEDORES_WRITE','USUARIOS_ADMIN','REPORTES_VENTAS','REPORTES_STOCK','HORARIOS_ADMIN','DASHBOARD_FULL'],
  },
  'cajero1.central@sanblas.com': {
    token: 'mock-token-cajero',
    email: 'cajero1.central@sanblas.com',
    nombreCompleto: 'Diego Fernández',
    rol: 'CAJERO',
    sucursalId: 1,
    sucursalNombre: 'Sucursal Central',
    permisos: ['POS_ACCESS','PRODUCTOS_READ'],
  },
  'repos.central@sanblas.com': {
    token: 'mock-token-repos',
    email: 'repos.central@sanblas.com',
    nombreCompleto: 'Matías Sánchez',
    rol: 'REPOSICION',
    sucursalId: 1,
    sucursalNombre: 'Sucursal Central',
    permisos: ['STOCK_READ','STOCK_WRITE','STOCK_TRANSFER','PRODUCTOS_READ','PRODUCTOS_WRITE','PROVEEDORES_READ','PROVEEDORES_WRITE','REPORTES_STOCK'],
  },
};

const MOCK_PASSWORDS: Record<string, string> = {
  'admin@sanblas.com':           'Admin123!',
  'cajero1.central@sanblas.com': 'Cajero123!',
  'cajero2.central@sanblas.com': 'Cajero123!',
  'cajero.norte@sanblas.com':    'Cajero123!',
  'cajero.sur@sanblas.com':      'Cajero123!',
  'gerencia@sanblas.com':        'Admin123!',
  'repos.central@sanblas.com':   'Repos123!',
  'repos.norte@sanblas.com':     'Repos123!',
  'repos.sur@sanblas.com':       'Repos123!',
};

const MOCK_PRODUCTOS = [
  { id:1, nombre:'Coca-Cola 1.5L', codigoBarras:'7790340001234', sku:'BEB-001', precioCosto:350, precioVenta:600, margenPct:71.4, categoriaNombre:'Bebidas', proveedorNombre:'Bebidas Nacionales SA', unidadMedida:'UNIDAD', activo:true },
  { id:2, nombre:'Sprite 1.5L', codigoBarras:'7790340001235', sku:'BEB-002', precioCosto:340, precioVenta:590, margenPct:73.5, categoriaNombre:'Bebidas', proveedorNombre:'Bebidas Nacionales SA', unidadMedida:'UNIDAD', activo:true },
  { id:3, nombre:'Agua Mineral 500ml', codigoBarras:'7790340001236', sku:'BEB-003', precioCosto:120, precioVenta:250, margenPct:108.3, categoriaNombre:'Bebidas', proveedorNombre:'Bebidas Nacionales SA', unidadMedida:'UNIDAD', activo:true },
  { id:4, nombre:'Arroz Marolio 1kg', codigoBarras:'7790340002001', sku:'ALI-001', precioCosto:350, precioVenta:600, margenPct:71.4, categoriaNombre:'Alimentos', proveedorNombre:'Distribuidora Norte SA', unidadMedida:'KG', activo:true },
  { id:5, nombre:'Aceite Cocinero 1.5L', codigoBarras:'7790340002003', sku:'ALI-003', precioCosto:950, precioVenta:1500, margenPct:57.9, categoriaNombre:'Alimentos', proveedorNombre:'Distribuidora Norte SA', unidadMedida:'UNIDAD', activo:true },
  { id:6, nombre:'Leche La Serenísima 1L', codigoBarras:'7790340003001', sku:'LAC-001', precioCosto:340, precioVenta:580, margenPct:70.6, categoriaNombre:'Lácteos', proveedorNombre:'Lácteos Premium SRL', unidadMedida:'LT', activo:true },
  { id:7, nombre:'Lavandina Ayudín 2L', codigoBarras:'7790340004001', sku:'LIM-001', precioCosto:380, precioVenta:650, margenPct:71.1, categoriaNombre:'Limpieza', proveedorNombre:'Limpieza Total SA', unidadMedida:'LT', activo:true },
  { id:8, nombre:'Papas Fritas Lay\'s 120g', codigoBarras:'7790340006001', sku:'SNA-001', precioCosto:280, precioVenta:480, margenPct:71.4, categoriaNombre:'Snacks', proveedorNombre:'Snack House Argentina', unidadMedida:'UNIDAD', activo:true },
  { id:9, nombre:'Alfajor Milka Doble', codigoBarras:'7790340006002', sku:'SNA-002', precioCosto:180, precioVenta:350, margenPct:94.4, categoriaNombre:'Snacks', proveedorNombre:'Snack House Argentina', unidadMedida:'UNIDAD', activo:true },
  { id:10, nombre:'Shampoo Pantene 750ml', codigoBarras:'7790340005001', sku:'HIG-001', precioCosto:650, precioVenta:1080, margenPct:66.2, categoriaNombre:'Higiene Personal', proveedorNombre:'Alimentos del Sur SRL', unidadMedida:'ML', activo:true },
];

const MOCK_STOCK = MOCK_PRODUCTOS.map((p, i) => ({
  id: i+1, productoId: p.id, productoNombre: p.nombre,
  codigoBarras: p.codigoBarras, sucursalNombre: 'Sucursal Central',
  cantidad: [48,36,120,85,22,48,30,45,80,14][i] ?? 20,
  stockMinimo: 10, stockMaximo: 100, ubicacion: `Góndola ${String.fromCharCode(65+i%5)}${i+1}`,
}));

const MOCK_ALERTAS = MOCK_STOCK.filter(s => s.cantidad <= s.stockMinimo);

const MOCK_KPI = { ventasHoy: 84500, ventasMes: 1245800, alertasStock: MOCK_ALERTAS.length };

const MOCK_VENTAS_SUC = [
  { sucursal:'Sucursal Central', total:524600, cantidad:148 },
  { sucursal:'Sucursal Norte',   total:389200, cantidad:112 },
  { sucursal:'Sucursal Sur',     total:332000, cantidad:98 },
];

const MOCK_RANKING_PROD = [
  { productoId:1, nombre:'Coca-Cola 1.5L',       unidades:312, ingresos:187200 },
  { productoId:9, nombre:'Alfajor Milka Doble',  unidades:287, ingresos:100450 },
  { productoId:3, nombre:'Agua Mineral 500ml',   unidades:265, ingresos:66250 },
  { productoId:8, nombre:'Papas Fritas Lay\'s',  unidades:198, ingresos:95040 },
  { productoId:6, nombre:'Leche Serenísima 1L',  unidades:176, ingresos:102080 },
  { productoId:4, nombre:'Arroz Marolio 1kg',    unidades:154, ingresos:92400 },
  { productoId:2, nombre:'Sprite 1.5L',          unidades:142, ingresos:83780 },
  { productoId:5, nombre:'Aceite Cocinero 1.5L', unidades:98,  ingresos:147000 },
  { productoId:7, nombre:'Lavandina Ayudín 2L',  unidades:87,  ingresos:56550 },
  { productoId:10, nombre:'Shampoo Pantene',     unidades:62,  ingresos:66960 },
];

const MOCK_RANKING_EMP = [
  { empleadoId:3, nombre:'Diego Fernández',   ventas:148, total:524600 },
  { empleadoId:4, nombre:'Sofía Martínez',    ventas:134, total:475200 },
  { empleadoId:5, nombre:'Julián García',     ventas:112, total:389200 },
  { empleadoId:6, nombre:'Valentina Pérez',   ventas:98,  total:332000 },
  { empleadoId:7, nombre:'Matías Sánchez',    ventas:45,  total:158400 },
];

let useMock = false;

async function tryApi<T>(mockFn: () => T, apiFn: () => Promise<T>): Promise<T> {
  if (useMock) return mockFn();
  try {
    return await apiFn();
  } catch {
    useMock = true;
    return mockFn();
  }
}

// ─── AUTH ──────────────────────────────────────────────────────────────────
export async function login(email: string, password: string): Promise<any> {
  try {
    const r = await api.post('/auth/login', { email, password });
    return r.data;
  } catch {
    // fallback mock
    const user = MOCK_USERS[email] ?? Object.values(MOCK_USERS).find((_, i) => Object.keys(MOCK_USERS)[i] === email);
    const correctPass = MOCK_PASSWORDS[email];
    if (user && password === correctPass) return user;
    if (!user) throw new Error('Usuario no encontrado');
    throw new Error('Contraseña incorrecta');
  }
}

// ─── PRODUCTOS ─────────────────────────────────────────────────────────────
export const getProductos = () =>
  tryApi(() => MOCK_PRODUCTOS, () => api.get('/productos').then(r => r.data));

export const searchProductos = (q: string) =>
  tryApi(
    () => MOCK_PRODUCTOS.filter(p => p.nombre.toLowerCase().includes(q.toLowerCase()) || p.codigoBarras.includes(q)),
    () => api.get(`/productos/buscar?q=${encodeURIComponent(q)}`).then(r => r.data)
  );

export const getProductoByBarras = (codigo: string) =>
  tryApi(
    () => {
      const p = MOCK_PRODUCTOS.find(p => p.codigoBarras === codigo);
      if (!p) throw new Error('Producto no encontrado');
      return p;
    },
    () => api.get(`/stock/barras/${codigo}`).then(r => r.data)
  );

export const createProducto = (data: any) =>
  tryApi(() => ({ ...data, id: Date.now(), activo: true }), () => api.post('/productos', data).then(r => r.data));

export const updateProducto = (id: number, data: any) =>
  tryApi(() => ({ ...data, id }), () => api.put(`/productos/${id}`, data).then(r => r.data));

export const deleteProducto = (id: number) =>
  tryApi(() => ({}), () => api.delete(`/productos/${id}`).then(r => r.data));

// ─── STOCK ─────────────────────────────────────────────────────────────────
export const getStockBySucursal = (_id: number) =>
  tryApi(() => MOCK_STOCK, () => api.get(`/stock/sucursal/${_id}`).then(r => r.data));

export const getAlertas = () =>
  tryApi(() => MOCK_ALERTAS, () => api.get('/stock/alertas').then(r => r.data));

export const ajustarStock = (data: any) =>
  tryApi(() => ({ message: 'Stock actualizado (demo)' }), () => api.post('/stock/ajuste', data).then(r => r.data));

// ─── VENTAS ────────────────────────────────────────────────────────────────
export const crearVenta = (data: any) =>
  tryApi(
    () => ({
      id: Date.now(),
      numeroTicket: `TK-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*9999).toString().padStart(4,'0')}`,
      estado: 'COMPLETADA',
      total: data.detalles?.reduce((a: number, d: any) => a + d.cantidad * 600, 0) ?? 0,
      vuelto: 0,
    }),
    () => api.post('/pos/ventas', data).then(r => r.data)
  );

export const getVentasBySucursal = (sucId: number, desde: string, hasta: string) =>
  tryApi(() => [], () => api.get(`/pos/ventas?sucursalId=${sucId}&desde=${desde}&hasta=${hasta}`).then(r => r.data));

// ─── REPORTES ──────────────────────────────────────────────────────────────
export const getKpi = () =>
  tryApi(() => MOCK_KPI, () => api.get('/reportes/kpi').then(r => r.data));

export const getVentasPorSucursal = (_dias = 30) =>
  tryApi(() => MOCK_VENTAS_SUC, () => api.get(`/reportes/ventas-por-sucursal?dias=${_dias}`).then(r => r.data));

export const getRankingProductos = (_dias = 30) =>
  tryApi(() => MOCK_RANKING_PROD, () => api.get(`/reportes/ranking-productos?dias=${_dias}`).then(r => r.data));

export const getRankingEmpleados = (_dias = 30) =>
  tryApi(() => MOCK_RANKING_EMP, () => api.get(`/reportes/ranking-empleados?dias=${_dias}`).then(r => r.data));

