# Prompt de estilos y organización de la interfaz

## Layout general

Sidebar fijo a la izquierda (200-230px) organizado en tres bloques, no como lista plana:

1. **Botón destacado "Publicar un lugar"** arriba de todo, con fondo de color (no es un ítem de navegación normal, es la acción principal de toda la app: subir una foto del lugar).
2. **Sección "Explorar"**: Inicio, Buscar y filtrar, Favoritos — todo lo que necesita alguien buscando arriendo.
3. **Sección "Tus publicaciones"**: Mis lugares (con contador de publicaciones activas), Precios y disponibilidad — todo lo que necesita el dueño del lugar para administrar lo que publicó.

Cada sección lleva un título pequeño en gris (11px) arriba para separarla visualmente, y un divisor sutil entre bloques. Perfil y Cerrar sesión quedan al final, separados con su propio divisor. El ítem activo se resalta con fondo suave y color de acento; los demás quedan en gris secundario. El contenido principal a la derecha tiene arriba una barra con buscador, y debajo la grilla de publicaciones.

En móvil (responsive de la web, no la app nativa todavía) el sidebar se colapsa a una barra inferior fija con los mismos íconos, estilo bottom-navigation, porque en una pantalla angosta un sidebar lateral come demasiado espacio.

## Paleta de colores

Color de acento principal: un teal/verde agua (cálido pero confiable, no corporativo gris). Úsalo para: ítem de navegación activo, botón principal "Publicar", precio destacado en las tarjetas.
Fondo de la app: blanco/gris muy claro para el contenido, un gris ligeramente más oscuro para el sidebar (para diferenciarlo visualmente sin usar otro color).
Estados: verde para "disponible", gris para "ya arrendado" (no rojo, evita que se sienta como un error).
Evita colores saturados o muchos colores distintos — máximo 2 colores de marca + grises neutros.

## Tipografía

Una sola familia sans-serif moderna (Inter, o la que venga por defecto en tu framework de UI). Jerarquía: título de página 20-22px peso medio, título de tarjeta 14-15px peso medio, precio 14-15px peso medio (mismo tamaño que el título pero como elemento que llama la atención por su posición, no por ser gigante), texto secundario (ubicación, fecha) 12-13px en gris.

## Componentes clave

**Tarjeta de publicación**: imagen arriba (relación de aspecto fija para que la grilla no se vea desordenada), debajo título, precio y ubicación con un ícono pequeño de pin. Toda la tarjeta es clickeable.

**Sidebar / navegación**: organizado en secciones con título pequeño, no como lista plana de íconos. El botón de publicar siempre destacado arriba, separado del resto. Ícono + texto en cada ítem, nunca solo ícono. La sección de "Tus publicaciones" debe dejar claro que ahí es donde el dueño edita precio y disponibilidad de su lugar, no solo donde lo ve.

**Barra de búsqueda + filtros**: input de texto libre + un botón/dropdown de filtros (precio, tipo de lugar, barrio) que se abre como panel lateral o modal, no como una fila larga de selects que ocupa toda la pantalla.

**Formulario de publicar**: dividido en pasos claros en vez de un formulario larguísimo de una sola vez: 1) datos básicos (título, descripción, precio, tipo), 2) fotos, 3) ubicación en el mapa. Cada paso con su propio botón de "siguiente".

**Botones**: uno primario (relleno con el color de acento, para la acción principal de cada pantalla) y uno secundario (solo borde, para acciones como "cancelar" o "ver más").

## Principios a seguir

Prioriza la foto y el precio en cualquier vista de lista, porque eso es lo primero que un estudiante busca al filtrar arriendos. Mantén el formulario de publicar lo más corto posible por paso, para que la gente realmente lo complete. Diseña pensando primero en cómo se va a ver en una pantalla angosta (la mayoría de estudiantes va a entrar desde el celular aunque sea "la versión web"), y después adapta hacia pantallas grandes.

## Prompt resumido (para pegar en una herramienta de diseño o generación de UI)

"Diseña la interfaz de una web de arriendos universitarios con sidebar de navegación a la izquierda (Inicio, Buscar, Mis publicaciones, Publicar, Perfil) y un área principal con buscador + grilla de tarjetas de publicaciones. Cada tarjeta muestra foto, título, precio destacado y ubicación con ícono de pin. Usa un color de acento tipo teal para la acción principal y el ítem activo del sidebar, fondo blanco/gris muy claro, tipografía sans-serif moderna, bordes redondeados suaves y sin sombras ni gradientes. El formulario de publicar debe estar dividido en pasos (datos básicos, fotos, ubicación). Diseño mobile-first: en pantallas angostas el sidebar se convierte en una barra de navegación inferior."