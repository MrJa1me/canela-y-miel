# Alcance acordado — Caso Pastelería 1000 Sabores

**Proyecto:** Canela & Miel (DSY1104 Desarrollo Fullstack II, EP2 + EP3)
**Fecha del acuerdo:** 25-11-2026
**Rama de trabajo:** `feature/nicolas-adaptar-caso` (aún sin crear)
**Integrantes:** Nicolás (esta ronda), Anaís (pruebas Jasmine/Karma y manual de usuario)

> **Estado de validación:** ninguno de los requerimientos de este documento fue validado todavía por el docente.
> Todo queda como **"pendiente de validar"** hasta que el equipo lo confirme con el profesor.
> El caso permite expresamente recortar alcance ("no todos los requerimientos se deben realizar").

## 1. Cómo se leyó el alcance

Se revisaron el caso (`base/caso/caso-pasteleria-mil-sabores.pdf`), la rúbrica EP2 y la rúbrica EP3.
La rúbrica EP3 no premia funcionalidades sueltas: premia que el backend y su lógica sean **"acordes a los
requerimientos del cliente"** (IE3.1.1), el CRUD en Swagger, la integración, JWT con roles, la sesión
persistente y las restricciones por rol. Por eso el orden de trabajo prioriza lo obligatorio y deja el
pulido visual al final.

## 2. Requerimientos del caso

| Requerimiento del caso | Decisión | Detalle acordado | Estado |
|---|---|---|---|
| 8 categorías y 16 productos con código y precio | **Se implementa** | Catálogo exacto del PDF (TC001…TE002), más `codigo` y `descripcion` en `Producto` | Pendiente de validar |
| Mayores de 50 años: 50% en todos los productos | **Se implementa** | Se pide `fechaNacimiento` obligatoria en el registro; la edad se calcula desde esa fecha | Pendiente de validar |
| Código FELICES50: 10% de por vida | **Se implementa** | `codigoPromocional` opcional en el registro. No crea un descuento nuevo: activa el 10% que ya representa `premium` y queda registrado el código para mostrarlo en el perfil | Pendiente de validar |
| Torta gratis para estudiantes Duoc en su cumpleaños | **Se implementa** | Correos válidos: `@duoc.cl`, `@duocuc.cl`, `@profesor.duoc.cl`. Aplica solo el día y mes de cumpleaños. Se regala **la torta de menor precio** del pedido y **solo si hay al menos otro producto pagado**; si el pedido es solo esa torta, no aplica | Pendiente de validar |
| Combinación de descuentos (50%, FELICES50, cupón) | **Se aplica solo el mayor** | Nunca se suman. La torta gratis se resta del subtotal primero y luego se aplica el mayor descuento porcentual sobre el saldo | Pendiente de validar |
| Filtro por tipo de torta (cuadrada/circular) | **Se implementa** | Sale de la categoría (Tortas Cuadradas / Tortas Circulares); no se crea otra estructura | Pendiente de validar |
| Filtro por tamaños | **Se implementa simplificado** | Campo entero `porciones` por producto y filtro "hasta X porciones". Los valores son **dato de demostración** (el caso no los entrega) | Pendiente de validar |
| Mensaje de personalización en tortas | **Se implementa** | Campo `mensaje` por línea de pedido, visible en el detalle y en el checkout | Pendiente de validar |
| Fecha de entrega preferida | **Se implementa** | `fechaEntrega` en el pedido; el backend rechaza fechas pasadas | Pendiente de validar |
| Boleta | **Se implementa simple** | Vista imprimible del pedido desde la confirmación con estilos de impresión (`window.print()`) | Pendiente de validar |
| Seguimiento del pedido | **Se mantiene y se mejora** | Stepper ya existente + mapa + fecha de entrega. **Sin** notificaciones en tiempo real: el estado se actualiza al recargar | Pendiente de validar |
| Compartir productos en redes | **Se implementa simple** | Copiar enlace + compartir por WhatsApp desde el detalle | Pendiente de validar |
| Búsqueda de productos | **Se implementa simple** | Filtro por nombre o código en el catálogo (en el cliente, sin endpoint nuevo) | Pendiente de validar |
| Blog / recetas | **Se implementa estático** | 3 tarjetas de contenido de demostración en el Home, rotuladas como dato de demostración. Sin backend ni CRUD | Pendiente de validar |
| Perfil: actualizar datos y preferencias | **Se implementa** | Endpoints `/api/v1/usuarios/me` (GET/PUT) y preferencias guardadas en el backend; el perfil edita con validaciones | Pendiente de validar |
| Cambiar contraseña | **Se implementa** | Contraseña actual + nueva, con BCrypt | Pendiente de validar |
| Foto de perfil | **Avatares predefinidos** | 6 avatares locales (SVG propios) elegidos por el usuario; sin subida de archivos, sin carpeta `uploads/` | Pendiente de validar |
| Recomendaciones personalizadas | **Se mantienen** | Ya existen en el cliente según historial y preferencias | Cumple hoy |
| Impacto comunitario, historia y origen | **Se implementa en el Home** | Contenido tomado del enunciado del caso (50 años, récord Guinness 1995) | Pendiente de validar |
| Registro y autenticación, carrito, pedidos, roles | **Se mantienen** | Ya implementados (JWT + refresh, sesión persistente, restricciones por rol, carrito con stock) | Cumple hoy |

