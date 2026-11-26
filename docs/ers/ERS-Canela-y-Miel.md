# Especificación de Requisitos de Software (ERS)
## Canela & Miel — Tienda online de pastelería artesanal

**Versión:** 2.0
**Fecha:** 25/11/2026
**Asignatura:** DSY1104 Desarrollo Fullstack II
**Evaluaciones:** Parcial 2 y Parcial 3 (entrega conjunta)
**Equipo:** Canela & Miel

---

## 1. Introducción

### 1.1 Propósito

Este documento especifica los requisitos funcionales y no funcionales del sistema **Canela & Miel**, una tienda online de pastelería artesanal. Sirve como acuerdo entre el equipo, como guía para el desarrollo y como base para la presentación individual.

### 1.2 Alcance

El sistema incluye:

- Catálogo público del caso: 8 categorías, 16 productos con código, descripción y porciones.
- Registro con fecha de nacimiento, código `FELICES50` y correo institucional Duoc.
- Carrito y pedidos con fecha de entrega, dirección, teléfono, mensaje de personalización y envío.
- Descuentos del caso: 50% mayores de 50, 10% FELICES50, cupón y torta de cumpleaños Duoc.
- Perfil editable con avatar, preferencias y cambio de contraseña.
- Seguimiento con stepper, mapa y boleta imprimible.
- Panel de administración: dashboard, inventario, pedidos y usuarios.
- API REST documentada en Swagger.
- Base de datos MySQL en Docker.

Quedan **fuera del alcance**: pasarela de pago real, facturación electrónica, POS, notificaciones de estado en tiempo real, geocodificación de direcciones y subida de archivos.

### 1.3 Definiciones

| Término | Significado |
|---|---|
| API REST | Interfaz HTTP que intercambia datos en JSON |
| CRUD | Crear, leer, actualizar y eliminar |
| JWT | Token firmado que identifica al usuario y su rol |
| Access token | Token de corta duración que viaja en cada petición |
| Refresh token | Token de larga duración que permite renovar el acceso |
| SPA | Aplicación de una sola página construida con React |
| ORM | Capa que traduce objetos Java a tablas (JPA/Hibernate) |
| DTO | Objeto que define lo que entra o sale por la API |
| KPI | Indicador clave del dashboard (ventas, pedidos, etc.) |
| BCrypt | Algoritmo de hash para contraseñas |

### 1.4 Referencias

- Rúbrica de la Evaluación Parcial 2 (DSY1104).
- Rúbrica de la Evaluación Parcial 3 (DSY1104).
- Anexo 2: Documentación de APIs e Integración.
- Anexo 4: Manual de usuario.
- `docs/integracion/documento-integracion.md` de este proyecto.

## 2. Descripción general

### 2.1 Contexto

Canela & Miel es una pastelería artesanal que vende tortas, postres y productos sin azúcar, sin gluten y veganos, en las 8 categorías del caso. El sistema reemplaza el prototipo estático de la Evaluación 1 por una aplicación fullstack: React en el cliente, Spring Boot en el servidor y MySQL como base de datos.

### 2.2 Objetivos

1. Permitir que un cliente compre sin fricción y vea el estado de su pedido.
2. Dar al administrador control de productos, stock y pedidos.
3. Mantener la seguridad mediante roles y tokens.
4. Cumplir los indicadores de las rúbricas de las Evaluaciones 2 y 3.

### 2.3 Actores

| Actor | Descripción | Permisos |
|---|---|---|
| Visitante | Persona sin sesión | Ver catálogo, registrarse, iniciar sesión, validar cupón |
| Cliente | Usuario con rol `CLIENTE` | Comprar, ver sus pedidos, editar su perfil |
| Cliente Premium | Cliente con `premium = true` | Lo anterior + 10% de descuento en productos |
| Cliente Duoc | Cliente con correo `@duoc.cl`, `@duocuc.cl` o `@profesor.duoc.cl` | Torta más barata gratis el día de su cumpleaños, si el pedido trae otro producto pagado |
| Administrador | Usuario con rol `ADMIN` | Todo el panel de administración |

