# Design: Unificar Frontends

## Technical Approach

Script Node.js (`unificar.js`) que parsea `index.html` — fuente única de verdad — y extrae/genera automáticamente los 3 parciales de Google Apps Script (`style.html`, `script.html`, `index-gas.html`). Se ejecuta *antes* de `minify.js` en el pipeline de build.

## Análisis de la Situación Actual

| Archivo | Rol actual | Problema |
|---------|-----------|----------|
| `index.html` (3203 lines) | Source of truth — GitHub Pages | ✅ Correcto |
| `style.html` (354 lines, 16KB) | Debería tener solo CSS | ❌ Es IDÉNTICO a `index-gas.html` — bug histórico |
| `script.html` (~1200 lines, 87KB) | Debería tener solo JS app logic | ⚠️ Tiene diferencias semánticas con `index.html` (ej: `cabañasConfig = []` vs `cabañasConfig = cargarConfigCabañas()`) |
| `index-gas.html` (354 lines) | Template GAS con includes | ✅ Correcto, pero se desfasa manualmente |

### Estructura de `index.html` (source of truth)

```
Lines 1-11:    DOCTYPE, <head>, meta, <title>
Lines 13-18:   <script>──► CONFIG VARS (API_URL, tokens) — QUEDA INLINE
Lines 20-985:  <style>──► TODO EL CSS (1 solo bloque)
Lines 987-1332: Body HTML completo (header, nav, panels, form, listado…)
Lines 1333-3201: <script>──► APP LOGIC (reservas, calendario, API calls…) — VA A script.html
Lines 3202-3203: </body></html>
```

## Architecture Decisions

| Opción | Tradeoff | Decisión |
|--------|----------|----------|
| `unificar.js` separado vs integrado en `minify.js` | Separado es más testeable y mantenible | **Script separado**, `minify.js` llama a `child_process.fork` o `execSync` |
| Parser CSS + JS vs regex simple | Regex es más frágil pero el HTML es conocido y controlado | **Regex con anclas** (`<style>`, `</style>`, `<script>`) — el HTML es generado por nosotros, no hay nesting complejo |
| npm dependency (htmlparser2) vs Node built-ins | Dependencia externa = riesgo de rotura | **0 dependencias externas** — solo `fs` y `path` |

## Data Flow

```
index.html (source of truth)
    │
    ▼
unificar.js
    │
    ├──► extrae <style>…</style>         ──→ style.html
    ├──► extrae 2do <script>…</script>   ──→ script.html
    └──► copia HTML, reemplaza:
           <style>…</style>  →  <?!= include('style') ?>
           2do <script>…     →  <?!= include('script') ?>
                                          ──→ index-gas.html
    │
    ▼
minify.js  (lee index.html, genera index.min.html)
```

### Pipeline final

```bash
node unificar.js && node minify.js
```

## `unificar.js` — Algoritmo

1. **Leer** `index.html` completo con `fs.readFileSync`
2. **Extraer CSS**: regex `/<\s*style\s*>([\s\S]*?)<\/style\s*>/i` — concatenar todos los matches (aunque hoy hay 1 solo) → `style.html`
3. **Identificar script blocks**: encontrar todos los `<script>` ... `</script>` (case-insensitive, non-greedy)
   - **Script #0 (índice 0)**: config vars — queda inline, no se extrae
   - **Script #1 (índice 1)**: app logic → `script.html`
4. **Generar `index-gas.html`**:
   - Copiar `index.html`
   - Reemplazar CADA bloque `<style>…</style>` por `<?!= include('style') ?>`
   - Reemplazar SOLO el 2do bloque `<script>…</script>` (índice 1) por `<?!= include('script') ?>`
   - El 1er `<script>` (config vars) queda intacto
5. **Escribir** los 3 archivos con `fs.writeFileSync`

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `unificar.js` | **Create** | Script build que extrae/genera parciales GAS |
| `style.html` | **Regenerate** | Ahora contiene SOLO el CSS extraído de `index.html` |
| `script.html` | **Regenerate** | Ahora contiene SOLO el 2do script (app logic) de `index.html` |
| `index-gas.html` | **Regenerate** | Generado automáticamente con includes |
| `minify.js` | Modify | Agregar `execSync('node unificar.js')` antes de minificar |
| `desplegar.ps1` | Modify | Agregar `node unificar.js` antes de `node minify.js` |

## Verification Strategy

| Capa | Qué probar | Cómo |
|------|-----------|------|
| Extracción | CSS extraído coincide semánticamente con `<style>` original | `diff --ignore-all-space` entre `style.html` y el CSS inline |
| Extracción | JS extraído coincide semánticamente con 2do `<script>` | `diff --ignore-all-space` entre `script.html` y el bloque original |
| Generación | `index-gas.html` generado tiene estructura correcta | Verificar que contiene `<?!= include('style') ?>`, `<?!= include('script') ?>`, y el 1er script inline |
| Pipeline | `node unificar.js && node minify.js` corre sin errores | `$LASTEXITCODE -eq 0` |
| Regresión | La app en GitHub Pages sigue funcionando | Abrir `index.html` en navegador (sin cambios en source of truth) |

## Open Questions

- [ ] Ninguna — el diseño cubre todos los casos identificados en el análisis

## Migration / Rollout

No requiere migración. Rollback: `git checkout HEAD~1 unificar.js style.html script.html index-gas.html minify.js desplegar.ps1`
