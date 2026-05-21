// ============================================================
//  CABAÑAS - SISTEMA DE RESERVAS
//  Google Apps Script  (pegar en script.google.com)
//  Versión 4.2 — Corrección setValues + Blindaje
// ============================================================
const SHEET_ID    = '1dvfBmFWT1ejwdIEZDGja9WGn9V2PZnoGFXV97o7qkgk';
const SHEET_NAME  = 'Reservas';
const CONFIG_SHEET_NAME = 'Config';
const ACCESS_TOKEN = 'CabanasCatamarca2026#Adriana';
const COLS = [
  'ID', 'Cabaña', 'Tipo', 'Estado', 'Nombre', 'DNI_CUIT', 
  'Telefono', 'Email', 'Direccion', 'Entrada', 'Salida', 
  'Noches', 'Pago', 'Monto', 'Observaciones', 'Socio', 
  'Cargada', 'NotaInterna'
];
const CONFIG_COLS = ['id', 'nombre', 'tarifa', 'capacidad', 'descripcion'];
function buildResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
// ── GET: devuelve todas las reservas ─────────────────────────
function doGet(e) {
  if (!e.parameter || e.parameter.token !== ACCESS_TOKEN) {
    return buildResponse({ ok: false, error: 'Acceso no autorizado' });
  }
  try {
    const ss    = SpreadsheetApp.openById(SHEET_ID);
    const sheet = getOrCreateSheet(ss);
    verificarConfiguracion(ss);
    // 1. PRIORIDAD: Verificar estado de mantenimiento global
    const props = PropertiesService.getScriptProperties();
    const enMantenimiento = props.getProperty('mantenimiento_activo') === 'true';
    
    // Si está en mantenimiento, verificar si es admin para darle acceso
    const isAdmin = e.parameter.adminKey === 'CabanasCatamarca2026#Adriana_ADMIN';
    
    if (enMantenimiento && !isAdmin) {
      CacheService.getScriptCache().removeAll(['reservas_data']);
      return buildResponse({ ok: true, mantenimiento: true, reservas: [] });
    }
    // Si es admin, ignoramos el bloqueo de mantenimiento y seguimos para devolver datos
    // 2. Si NO hay mantenimiento, usar caché para velocidad
    const cache = CacheService.getScriptCache();
    const cached = cache.get('reservas_data');
    if (cached) {
      return buildResponse({ ok: true, mantenimiento: false, reservas: JSON.parse(cached), cached: true });
    }
    // 3. Leer hoja si no hay caché
    const rows = sheet.getDataRange().getValues();
    if (rows.length <= 1) return buildResponse({ ok: true, mantenimiento: false, reservas: [], config: leerConfig(ss) });
    const reservas = rows.slice(1)
      .filter(row => row[0] !== '' && row[0] !== null)
      .map(row => {
        const obj = {};
        COLS.forEach((col, i) => {
          let val = row[i];
          if (val instanceof Date) {
            const y = val.getFullYear();
            const m = String(val.getMonth() + 1).padStart(2, '0');
            const d = String(val.getDate()).padStart(2, '0');
            val = y + '-' + m + '-' + d;
          }
          obj[col] = (val || '').toString();
        });
        return obj;
      });
    // Guardar en caché por 30 segundos
    cache.put('reservas_data', JSON.stringify(reservas), 30);
    return buildResponse({ ok: true, mantenimiento: false, reservas, config: leerConfig(ss) });
  } catch (err) {
    return buildResponse({ ok: false, error: err.message });
  }
}
// ── POST: crear, editar, eliminar o mantenimiento ────────────
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    if (payload.token !== ACCESS_TOKEN) {
      return buildResponse({ ok: false, error: 'Acceso no autorizado' });
    }
    // Acción de mantenimiento global
    if (payload.action === 'mantenimiento') {
      const props = PropertiesService.getScriptProperties();
      const cache = CacheService.getScriptCache();
      
      if (payload.estado === true) {
        props.setProperty('mantenimiento_activo', 'true');
        cache.removeAll(['reservas_data']);
        return buildResponse({ ok: true, mensaje: 'Mantenimiento activado globalmente' });
      } else {
        props.deleteProperty('mantenimiento_activo');
        cache.removeAll(['reservas_data']);
        return buildResponse({ ok: true, mensaje: 'Mantenimiento desactivado' });
      }
    }
    const ss    = SpreadsheetApp.openById(SHEET_ID);
    const sheet = getOrCreateSheet(ss);
    verificarConfiguracion(ss);
    if (payload.action === 'crear')    return crearReserva(sheet, payload.reserva);
    if (payload.action === 'editar')   return editarReserva(sheet, payload.id, payload.reserva);
    if (payload.action === 'eliminar') return eliminarReserva(sheet, payload.id);
    if (payload.action === 'config')   return guardarConfigSheet(ss, payload.config);
    return buildResponse({ ok: false, error: 'Accion desconocida' });
  } catch (err) {
    return buildResponse({ ok: false, error: err.message });
  }
}
// ── Verificar configuración (solo primera vez) ──────────────
function verificarConfiguracion(ss) {
  const props = PropertiesService.getScriptProperties();
  if (props.getProperty('setup_done') === 'true') return;
  
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (sheet) {
    repararEncabezados(sheet);
    setColumnWidths(sheet);
    props.setProperty('setup_done', 'true');
  }
}
// ─ PUNTO 1: Crear reserva con LockService ───────────────────
function crearReserva(sheet, r) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
  } catch (e) {
    return buildResponse({ ok: false, error: 'El servidor está ocupado procesando otra reserva. Intentá nuevamente en unos segundos.' });
  }
  try {
    const rows = sheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row[0]) continue;
      const cab = row[COLS.indexOf('Cabaña')];
      const ent = (row[COLS.indexOf('Entrada')] || '').toString();
      const sal = (row[COLS.indexOf('Salida')]  || '').toString();
      if (cab === r.cabaña && r.entrada < sal && r.salida > ent && r.entrada !== sal) {
        return buildResponse({
          ok: false, conflicto: true,
          error: 'Conflicto: ' + cab + ' ya fue reservada por ' + row[COLS.indexOf('Nombre')] + ' en esas fechas.'
        });
      }
    }
    const noches     = Math.round((new Date(r.salida) - new Date(r.entrada)) / 86400000);
    const id         = Date.now().toString();
    const cargada    = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Cordoba' });
    const entradaStr = r.entrada.substring(0, 10);
    const salidaStr  = r.salida.substring(0, 10);
    const newRow = [
      id, r.cabaña, r.tipo, r.estado, r.nombre, r.dni,
      r.tel||'', r.email||'', r.dir||'',
      entradaStr, salidaStr, noches,
      r.pago||'', r.monto||'', r.obs||'',
      r.socio||'', cargada, r.notaInterna||''
    ];
    sheet.appendRow(newRow);
    aplicarEstilosFila(sheet, sheet.getLastRow(), r.estado, newRow.length);
    return buildResponse({ ok: true, id, noches, cargada });
  } catch (err) {
    return buildResponse({ ok: false, error: err.message });
  } finally {
    lock.releaseLock();
  }
}
// ── PUNTO 2: Editar reserva in-situ (no destructiva) ─────────
function editarReserva(sheet, id, r) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
  } catch (e) {
    return buildResponse({ ok: false, error: 'El servidor está ocupado. Reintentá en unos segundos.' });
  }
  try {
    const rows = sheet.getDataRange().getValues();
    let rowIndex = -1;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0].toString() === id.toString()) {
        rowIndex = i + 1;
        break;
      }
    }
    if (rowIndex === -1) {
      return buildResponse({ ok: false, error: 'No se encontró la reserva original para actualizar.' });
    }
    for (let i = 1; i < rows.length; i++) {
      if (i + 1 === rowIndex) continue;
      const row = rows[i];
      if (!row[0]) continue;
      const cab = row[COLS.indexOf('Cabaña')];
      const ent = (row[COLS.indexOf('Entrada')] || '').toString();
      const sal = (row[COLS.indexOf('Salida')]  || '').toString();
      if (cab === r.cabaña && r.entrada < sal && r.salida > ent && r.entrada !== sal) {
        return buildResponse({
          ok: false, conflicto: true,
          error: 'Conflicto: ' + cab + ' ya está reservada por ' + row[COLS.indexOf('Nombre')] + ' en esas fechas.'
        });
      }
    }
    const noches     = Math.round((new Date(r.salida) - new Date(r.entrada)) / 86400000);
    const entradaStr = r.entrada.substring(0, 10);
    const salidaStr  = r.salida.substring(0, 10);
    const cargadaOriginal = (rows[rowIndex - 1][COLS.indexOf('Cargada')] || '').toString();
    const updatedRow = [
      id, r.cabaña, r.tipo, r.estado, r.nombre, r.dni,
      r.tel||'', r.email||'', r.dir||'',
      entradaStr, salidaStr, noches,
      r.pago||'', r.monto||'', r.obs||'',
      r.socio||'', cargadaOriginal, r.notaInterna||''
    ];
    // CORRECCIÓN: Forzamos explícitamente matriz 2D y usamos setValues con rango exacto
    const range = sheet.getRange(rowIndex, 1, 1, COLS.length);
    range.setValues([updatedRow]);
    aplicarEstilosFila(sheet, rowIndex, r.estado, COLS.length);
    return buildResponse({ ok: true, id, noches, cargada: cargadaOriginal });
  } catch (err) {
    return buildResponse({ ok: false, error: err.message });
  } finally {
    lock.releaseLock();
  }
}
// ── Eliminar reserva (con LockService) ───────────────────────
function eliminarReserva(sheet, id) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
  } catch (e) {
    return buildResponse({ ok: false, error: 'El servidor está ocupado. Reintentá en unos segundos.' });
  }
  try {
    const rows = sheet.getDataRange().getValues();
    for (let i = rows.length - 1; i >= 1; i--) {
      if (rows[i][0].toString() === id.toString()) {
        sheet.deleteRow(i + 1);
        return buildResponse({ ok: true });
      }
    }
    return buildResponse({ ok: false, error: 'Reserva no encontrada.' });
  } catch (err) {
    return buildResponse({ ok: false, error: err.message });
  } finally {
    lock.releaseLock();
  }
}
// ─ Aplicar estilos de color por estado ──────────────────────
function aplicarEstilosFila(sheet, rowIndex, estado, columnsCount) {
  const rowRange = sheet.getRange(rowIndex, 1, 1, columnsCount);
  rowRange.setVerticalAlignment('middle');
  const dateCols = [COLS.indexOf('Entrada') + 1, COLS.indexOf('Salida') + 1];
  dateCols.forEach(col => sheet.getRange(rowIndex, col).setNumberFormat('@STRING@'));
  let bg = '#ffffff';
  if      (estado === 'Ocupada')       bg = '#fce8e6';
  else if (estado === 'Confirmada')    bg = '#fef7e0';
  else if (estado === 'No confirmada') bg = '#fffde7';
  
  // CORRECCIÓN: setBackgrounds espera [[color1, color2, ...]] (1 fila, N columnas)
  const bgs = [Array(columnsCount).fill(bg)];
  rowRange.setBackgrounds(bgs);
  const ec = sheet.getRange(rowIndex, COLS.indexOf('Estado') + 1);
  if      (estado === 'Ocupada')       { ec.setBackground('#b80000'); ec.setFontColor('#ffffff'); }
  else if (estado === 'Confirmada')    { ec.setBackground('#FF8C00'); ec.setFontColor('#ffffff'); }
  else if (estado === 'No confirmada') { ec.setBackground('#FAD201'); ec.setFontColor('#5a4300'); }
  ec.setFontWeight('bold');
}
// ── Reparar encabezados si faltan ─────────────────────────────
function repararEncabezados(sheet) {
  const primera = sheet.getRange(1, 1).getValue().toString();
  if (primera !== 'ID') {
    sheet.insertRowBefore(1);
    const hr = sheet.getRange(1, 1, 1, COLS.length);
    hr.setValues([COLS]);
    hr.setBackground('#1a73e8');
    hr.setFontColor('#ffffff');
    hr.setFontWeight('bold');
    hr.setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
    setColumnWidths(sheet);
  }
  const lastCol = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  if (!headers.includes('NotaInterna')) {
    const nextCol = lastCol + 1;
    const cell = sheet.getRange(1, nextCol);
    cell.setValue('NotaInterna');
    cell.setBackground('#1a73e8');
    cell.setFontColor('#ffffff');
    cell.setFontWeight('bold');
    sheet.setColumnWidth(nextCol, 200);
  }
}
// ── Crear hoja si no existe ───────────────────────────────────
function getOrCreateSheet(ss) {
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    const hr = sheet.getRange(1, 1, 1, COLS.length);
    hr.setValues([COLS]);
    hr.setBackground('#1a73e8');
    hr.setFontColor('#ffffff');
    hr.setFontWeight('bold');
    hr.setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
    setColumnWidths(sheet);
  }
  return sheet;
}
// ── Anchos de columna ────────────────────────────────────────
function setColumnWidths(sheet) {
  [130,100,100,150,180,120,130,180,200,100,100,70,130,100,200,100,160,200]
    .forEach((w, i) => sheet.setColumnWidth(i + 1, w));
}

