# Guía para Trabajar con IA - Conceptos Básicos

## Las Piezas del Rompecabezas

| Herramienta | Qué es | Para qué sirve |
|-------------|--------|----------------|
| **Terminal** (Warp, PowerShell, CMD) | La "ventana negra" donde escribís comandos | Ejecutar programas y herramientas |
| **Ollama** | Motor que corre modelos de IA en tu PC | Descargás modelos gratis y funcionan localmente |
| **Opencode** | Asistente de código en terminal | Le hablás en español y te genera código |
| **LM Studio** | Interfaz visual (GUI) para chatear con modelos | Probar modelos sin usar comandos |
| **Claude Code** | Asistente de código de Anthropic | Similar a Opencode pero usa API online (pago) |

## Qué es Cada Cosa

### 1. Terminal
Es como la "consola" o "línea de comandos". Es donde escribís instrucciones a la computadora.
- **Warp**: Terminal moderna con IA integrada (bonita, pero no esencial)
- **PowerShell**: Terminal nativa de Windows
- **CMD**: Terminal clásica de Windows

**Podés usar cualquiera.** Opencode funciona en todas.

### 2. Ollama
Es un programa que descargás e instalás. Una vez instalado:
- Corre como servicio en segundo plano
- Te permite descargar modelos de IA gratis
- Los modelos se ejecutan en TU computadora (no en la nube)
- Funciona sin internet una vez descargado el modelo

### 3. Modelos de IA
Son los "cerebros" que entienden y responden. Ejemplos:
- **Llama 3.2** (Meta, gratis, funciona en Ollama)
- **Qwen 2.5** (Alibaba, gratis, funciona en Ollama)
- **Qwen 3.6 Plus Free** (Alibaba, online, gratis vía OpenCode Zen)
- **Mistral** (gratis, funciona en Ollama)
- **GPT-4/5** (OpenAI, pago)
- **Claude** (Anthropic, pago)

### 4. Opencode
Es el asistente que estás usando ahora. Se conecta a un modelo de IA y te ayuda a:
- Escribir código
- Crear aplicaciones
- Resolver problemas
- Aprender programación conversando en español

## Tu Configuración Actual (Mayo 2026)

### Lo que tenés instalado:
| Herramienta | Estado | ¿Lo necesitás? |
|---|---|---|
| **Warp** | Instalado | Sí (o cualquier terminal) |
| **Opencode** | Instalado | Sí (tu asistente principal) |
| **Ollama** | Instalado pero **NO corriendo** | No para tu flujo actual |
| **LM Studio** | Instalado | Opcional (para probar modelos) |
| **Claude Code** | Instalado | No (requiere pago) |

### Tu flujo de trabajo actual:
```
Warp (terminal) → Opencode (asistente) → OpenCode Zen (proveedor) → Qwen3.6 Plus Free (modelo online) → Respuesta
```

**Importante:** No necesitás Ollama para este flujo. Opencode ya viene con acceso a OpenCode Zen integrado.

### Modelos disponibles en tu configuración:

**OpenCode Zen (Gratis):**
- Qwen3.6 Plus Free ⭐ (recomendado)
- Big Pickle
- DeepSeek V4 Flash Free
- MiniMax M2.5 Free
- Nemotron 3 Super Free

**GitHub Copilot (con tu cuenta):**
- Claude Haiku 4.5
- Claude Opus 4.5/4.6/4.7
- Claude Sonnet 4.5/4.6
- GPT-4.1, GPT-4o, GPT-5-mini

### Comandos útiles de Opencode:
- `/models` - Ver lista de modelos disponibles y el activo
- `/info` - Ver info de la sesión actual
- `/exit` o Ctrl+D - Salir de opencode

## Comparación de Modelos Gratuitos

### Límites del Plan Gratuito

| | Qwen 3.6 Plus Free | Claude Sonnet 4.6 | Gemini 3.1 Flash-Lite |
|---|---|---|---|
| **Costo** | Gratis (preview) | Gratis | Gratis |
| **Límite mensajes** | Sin límite claro | ~15-40 mensajes cada 5 horas | ~1000 requests/día |
| **Contexto** | 1M tokens | 200K tokens | 1M tokens |
| **Datos usados para training** | Sí | Sí | Sí |
| **Necesita tarjeta** | No | No | No |

### Calidad para Programar

| | Qwen 3.6 Plus Free | Claude Sonnet 4.6 | Gemini 3.1 Flash-Lite |
|---|---|---|---|
| **Nivel** | Flagship (top) | Medio-alto | Básico/eficiente |
| **Coding** | Excelente (SWE-bench 72-80) | Muy bueno | Adecuado para tareas simples |
| **Razonamiento** | Integrado (piensa antes) | Thinking mode | Mínimo |
| **Velocidad** | ~10s primera respuesta | Rápido | Muy rápido |

### Tu Problema con Claude
Claude free te limita a **~15-40 mensajes cada 5 horas**. Es muy restrictivo si trabajás seguido. No hay forma de evitarlo sin pagar $20/mes (Pro).

### Recomendación Práctica
| Situación | Mejor opción |
|---|---|
| **Trabajo diario intensivo** | Qwen 3.6 Plus Free (sin límites estrictos) |
| **Tareas rápidas y simples** | Gemini 3.1 Flash-Lite (1000/día, muy rápido) |
| **Cuando necesitás calidad máxima** | Claude Sonnet 4.6 (usá con moderación) |

