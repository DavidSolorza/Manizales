# Especificación técnica: plataforma de arriendos universitarios

## 1. Resumen del proyecto

Aplicación donde estudiantes de una ciudad universitaria pueden publicar y buscar lugares de arriendo económicos, con fotos, descripción, precio y ubicación en mapa. Login con cuenta de Google para poder publicar.

**Estrategia de plataformas**: se construye primero la página web (es donde se valida la idea más rápido). La arquitectura se piensa desde el día uno para que, cuando llegue el momento de hacer la app móvil, no se reescriba la lógica de negocio desde cero, solo se construyan las pantallas nativas reutilizando lo que ya existe.

## 2. Por qué un monorepo (la clave de la escalabilidad)

La forma más simple de lograr "web ahora, móvil después sin duplicar trabajo" es separar el proyecto en dos tipos de carpetas:

- **`apps/`**: lo que el usuario final ve y toca. Cada app (web, móvil, backend) tiene su propia interfaz, pero **no contiene lógica de negocio propia**.
- **`packages/`**: el cerebro de la aplicación. Reglas de negocio, llamadas a la API, hooks de React. Esto es lo que web y móvil **comparten al 100%**.

React Native (la tecnología estándar para apps móviles con React) usa los mismos hooks, el mismo manejo de estado y las mismas llamadas a la API que React web; lo único que cambia son los componentes visuales (`<View>` en vez de `<div>`, por ejemplo). Si desde ahora separas "qué hace la app" de "cómo se ve", cuando construyas la app móvil el 70-80% del trabajo (lógica, validaciones, llamadas al backend) ya está hecho.

Herramienta para manejar el monorepo: **pnpm workspaces** + **Turborepo** (gratis, simple de configurar, evita instalar dependencias duplicadas).

## 3. Stack tecnológico

- **Web** (prioridad ahora): React + Vite + TypeScript
- **Móvil** (fase futura): React Native con Expo (mismo lenguaje, mismo paradigma de hooks que la web)
- **Backend**: Node.js + NestJS + TypeScript
- **Base de datos**: PostgreSQL
- **ORM**: Prisma (solo en la capa de infraestructura del backend)
- **Autenticación**: Google OAuth 2.0 + JWT propio para las sesiones (funciona igual para web y para móvil, el backend no distingue de dónde viene el login)
- **Almacenamiento de imágenes**: Cloudinary
- **Mapas**: Leaflet + OpenStreetMap en web (en móvil más adelante sería `react-native-maps`, también compatible con OpenStreetMap)

## 4. Principios de arquitectura aplicados

**Arquitectura en capas (por módulo del backend):**

```
Presentación    -> Controllers
Aplicación      -> Services / Use cases
Dominio         -> Entidades, value objects, reglas de negocio puras
Infraestructura -> Prisma, Cloudinary, Google Auth, etc.
```

**SOLID aplicado:**

- **S**: `ListingService` solo orquesta lógica de publicaciones, no sabe nada de imágenes ni de autenticación.
- **O**: si cambias Cloudinary por S3, solo creas una nueva implementación de `IImageStorageService`, no tocas el resto.
- **L**: cualquier implementación de `IListingRepository` (Prisma, en memoria para tests) debe poder reemplazar a otra sin romper nada.
- **I**: interfaces específicas por agregado (`IListingRepository`, `IUserRepository`), no una interfaz gigante genérica.
- **D**: los services dependen de interfaces inyectadas, nunca de la clase concreta de Prisma o Cloudinary.

**DDD pragmático:**

Entidades de dominio puras (sin decoradores de Prisma ni de NestJS) que llevan las reglas reales del negocio. Value objects para `Precio`, `Coordenadas`, `Direccion`. Los módulos del backend se organizan por dominio, no por tipo técnico.

**Vertical slicing + separación lógica/UI (lo que habilita multi-plataforma):**

Cada feature es una rebanada vertical, pero ahora con un corte adicional: la lógica (hooks, llamadas a la API, tipos) vive en `packages/`, y solo la interfaz visual vive dentro de cada `app`. Así la rebanada de "listings" se puede usar tanto en la web como, después, en la app móvil.

