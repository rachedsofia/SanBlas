export interface User {
  id: number;
  email: string;
  nombreCompleto: string;
  rol: 'ADMIN' | 'CAJERO' | 'REPOSICION';
  sucursalId: number | null;
  sucursalNombre: string;
  permisos: string[];
  token: string;
}

export interface Producto {
  id: number;
  nombre: string;
  codigoBarras: string;
  sku: string;
  precioCosto: number;
  precioVenta: number;
  margenPct: number;
  categoriaNombre: string;
  proveedorNombre: string;
  unidadMedida: string;
  activo: boolean;
  imagenUrl?: string;
}

export interface StockItem {
  id: number;
  productoId: number;
  productoNombre: string;
  codigoBarras: string;
  sucursalNombre: string;
  cantidad: number;
  stockMinimo: number;
  stockMaximo: number;
  ubicacion: string;
}

export interface CarritoItem {
  productoId: number;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  codigoBarras: string;
}

export interface Venta {
  id: number;
  numeroTicket: string;
  estado: string;
  sucursal: string;
  cajero: string;
  subtotal: number;
  total: number;
  metodoPago: string;
  montoRecibido: number;
  vuelto: number;
  fecha: string;
  detalles: DetalleVenta[];
}

export interface DetalleVenta {
  productoId: number;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface KPI {
  ventasHoy: number;
  ventasMes: number;
  alertasStock: number;
}

export interface VentaSucursal {
  sucursal: string;
  total: number;
  cantidad: number;
}

export interface RankingProducto {
  productoId: number;
  nombre: string;
  unidades: number;
  ingresos: number;
}

export interface RankingEmpleado {
  empleadoId: number;
  nombre: string;
  ventas: number;
  total: number;
}
