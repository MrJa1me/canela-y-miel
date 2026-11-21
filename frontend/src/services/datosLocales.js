// Datos de ejemplo de la administración.
// En la Fase 4 los servicios pasan a la API real y este archivo deja de usarse.

export const CATEGORIAS = ['Tortas', 'Postres', 'Sin gluten']

// Imágenes reutilizadas del prototipo, copiadas a frontend/public/img.
export const IMAGENES = [
  { archivo: '/img/chocolate.jpg', nombre: 'Torta de chocolate' },
  { archivo: '/img/tartaleta.jpg', nombre: 'Tartaleta' },
  { archivo: '/img/pancakes.png', nombre: 'Pancakes' },
  { archivo: '/img/cheesecake.jpg', nombre: 'Cheesecake' },
  { archivo: '/img/tres_leches.jpg', nombre: 'Tres leches' },
  { archivo: '/img/zanahoria.jpg', nombre: 'Pastel de zanahoria' },
  { archivo: '/img/macarons.jpg', nombre: 'Macarons' },
  { archivo: '/img/mapa.jpg', nombre: 'Mapa' },
]

export const datosProductos = [
  { id: 1, nombre: 'Torta de Chocolate Clásica', categoria: 'Tortas', precio: 35000, stock: 8, imagen: '/img/chocolate.jpg' },
  { id: 2, nombre: 'Tartaleta de Frutos Rojos', categoria: 'Postres', precio: 28000, stock: 12, imagen: '/img/tartaleta.jpg' },
  { id: 3, nombre: 'Pancakes Sin Gluten', categoria: 'Sin gluten', precio: 22000, stock: 15, imagen: '/img/pancakes.png' },
  { id: 4, nombre: 'Cheesecake de Frutos Rojos', categoria: 'Postres', precio: 30000, stock: 6, imagen: '/img/cheesecake.jpg' },
  { id: 5, nombre: 'Tres Leches Clásica', categoria: 'Tortas', precio: 32000, stock: 10, imagen: '/img/tres_leches.jpg' },
  { id: 6, nombre: 'Pastel de Zanahoria', categoria: 'Tortas', precio: 26000, stock: 4, imagen: '/img/zanahoria.jpg' },
  { id: 7, nombre: 'Caja de Macarons Variados (12 uds)', categoria: 'Postres', precio: 42000, stock: 9, imagen: '/img/macarons.jpg' },
]

export const ESTADOS_PEDIDO = [
  'Recibido',
  'En preparación',
  'Listo para despacho',
  'En camino',
  'Entregado',
]

export const datosPedidos = [
  { id: 1001, cliente: 'Camila Rojas', fecha: '2026-11-18', total: 43000, estado: 'Recibido' },
  { id: 1002, cliente: 'Diego Fuentes', fecha: '2026-11-18', total: 36000, estado: 'En preparación' },
  { id: 1003, cliente: 'Valentina Soto', fecha: '2026-11-17', total: 52000, estado: 'Listo para despacho' },
  { id: 1004, cliente: 'Matías Herrera', fecha: '2026-11-17', total: 28000, estado: 'En camino' },
  { id: 1005, cliente: 'Josefa Díaz', fecha: '2026-11-16', total: 70000, estado: 'Entregado' },
  { id: 1006, cliente: 'Tomás Vega', fecha: '2026-11-16', total: 30000, estado: 'Entregado' },
]

export const datosUsuarios = [
  { id: 1, nombre: 'Administrador', correo: 'admin@canelaymiel.cl', rol: 'ADMIN', premium: false },
  { id: 2, nombre: 'Cliente Demo', correo: 'cliente@canelaymiel.cl', rol: 'CLIENTE', premium: false },
  { id: 3, nombre: 'Camila Rojas', correo: 'camila.rojas@correo.cl', rol: 'CLIENTE', premium: true },
  { id: 4, nombre: 'Diego Fuentes', correo: 'diego.fuentes@correo.cl', rol: 'CLIENTE', premium: false },
  { id: 5, nombre: 'Valentina Soto', correo: 'valentina.soto@correo.cl', rol: 'CLIENTE', premium: true },
]

// Ventas de los últimos 7 días para el gráfico del dashboard.
export const ventasSemana = {
  etiquetas: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
  valores: [120000, 185000, 95000, 240000, 310000, 275000, 160000],
}
