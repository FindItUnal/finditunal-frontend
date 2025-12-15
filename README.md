<p align="center">
  <h1 align="center">🔍 FindIt UNAL - Frontend</h1>
  <p align="center">
    <strong>Aplicación web moderna para la gestión de objetos perdidos y encontrados en la Universidad Nacional de Colombia</strong>
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS"/>
  <img src="https://img.shields.io/badge/React_Query-5.90-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" alt="React Query"/>
  <img src="https://img.shields.io/badge/Zustand-5.0-433E38?style=for-the-badge&logo=react&logoColor=white" alt="Zustand"/>
</p>

---

## 📑 Tabla de Contenidos

- [📖 Descripción](#-descripción)
- [✨ Características](#-características)
- [🖼️ Capturas de Pantalla](#️-capturas-de-pantalla)
- [🛠️ Tecnologías](#️-tecnologías)
- [📋 Requisitos Previos](#-requisitos-previos)
- [🚀 Instalación](#-instalación)
- [⚙️ Configuración](#️-configuración)
- [▶️ Ejecución](#️-ejecución)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🗺️ Rutas y Páginas](#️-rutas-y-páginas)
- [🎨 Sistema de Diseño](#-sistema-de-diseño)
- [🔌 Integración con Backend](#-integración-con-backend)
- [🐳 Docker](#-docker)
- [🤝 Contribución](#-contribución)
- [📄 Licencia](#-licencia)

---

## 📖 Descripción

**FindIt UNAL Frontend** es una aplicación web Single Page Application (SPA) desarrollada con React y TypeScript que proporciona una interfaz de usuario intuitiva y moderna para el sistema de gestión de objetos perdidos y encontrados de la Universidad Nacional de Colombia.

La aplicación permite a los miembros de la comunidad universitaria:
- 📝 Reportar objetos perdidos o encontrados
- 🔍 Buscar y filtrar objetos
- 💬 Comunicarse con otros usuarios en tiempo real
- 🔔 Recibir notificaciones instantáneas
- 👤 Gestionar su perfil y reportes

---

## ✨ Características

### Para Usuarios

| Característica | Descripción |
|----------------|-------------|
| 🔐 **Autenticación Google** | Login seguro con correo institucional `@unal.edu.co` |
| 📝 **Gestión de Reportes** | Crear, editar y eliminar reportes de objetos |
| 🔍 **Búsqueda Avanzada** | Filtros por categoría, ubicación, estado y fecha |
| 💬 **Chat en Tiempo Real** | Mensajería instantánea con otros usuarios |
| 🔔 **Notificaciones** | Alertas en tiempo real de mensajes y actividad |
| 📱 **Diseño Responsivo** | Experiencia optimizada en móviles y desktop |
| 🌙 **Tema Oscuro/Claro** | Soporte para preferencias de tema del sistema |

### Para Administradores

| Característica | Descripción |
|----------------|-------------|
| 📊 **Dashboard** | Estadísticas y métricas del sistema |
| 👥 **Gestión de Usuarios** | Administrar usuarios y permisos |
| 📋 **Gestión de Reportes** | Moderar y administrar reportes |
| 🚨 **Sistema de Quejas** | Revisar y resolver quejas |
| 📜 **Logs de Actividad** | Registro de acciones administrativas |

---

## 🖼️ Capturas de Pantalla

> *Próximamente: capturas de la aplicación en funcionamiento*

---

## 🛠️ Tecnologías

### Core

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **React** | 18.3 | Biblioteca UI basada en componentes |
| **TypeScript** | 5.5 | Tipado estático para JavaScript |
| **Vite** | 5.4 | Build tool ultrarrápido |

### Estilizado

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **TailwindCSS** | 3.4 | Framework CSS utility-first |
| **Lucide React** | 0.344 | Iconos SVG modernos |

### Estado y Data Fetching

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **TanStack Query** | 5.90 | Gestión de estado del servidor |
| **Zustand** | 5.0 | Gestión de estado global |

### Routing y UI

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **React Router DOM** | 7.9 | Enrutamiento declarativo |
| **Radix UI** | 1.1 | Componentes accesibles |

### Comunicación

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **Socket.IO Client** | 4.8 | WebSockets para tiempo real |
| **Supabase** | 2.57 | Cliente de servicios cloud |

### Desarrollo

| Tecnología | Descripción |
|------------|-------------|
| **ESLint** | Linting de código |
| **PostCSS** | Procesamiento de CSS |
| **Autoprefixer** | Prefijos CSS automáticos |

---

## 📋 Requisitos Previos

Asegúrate de tener instalado:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git**

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/finditunal-frontend.git
cd finditunal-frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita el archivo `.env` según tus necesidades (ver [Configuración](#️-configuración)).

---

## ⚙️ Configuración

Crea un archivo `.env` en la raíz del proyecto:

```env
# ===========================================
# 🔧 Configuración de la Aplicación
# ===========================================

# URL del Backend API
VITE_API_URL=http://localhost:3000

# URL del WebSocket Server
VITE_WS_URL=http://localhost:3000

# ===========================================
# 🔑 Google OAuth
# ===========================================
VITE_GOOGLE_CLIENT_ID=tu_google_client_id.apps.googleusercontent.com

# ===========================================
# 🌐 Supabase (Opcional)
# ===========================================
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

### Variables de Entorno

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `VITE_API_URL` | ✅ | URL base del backend API |
| `VITE_WS_URL` | ✅ | URL del servidor WebSocket |
| `VITE_GOOGLE_CLIENT_ID` | ✅ | Client ID de Google OAuth |
| `VITE_SUPABASE_URL` | ❌ | URL de Supabase (si se usa) |
| `VITE_SUPABASE_ANON_KEY` | ❌ | Anon key de Supabase |

---

## ▶️ Ejecución

### Desarrollo

```bash
npm run dev
```

La aplicación se abrirá en `http://localhost:5173` con Hot Module Replacement (HMR).

### Producción

```bash
# Compilar para producción
npm run build

# Vista previa del build
npm run preview
```

### Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor de desarrollo con HMR |
| `npm run build` | Compila la aplicación para producción |
| `npm run preview` | Vista previa del build de producción |
| `npm run lint` | Ejecuta ESLint |
| `npm run typecheck` | Verifica tipos de TypeScript |

---

## 📁 Estructura del Proyecto

```
finditunal-frontend/
├── 📂 public/                   # Archivos estáticos públicos
├── 📂 src/
│   ├── 📂 assets/               # Imágenes y recursos estáticos
│   │   ├── 📄 icon_unal.svg
│   │   └── 📄 image_102-removebg-preview 3.svg
│   │
│   ├── 📂 components/           # Componentes React
│   │   ├── 📂 atoms/            # Componentes básicos (Button, Input, etc.)
│   │   ├── 📂 molecules/        # Componentes compuestos
│   │   ├── 📂 organisms/        # Componentes complejos
│   │   ├── 📂 templates/        # Layouts y plantillas
│   │   └── 📄 AppInitializer.tsx
│   │
│   ├── 📂 context/              # Contextos de React
│   │   ├── 📄 ThemeContext.tsx
│   │   └── 📄 ToastContext.tsx
│   │
│   ├── 📂 data/                 # Datos mock y constantes
│   │   └── 📄 chats.ts
│   │
│   ├── 📂 hooks/                # Custom hooks
│   │   ├── 📄 useAuth.ts
│   │   ├── 📄 useCategories.ts
│   │   ├── 📄 useConversations.ts
│   │   ├── 📄 useMessages.ts
│   │   ├── 📄 useObjects.ts
│   │   ├── 📄 useProfile.ts
│   │   ├── 📄 useSocketIO.ts
│   │   └── 📄 ...
│   │
│   ├── 📂 lib/                  # Configuraciones de librerías
│   │   └── 📄 queryClient.ts
│   │
│   ├── 📂 pages/                # Páginas/Vistas
│   │   ├── 📄 AdminDashboardPage.tsx
│   │   ├── 📄 AdminReportsPage.tsx
│   │   ├── 📄 AdminUsersPage.tsx
│   │   ├── 📄 DashboardPage.tsx
│   │   ├── 📄 LandingPage.tsx
│   │   ├── 📄 LoginPage.tsx
│   │   ├── 📄 MessagesPage.tsx
│   │   ├── 📄 ObjectDetailPage.tsx
│   │   ├── 📄 ProfilePage.tsx
│   │   └── 📄 ...
│   │
│   ├── 📂 routes/               # Configuración de rutas
│   │   ├── 📄 AppRoutes.tsx
│   │   ├── 📄 PrivateRoute.tsx
│   │   └── 📄 index.ts
│   │
│   ├── 📂 services/             # Servicios API
│   │   ├── 📄 authService.ts
│   │   ├── 📄 reportService.ts
│   │   ├── 📄 chatService.ts
│   │   └── 📄 ...
│   │
│   ├── 📂 store/                # Estado global (Zustand)
│   │   ├── 📄 useGlobalStore.ts
│   │   └── 📄 useUserStore.ts
│   │
│   ├── 📂 types/                # Definiciones de tipos TypeScript
│   │   └── 📄 index.ts
│   │
│   ├── 📂 utils/                # Funciones utilitarias
│   │   ├── 📄 dateUtils.ts
│   │   ├── 📄 imageUtils.ts
│   │   ├── 📄 stringUtils.ts
│   │   ├── 📄 userUtils.ts
│   │   └── 📄 validation.ts
│   │
│   ├── 📄 App.tsx               # Componente raíz
│   ├── 📄 main.tsx              # Punto de entrada
│   ├── 📄 index.css             # Estilos globales
│   └── 📄 vite-env.d.ts         # Tipos de Vite
│
├── 📄 index.html                # HTML principal
├── 📄 package.json
├── 📄 tailwind.config.js        # Configuración de Tailwind
├── 📄 postcss.config.js         # Configuración de PostCSS
├── 📄 vite.config.ts            # Configuración de Vite
├── 📄 tsconfig.json             # Configuración de TypeScript
├── 📄 eslint.config.js          # Configuración de ESLint
├── 📄 Dockerfile                # Imagen Docker
├── 📄 nginx.conf                # Configuración de Nginx
└── 📄 README.md
```

---

## 🗺️ Rutas y Páginas

### Rutas Públicas

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | `LandingPage` | Página de inicio/bienvenida |
| `/login` | `LoginPage` | Inicio de sesión con Google |
| `/auth/callback` | `AuthCallbackPage` | Callback de OAuth |
| `/banned` | `BannedPage` | Usuario suspendido |

### Rutas Protegidas (Usuario)

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/dashboard` | `DashboardPage` | Panel principal con listado de objetos |
| `/object/:id` | `ObjectDetailPage` | Detalle de un objeto/reporte |
| `/messages` | `MessagesPage` | Chat y conversaciones |
| `/profile` | `ProfilePage` | Perfil del usuario |

### Rutas Protegidas (Administrador)

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/admin` | `AdminDashboardPage` | Dashboard de administrador |
| `/admin/reports` | `AdminReportsPage` | Gestión de reportes |
| `/admin/users` | `AdminUsersPage` | Gestión de usuarios |

---

## 🎨 Sistema de Diseño

### Arquitectura de Componentes

El proyecto sigue el patrón **Atomic Design**:

```
Atoms → Molecules → Organisms → Templates → Pages
```

| Nivel | Descripción | Ejemplos |
|-------|-------------|----------|
| **Atoms** | Componentes básicos e indivisibles | Button, Input, Icon, Badge |
| **Molecules** | Combinación de átomos | SearchBar, Card, FormField |
| **Organisms** | Secciones complejas | Header, Sidebar, ObjectList |
| **Templates** | Layouts de página | DashboardLayout, AuthLayout |
| **Pages** | Vistas completas | DashboardPage, ProfilePage |

### Tema y Colores

La aplicación soporta tema claro y oscuro utilizando CSS variables y TailwindCSS:

```css
/* Ejemplo de variables de tema */
:root {
  --color-primary: #3b82f6;
  --color-secondary: #10b981;
  --color-background: #ffffff;
  --color-text: #1f2937;
}

.dark {
  --color-background: #111827;
  --color-text: #f9fafb;
}
```

### Iconografía

Se utiliza **Lucide React** para iconos consistentes y accesibles:

```tsx
import { Search, Bell, User, MessageCircle } from 'lucide-react';
```

---

## 🔌 Integración con Backend

### Cliente API

Los servicios de API se encuentran en `src/services/`:

```typescript
// Ejemplo de servicio
export const reportService = {
  getAll: () => fetch('/api/reports').then(res => res.json()),
  getById: (id: string) => fetch(`/api/reports/${id}`).then(res => res.json()),
  create: (data: ReportData) => fetch('/api/reports', {
    method: 'POST',
    body: JSON.stringify(data),
  }).then(res => res.json()),
};
```

### React Query

Gestión de estado del servidor con TanStack Query:

```typescript
// Ejemplo de hook
export const useReports = () => {
  return useQuery({
    queryKey: ['reports'],
    queryFn: reportService.getAll,
  });
};
```

### WebSocket (Socket.IO)

Comunicación en tiempo real:

```typescript
// Hook de Socket.IO
const { socket, isConnected } = useSocketIO();

// Escuchar eventos
socket?.on('message:new', (message) => {
  // Manejar nuevo mensaje
});
```

---

## 🐳 Docker

### Construcción de imagen

```bash
docker build -t finditunal-frontend .
```

### Ejecutar contenedor

```bash
docker run -p 80:80 finditunal-frontend
```

### Configuración Nginx

El proyecto incluye un archivo `nginx.conf` optimizado para SPA:

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 📊 Performance

### Optimizaciones Incluidas

- ⚡ **Code Splitting** automático con Vite
- 🗜️ **Tree Shaking** de dependencias no utilizadas
- 📦 **Lazy Loading** de rutas y componentes
- 🖼️ **Optimización de imágenes**
- 📋 **Caché de queries** con React Query

### Lighthouse Score Objetivo

| Métrica | Objetivo |
|---------|----------|
| Performance | > 90 |
| Accessibility | > 95 |
| Best Practices | > 95 |
| SEO | > 90 |

---

## 🧪 Testing

> *Próximamente: configuración de testing con Vitest y React Testing Library*

```bash
# Ejecutar tests (cuando esté configurado)
npm run test

# Coverage
npm run test:coverage
```

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Por favor, sigue estos pasos:

### Proceso de Contribución

1. **Fork** el repositorio
2. **Crea** una rama para tu feature:
   ```bash
   git checkout -b feature/NuevaCaracteristica
   ```
3. **Desarrolla** siguiendo las convenciones del proyecto
4. **Commit** tus cambios:
   ```bash
   git commit -m 'Add: nueva característica'
   ```
5. **Push** a la rama:
   ```bash
   git push origin feature/NuevaCaracteristica
   ```
6. **Abre** un Pull Request

### Convenciones de Código

- Utiliza **TypeScript** estricto
- Sigue las reglas de **ESLint**
- Nombra componentes en **PascalCase**
- Nombra hooks con prefijo **use**
- Documenta props con **JSDoc** cuando sea necesario

### Convenciones de Commits

| Prefijo | Uso |
|---------|-----|
| `Add:` | Nueva funcionalidad |
| `Fix:` | Corrección de bugs |
| `Update:` | Actualizaciones menores |
| `Refactor:` | Refactorización de código |
| `Style:` | Cambios de estilo/UI |
| `Docs:` | Documentación |
| `Test:` | Tests |

---

## 📄 Licencia

Este proyecto es de uso privado para la Universidad Nacional de Colombia.

---

## 🔗 Enlaces Útiles

- [Backend Repository](../finditunal-backend)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Vite Documentation](https://vitejs.dev/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)

---

<p align="center">
  Desarrollado con ❤️ para la comunidad de la <strong>Universidad Nacional de Colombia</strong>
</p>

<p align="center">
  <a href="#-tabla-de-contenidos">⬆️ Volver arriba</a>
</p>