### 2.4 Supuestos y dependencias

- El sistema se ejecuta en un computador con Docker Desktop, JDK 17 y Node.js 20 o superior.
- El navegador es moderno (Chrome, Edge o Firefox actualizados).
- MySQL corre en Docker y el backend se conecta a `localhost:3306`.
- El frontend se sirve en `http://localhost:5173` y el backend en `http://localhost:8080`.

### 2.5 Restricciones

- Stack obligatorio: React 18, Vite, React Router, Bootstrap 5, Spring Boot 3, JPA, Security, JWT y MySQL 8.
- Mínimo 10 pruebas unitarias de frontend con Jasmine y Karma, con reporte de cobertura.
- Entrega de ERS, documento de integración, manual de usuario y evidencias.
- Presentación individual: cada integrante debe explicar su parte.

### 2.6 Requerimientos del caso y alcance acordado

El caso "Pastelería 1000 Sabores" y las dos rúbricas se revisaron antes de programar. El acuerdo completo, con el estado **"pendiente de validar por el docente"**, está en [`docs/alcance.md`](../alcance.md).

| Requerimiento del caso | Decisión | Estado |
|---|---|---|
| 8 categorías y 16 productos con código y descripción | Implementado | Pendiente de validar |
| 50% para mayores de 50 años | Implementado | Pendiente de validar |
| Código FELICES50 (10% de por vida) | Implementado | Pendiente de validar |
| Torta gratis Duoc en el cumpleaños | Implementado: la más barata, con otro producto pagado | Pendiente de validar |
| Filtro por tipo de torta y tamaños | Implementado con categoría + porciones | Pendiente de validar |
| Mensaje de personalización | Implementado, por torta | Pendiente de validar |
| Fecha de entrega y boleta | Implementado con boleta imprimible | Pendiente de validar |
| Compartir, búsqueda y blog | Implementado (blog de demostración) | Pendiente de validar |
| Perfil con preferencias, avatar y recomendaciones | Implementado | Pendiente de validar |

La regla de combinación de descuentos, la definición de "la torta", los avatares y los datos de demostración (porciones, ubicación del mapa, blog) están justificados en `docs/alcance.md`.

## 3. Requisitos funcionales