## Diferencias: Local vs Online

| | Local (Ollama) | Online (OpenCode Zen, Gemini, etc.) |
|---|---|---|
| **Costo** | Gratis | Gratis con límites |
| **Velocidad** | Depende de tu PC | Más rápido |
| **Privacidad** | Todo queda en tu PC | Datos van a servidores |
| **Modelos** | Los más livianos | Los más potentes |
| **Internet** | No necesario (después de descargar) | Siempre necesario |
| **Límites de uso** | Sin límites | Límites diarios/mensuales |

## Comandos Útiles de Ollama (si lo usás en el futuro)

```bash
# Descargar un modelo
ollama pull llama3.2

# Ver modelos instalados
ollama list

# Chatear directamente con un modelo
ollama run llama3.2

# Borrar un modelo
ollama rm llama3.2

# Ver si Ollama está corriendo
ollama serve
```

## Modelos Recomendados para Empezar (Local con Ollama)

| Modelo | Tamaño | Ideal para |
|--------|--------|------------|
| **llama3.2** | 3B | PCs con poca RAM (8GB) |
| **llama3.2:latest** | 3B | Uso general |
| **qwen2.5-coder** | 7B | Programación |
| **llama3.1:8b** | 8B | PCs con 16GB RAM |
| **mistral** | 7B | Buen balance calidad/rendimiento |

## Conceptos Clave

### ¿Qué es una API?
Es como un "enchufe" que permite que dos programas hablen entre sí.
- Opencode se "enchufa" a Ollama por API local
- Opencode se "enchufa" a OpenCode Zen por API online
- Claude Code se "enchufa" a Anthropic por API online

### ¿Qué es una API Key?
Es como una contraseña que te da acceso a un servicio online.
- Google Gemini: API key gratis
- Groq: API key gratis
- OpenAI: requiere tarjeta de crédito (pago por uso)
- Anthropic: requiere tarjeta de crédito (pago por uso)
- OpenCode Zen: No necesita API key (integrado en opencode)

### ¿Qué es un "prompt"?
Es lo que le escribís a la IA. Ejemplo:
- "Creame una página web con un formulario de contacto"
- "Explicame cómo funciona un bucle for en Python"

## Recomendación para tu Camino

1. **Usá Opencode con Qwen3.6 Plus Free** como tu asistente principal (ya configurado)
2. **Warp** queda si te gusta, sino usá PowerShell normal
3. **Ollama** dejalo instalado por si algún día querés probar modelos locales
4. **LM Studio** sirve para probar modelos visualmente (opcional)
5. **Claude Code** requiere pago, podés dejarlo para después

## Próximo Paso Sugerido

Empezar a usar Opencode con Qwen3.6 Plus Free para crear tus primeras aplicaciones.

---

## Tu Proyecto: App de Cabañas

### Estructura de Archivos

| Archivo | Para qué sirve | Dónde se usa |
|---------|---------------|--------------|
| **`index.html`** (120 KB) | App completa con todo adentro (CSS + JS + HTML) | **GitHub Pages** → los usuarios abren esta URL |
| **`index-gas.html`** (16 KB) | Versión liviana que usa `include()` | **Google Apps Script** → como archivo HTML en GAS |
| **`style.html`** (32 KB) | Solo los estilos CSS | **Google Apps Script** → como archivo HTML en GAS |
| **`script.html`** (76 KB) | Solo el JavaScript | **Google Apps Script** → como archivo HTML en GAS |
| **`Codigo_AppScript.gs`** | Backend que guarda/lee de Google Sheets | **Google Apps Script** → como archivo .gs en GAS |

### Cómo Funciona

```
USUARIOS (celular/PC)
       │
       ▼
  GitHub Pages (index.html)  ←  URL simple que compartís
       │
       │  (llama a la API de Google)
       ▼
  Google Apps Script (Codigo_AppScript.gs)  ←  "caja negra"
       │
       ▼
  Google Sheets  ←  donde se guardan los datos
```

### Qué Actualizar y Dónde

**Cuando trabajás conmigo (opencode):**
1. Editamos los archivos en `C:\Users\Cromi\curso-opencode\`
2. Yo genero automáticamente ambas versiones (`index.html` + `index-gas.html`)

**Para publicar cambios:**

| Qué cambiaste | Qué subís | Dónde |
|--------------|-----------|-------|
| HTML/CSS/JS (frontend) | `index.html` | GitHub Pages (reemplazás el archivo) |
| Backend (lógica del servidor) | `Codigo_AppScript.gs` + `index-gas.html` + `style.html` + `script.html` | Google Apps Script → Implementar → Nueva versión |

**Importante:** Si solo cambiaste el frontend (colores, textos, diseño), solo necesitás actualizar `index.html` en GitHub Pages. Si cambiaste la lógica del servidor (cómo se guardan datos, mantenimiento, etc.), necesitás actualizar Google Apps Script.

### Claves que usás

| Concepto | Valor |
|----------|-------|
| Sheet ID | `1dvfBmFWT1ejwdIEZDGja9WGn9V2PZnoGFXV97o7qkgk` |
| API URL | `https://script.google.com/macros/s/AKfycbws_p84N9HlqiRGF15gl6hWpMCk7l2UyXGb91vl-1RTfEpQ8M5QlOFdqcIFFeU7KaXA/exec` |
| Access Token | `CabanasCatamarca2026#Adriana` |
| Admin Key | `CabanasCatamarca2026#Adriana_ADMIN` |
