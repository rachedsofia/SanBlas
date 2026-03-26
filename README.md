# 🏬 San Blas — Sistema Integral de Gestión Comercial Multi-Sucursal

> Stack: **Java 21 + Spring Boot 3** · **React 18 + Vite + TypeScript** · **MySQL 8**
> Instalación local directa, sin Docker.

---

## 📋 Requisitos previos

| Herramienta | Versión mínima | Verificar con       |
|-------------|----------------|---------------------|
| Java (JDK)  | 21             | `java -version`     |
| Maven       | 3.9+           | `mvn -version`      |
| Node.js     | 20+            | `node -v`           |
| npm         | 9+             | `npm -v`            |
| MySQL       | 8.0+           | `mysql --version`   |

---

## 🗄️ Paso 1 — Crear la base de datos

```bash
mysql -u root -p < sanblas_db.sql
```

O desde MySQL Workbench: `File → Open SQL Script → sanblas_db.sql → Ejecutar (⚡)`

Esto crea automáticamente: base de datos `sanblas_db`, todas las tablas, vistas, índices
y datos de prueba (3 sucursales, 9 usuarios, 27 productos, ~300 ventas).

---

## ☕ Paso 2 — Configurar y correr el Backend

### 2.1 Configurar MySQL

Editá `backend/src/main/resources/application.properties` y ajustá tus credenciales:

```properties
spring.datasource.username=root
spring.datasource.password=tu_password_mysql
```

Si tu MySQL no corre en el puerto 3306, también ajustá la URL:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/sanblas_db?useSSL=false&serverTimezone=America/Argentina/Buenos_Aires&allowPublicKeyRetrieval=true
```

### 2.2 Ejecutar

```bash
cd backend
mvn clean install -DskipTests   # primera vez, descarga dependencias (~2 min)
mvn spring-boot:run
```

✅ Listo en: **http://localhost:8080/api**

Verificar:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sanblas.com","password":"Admin123!"}'
```

---

## ⚛️ Paso 3 — Correr el Frontend

```bash
cd frontend
npm install        # solo la primera vez
npm run dev
```

✅ Listo en: **http://localhost:5173**

El proxy en `vite.config.ts` ya redirige `/api/*` → `http://localhost:8080` automáticamente.
**No hay nada más que configurar.**

---

## 🔑 Usuarios de prueba

| Rol        | Email                         | Contraseña   | Acceso                        |
|------------|-------------------------------|--------------|-------------------------------|
| Admin      | admin@sanblas.com             | Admin123!    | Todo el sistema               |
| Admin      | gerencia@sanblas.com          | Admin123!    | Todo el sistema               |
| Cajero     | cajero1.central@sanblas.com   | Cajero123!   | Solo punto de venta (POS)     |
| Cajero     | cajero2.central@sanblas.com   | Cajero123!   | Solo punto de venta (POS)     |
| Cajero     | cajero.norte@sanblas.com      | Cajero123!   | Solo punto de venta (POS)     |
| Cajero     | cajero.sur@sanblas.com        | Cajero123!   | Solo punto de venta (POS)     |
| Reposición | repos.central@sanblas.com     | Repos123!    | Stock, productos, proveedores |
| Reposición | repos.norte@sanblas.com       | Repos123!    | Stock, productos, proveedores |
| Reposición | repos.sur@sanblas.com         | Repos123!    | Stock, productos, proveedores |

> La pantalla de login tiene botones de **acceso rápido** para probar cada rol sin escribir las credenciales.

---

## 📁 Estructura del proyecto

```
sanblas/
├── README.md
├── sanblas_db.sql                       ← Script MySQL completo
│
├── backend/                             ← Spring Boot 3 / Java 21
│   ├── pom.xml
│   └── src/main/
│       ├── resources/
│       │   └── application.properties  ← ⚠️ Configurar usuario/pass MySQL aquí
│       └── java/com/sanblas/
│           ├── SanBlasApplication.java
│           ├── config/
│           │   ├── SecurityConfig.java          ← CORS, JWT, RBAC
│           │   └── UserDetailsServiceImpl.java
│           ├── security/
│           │   ├── jwt/JwtService.java
│           │   └── filters/JwtAuthFilter.java
│           ├── domain/
│           │   ├── model/           ← Entidades de dominio (POJOs)
│           │   └── exception/       ← ResourceNotFoundException, BusinessException
│           ├── application/
│           │   ├── dto/request/     ← LoginRequest, VentaRequest, StockAjusteRequest
│           │   ├── dto/response/    ← AuthResponse, VentaResponse
│           │   └── usecase/         ← AuthUseCase, VentaUseCase
│           └── infrastructure/
│               ├── persistence/
│               │   ├── entity/      ← 10 JPA Entities
│               │   └── repository/  ← JPA Repositories con JPQL custom
│               └── web/
│                   ├── controller/  ← Auth, Venta, Stock, Producto, Dashboard
│                   └── advice/      ← GlobalExceptionHandler centralizado
│
└── frontend/                            ← React 18 + Vite + TypeScript
    ├── package.json
    ├── vite.config.ts                   ← Proxy /api → localhost:8080
    ├── tailwind.config.js
    └── src/
        ├── main.tsx
        ├── App.tsx                      ← Routing protegido por permisos
        ├── index.css                    ← Design tokens + utilidades globales
        ├── types/index.ts
        ├── store/authStore.ts           ← Zustand: sesión JWT
        ├── services/api.ts              ← Axios + todos los endpoints
        ├── components/layout/
        │   └── MainLayout.tsx           ← Sidebar + Topbar responsivo
        └── pages/
            ├── LoginPage.tsx            ← Login con acceso rápido por rol
            ├── DashboardPage.tsx        ← KPIs + 5 gráficos Recharts
            ├── POSPage.tsx              ← POS completo con scanner
            ├── StockPage.tsx            ← Stock + scanner de carga + alertas
            ├── ProductosPage.tsx        ← CRUD completo de productos
            ├── ReportesPage.tsx         ← 6 gráficos + tablas de ranking
            ├── ProveedoresPage.tsx
            ├── UsuariosPage.tsx
            └── HorariosPage.tsx         ← Planilla semanal de turnos
```