| ID | Requisito | Descripción | Actor | Prioridad |
|---|---|---|---|---|
| RF-01 | Catálogo público | Mostrar productos con código, nombre, descripción, precio, categoría, porciones, stock e imagen sin exigir sesión | Visitante | Alta |
| RF-02 | Filtros de catálogo | Filtrar por categoría, porciones máximas, rango de precio y búsqueda por nombre o código | Visitante | Media |
| RF-03 | Registro | Crear cuenta con nombre, correo único, contraseña de al menos 6 caracteres, fecha de nacimiento y código promocional opcional; asignar rol `CLIENTE` | Visitante | Alta |
| RF-04 | Inicio de sesión | Validar correo y contraseña con BCrypt y entregar access y refresh token | Todos | Alta |
| RF-05 | Sesión persistente | Mantener la sesión al recargar la página | Cliente / Admin | Alta |
| RF-06 | Renovación de sesión | Renovar el access token con el refresh token cuando vence | Cliente / Admin | Alta |
| RF-07 | Cierre de sesión | Borrar los tokens del navegador y volver al estado público | Cliente / Admin | Alta |
| RF-08 | Carrito | Agregar, quitar y cambiar cantidades de productos | Cliente | Alta |
| RF-09 | Crear pedido | Registrar un pedido con uno o más productos, fecha de entrega, dirección, teléfono y mensaje de la torta; calcular subtotal, descuento, envío y total | Cliente | Alta |
| RF-10 | Descuentos del caso | Aplicar **solo el mayor** entre 50% (mayor de 50 años), 10% (`FELICES50` o Premium) y el porcentaje del cupón | Cliente | Alta |
| RF-11 | Cupones | Validar un código activo (público) y usarlo como candidato a descuento al crear el pedido | Cliente | Alta |
| RF-12 | Stock | Descontar stock al crear el pedido y rechazar si no alcanza | Sistema | Alta |
| RF-13 | Estados del pedido | Avanzar solo al estado siguiente del flujo definido | Administrador | Alta |
| RF-14 | Mis pedidos | Mostrar al cliente únicamente sus propios pedidos | Cliente | Alta |
| RF-15 | Dashboard | Mostrar ventas, pedidos, stock bajo, clientes y ventas de los últimos 7 días | Administrador | Media |
| RF-16 | Inventario | Crear, editar y eliminar productos | Administrador | Alta |
| RF-17 | Pedidos (admin) | Listar, filtrar por estado y avanzar pedidos | Administrador | Alta |
| RF-18 | Usuarios y roles | Listar usuarios y cambiar su rol entre `ADMIN` y `CLIENTE` | Administrador | Alta |
| RF-19 | Restricciones por rol | Ocultar en el frontend lo que el rol no puede usar y validarlo en el backend | Sistema | Alta |
| RF-20 | Datos semilla | Crear roles, estados, categorías, productos, usuarios y cupones al arrancar; completar el catálogo sin borrar datos | Sistema | Media |
| RF-21 | Torta de cumpleaños Duoc | Regalar la torta más barata del pedido a los correos institucionales el día de su cumpleaños, solo si hay otro producto pagado | Cliente Duoc | Alta |
| RF-22 | Perfil propio | Ver y editar nombre, teléfono, dirección, preferencias y avatar; cambiar la contraseña con la actual; solo el dueño de la cuenta | Cliente / Admin | Alta |
| RF-23 | Compartir producto | Copiar el enlace del producto o compartirlo por WhatsApp desde su detalle | Visitante | Media |
| RF-24 | Blog y recetas | Mostrar 3 tarjetas estáticas de recetas y consejos en el Home (contenido de demostración) | Visitante | Baja |
| RF-25 | Boleta | Generar una vista imprimible del pedido con detalle, entrega y totales | Cliente | Media |
| RF-26 | Mapa y entrega | Mostrar la ubicación de la tienda con OpenStreetMap en la confirmación y el seguimiento, junto a la fecha estimada | Cliente | Media |

## 4. Requisitos no funcionales

| ID | Requisito | Criterio de aceptación |
|---|---|---|
| RNF-01 | Usabilidad | Formularios con etiquetas, mensajes de error claros y navegación comprensible |
| RNF-02 | Responsividad | La interfaz se adapta a móvil, tablet y escritorio con Bootstrap |
| RNF-03 | Seguridad | Contraseñas con BCrypt; JWT firmado; roles validados en el backend; CORS restringido a `localhost:5173` |
| RNF-04 | Rendimiento | Las operaciones locales responden en menos de 1 segundo con la base de datos en Docker |
| RNF-05 | Mantenibilidad | Capas controller → service → repository; nombres consistentes; comentarios cortos en español |
| RNF-06 | Pruebas | Mínimo 10 pruebas Jasmine/Karma con cobertura (hoy 52) y pruebas del backend para la lógica de pedidos, reglas y tokens (21) |
| RNF-07 | Portabilidad | Funciona en Windows con Docker, JDK 17 y Node 20+; no depende de rutas absolutas |
| RNF-08 | Accesibilidad | `label` asociado a cada campo, textos alternativos, contraste y foco visible |
| RNF-09 | Persistencia | Los datos sobreviven a reinicios gracias al volumen de Docker |
| RNF-10 | Explicabilidad | Cada integrante puede explicar sus archivos y decisiones en la presentación |

## 5. Reglas de negocio

### 5.1 Productos

Catálogo del caso (8 categorías y 16 productos). Las porciones son un dato de demostración:
el enunciado no entrega tamaños.

