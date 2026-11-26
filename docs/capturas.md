# Capturas para el manual de usuario y el documento de cobertura

La interfaz quedó **congelada** al cerrar la Fase 8. Toma estas capturas sin cambiar estilos, textos ni datos.
Este archivo no reemplaza el manual: es la lista para que Anaís lo actualice.

## Preparación

- Navegador a ~1440 px de ancho, zoom 100 %, tema claro (Chrome o Edge).
- MySQL, backend y frontend encendidos (`docker compose up -d`, `mvnw spring-boot:run`, `npm run dev`).
- Usuarios:
  - `admin@canelaymiel.cl` / `Admin1234` (ADMIN).
  - `cliente@canelaymiel.cl` / `Cliente1234` (CLIENTE Premium).
  - `maria@duoc.cl` / `Cliente1234` (FELICES50 y correo Duoc).
  - `pedro@correo.cl` / `Cliente1234` (mayor de 50).
  - `mostrador@canelaymiel.cl` / `Cliente1234` (cliente para el POS).
  - `ui.duoc.19fa88@duoc.cl` / `Clave1234` (cumpleaños hoy, avatar y preferencias).
- Pedidos: en una **base nueva** la semilla crea 14 pedidos de los últimos 7 días. En la base actual existen
  el #3 y el #6; usa los que aparezcan en el panel.
- Para la boleta impresa: entrar al pedido, pulsar **Ver boleta** y capturar la vista previa de impresión.
- Las capturas del panel (`/admin`, inventario, pedidos y usuarios) deben tomarse **después** de los últimos
  cambios del mostrador y las búsquedas.

## Lista de capturas

| # | Pantalla | URL | Usuario | Qué debe verse |
|---|---|---|---|---|
| 1 | Inicio | `/` | Visitante | Hero con promociones, categorías, favoritos, beneficios, historia, blog y CTA |
| 2 | Catálogo | `/catalogo` | Visitante | Filtros de búsqueda, categoría, tamaño y precio, con 16 productos |
| 3 | Búsqueda | `/catalogo` (buscar `tc001`) | Visitante | Un solo producto y el texto "1 producto" |
| 4 | Filtro por tamaño | `/catalogo` (Hasta 8 porciones) | Visitante | 6 productos y el filtro seleccionado |
| 5 | Detalle de torta | `/producto/1` | Visitante | Código, descripción, porciones, mensaje, compartir y relacionados |
| 6 | Carrito | `/carrito` | `ui.duoc` | Mensaje de la torta y resumen con la torta gratis |
| 7 | Checkout | `/checkout` | `ui.duoc` | Fecha de entrega, dirección, teléfono, cupón y resumen |
| 8 | Confirmación | `/confirmacion` (después de comprar) | `ui.duoc` | Fecha, mapa, boleta y botones |
| 9 | Boleta impresa | Confirmación → Ver boleta | `ui.duoc` | Vista previa de impresión solo con la boleta |
| 10 | Seguimiento | `/seguimiento` | `ui.duoc` | Stepper de 5 estados, entrega estimada, dirección y mapa |
| 11 | Registro | `/registro` | Visitante | Fecha de nacimiento, código promocional y aviso FELICES50 |
| 12 | Inicio de sesión | `/login` | Visitante | Formulario limpio |
| 13 | Perfil | `/perfil` | `ui.duoc` | Datos, avatar, beneficios, contraseña, preferencias e historial |
| 14 | Edición del perfil | `/perfil` → Editar | `ui.duoc` | Formulario con los 6 avatares y vista previa |
| 15 | Panel admin | `/admin` | `admin@...` | KPIs, gráfico, últimos pedidos y stock bajo |
| 16 | Mostrador (POS) | `/admin/mostrador` | `admin@...` | Productos, pedido en curso, cliente, retiro y total |
| 17 | Inventario | `/admin/inventario` | `admin@...` | Tabla con búsqueda y filtro de stock bajo |
| 18 | Pedidos | `/admin/pedidos` | `admin@...` | Búsqueda, entrega y botón de estado |
| 19 | Usuarios | `/admin/usuarios` | `admin@...` | Búsqueda, Premium y rol |
| 20 | Swagger | `http://localhost:8080/swagger-ui.html` | — | Los 6 grupos, las 33 operaciones y el botón Authorize |
| 21 | Swagger autorizado | Igual, tras `POST /auth/login` + Authorize | ADMIN | El diálogo con "Authorized" |
| 22 | Swagger 403 | `GET /usuarios` con token CLIENTE | CLIENTE | Respuesta 403 |
| 23 | Swagger registro | `POST /auth/registro` con FELICES50 y fecha | — | Respuesta 201 con el usuario creado |

## Documento de cobertura (Anaís)

1. En `frontend/`: `npm run test:coverage` (si no hay Chrome, usar Edge con `CHROME_BIN`).
2. Abrir `frontend/coverage/index.html` y capturar el resumen: **52 pruebas** y **93,65 % de sentencias / 88,57 % de ramas / 96,36 % de líneas**.
3. Agregar que el backend tiene **21 pruebas** (`mvn clean verify`).
4. El informe cubre componentes (`FormField`, `ProductCard`, `Avatar`), el carrito con `localStorage`, los cálculos de descuentos, los filtros, los validadores y las utilidades.

## Lo que debe actualizar Anaís

- Reemplazar las capturas del manual por las de esta lista (la paleta y la tipografía cambiaron).
- Agregar las secciones nuevas: Home, perfil editable, mapa, boleta y seguimiento.
- No editar el código; si una captura no coincide con la app, avisar antes de tomarla.
