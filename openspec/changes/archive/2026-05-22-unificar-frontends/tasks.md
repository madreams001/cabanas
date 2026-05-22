# Tasks: Unificar Frontends

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~86 (nuevo `unificar.js`: 80 + `minify.js`: 3 + `desplegar.ps1`: 3) |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | size-exception |

```
Decision needed before apply: Yes
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low
```

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Script + pipeline + verify | PR 1 (único) | Todo el cambio cabe en 1 PR < 400 líneas |

## Phase 1: Crear `unificar.js`

- [x] 1.1 Crear `unificar.js` con `fs.readFileSync('index.html')` — leer archivo completo
- [x] 1.2 Extraer todos los bloques `<style>...</style>` con regex, concatenarlos → `style.html`
- [x] 1.3 Identificar 1er `<script>` (config vars: queda inline) y 2do `<script>` (app logic) → `script.html`
- [x] 1.4 Generar `index-gas.html`: copiar `index.html`, reemplazar `<style>` por `<?!= include('style') ?>` y 2do `<script>` por `<?!= include('script') ?>`
- [x] 1.5 Escribir los 3 archivos con `fs.writeFileSync`; agregar header comentado indicando "generado automáticamente"

## Phase 2: Integrar en `minify.js`

- [x] 2.1 Agregar `const { execSync } = require('child_process')` al inicio del archivo
- [x] 2.2 Agregar `execSync('node unificar.js', { stdio: 'inherit' })` antes de la lógica de minificación

## Phase 3: Integrar en `desplegar.ps1`

- [x] 3.1 Agregar `node unificar.js &&` antes de `node minify.js` en el paso 1 del script

## Phase 4: Verificación

- [x] 4.1 Ejecutar `node unificar.js` y verificar que `style.html`, `script.html`, `index-gas.html` se crean sin errores
- [x] 4.2 Diff semántico: comparar `style.html` generado vs actual con `git diff --ignore-all-space`
- [x] 4.3 Diff semántico: comparar `script.html` generado vs actual con `git diff --ignore-all-space`
- [x] 4.4 Verificar que `index-gas.html` generado contiene `<?!= include('style') ?>`, `<?!= include('script') ?>`, y el 1er script inline intacto
- [x] 4.5 Ejecutar `node unificar.js && node minify.js` y confirmar `$LASTEXITCODE -eq 0`