| Código | Producto | Categoría | Porciones | Precio |
|---|---|---|---|---|
| TC001 | Torta Cuadrada de Chocolate | Tortas Cuadradas | 20 | $45.000 |
| TC002 | Torta Cuadrada de Frutas | Tortas Cuadradas | 24 | $50.000 |
| TT001 | Torta Circular de Vainilla | Tortas Circulares | 12 | $40.000 |
| TT002 | Torta Circular de Manjar | Tortas Circulares | 16 | $42.000 |
| PI001 | Mousse de Chocolate | Postres Individuales | 1 | $5.000 |
| PI002 | Tiramisú Clásico | Postres Individuales | 1 | $5.500 |
| PSA001 | Torta Sin Azúcar de Naranja | Productos Sin Azúcar | 12 | $48.000 |
| PSA002 | Cheesecake Sin Azúcar | Productos Sin Azúcar | 10 | $47.000 |
| PT001 | Empanada de Manzana | Pastelería Tradicional | 1 | $3.000 |
| PT002 | Tarta de Santiago | Pastelería Tradicional | 8 | $6.000 |
| PG001 | Brownie Sin Gluten | Productos Sin Gluten | 1 | $4.000 |
| PG002 | Pan Sin Gluten | Productos Sin Gluten | 8 | $3.500 |
| PV001 | Torta Vegana de Chocolate | Productos Vegana | 12 | $50.000 |
| PV002 | Galletas Veganas de Avena | Productos Vegana | 12 | $4.500 |
| TE001 | Torta Especial de Cumpleaños | Tortas Especiales | 30 | $55.000 |
| TE002 | Torta Especial de Boda | Tortas Especiales | 40 | $60.000 |

### 5.2 Cálculo del pedido

1. **Subtotal** = suma de `precio unitario × cantidad`.
2. **Torta gratis Duoc** = precio de la torta más barata del pedido, solo si el cliente tiene correo institucional, hoy es su cumpleaños y el pedido trae al menos otro producto pagado.
3. **Base** = subtotal − torta gratis.
4. **Descuento porcentual** = **el mayor** entre: 50% (mayor de 50 años), 10% (`FELICES50` o Premium) y el porcentaje del cupón. Nunca se suman.
5. **Envío** = $8.000 fijo.
6. **Total** = subtotal − torta gratis − descuento porcentual + envío.

Los valores se redondean a peso entero (sin decimales). El frontend usa la misma fórmula en
`calcularTotales.js` para mostrar el resumen antes de confirmar.

### 5.3 Stock

- Al crear el pedido se valida que cada producto tenga stock suficiente.
- Si no alcanza, se rechaza con **409** y no se descuenta nada.
- El descuento se hace dentro de una transacción: si un producto falla, se revierte todo.
- Al eliminar un pedido, las unidades vuelven al stock.

### 5.4 Estados

```
Recibido → En preparación → Listo para despacho → En camino → Entregado
```

- Solo se permite avanzar al estado inmediatamente siguiente.
- Un pedido entregado no tiene siguiente.
- El cambio de estado es exclusivo del `ADMIN`.

### 5.5 Cupones

- El código no distingue mayúsculas de minúsculas.
- Debe existir y estar activo.
- El porcentaje va entre 1 y 100.
- `GET /cupones/validar/{codigo}` es público y solo devuelve el porcentaje, para que el checkout muestre el resumen correcto.
- El cupón compite con los otros descuentos: se aplica solo si es el mayor.

## 6. Modelo de datos

| Entidad | Campos principales | Relaciones |
|---|---|---|
| `Rol` | id, nombre (ADMIN/CLIENTE) | 1 rol → muchos usuarios |
| `Usuario` | id, nombre, correo único, password (BCrypt), teléfono, dirección, fecha de nacimiento, código promocional, correo institucional, preferencias, avatar, premium, activo | Muchos usuarios → 1 rol |
| `Categoria` | id, nombre único | 1 categoría → muchos productos |
| `Producto` | id, código único, nombre, descripción, precio, stock, porciones, imagen, activo | Muchos productos → 1 categoría |
| `Pedido` | id, fecha, fecha de entrega, dirección, teléfono, subtotal, descuento, envio, total | 1 cliente → muchos pedidos; 1 estado → muchos pedidos; 1 cupón → muchos pedidos |
| `DetallePedido` | id, cantidad, precio unitario, subtotal, mensaje | Muchos detalles → 1 pedido; muchos detalles → 1 producto |
| `EstadoPedido` | id, nombre único, orden único | 1 estado → muchos pedidos |
| `Cupon` | id, código único, porcentaje, activo | 1 cupón → muchos pedidos |

