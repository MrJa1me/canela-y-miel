// Datos de la tienda. La ubicación es de demostración: el caso no entrega una dirección.
export const TIENDA = {
  nombre: "Canela & Miel",
  direccion: "Calle del Sabor 123, Barrio Dulce, Santiago",
  latitud: -33.4489,
  longitud: -70.6693,
  demostracion: true,
};

// Mapa embebido de OpenStreetMap: no necesita clave ni librerías.
export function urlMapa() {
  const delta = 0.008;
  const bbox = [
    TIENDA.longitud - delta,
    TIENDA.latitud - delta,
    TIENDA.longitud + delta,
    TIENDA.latitud + delta,
  ]
    .map((valor) => valor.toFixed(4))
    .join("%2C");

  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${TIENDA.latitud}%2C${TIENDA.longitud}`;
}

// Enlace para abrir el mapa completo en otra pestaña.
export function urlMapaCompleto() {
  return `https://www.openstreetmap.org/?mlat=${TIENDA.latitud}&mlon=${TIENDA.longitud}#map=16/${TIENDA.latitud}/${TIENDA.longitud}`;
}