## 3. Descuentos: regla única

Orden del cálculo de un pedido:

1. Subtotal = suma de precio × cantidad.
2. Si corresponde torta gratis Duoc (cumpleaños + correo institucional + al menos otro producto pagado), se resta el precio de la torta más barata del pedido.
3. Descuento porcentual = **el mayor** entre: 50% (mayor de 50 años), 10% (`premium`/FELICES50) y el cupón ingresado.
4. Total = subtotal − torta gratis − descuento + envío de $8.000.

La misma fórmula debe dar el mismo resultado en el backend y en el frontend (`calcularTotales.js`).
Los cupones `MIEL10` (activo) y `CANELA20` (inactivo) se conservan porque sostienen el CRUD de Swagger;
`premium` también se conserva y FELICES50 se apoya en él para no duplicar el 10%.

## 4. Mejoras de estilo y experiencia

| Mejora | Decisión | Detalle |
|---|---|---|
| Marca | **Se mantiene "Canela & Miel"** | No se renombra el proyecto ni los identificadores técnicos |
| Paleta y tipografías | **Se adopta la del caso, con una excepción** | Fondo `#FFF5E1`, acentos `#FFC0CB` y `#8B4513`, texto `#5D4037`; `#B0BEC5` solo en detalles por contraste; **Lato + Playfair Display** en vez de Pacifico, porque Pacifico superponía letras en tamaños pequeños |
| Carrusel de productos | **Se implementa** | Carrusel de Bootstrap ya existente, reutilizado para tarjetas de producto en Home y relacionados |
| Home más completa | **Se implementa** | Hero con promociones, 8 categorías, destacados, beneficios, historia, impacto comunitario, blog, CTA FELICES50 y footer |
| Mapa | **Se implementa con `iframe` de OpenStreetMap** | Sin librerías ni claves. Ubicación de demostración: Santiago centro, Plaza de Armas (−33.4489 / −70.6693) en `src/config/tienda.js`, rotulada como dato de demostración |
| Animaciones | **CSS propio** | Un solo archivo `animaciones.css`, 200–400 ms, hover con elevación, fade-in con `IntersectionObserver` y `prefers-reduced-motion` |
| Skeletons | **Se implementan** | Estados de carga en catálogo, detalle, perfil y seguimiento |

## 5. Fuera de alcance (documentado)

- Notificaciones push o en tiempo real del estado del pedido.
- Geocodificación de la dirección del cliente y ruta del repartidor.
- Pasarela de pago real (el pedido se confirma sin pago en línea).
- Blog con backend, comentarios o CRUD.
- Subida real de archivos (foto de perfil por avatares; sin `uploads/`).
- Librerías de animación, mapas con clave o componentes de UI adicionales.

## 6. Supuestos y datos de demostración

- **Porciones** por producto: valores inventados y rotulados como demostración.
- **Ubicación del mapa:** Santiago centro, demostración.
- **Blog/recetas:** contenido estático de demostración.
- **Dirección y teléfono:** hoy el Checkout los valida pero no los envía; se guardarán en el pedido (necesarios para boleta y entrega). Es una corrección, no un requerimiento nuevo.
- **Base de datos existente:** la semilla se vuelve incremental; crea lo que falta y desactiva los 7 productos viejos sin borrarlos, para no romper pedidos históricos.

## 7. Criterios de aceptación del alcance

1. `mvn clean verify` y `npm test` pasan.
2. Swagger muestra todas las operaciones, incluidas las nuevas, y "Authorize" funciona con ADMIN y con CLIENTE.
3. Un pedido de un mayor de 50, uno con FELICES50, uno con cupón y uno de cumpleaños Duoc dan el total esperado, con prueba automatizada.
4. El backend arranca en un PC limpio copiando `.env.example` a `.env`, sin editar código.
5. El ERS y el documento de integración reflejan el catálogo y las reglas reales.
6. La interfaz queda congelada al terminar: las capturas del manual se toman al final.