Diagrama simplificado:

```
Rol 1 ─── * Usuario 1 ─── * Pedido 1 ─── * DetallePedido * ─── 1 Producto * ─── 1 Categoria
                              │
                              ├── 1 EstadoPedido
                              └── 0..1 Cupon
```

## 7. Arquitectura

### 7.1 Vista general

```
React 18 + Vite (5173)
        │  HTTP / JSON + JWT
        ▼
Spring Boot 3 (8080): Controller → Service → Repository
        │  JPA / Hibernate
        ▼
MySQL 8 (3306, Docker)  ──  Adminer (8081)
```

### 7.2 Frontend

| Elemento | Tecnología |
|---|---|
| Framework | React 18 |
| Build | Vite 5 |
| Rutas | React Router 6 |
| Estilos | Bootstrap 5 + `variables.css` |
| Estado global | Context API (`AuthContext`) |
| Llamadas HTTP | Capa `services/` con `fetch` |

### 7.3 Backend

| Elemento | Tecnología |
|---|---|
| Lenguaje | Java 17 |
| Framework | Spring Boot 3.5 |
| Persistencia | Spring Data JPA / Hibernate |
| Seguridad | Spring Security + JWT (jjwt) + BCrypt |
| Documentación | springdoc-openapi (Swagger) |
| Build | Maven Wrapper |

### 7.4 Estructura de carpetas

```
backend/src/main/java/cl/canelaymiel/
├─ config/       Semilla, password, OpenAPI
├─ controller/   Endpoints REST
├─ service/      Lógica de negocio
├─ repository/   Acceso a datos
├─ model/        Entidades JPA
├─ dto/          Request y Response
├─ security/     JWT, filtro y reglas
└─ exception/    Errores y manejador global

frontend/src/
├─ components/   NavBar, Footer, layouts, ProtectedRoute
├─ pages/        cliente y admin
├─ context/      AuthContext
├─ services/     api, auth, product, category, order, user, session
├─ utils/        utilidades compartidas
└─ styles/       variables y estilos globales
```

## 8. API REST

La API se documenta en detalle en `docs/integracion/documento-integracion.md` y en Swagger (`/swagger-ui.html`). Hoy expone **33 operaciones**.

| Recurso | Operaciones |
|---|---|
| Autenticación | registro, login, refresh, perfil |
| Productos | listar, obtener, crear, actualizar, eliminar |
| Categorías | listar, obtener, crear, actualizar, eliminar |
| Pedidos | listar, obtener, crear, cambiar estado, eliminar |
| Usuarios | listar, obtener, crear, actualizar, eliminar, ver mi perfil, editar mi perfil, cambiar mi contraseña |
| Cupones | listar, obtener, crear, actualizar, eliminar, validar por código (público) |

## 9. Seguridad

- **Contraseñas:** se guardan con BCrypt; nunca se devuelven en las respuestas.
- **Access token:** 15 minutos; contiene correo, rol, nombre e id.
- **Refresh token:** 7 días; solo sirve para renovar.
- **Filtro JWT:** valida la firma en cada petición y carga el usuario desde la base para respetar cambios de rol o desactivación.
- **Reglas por ruta:** catálogo y validación de cupón públicos; pedidos y `/usuarios/me` con sesión; usuarios, cupones y mutaciones del catálogo solo para `ADMIN`.
- **Reglas por fila:** un `CLIENTE` solo ve y crea pedidos propios y solo edita su propio perfil; si intenta otro, recibe **403**.
- **CORS:** solo `http://localhost:5173`.
- **Frontend:** `ProtectedRoute` y menús condicionados por rol; el backend igual valida.