// ── Incluir archivos HTML separados (patrón GAS include) ────
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// ═══════════════════════════════════════════════════════════
//  CONFIGURACIÓN DE CABAÑAS (hoja "Config")
// ═══════════════════════════════════════════════════════════

function getOrCreateConfigSheet(ss) {
  let sheet = ss.getSheetByName(CONFIG_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG_SHEET_NAME);
    const hr = sheet.getRange(1, 1, 1, CONFIG_COLS.length);
    hr.setValues([CONFIG_COLS]);
    hr.setBackground('#1a73e8');
    hr.setFontColor('#ffffff');
    hr.setFontWeight('bold');
    hr.setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
    // Crear config por defecto para 8 cabañas
    const defaultRows = [];
    for (let i = 1; i <= 8; i++) {
      defaultRows.push([i.toString(), 'Cabaña ' + i, 0, 0, '']);
    }
    if (defaultRows.length > 0) {
      sheet.getRange(2, 1, defaultRows.length, CONFIG_COLS.length).setValues(defaultRows);
    }
  }
  return sheet;
}

function leerConfig(ss) {
  try {
    const sheet = getOrCreateConfigSheet(ss);
    const rows = sheet.getDataRange().getValues();
    if (rows.length <= 1) return [];
    return rows.slice(1)
      .filter(row => row[0] !== '' && row[0] !== null)
      .map(row => {
        const obj = {};
        CONFIG_COLS.forEach((col, i) => {
          obj[col] = (row[i] || '').toString();
        });
        return obj;
      });
  } catch (e) {
    return [];
  }
}

function guardarConfigSheet(ss, config) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (e) {
    return buildResponse({ ok: false, error: 'Servidor ocupado. Intentá de nuevo.' });
  }
  try {
    const sheet = getOrCreateConfigSheet(ss);
    // Borrar todo excepto encabezados
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.getRange(2, 1, lastRow - 1, CONFIG_COLS.length).clearContent();
    }
    // Escribir nueva config
    if (config && config.length > 0) {
      const rows = config.map(c => [
        c.id.toString(),
        c.nombre || '',
        Number(c.tarifa) || 0,
        Number(c.capacidad) || 0,
        c.descripcion || ''
      ]);
      sheet.getRange(2, 1, rows.length, CONFIG_COLS.length).setValues(rows);
    }
    return buildResponse({ ok: true, mensaje: 'Configuración guardada' });
  } catch (err) {
    return buildResponse({ ok: false, error: err.message });
  } finally {
    lock.releaseLock();
  }
}
