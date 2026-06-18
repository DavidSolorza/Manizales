# Prompt de diseño: rediseño visual de "Arriendos Universitarios"

## Contexto para quien implemente esto

Es una plataforma para que estudiantes de Manizales encuentren y publiquen arriendos económicos cerca de la universidad. El usuario llega con una necesidad concreta y bajo presupuesto: quiere ver rápido qué hay disponible, a qué precio y qué tan cerca está del campus. El diseño actual (inputs sueltos en una barra horizontal, mapa centrado en otra ciudad, lista vacía sin personalidad) se ve genérico y poco confiable. El objetivo es que se sienta como una herramienta hecha a la medida de esta ciudad y de este problema, no como una plantilla descargada.

No usar look genérico de IA: nada de fondo crema con tipografía serif de alto contraste y acento terracota, nada de fondo negro con un solo acento neón, nada de estilo periódico con líneas finas tipo broadsheet. Estos tres looks son los defaults que cualquier IA produce sin pensar en el contexto; aquí queremos algo anclado en Manizales como ciudad de montaña y región cafetera, no un template.

## Paleta de colores

| Nombre | Hex | Uso |
|---|---|---|
| Niebla | `#F1F4F1` | Fondo general de la página (gris-verde muy claro, evoca la niebla/nubosidad típica de Manizales por la altura, no un crema cálido genérico) |
| Musgo | `#2F5233` | Color de marca: botones primarios, estados activos, pines del mapa |
| Cereza | `#E1483E` | Acento único y deliberado: precios destacados, badges, el elemento de firma (ver abajo). Úsalo con moderación, no lo repitas en todo |
| Tinta | `#20281F` | Texto principal (negro con matiz verde, no negro puro) |
| Piedra | `#C9D1C5` | Bordes, separadores, fondos de inputs sin foco |
| Sol | `#F2A93B` | Único color extra, solo para el badge "disponible ahora" o similar, no para nada más |

Fondo de las tarjetas y el sidebar: blanco puro (`#FFFFFF`) sobre el fondo Niebla, para que las tarjetas se sientan como objetos físicos flotando sobre la página, no todo plano del mismo gris.

## Tipografía

- **Display (títulos, wordmark "Arriendos U")**: Space Grotesk, peso 600-700. Es geométrica y con carácter, evita el cliché de la serif editorial.
- **Cuerpo y UI (inputs, descripciones, navegación)**: Inter, peso 400-500. Máxima legibilidad para formularios y listas largas.
- **Precios y datos numéricos**: IBM Plex Mono. Los números en monoespaciada se alinean visualmente al escanear varias tarjetas de precio una debajo de otra, y le da a cada precio un look de "etiqueta" sin necesidad de decoración extra.

## Reestructuración del layout (esto resuelve tu pregunta del sidebar)

Cambiar la barra horizontal de filtros por un **sidebar fijo a la izquierda** (320-360px de ancho), y mantener el mapa a la derecha ocupando el resto del alto disponible. Esto es lo que ya usan Airbnb y plataformas de finca raíz porque funciona: permite ver lista y mapa al mismo tiempo sin scroll horizontal raro.

Dentro del sidebar, de arriba hacia abajo:

1. Wordmark "Arriendos U" en Space Grotesk, simple, sin logo decorativo innecesario.
2. Buscador de texto libre (título o descripción).
3. Filtros, pero no como inputs sueltos sino agrupados visualmente:
   - Precio: un slider de doble manija (rango mín-máx en un solo control visual, no dos cajas de texto separadas).
   - Tipo: chips/píldoras seleccionables (Habitación, Apartaestudio, Apartamento, Casa) en vez de un `<select>` dropdown — son más rápidos de usar y se ven menos "formulario corporativo".
   - Barrio: input con autocompletado.
4. Debajo de los filtros, la lista de resultados como tarjetas, scrolleable independientemente del mapa.

Cada tarjeta de publicación debe mostrar: imagen miniatura (relación 4:3), precio en Plex Mono dentro de un badge color Cereza, título, barrio + tipo como mini-pills color Piedra, y opcionalmente la distancia a la universidad si la tienes calculada.

## El elemento de firma (lo que hace que esto no se vea genérico)

Los pines del mapa no deben ser el marcador rojo por defecto de Leaflet. Usa un pin con silueta simple de techo a dos aguas, coloreado en una escala de Musgo (barato) a Sol (más caro) según el precio relativo de esa publicación frente al resto de resultados visibles. Así, de un vistazo en el mapa, el usuario ve dónde está lo más económico sin tener que abrir cada publicación. Sincroniza lista y mapa: pasar el cursor sobre una tarjeta resalta su pin, y hacer clic en un pin desplaza el scroll hasta su tarjeta correspondiente.

## Estados vacíos (importante, ahora se ve roto)

"No se encontraron publicaciones / Intenta con otros filtros" en gris dentro de un espacio enorme vacío se siente como un error, no como una invitación. En vez de eso: un ícono simple relacionado al contexto (una casa o un pin de mapa, no un ícono genérico de "no results"), un mensaje en el tono de la interfaz ("Nada por aquí con estos filtros") y un botón visible para limpiar filtros directamente ahí, no solo arriba en la barra.

## Corrección funcional necesaria (afecta la percepción del diseño)

El mapa está centrado por defecto en Bogotá (Suba, Engativá, Usaquén se ven en tu captura), no en Manizales. Esto hay que arreglarlo en el código antes que en el estilo: el centro inicial del mapa debe ser las coordenadas de Manizales (aprox. lat 5.07, lng -75.52) con un zoom que muestre la ciudad completa, no un mapa vacío de otra ciudad. Un mapa "bonito" pero mostrando la ciudad equivocada sigue viéndose roto.

## Responsive

En mobile, el sidebar se convierte en una hoja inferior (bottom sheet) deslizable: el mapa ocupa toda la pantalla por defecto, y un botón flotante "Ver lista (N)" abre la lista de tarjetas como un panel que sube desde abajo. No intentes meter sidebar + mapa lado a lado en una pantalla angosta, eso es lo que rompe la mayoría de estos diseños en celular.