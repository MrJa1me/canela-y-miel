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

Abre `.env` y cambia las claves si quieres. El archivo `.env` nunca se sube a Git.

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
  - Usuario: `canela`
  - Contraseña: `canela123`
  - Base de datos: `canela_miel`

> `docker compose down -v` **borra el volumen y todos los datos**. Usa `docker compose down` para apagar sin perder nada.

### 3. Backend

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

- API: <http://localhost:8080>
- Swagger: <http://localhost:8080/swagger-ui.html>

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

Se crean al arrancar el backend (Fase 2).

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
| Cupones | `GET/POST /cupones` · `GET/PUT/DELETE /cupones/{id}` |

Reglas de negocio de un pedido: subtotal → 10% Premium → cupón sobre el saldo → envío de $8.000.
El stock se descuenta al crear y se devuelve al eliminar. Los estados solo avanzan de a uno.

### Acceso y roles

- **Público:** catálogo (`GET /productos`, `GET /categorias`), registro, login, refresh y Swagger.
- **CLIENTE:** crea pedidos para su propia cuenta y ve solo los suyos.
- **ADMIN:** crea/edita/elimina productos y categorías, administra usuarios y cupones, y cambia estados.
- El token de acceso dura **15 minutos** y el refresh **7 días**. Van en `Authorization: Bearer <token>`.
- La clave para firmar los tokens está en `JWT_SECRET` (`.env`).
- En Swagger: ejecuta `POST /auth/login`, copia el `token` y pégalo en **Authorize**.

## Estructura

```
canela-y-miel/
├─ base/                  Referencia del curso (no se edita ni se entrega)
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
