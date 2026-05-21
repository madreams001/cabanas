# Checklist: Inicio de Proyecto Nuevo

Cuando Cromi pide crear un proyecto nuevo, seguir estos pasos **en orden**:

## 1. Estructura de carpetas

```
proyectos/<nombre>/
├── opencode.json       ← Copiar desde plantilla
├── AGENTS.md           ← Crear con /init o desde plantilla
└── .opencode/          ← Crear si necesita skills/agentes custom
```

## 2. Seguridad (SIEMPRE)

- [ ] Verificar que `opencode.json` exista en la raíz del proyecto
- [ ] Permisos `bash`: `"*": "ask"` (preguntar antes de ejecutar)
- [ ] Permisos `edit`: `"ask"` (preguntar antes de modificar)
- [ ] Bloquear comandos peligrosos: `git commit*`, `git push*`, `rm*`, `del*` → `"deny"`
- [ ] Permitir comandos seguros: `git status*`, `git log*`, `grep*`, `ls*` → `"allow"`
- [ ] Bloquear lectura de `.env`: `"*.env": "deny"`
- [ ] `external_directory`: `"ask"`
- [ ] `doom_loop`: `"ask"`

## 3. Configuración del proyecto

- [ ] Definir modelo principal (por defecto: `opencode/qwen3.6-plus-free`)
- [ ] Definir `small_model` para tareas livianas (`opencode/qwen3-coder`)
- [ ] Configurar `watcher.ignore` según el tipo de proyecto
- [ ] Configurar `instructions` con archivos relevantes (AGENTS.md, guías, etc.)
- [ ] `share`: `"manual"` (no compartir automáticamente)
- [ ] `compaction`: `auto: true`, `prune: true`

## 4. AGENTS.md (Memoria del proyecto)

- [ ] Crear con estructura clara:
  - Nombre y descripción del proyecto
  - Estructura de archivos
  - Tecnologías usadas
  - Convenciones de código
  - Historial reciente
  - Roadmap / tareas futuras
- [ ] Commitear a git (SIEMPRE)

## 5. Agentes especializados (si aplica)

- [ ] ¿Necesita agentes custom? Crear en `.opencode/agents/`
- [ ] Definir permisos por agente (ej: review = solo lectura)
- [ ] Asignar modelo según complejidad de la tarea

## 6. Skills (si aplica)

- [ ] ¿Hay flujos de trabajo reutilizables? Crear en `.opencode/skills/`
- [ ] Cada skill necesita: `SKILL.md` con frontmatter YAML (`name` + `description`)
- [ ] Configurar permisos de skills si es necesario

## 7. Git

- [ ] `git init` si es repo nuevo
- [ ] `git add .` y `git commit -m "Inicio del proyecto: <nombre>"`
- [ ] Crear remote en GitHub y `git push`
- [ ] Verificar que NO se commiteen archivos sensibles (.env, claves, etc.)

## 8. Verificación final

- [ ] Probar que `opencode` abre correctamente en el proyecto
- [ ] Verificar que los permisos funcionan (probar un comando bash)
- [ ] Confirmar que el agente lee el AGENTS.md correctamente
- [ ] Documentar en el AGENTS.md global qué se hizo

---

## Plantilla rápida de opencode.json

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "opencode/qwen3.6-plus-free",
  "small_model": "opencode/qwen3-coder",
  "instructions": ["AGENTS.md"],
  "watcher": {
    "ignore": ["node_modules/**", "dist/**", ".git/**"]
  },
  "compaction": {
    "auto": true,
    "prune": true
  },
  "permission": {
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
  },
  "share": "manual"
}
```

---

## 9. Configuración avanzada (explorar según necesidad)

Estas secciones de la documentación oficial aún no se implementaron, pero pueden ser útiles en el futuro:

| Sección | Para qué sirve | Prioridad |
|---------|----------------|-----------|
| **LSP Servers** (`/docs/es/lsp/`) | Autocompletado inteligente, ir a definición, detectar errores en vivo. OpenCode conecta con language servers del lenguaje del proyecto. | Alta |
| **Comandos personalizados** (`/docs/es/commands/`) | Crear atajos como `/test`, `/deploy`, `/lint` para tareas repetitivas. Se definen en `opencode.json` o `.opencode/commands/`. | Alta |
| **Formateadores** (`/docs/es/formatters/`) | Formatear código automáticamente al editar (prettier, black, etc.). Se configuran en `opencode.json`. | Media |
| **MCP Servers** (`/docs/es/mcp-servers/`) | Conectar OpenCode a APIs externas (GitHub, Jira, bases de datos, herramientas de equipo). | Media |
| **Herramientas personalizadas** (`/docs/es/custom-tools/`) | Crear herramientas propias que el agente pueda usar (scripts custom, integraciones). | Baja |
| **Temas** (`/docs/es/themes/`) | Personalizar apariencia visual de la TUI. | Baja |
| **Keybinds** (`/docs/es/keybinds/`) | Personalizar atajos de teclado. | Baja |
| **Windows/WSL** (`/docs/es/windows-wsl/`) | OpenCode recomienda usar WSL en Windows para mejor rendimiento y compatibilidad completa. | Verificar |

### Cuándo usar cada una

- **LSP**: Cuando el proyecto usa un lenguaje con soporte (TypeScript, Python, Go, Rust, etc.) y querés autocompletado y detección de errores en vivo.
- **Comandos personalizados**: Cuando hay tareas que se repiten mucho (correr tests, deploy, lint, build).
- **Formateadores**: Cuando querés que el código se formatee solo al editar, sin tener que pedirlo.
- **MCP**: Cuando necesitás que OpenCode interactúe con servicios externos (crear issues en GitHub, consultar bases de datos, etc.).
- **WSL**: Si notás que OpenCode va lento en Windows nativo, migrar a WSL puede mejorar el rendimiento.

### Referencia

Toda la documentación está en: https://opencode.ai/docs/es