---

## 🔌 Endpoints principales de la API

```
POST  /api/auth/login                    → Login, devuelve JWT
GET   /api/productos                     → Listado activos
GET   /api/productos/buscar?q=           → Búsqueda por nombre o código
GET   /api/stock/sucursal/:id            → Stock de una sucursal
GET   /api/stock/barras/:codigo          → Producto por código de barras
GET   /api/stock/alertas                 → Productos bajo mínimo
POST  /api/stock/ajuste                  → Entrada / Salida / Ajuste
POST  /api/pos/ventas                    → Registrar venta
GET   /api/pos/ventas                    → Ventas por sucursal y fecha
GET   /api/reportes/kpi                  → Ventas hoy, mes, alertas stock
GET   /api/reportes/ventas-por-sucursal  → ?dias=30
GET   /api/reportes/ranking-productos    → ?dias=30
GET   /api/reportes/ranking-empleados    → ?dias=30
```

Todos los endpoints (menos `/api/auth/login`) requieren:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 🔐 Roles y accesos

| Rol        | Dashboard | POS | Stock | Productos | Proveedores | Usuarios | Horarios | Reportes |
|------------|:---------:|:---:|:-----:|:---------:|:-----------:|:--------:|:--------:|:--------:|
| ADMIN      | ✅        | ✅  | ✅    | ✅        | ✅          | ✅       | ✅       | ✅       |
| CAJERO     | ❌        | ✅  | ❌    | 👁️ ver   | ❌          | ❌       | ❌       | ❌       |
| REPOSICION | ❌        | ❌  | ✅    | ✅        | ✅          | ❌       | ❌       | 📦 stock |

---

## 🎨 Paleta de diseño

```
Fondo base:   #0d0d1a   (azul muy oscuro)
Superficie:   #16213E
Tarjeta:      #1a2744

Acento:       #E94560   (rojo/coral — CTAs, alertas)
Éxito:        #00D68F   (verde neón — stock OK, ventas)
Info:         #00B4D8   (azul — rol cajero)
Warning:      #FFB703   (ámbar — alertas stock, vuelto)

Tipografía:   Plus Jakarta Sans + JetBrains Mono (para códigos/montos)
```

---

## ⚙️ Comandos útiles

```bash
# Backend — build sin tests
mvn clean package -DskipTests

# Frontend — build de producción
cd frontend && npm run build
# Los archivos quedan en frontend/dist/ listos para subir a cualquier servidor web

# MySQL — consultas útiles
mysql -u root -p sanblas_db -e "SELECT * FROM v_ranking_productos LIMIT 5;"
mysql -u root -p sanblas_db -e "SELECT * FROM v_stock_bajo_minimo;"
mysql -u root -p sanblas_db -e "SELECT * FROM v_dashboard_kpi;"
```

---

## 🚨 Problemas comunes

| Error | Solución |
|-------|----------|
| `Communications link failure` | MySQL no está corriendo o credenciales incorrectas en `application.properties` |
| `Table doesn't exist` | El script `sanblas_db.sql` no se ejecutó. Volvé al Paso 1 |
| `Port 8080 already in use` | Cambiar a `server.port=8081` y actualizar el proxy en `vite.config.ts` |
| Error CORS en el navegador | Verificar que `cors.allowed-origins` en `application.properties` incluya la URL del frontend |
| Frontend no llega al backend | Verificar que el backend esté en puerto 8080 y que `vite.config.ts` apunte ahí |

---

## 🛡️ Seguridad implementada

- Contraseñas hasheadas con **BCrypt factor 12**
- Autenticación stateless con **JWT HS256** (expira en 24h)
- Control de acceso granular por permiso en cada endpoint
- Validación de entrada con `@Valid` + Bean Validation en todos los DTOs
- Manejo de errores centralizado — nunca expone stack traces al cliente

---

*San Blas — Sistema Integral de Gestión Comercial v1.0.0*
