# Mejores Prácticas de OpenCode

Referencia extraída de la documentación oficial (https://opencode.ai/docs/es) para implementar siempre en nuestros proyectos.

---

## 🔒 Seguridad

OpenCode por defecto es **demasiado permisivo** (`allow` para todo). Siempre debemos configurar permisos granulares.

| Práctica | Detalle |
|----------|---------|
| **Permisos granulares** | Usar `"permission"` en `opencode.json`. Poner `"*": "ask"` para bash y edit como base. |
| **Bloquear comandos peligrosos** | `"git commit*": "deny"`, `"git push*": "deny"`, `"rm*": "deny"`, `"del*": "deny"`. |
| **Bloquear archivos .env** | OpenCode ya bloquea `*.env` por defecto, pero ser explícito: `"*.env": "deny"`. |
| **Directorios externos** | Usar `external_directory: "ask"` para limitar acceso solo a rutas confiables. |
| **API keys seguras** | Usar `{file:~/.secrets/key}` en la config, nunca hardcodear claves. |
| **Doom loop** | `"doom_loop": "ask"` para evitar bucles infinitos de herramientas. |

---

## ⚙️ Configuración

| Práctica | Detalle |
|----------|---------|
| **`opencode.json` por proyecto** | Cada proyecto tiene su config en la raíz. Se versiona en git. |
| **Config global** | Preferencias personales en `~/.config/opencode/opencode.json`. |
| **`$schema` siempre** | Incluir `"$schema": "https://opencode.ai/config.json"` para autocompletado y validación. |
| **JSONC con comentarios** | Usar `.jsonc` para poder agregar comentarios explicativos. |
| **Small model** | Configurar `small_model` para tareas livianas (generación de títulos, resúmenes) y ahorrar tokens. |
| **Compaction** | `"compaction": { "auto": true, "prune": true }` para manejar contextos largos eficientemente. |
| **Share manual** | `"share": "manual"` para no compartir sesiones automáticamente. |

---

## 📝 Reglas (AGENTS.md)

| Práctica | Detalle |
|----------|---------|
| **Siempre commitear AGENTS.md** | Es la memoria del proyecto para OpenCode. Sin esto, el agente no entiende el contexto. |
| **Instrucciones externas** | Usar `"instructions"` en `opencode.json` para referenciar guías de estilo, convenciones, etc. |
| **Referencias con @** | En AGENTS.md, usar `@ruta/archivo.md` para que OpenCode sepa cargar archivos bajo demanda. |
| **Reglas globales personales** | `~/.config/opencode/AGENTS.md` para reglas que aplican a todos tus proyectos (idioma, tono, etc.). |
| **Estructura clara** | Nombre, descripción, estructura de archivos, tecnologías, convenciones, historial, roadmap. |

---

## 🤖 Agentes

| Práctica | Detalle |
|----------|---------|
| **Usar Plan para analizar** | Antes de hacer cambios grandes, usar agente Plan para que proponga un plan sin modificar código. |
| **Subagentes especializados** | Crear agentes para tareas específicas (review, docs, debug) con permisos restringidos. |
| **Permisos por agente** | Cada agente puede tener sus propios permisos (ej: review = solo lectura, `edit: deny`). |
| **Modelo por agente** | Usar modelos más baratos para tareas simples (haiku), más potentes para complejas (sonnet). |
| **Temperatura** | Baja (0.1-0.2) para análisis/planning, media (0.3-0.5) para desarrollo, alta (0.6+) para brainstorming. |

---

## 🧩 Skills (Habilidades del Agente)

| Práctica | Detalle |
|----------|---------|
| **Ubicación** | `.opencode/skills/<nombre>/SKILL.md` por proyecto, `~/.config/opencode/skills/<nombre>/SKILL.md` global. |
| **Frontmatter obligatorio** | Cada `SKILL.md` debe empezar con YAML: `name` y `description` son obligatorios. |
| **Nombre válido** | Alfanumérico en minúsculas con guiones simples: `^[a-z0-9]+(-[a-z0-9]+)*$`. Máx 64 chars. |
| **Descripción específica** | Entre 1 y 1024 chars. Debe ser clara para que el agente elija correctamente cuándo usarla. |
| **Carga bajo demanda** | El agente ve las skills disponibles y las carga con `skill({ name: "..." })` solo cuando las necesita. |
| **Permisos por skill** | Configurar en `opencode.json`: `"skill": { "*": "allow", "internal-*": "deny", "experimental-*": "ask" }`. |
| **Deshabilitar en agentes** | Si un agente no necesita skills: `"tools": { "skill": false }` en la config del agente. |
| **Nombres únicos** | Verificar que no haya skills con el mismo nombre en distintas ubicaciones (`.opencode`, `.claude`, `.agents`). |

### Estructura de un SKILL.md

```markdown
---
name: mi-skill
description: Descripción clara y específica de qué hace y cuándo usarla
license: MIT
compatibility: opencode
metadata:
  audience: desarrolladores
  workflow: deploy
---

## Qué hace
- Instrucciones claras para el agente
- Pasos a seguir

## Cuándo usar
Explicación de cuándo el agente debe cargar esta skill.
```

---

## 🛡️ Template de permisos recomendados

```json
{
  "permission": {
    "*": "allow",
    "bash": {
      "*": "ask",
      "git status*": "allow",
      "git log*": "allow",
      "git diff*": "allow",
      "git branch*": "allow",
      "ls*": "allow",
      "dir*": "allow",
      "grep*": "allow",
      "rg*": "allow",
      "find*": "allow",
      "cat*": "allow",
      "type*": "allow",
      "echo*": "allow",
      "npm run*": "allow",
      "node*": "allow",
      "pwsh*": "allow",
      "powershell*": "allow",
      "git commit*": "deny",
      "git push*": "deny",
      "git force*": "deny",
      "rm*": "deny",
      "del*": "deny",
      "rmdir*": "deny"
    },
    "edit": "ask",
    "write": "ask",
    "read": {
      "*": "allow",
      "*.env": "deny",
      "*.env.*": "deny",
      "*.env.example": "allow"
    },
    "external_directory": "ask",
    "doom_loop": "ask"
  }
}
