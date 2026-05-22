# Proposal: Unificar Frontends

## Intent

Eliminar la duplicación manual de código entre los 4 frontends (GitHub Pages + 3 GAS parciales). Cada cambio actual requiere editar 4 archivos; el desfase es inevitable.

## Scope

### In Scope
- Script de build (`unificar.js`) que parsea `index.html` y genera `style.html`, `script.html`, `index-gas.html`
- Integración del script en `minify.js` (pre-minificación)
- Actualización de `desplegar.ps1` para que incluya `unificar.js`
- Verificación: diff entre archivos generados y actuales para equivalencia funcional
- Documentación inline del flujo en los archivos generados

### Out of Scope
- Bug fixes, XSS sanitization, modularización JS, tests, linter, eliminación de dead code

## Capabilities

### New Capabilities
None — cambio puramente interno (build pipeline), sin nuevas funcionalidades visibles al usuario.

### Modified Capabilities
None — no cambia comportamiento en producción. Los archivos generados deben ser funcionalmente equivalentes a los actuales.

## Approach

1. **Parsear `index.html`**: extraer contenido de los 2 bloques `<style>` (combinarlos) → `style.html`. Extraer contenido de los 2 bloques `<script>` (combinarlos) → `script.html`.
2. **Generar `index-gas.html`**: copiar `index.html` reemplazando `<style>…</style>` por `<?!= include('style') ?>` y el segundo `<script>` por `<?!= include('script') ?>`. Mantener el primer `<script>` (config vars) inline.
3. **Pipeline**: `unificar.js` se ejecuta antes de `minify.js`. `desplegar.ps1` llama a ambos.
4. **Verificación**: diff de contenido extraído vs. archivos actuales (ignorando whitespace/comentarios).

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `index.html` | Source of truth | Sin cambios, solo se lee |
| `script.html` | Regenerado | Se genera automáticamente, se elimina mantenimiento manual |
| `style.html` | Regenerado | Se genera automáticamente (hoy es IDÉNTICO a `index-gas.html` — bug) |
| `index-gas.html` | Regenerado | Se genera con `<?!= include(...)?>` |
| `minify.js` | Modificado | Agrega llamado a `unificar.js` antes de minificar |
| `desplegar.ps1` | Modificado | Agrega `node unificar.js` al pipeline |
| `unificar.js` | **Nuevo** | Script build: extrae/genera parciales GAS |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Extracción incorrecta rompe GAS | Low | Verificación por diff post-generación |
| Whitespace/comentarios difieren | Low | Comparación semántica (sin whitespace) |
| Script no corre en CI | Low | `desplegar.ps1` lo ejecuta localmente |

## Rollback Plan

```bash
git checkout v1.0-pre-refactor
```

Tag existente antes de cualquier cambio. Garantiza revertir a estado conocido.

## Dependencies

- Node.js (ya instalado para `minify.js`)
- `fs` + `path` (módulos estándar de Node, sin dependencias externas)

## Success Criteria

- [ ] `node unificar.js` genera `style.html`, `script.html`, `index-gas.html` sin errores
- [ ] Los archivos generados son funcionalmente equivalentes a los actuales (diff semántico)
- [ ] `desplegar.ps1` ejecuta `unificar.js → minify.js` sin intervención manual
- [ ] `minify.js` minifica `index.html` correctamente después de la unificación
