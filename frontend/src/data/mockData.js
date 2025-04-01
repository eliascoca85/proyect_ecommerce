export const productos = [
  {
    id_producto: 1,
    nombre: 'Laptop Gaming',
    descripcion: 'Potente laptop para gaming con gráficos de última generación',
    precio: 1299.99,
    precio_oferta: 1099.99,
    stock: 10,
    id_marca: 1,
    marca_nombre: 'TechPro',
    imagen: '/img/productos/laptop.jpg'
  },
  // Más productos...
];

export const marcas = [
  { id_marca: 1, nombre: 'TechPro', logo: '/img/marcas/techpro.png' },
  // Más marcas...
];

export const carritoItems = [
  {
    id_detalle_carrito: 1,
    id_carrito: 1,
    id_producto: 1,
    cantidad: 1,
    precio_unitario: 1099.99,
    total: 1099.99,
    nombre: 'Laptop Gaming',
    imagen: '/img/productos/laptop.jpg',
    marca_nombre: 'TechPro'
  },
  // Más items...
]; 