## 10. Pruebas y calidad

### 10.1 Backend

**21 pruebas unitarias** con JUnit y Mockito (`mvn clean verify`):

| Clase | Qué verifica |
|---|---|
| `PedidoServiceTest` (9) | Descuento 10%, 50%, FELICES50, combinación con cupón, torta Duoc, torta única sin regalo, fecha pasada, stock insuficiente y salto de estado |
| `ReglasClienteTest` (4) | Edad, mayoría de 50, cumpleaños por día/mes y correos institucionales |
| `UsuarioServiceTest` (5) | Edición del perfil, limpieza de campos, avatar inválido y cambio de contraseña |
| `JwtServiceTest` (3) | Token de acceso, refresh y firma ajena |

### 10.2 Frontend

**52 pruebas** con Jasmine + Karma, con mocks de `localStorage` y espías de funciones:

| Archivo | Qué cubre |
|---|---|
| `test/components/` | `FormField`, `ProductCard` y `Avatar` (props, render y eventos) |
| `test/context/CartContext.spec.jsx` | Carrito, `localStorage` y mensaje por producto |
| `test/utils/calcularTotales.spec.js` | Envío, Premium, 50%, FELICES50, cupón, solo el mayor y torta gratis |
| `test/utils/descuentos.spec.js` | Edad, cumpleaños, correo institucional y beneficios del usuario |
| `test/utils/filtros.spec.js` | Categoría, precio, porciones, búsqueda por nombre/código y recomendaciones |
| `test/utils/validators.spec.js` | Correo, teléfono chileno, largos y contraseñas |
| `test/utils/formatPrice.spec.js` | Formato de pesos |
| `test/utils/avatares.spec.js` | Iniciales y lista de avatares |
| `test/utils/agruparEnFilas.spec.js` | Agrupación para el carrusel |
| `test/utils/tienda.spec.js` | URL del mapa de OpenStreetMap |

Comando del reporte: `npm run test:coverage` (genera `frontend/coverage/`). Última medición sobre el código cubierto por las pruebas: **93,65% de sentencias, 88,57% de ramas y 96,36% de líneas**.

### 10.3 Pruebas manuales de aceptación

1. Instalación desde cero: clonar, copiar `.env.example`, `docker compose up -d`, backend y frontend.
2. Registro con fecha de nacimiento y código `FELICES50`; registro con correo `@duoc.cl`.
3. Login, recarga de la página con sesión activa y renovación del token.
4. Cliente no puede entrar a `/admin` ni ver pedidos ajenos; `/usuarios/me` solo edita su cuenta.
5. Admin crea, edita y elimina un producto, una categoría y un cupón.
6. Pedido de mayor de 50, con FELICES50, con cupón, de cumpleaños Duoc y combinación: se aplica solo el mayor.
7. Fecha de entrega pasada y pedido sin stock → error, sin cambios.
8. Cambio de estado fuera de orden → error; eliminar pedido → stock restaurado.
9. Perfil: editar datos, elegir avatar, guardar preferencias y cambiar contraseña.
10. Catálogo: filtros por categoría, porciones y precio; búsqueda por nombre y código; compartir.
11. Confirmación: fecha de entrega, mapa, boleta imprimible y seguimiento con stepper.
12. Cierre de sesión y vuelta al estado público.

## 11. Despliegue y operación

1. `Copy-Item .env.example .env` y ajustar claves.
2. `docker compose up -d` → MySQL y Adminer.
3. `cd backend && .\mvnw.cmd spring-boot:run` → API y Swagger.
4. `cd frontend && npm.cmd install && npm.cmd run dev` → aplicación.

Usuarios de prueba:

| Rol | Correo | Contraseña |
|---|---|---|
| ADMIN | admin@canelaymiel.cl | Admin1234 |
| CLIENTE (Premium) | cliente@canelaymiel.cl | Cliente1234 |

> `docker compose down -v` elimina el volumen y todos los datos. Al arrancar de nuevo se recrean los datos semilla.