## 5. Estructura del repositorio (monorepo)

```
proyecto-arriendos/
├── apps/
│   ├── web/                  (React + Vite — se construye ahora)
│   ├── mobile/                (React Native + Expo — se construye después)
│   └── backend/                (NestJS — ya descrito abajo)
│
├── packages/
│   ├── domain/                 (entidades y value objects, TS puro, sin React ni Node)
│   ├── api-client/              (funciones que llaman al backend + tipos de los DTOs)
│   ├── hooks/                    (hooks de React reutilizables: useListings, useAuth, useSearchFilters)
│   └── config/                    (tsconfig y eslint compartidos entre todas las apps)
│
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## 6. Estructura de `apps/backend`

```
apps/backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── domain/entities/user.entity.ts
│   │   │   ├── application/
│   │   │   │   ├── services/google-auth.service.ts
│   │   │   │   └── use-cases/login-with-google.use-case.ts
│   │   │   ├── infrastructure/
│   │   │   │   ├── google-token-verifier.ts
│   │   │   │   └── jwt-strategy.ts
│   │   │   ├── presentation/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   └── dtos/google-login.dto.ts
│   │   │   └── auth.module.ts
│   │   │
│   │   ├── listings/
│   │   │   ├── domain/
│   │   │   │   ├── entities/listing.entity.ts
│   │   │   │   ├── value-objects/price.vo.ts
│   │   │   │   └── repositories/listing-repository.interface.ts
│   │   │   ├── application/
│   │   │   │   ├── services/listing.service.ts
│   │   │   │   └── use-cases/create-listing.use-case.ts
│   │   │   ├── infrastructure/prisma-listing.repository.ts
│   │   │   ├── presentation/
│   │   │   │   ├── listings.controller.ts
│   │   │   │   └── dtos/create-listing.dto.ts
│   │   │   └── listings.module.ts
│   │   │
│   │   ├── images/
│   │   │   ├── domain/repositories/image-storage.interface.ts
│   │   │   ├── infrastructure/cloudinary-storage.service.ts
│   │   │   ├── presentation/images.controller.ts
│   │   │   └── images.module.ts
│   │   │
│   │   ├── locations/
│   │   │   ├── domain/value-objects/coordinates.vo.ts
│   │   │   ├── application/services/geocoding.service.ts
│   │   │   ├── presentation/locations.controller.ts
│   │   │   └── locations.module.ts
│   │   │
│   │   └── users/
│   │       ├── domain/entities/user.entity.ts
│   │       ├── application/services/user.service.ts
│   │       ├── infrastructure/prisma-user.repository.ts
│   │       └── users.module.ts
│   │
│   ├── shared/
│   │   ├── database/prisma.service.ts
│   │   ├── guards/jwt-auth.guard.ts
│   │   └── decorators/current-user.decorator.ts
│   │
│   ├── app.module.ts
│   └── main.ts
└── prisma/schema.prisma
```

Este backend no cambia nada cuando llegue la app móvil: la misma API sirve a la web y al móvil al mismo tiempo.

## 7. Estructura de `apps/web`

```
apps/web/
├── src/
│   ├── features/
│   │   ├── auth/components/GoogleLoginButton.tsx
│   │   ├── listings/components/
│   │   │   ├── ListingCard.tsx
│   │   │   ├── ListingDetail.tsx
│   │   │   └── ListingForm.tsx
│   │   ├── search/components/SearchFilters.tsx
│   │   └── map/components/MapView.tsx   (usa Leaflet)
│   │
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── ListingDetailPage.tsx
│   │   └── CreateListingPage.tsx
│   │
│   ├── App.tsx
│   └── main.tsx
└── package.json   (depende de @proyecto/hooks, @proyecto/api-client, @proyecto/domain)
```

Importante: aquí ya **no** hay carpeta `services/` ni `hooks/` propios por feature — esos viven en `packages/hooks` y `packages/api-client` para poder reutilizarse después en `apps/mobile`. `apps/web` solo tiene componentes visuales y páginas.

## 8. Estructura de `packages/hooks` y `packages/api-client` (lo que se comparte)

```
packages/
├── domain/
│   └── src/
│       ├── entities/listing.entity.ts
│       └── value-objects/price.vo.ts
│
├── api-client/
│   └── src/
│       ├── listings.api.ts     (createListing, searchListings, getListingById)
│       ├── auth.api.ts          (loginWithGoogle)
│       └── http-client.ts        (instancia base con manejo del token JWT)
│
└── hooks/
    └── src/
        ├── useListings.ts
        ├── useAuth.ts
        └── useSearchFilters.ts
