// ═══════════════════════════════════════════════════════════
//  MINIFY GENÉRICO — curso-opencode/tools/minify.js
//  Usa html-minifier-terser (instalado globalmente)
//  Uso: node <ruta-a-este-script> [--config archivo.json]
//       node <ruta-a-este-script> --input index.html --output index.min.html
// ═══════════════════════════════════════════════════════════

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ── Parsear argumentos ──────────────────────────────────────
const args = process.argv.slice(2);
let configFile = null;
let inputFile = null;
let outputFile = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--config' && args[i + 1]) {
    configFile = args[++i];
  } else if (args[i] === '--input' && args[i + 1]) {
    inputFile = args[++i];
  } else if (args[i] === '--output' && args[i + 1]) {
    outputFile = args[++i];
  }
}

// ── Cargar configuración ────────────────────────────────────
let jobs = [];

if (configFile) {
  // Config desde archivo JSON
  const configPath = path.resolve(configFile);
  if (!fs.existsSync(configPath)) {
    console.error(`❌ No se encontró: ${configPath}`);
    process.exit(1);
  }
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  jobs = config.jobs || [];
} else if (inputFile && outputFile) {
  // Config desde argumentos directos
  jobs = [{ input: inputFile, output: outputFile }];
} else {
  // Buscar minify.config.json en el directorio actual
  const localConfig = path.resolve('minify.config.json');
  if (fs.existsSync(localConfig)) {
    const config = JSON.parse(fs.readFileSync(localConfig, 'utf8'));
    jobs = config.jobs || [];
  } else {
    console.log('📋 Uso:');
    console.log('  node minify.js --input archivo.html --output archivo.min.html');
    console.log('  node minify.js --config minify.config.json');
    console.log('');
    console.log('📋 O crear un archivo minify.config.json en el directorio actual:');
    console.log(JSON.stringify({
      jobs: [
        { input: 'index.html', output: 'index.min.html' }
      ]
    }, null, 2));
    process.exit(0);
  }
}

// ── Opciones de minificación (robustas) ─────────────────────
const minifyOptions = [
  '--collapse-whitespace',
  '--remove-comments',
  '--remove-optional-tags',
  '--remove-redundant-attributes',
  '--remove-script-type-attributes',
  '--remove-tag-whitespace',
  '--use-short-doctype',
  '--minify-css true',
  '--minify-js true',
  '--collapse-boolean-attributes',
  '--conservative-collapse',
  '--decode-entities',
  '--sort-attributes',
  '--sort-class-name',
];

// ── Ejecutar minificación ───────────────────────────────────
console.log('🚀 Iniciando minificación con html-minifier-terser...\n');

let totalSaved = 0;
let totalOriginal = 0;
let successCount = 0;
let errorCount = 0;

jobs.forEach((job, index) => {
  const inputPath = path.resolve(job.input);
  const outputPath = path.resolve(job.output);

  if (!fs.existsSync(inputPath)) {
    console.error(`❌ [${index + 1}/${jobs.length}] No se encontró: ${inputPath}`);
    errorCount++;
    return;
  }

  const originalSize = fs.statSync(inputPath).size;
  totalOriginal += originalSize;

  try {
    // Construir comando
    const cmd = [
      'html-minifier-terser',
      `"${inputPath}"`,
      `-o "${outputPath}"`,
      ...minifyOptions
    ].join(' ');

    execSync(cmd, { stdio: 'pipe' });

    const minSize = fs.statSync(outputPath).size;
    const saved = originalSize - minSize;
    const savings = ((saved / originalSize) * 100).toFixed(1);
    totalSaved += saved;
    successCount++;

    console.log(`✅ [${index + 1}/${jobs.length}] ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
    console.log(`   📄 Original: ${(originalSize / 1024).toFixed(1)} KB`);
    console.log(`   📦 Minificado: ${(minSize / 1024).toFixed(1)} KB`);
    console.log(`   💾 Ahorro: ${savings}%\n`);
  } catch (err) {
    console.error(`❌ [${index + 1}/${jobs.length}] Error minificando ${path.basename(inputPath)}:`);
    console.error(`   ${err.message}\n`);
    errorCount++;
  }
});

// ── Resumen ──────────────────────────────────────────────────
console.log('═══════════════════════════════════════════════');
console.log(`📊 Resumen: ${successCount} exitoso(s), ${errorCount} error(es)`);
console.log(`💾 Total ahorrado: ${(totalSaved / 1024).toFixed(1)} KB de ${(totalOriginal / 1024).toFixed(1)} KB (${((totalSaved / totalOriginal) * 100).toFixed(1)}%)`);
console.log('═══════════════════════════════════════════════');

if (errorCount > 0) {
  process.exit(1);
}