## 12. Trazabilidad con la rúbrica

| Indicador | Dónde se cumple | Estado |
|---|---|---|
| EP2 — Proyecto con framework JS (IE2.1.1) | React + Vite + Router, estructura por capas | Cumplido |
| EP2 — Componentes con props/estados y Bootstrap (IE2.1.2) | Componentes del admin, `NavBar`, `ProtectedRoute`, grillas y tablas responsivas | Cumplido |
| EP2 — 10 pruebas unitarias (IE2.2.x) | `frontend/test/` | Cumplido: 52 pruebas |
| EP2 — Proceso de testeo y cobertura (IE2.3.x) | Configuración Karma + reporte | Cumplido: `npm run test:coverage` |
| EP3 — Backend, base de datos, lógica y modelos (IE3.1.1) | Entidades, servicios y MySQL | Cumplido |
| EP3 — API REST con CRUD y Swagger (IE3.2.1) | 33 operaciones documentadas | Cumplido |
| EP3 — Integración frontend–backend (IE3.2.2) | Capa `services/` y pantallas reales | Cumplido |
| EP3 — Roles y JWT (IE3.3.1) | `security/` y `/auth` | Cumplido |
| EP3 — Sesión persistente (IE3.3.2) | `AuthContext` + refresh | Cumplido |
| EP3 — Restricciones por rol (IE3.3.3) | `ProtectedRoute` + reglas del backend | Cumplido |
| Documentos | Integración, ERS, manual y cobertura | Integración y ERS actualizados; manual por actualizar capturas; reporte de cobertura generado |

## 13. Riesgos y trabajo pendiente

| Riesgo o pendiente | Impacto | Mitigación |
|---|---|---|
| Manual de usuario y cobertura | Indicadores de la EP2/EP3 | El manual existe en `docs/` y hay que actualizar sus capturas; el reporte de cobertura se genera con `npm run test:coverage` |
| Mapa de demostración | El pin no corresponde a una dirección real del negocio | Está marcado como demostración en `src/config/tienda.js` y en pantalla |
| Notificaciones de estado | No hay aviso en tiempo real | El seguimiento se actualiza al recargar; documentado en el alcance |
| Boleta | Depende del diálogo de impresión del navegador | Se probó el contenido y los estilos `@media print`; el documento no tiene valor tributario |
| Refresh token sin revocación | Un token robado sirve 7 días | Aceptado para el alcance; se podría agregar una tabla de revocación |
| Token en `localStorage` | Vulnerable a XSS | No se inyecta HTML de terceros; se podría migrar a cookie `httpOnly` |
| `ddl-auto=update` | Cambios de esquema sin control | Usar migraciones (Flyway) en un entorno real |
| Datos de demostración | El dashboard se ve vacío sin pedidos | Crear pedidos durante la presentación |
| Dependencia de Docker | Sin Docker no hay base de datos | El README explica la instalación y el volumen |

## 14. Glosario de archivos clave

| Archivo | Función |
|---|---|
| `backend/config/DatosSemilla.java` | Crea los datos iniciales |
| `backend/service/PedidoService.java` | Totales, descuentos, torta Duoc, stock y estados |
| `backend/service/ReglasCliente.java` | Edad, cumpleaños, correo institucional y avatares |
| `backend/security/JwtService.java` | Firma y valida tokens |
| `backend/security/ConfiguracionSeguridad.java` | Reglas de acceso y CORS |
| `frontend/services/api.js` | Única salida HTTP y renovación |
| `frontend/context/AuthContext.jsx` | Sesión global y persistencia |
| `frontend/utils/calcularTotales.js` | La misma fórmula de totales que el backend |
| `frontend/config/tienda.js` | Ubicación de demostración para el mapa |
| `frontend/components/MapaTienda.jsx` | Mapa público de OpenStreetMap |
| `frontend/components/ProtectedRoute.jsx` | Rutas con sesión y rol |
| `docker-compose.yml` | MySQL y Adminer |
| `docs/integracion/documento-integracion.md` | Detalle de la API |