```

`useListings.ts`, por ejemplo, llama a `api-client` y devuelve datos y estados de carga — funciona igual en un componente web (`<div>`) que en una pantalla de React Native (`<View>`), porque un hook de React no sabe ni le importa qué se renderiza con sus datos.

## 9. Cuando llegue el momento de la app móvil

1. Se crea `apps/mobile` con Expo.
2. Se agregan `@proyecto/hooks`, `@proyecto/api-client` y `@proyecto/domain` como dependencias (ya existen, no se reescriben).
3. Se construyen únicamente las pantallas (`screens/`) con componentes de React Native, llamando a los mismos hooks que ya usa la web.
4. El login con Google en móvil usa el SDK nativo de Google Sign-In en vez del botón web, pero el backend recibe el mismo tipo de token y lo verifica exactamente igual — no se toca el backend.
5. El mapa en móvil usa `react-native-maps` en vez de Leaflet, pero la lógica de "qué coordenadas mostrar" sigue viniendo del mismo hook compartido.

## 10. Flujo de login con Google (válido para web y, después, para móvil)

1. El cliente (web o móvil) obtiene un **ID token** de Google (en web con Google Identity Services, en móvil con el SDK nativo).
2. Se envía al backend: `POST /auth/google { idToken }`.
3. El backend verifica el token con `google-auth-library` y extrae email, nombre y foto.
4. Busca o crea el usuario (find-or-create) en la base de datos.
5. El backend genera su propio JWT y lo devuelve.
6. El cliente guarda ese JWT y lo manda en cada request protegido (`Authorization: Bearer <token>`).
7. Las rutas protegidas (crear, editar, borrar publicación) usan `JwtAuthGuard` en NestJS — sin importar si la request vino de la web o del móvil.

## 11. Modelo de dominio (vive en `packages/domain`)

- **Usuario**: id, nombre, email, fotoUrl, fechaRegistro
- **Publicacion**: id, titulo, descripcion, precio (value object), tipoDeLugar, numeroDeHabitaciones, estado, usuarioId, fechaPublicacion
- **Imagen**: id, url, publicacionId, orden
- **Ubicacion**: id, publicacionId, coordenadas (value object), direccionAproximada, barrio

Reglas de negocio en el dominio: una publicación no se puede crear sin al menos una imagen y una ubicación; el precio no puede ser negativo ni cero; solo el usuario que la creó puede editarla o borrarla. Estas reglas, al vivir en `packages/domain`, aplican igual sin importar si la publicación se creó desde la web o desde el celular.

## 12. Roadmap sugerido

**Fase 1 — Web MVP**: monorepo configurado, backend con auth de Google + CRUD de publicaciones, web consumiendo todo desde `packages/`.
**Fase 2 — Web completa**: subida de imágenes a Cloudinary + selección de ubicación en el mapa al publicar.
**Fase 3 — Web pulida**: buscador con filtros + vista de mapa con todas las publicaciones.
**Fase 4 — App móvil**: crear `apps/mobile` con Expo, reutilizando `packages/domain`, `packages/api-client` y `packages/hooks` tal como están; solo se construyen las pantallas nativas.
**Fase 5 (opcional, a futuro)**: favoritos, mensajería entre usuarios, calificaciones.

Como la lógica ya está separada desde la fase 1, la fase 4 es mucho más rápida de lo que sería si todo se hubiera escrito mezclado dentro de la web.