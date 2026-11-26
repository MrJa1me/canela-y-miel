# Canela & Miel

Tienda online de pastelería artesanal para el proyecto de **DSY1104 Desarrollo Fullstack II**.
Incluye frontend en React, backend en Spring Boot y base de datos MySQL en Docker.

## Requisitos

- JDK 17
- Node.js 20 o superior
- Docker Desktop encendido

## Puesta en marcha (en este orden)

### 1. Variables de entorno

En la raíz del proyecto:

```powershell
Copy-Item .env.example .env
```

Abre `.env` y cambia las claves si quieres. El backend **lee ese mismo `.env`** al arrancar
(`spring.config.import=optional:file:../.env[.properties]` en `application.properties`), así que no hay
que duplicar valores ni configurar variables en Windows. El archivo `.env` nunca se sube a Git.

`MYSQL_PASSWORD` (la usa el contenedor) y `DB_PASSWORD` (la usa el backend) **deben tener el mismo valor**.

| Variable | Para qué sirve | Valor por defecto |
|---|---|---|
| `MYSQL_ROOT_PASSWORD` | Clave de root de MySQL en Docker | Ninguno, la eliges |
| `MYSQL_DATABASE` | Nombre de la base que crea Docker | `canela_miel` |
| `MYSQL_USER` | Usuario que crea Docker | `canela` |
| `MYSQL_PASSWORD` | Clave de ese usuario en MySQL | Ninguno, la eliges |
| `DB_URL` | URL JDBC que usa el backend | `jdbc:mysql://localhost:3306/canela_miel?...` |
| `DB_USER` | Usuario del backend | `canela` |
| `DB_PASSWORD` | Clave del backend (igual a `MYSQL_PASSWORD`) | Ninguno, la eliges |
| `JWT_SECRET` | Firma de los tokens (mínimo 32 caracteres) | Ninguno, es obligatoria |
| `SERVER_PORT` | Puerto del backend | `8080` |
| `JWT_ACCESS_MINUTOS` | Duración del token de acceso | `15` |
| `JWT_REFRESH_DIAS` | Duración del refresh token | `7` |

### 2. Base de datos

```powershell
docker compose up -d
docker compose ps
```

Debes ver `canela-mysql` como `healthy` y `canela-adminer` arriba.

- MySQL: `localhost:3306`
- Adminer (interfaz web): <http://localhost:8081>
  - Sistema: `MySQL`
  - Servidor: `mysql`
  - Usuario: `MYSQL_USER` (por defecto `canela`)
  - Contraseña: `MYSQL_PASSWORD` (por defecto `cambia_esta_clave`)
  - Base de datos: `MYSQL_DATABASE` (por defecto `canela_miel`)

> `docker compose down -v` **borra el volumen y todos los datos**. Usa `docker compose down` para apagar sin perder nada.

### 3. Backend

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

- API: <http://localhost:8080>
- Swagger: <http://localhost:8080/swagger-ui.html>

> El backend lee el `.env` de la raíz. Si falta, no arranca y muestra `Could not resolve placeholder 'DB_PASSWORD'`: vuelve al paso 1.

### 4. Frontend

En otra terminal:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

- Aplicación: <http://localhost:5173>

> En PowerShell, `npm` puede estar bloqueado por la política de scripts. Usa `npm.cmd` y `npx.cmd`.

## Usuarios de prueba

Se crean al arrancar el backend con la base vacía.

| Rol | Correo | Contraseña | Nota |
|---|---|---|---|
| ADMIN | admin@canelaymiel.cl | Admin1234 | Acceso al panel |
| CLIENTE | cliente@canelaymiel.cl | Cliente1234 | Premium: 10% de descuento |

Cupón de prueba: `MIEL10` (10%, activo). `CANELA20` existe, pero está inactivo.

## API

Base: `http://localhost:8080/api/v1` · Documentación: <http://localhost:8080/swagger-ui.html>

