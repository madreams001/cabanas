---
name: memoria-cabanas
description: Use when working on the Cabañas Catamarca reservation app. Provides full project context, architecture, deployment workflow, and technical details. Trigger when Cromi mentions cabañas, reservas, calendario, mantenimiento, or any frontend/backend changes to the app.
---

# Memoria del Proyecto: App Cabañas Catamarca

## Descripción General
App de reservas de cabañas para 3 socios (Adriana, Federico, Jose) en Catamarca, Argentina. Permite gestionar reservas, ver calendario de disponibilidad, listar reservas con filtros, ver finanzas, historial y configuración.

## Arquitectura

### Frontend
- **`index.html`** (120 KB) — App completa con todo adentro (CSS + JS + HTML). Se usa en **GitHub Pages**.
- **`index-gas.html`** (16 KB) — Versión liviana que usa `include()`. Se usa en **Google Apps Script**.
- **`style.html`** (32 KB) — Solo CSS. Se usa en Google Apps Script.
- **`script.html`** (76 KB) — Solo JavaScript. Se usa en Google Apps Script.

### Backend
- **`Codigo_AppScript.gs`** — Backend en Google Apps Script que guarda/lee de Google Sheets.

### Flujo de datos
```
USUARIOS (celular/PC) → GitHub Pages (index.html) → Google Apps Script (API) → Google Sheets
```

## Funcionalidades Implementadas

### 1. Calendario visual
- Vista mensual con semáforo de colores:
  - 🟢 Verde = Libre
  - 🟢 Gris = Libre (fin de semana)
  - 🔴 Rojo = Ocupada (ya hospedado)
  - 🟠 Naranja = Reserva confirmada
  - 🟡 Amarillo = Reserva no confirmada
  - Mitad rojo/mitad verde = Checkout 11hs / checkin 13hs (transición)
- Panel de disponibilidad del día con botones clickeables
- Leyenda de colores
- Navegación entre meses + botón "Hoy"

### 2. Nueva reserva / Edición
- Formulario con campos: cabaña, tipo (particular/empresa), estado, fechas, cliente, datos económicos, observaciones, nota interna entre socios
- Detección de conflictos de fechas
- Cálculo automático de noches
- Badge de estado visual

### 3. Listado de reservas
- Vista lista o grilla (toggle)
- Filtros: búsqueda por nombre/DNI, cabaña, estado, tipo, socio, mes
- Exportar a CSV y PDF
- Eliminar reservas (solo las del socio logueado)

### 4. Modo mantenimiento
- Pantalla azul completa para socios cuando está activo
- Admin puede trabajar normalmente con banner discreto titilante
- Activación: tocar 5 veces el logo de la carpa en pantalla "¿Quién sos?"
- Estado se guarda en Google Sheets
- Botón de desactivar visible solo para admin

### 5. Identidad de socios
- Modal "¿Quién sos?" al entrar (Adriana, Federico, Jose)
- Cada socio solo puede eliminar sus propias reservas
- Filtro por socio en el listado

### 6. Finanzas
- Panel con resumen económico

### 7. Historial
- Registro de reservas pasadas

### 8. Configuración
- Panel de configuración de la app

## Datos Técnicos

### Google Sheets
- Sheet ID: `1dvfBmFWT1ejwdIEZDGja9WGn9V2PZnoGFXV97o7qkgk`
- API URL: `https://script.google.com/macros/s/AKfycby1PCqi24Y8U88eO54ZjKYrpJRTxjsUX9YfJtuaCTj-_PRJd_I7G2uoAX6a0hJfAe6m/exec`
- Access Token: `CabanasCatamarca2026#Adriana`
- Admin Key: `CabanasCatamarca2026#Adriana_ADMIN`

### Cabañas
- 8 cabañas (Cabaña 1 a Cabaña 8)
- Configurables desde localStorage (nombre, tarifa, capacidad, descripción)

### Estados de reserva
- `Ocupada` — Ya está hospedado
- `Confirmada` — Reserva confirmada
- `No confirmada` — Reserva no confirmada

## Flujo de Publicación

### Frontend (solo cambios visuales)
1. Opencode modifica `index.html` y `index-gas.html`
2. Cromi sube `index.html` a GitHub Pages

### Backend (cambios de lógica)
1. Opencode modifica `Codigo_AppScript.gs`, `index-gas.html`, `style.html`, `script.html`
2. Cromi sube los 4 archivos a Google Apps Script
3. Cromi hace "Nueva implementación" en GAS

## Bugs Resueltos (historial)
- Fechas: fecha de salida debe ser entrada + 1 día mínimo
- Sincronización: pantalla modal aparecía antes de cargar datos → se agregó popup "Conectando Sistema..."
- Modo mantenimiento: loop de pantalla azul → se corrigió con verificación de estado antes de sync
- Error de filas: "datos tienen 18, rango tiene 1" → se corrigió en GAS
- Transición checkout/checkin: día dividido con gradiente y rayas blancas

## Reglas para Modificar
- **Siempre leer primero** los archivos antes de modificar
- **Siempre generar ambas versiones** del frontend (`index.html` + `index-gas.html`)
- **Explicar en español simple** qué se cambió y por qué
- **Commit a git** después de cada cambio
- Cromi prueba en local antes de subir a producción
