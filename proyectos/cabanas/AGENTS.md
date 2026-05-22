# Memoria del Proyecto: App Cabañas Catamarca

## Información Técnica
- **Sheet ID:** `1dvfBmFWT1ejwdIEZDGja9WGn9V2PZnoGFXV97o7qkgk`
- **API URL:** `https://script.google.com/macros/s/AKfycby1PCqi24Y8U88eO54ZjKYrpJRTxjsUX9YfJtuaCTj-_PRJd_I7G2uoAX6a0hJfAe6m/exec`
- **Access Token:** `CabanasCatamarca2026#Adriana`
- **Admin Key:** `CabanasCatamarca2026#Adriana_ADMIN`

## Estructura de Archivos
- `index.html`: Frontend principal (fuente legible).
- `index.min.html`: Frontend minificado (para producción en GitHub Pages).
- `script.html`: Frontend para Google Apps Script.
- `Codigo_AppScript.gs`: Backend (Google Apps Script).
- `minify.js`: Script para generar la versión minificada.

## Hojas de Cálculo
- **Reservas:** Guarda las reservas de los clientes.
- **Config:** Guarda la configuración de las cabañas (nombre, tarifa, capacidad, descripción).

## Historial Reciente
- **Mayo 2026:**
  - Migración a estructura de proyectos.
  - Implementación de modo mantenimiento con bypass de admin.
  - Optimización de carga de reservas (caché local).
  - Navegación de calendario por año+mes.
  - Configuración de cabañas sincronizada con Google Sheets (hoja "Config").
  - Implementación de script de minificación (`minify.js`).

## Reglas de Despliegue

- **Backend (`Codigo_AppScript.gs`):** Si se modifica, Opencode DEBE alertar a Cromi con el mensaje:
  *"⚠️ Se modificó el backend. Recordá ir a **script.google.com** → Implementar → **Nueva implementación** para actualizar la versión asociada a la URL de la API."*
- **Frontend (`index.html`, `script.html`, `style.html`):** No necesita nueva implementación en GAS, el `clasp push` alcanza.

## Última Sesión (21-May-2026)
- **Tarea:** Fix: admin puede editar/eliminar cualquier reserva en "Todas las reservas".
- **Cambios:** `index.html`, `script.html`, `index.min.html`, `minis/index.html`.
- **Deploy:** ✅ Commit `182d66d` → push a `master`.
- **Test local:** ✅ Funcionando.
- **Pendiente:** —

## Roadmap / Tareas Futuras

| Tarea | Descripción | Prioridad |
|-------|-------------|-----------|
| **Deploy Automático** | Crear script (PowerShell) para subir `index.html` a GitHub Pages y `script.html` a Google Apps Script automáticamente. | Media |
| **PWA (Instalable)** | Agregar `manifest.json` y `service-worker.js` para que la app se pueda instalar como app nativa en celular/PC. | Media |
| **Minificación** | Mejorar el script de minificación usando herramientas robustas (npm) para evitar errores de sintaxis. | Baja |