| Recurso | Endpoints |
|---|---|
| Autenticación | `POST /auth/registro` · `POST /auth/login` · `POST /auth/refresh` · `GET /auth/perfil` |
| Productos | `GET/POST /productos` · `GET/PUT/DELETE /productos/{id}` |
| Categorías | `GET/POST /categorias` · `GET/PUT/DELETE /categorias/{id}` |
| Pedidos | `GET/POST /pedidos` · `GET/DELETE /pedidos/{id}` · `PATCH /pedidos/{id}/estado` |
| Usuarios | `GET/POST /usuarios` · `GET/PUT/DELETE /usuarios/{id}` |
| Cupones | `GET/POST /cupones` · `GET/PUT/DELETE /cupones/{id}` · `GET /cupones/validar/{codigo}` (público) |

Reglas de negocio de un pedido: subtotal → torta gratis de cumpleaños Duoc (si aplica) → **solo el mayor**
descuento (50% mayor de 50, 10% FELICES50/Premium, cupón) → envío de $8.000.

El registro pide **fecha de nacimiento** (obligatoria) y un **código promocional** opcional (`FELICES50`).
Los correos `@duoc.cl`, `@duocuc.cl` y `@profesor.duoc.cl` reciben la torta más barata gratis el día de su
cumpleaños. El pedido guarda fecha de entrega, dirección, teléfono y el mensaje de personalización de las tortas.

El stock se descuenta al crear y se devuelve al eliminar. Los estados solo avanzan de a uno.

### Acceso y roles

- **Público:** catálogo (`GET /productos`, `GET /categorias`), registro, login, refresh, validar cupón y Swagger.
- **CLIENTE:** crea pedidos para su propia cuenta y ve solo los suyos.
- **ADMIN:** crea/edita/elimina productos y categorías, administra usuarios y cupones, y cambia estados.
- El token de acceso dura **15 minutos** y el refresh **7 días**. Van en `Authorization: Bearer <token>`.
- La clave para firmar los tokens está en `JWT_SECRET` (`.env`).
- En Swagger: ejecuta `POST /auth/login`, copia el `token` y pégalo en **Authorize**.

### Sesión en el frontend

- Al iniciar sesión se guardan `canela.token`, `canela.refreshToken` y `canela.usuario` en `localStorage`.
- Al recargar, `AuthContext` valida la sesión con `GET /auth/perfil`.
- Si el token de acceso venció (401), `api.js` lo renueva con `/auth/refresh` y repite la petición una sola vez.
- Si el refresh también falla, se cierra la sesión y el guard manda a `/login`.
- `/admin` exige rol **ADMIN**; Perfil, Checkout y Seguimiento exigen tener sesión.

## Documentos

- [Documento de integración](docs/integracion/documento-integracion.md)
- [ERS final](docs/ers/ERS-Canela-y-Miel.md)
- [Manual de usuario](docs/Manual-de-usuario-Canela-y-Miel.docx) (capturas por actualizar)
- Reporte de cobertura de testing: pendiente (lo prepara la otra integrante).

## Estructura

```
canela-y-miel/
├─ base/                  Referencia del curso (en .gitignore: no se versiona ni se entrega)
├─ backend/               Spring Boot 3 + Java 17 + Maven
├─ frontend/              React 18 + Vite + React Router + Bootstrap 5
├─ docs/                  Documentos de la entrega (Fase 5)
├─ docker-compose.yml     MySQL 8 + Adminer
├─ .env.example
└─ README.md
```

### Frontend

```
frontend/src/
├─ components/            NavBar, Footer y layouts
├─ pages/cliente/         Páginas de la tienda
├─ pages/admin/           Páginas del administrador
├─ context/               Contextos de React (sesión y carrito)
├─ services/              Llamadas a la API (nunca fetch dentro de un componente)
├─ utils/
└─ styles/                variables.css y estilos globales
```

### Backend

```
backend/src/main/java/cl/canelaymiel/
├─ config/
├─ controller/
├─ service/
├─ repository/
├─ model/
├─ dto/
├─ security/
└─ exception/
```
