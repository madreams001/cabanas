# Glosario de Componentes — App Cabañas

Este archivo sirve para que hablemos el mismo idioma cuando hablamos del código.

## Estructura Visual

| Término | Qué es | Ejemplo |
|---------|--------|---------|
| **Card** (tarjeta) | Caja que contiene toda la info de una reserva | Cada rectángulo en el listado |
| **Header** (encabezado) | Barra superior con logo y nombre | "🏕️ Cabañas · Reservas" |
| **Nav** (navegación) | Botones de pestañas (Calendario, Nueva, etc.) | La barra de tabs |
| **Panel** | Sección completa que se muestra/oculta | El calendario, el formulario |
| **Footer** (pie) | Parte inferior de una card o página | "Cargada: 20/5/2026" |
| **Badge** (etiqueta) | Indicador pequeño de estado | "🔴 Ocupada", "🟠 Confirmada" |
| **Chip** | Pastilla redondeada con info corta | "🏕️ Cabaña 1", "🌙 3 noches", "👤 Adriana" |
| **Modal** | Ventana que aparece encima de todo | "¿Quién sos?" |
| **Overlay** | Capa que cubre toda la pantalla | Pantalla azul de mantenimiento |
| **Banner** | Barra horizontal de aviso | Banner naranja "MODO MANTENIMIENTO" |
| **Tooltip** | Texto que aparece al pasar el mouse | Info al dejar el cursor sobre un día |
| **Input** | Campo donde escribís | El campo "Nombre y apellido" |
| **Select** | Menú desplegable | El campo "Cabaña" o "Estado" |
| **Textarea** | Campo grande para texto largo | "Observaciones" |
| **Button** (botón) | Elemento clickeable | "💾 Guardar reserva" |
| **Icon** (ícono) | Símbolo visual | 🏕️, 🔴, 🗑️, ✏️ |

## Partes del Calendario

| Término | Qué es |
|---------|--------|
| **Celda** | Cada cuadradito de un día |
| **Fila** | Una cabaña completa (todas las celdas de ese mes) |
| **Columna** | Un día del mes (todas las cabañas) |
| **Transición** | Día dividido (checkout/checkin) |
| **Semáforo** | Sistema de colores (verde, rojo, naranja, amarillo) |

## Partes de la Card de Reserva

```
┌─────────────────────────────────┐ ← Card
│ 🏕️ Cabaña 1 — Juan Pérez       │ ← Nombre (rc-name)
│ DNI: 28.123.456 · Tel · Email   │ ← Sub (rc-sub)
│ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐  │ ← Chips (rc-chips)
│ │🔴 │ │Part│ │3n │ │$$$│ │👤 │  │
│ └───┘ └───┘ └───┘ └───┘ └───┘  │
│ 📅 20-05 → 23-05                │ ← Fecha
│ 🔒 Nota interna                 │ ← Nota (rc-obs)
│ 📝 Observaciones                │ ← Obs (rc-obs)
│ Cargada: 20/5/2026 14:30        │ ← Footer (rc-footer)
│                    [✏️] [🗑️]    │ ← Botones
└─────────────────────────────────┘
```

## Términos Técnicos

| Término | Qué significa |
|---------|---------------|
| **API** | El "enchufe" entre la app y Google Sheets |
| **Fetch** | La acción de pedir datos al servidor |
| **Cache** | Datos guardados localmente para no pedir siempre |
| **Sync** | Sincronizar (actualizar datos entre app y Sheets) |
| **Payload** | Los datos que enviamos al servidor |
| **Token** | La contraseña que usa la app para hablar con Sheets |
| **Debounce** | Esperar un poco antes de ejecutar algo (para no saturar) |
| **Render** | Dibujar algo en pantalla |
| **DOM** | La estructura de la página HTML |
| **localStorage** | Memoria del navegador (persiste entre sesiones) |
| **sessionStorage** | Memoria temporal (se borra al cerrar pestaña) |

## IDs de Elementos Clave

| ID | Qué es |
|----|--------|
| `calTable` | La tabla del calendario |
| `listaReservas` | El contenedor de las cards |
| `statsGrid` | Los 4 cuadraditos de estadísticas |
| `btnGuardar` | El botón de guardar reserva |
| `idModal` | El popup "¿Quién sos?" |
| `maintOverlay` | La pantalla azul de mantenimiento |
| `connectionBanner` | El popup "Conectando..." |
| `adminMaintBanner` | El banner naranja del admin |

---

*Este archivo se actualiza cuando agregamos componentes nuevos.*
