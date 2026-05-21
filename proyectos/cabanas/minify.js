const fs = require('fs');

const inputFile = 'index.html';
const outputFile = 'index.min.html';

if (!fs.existsSync(inputFile)) {
  console.error(`❌ Error: No se encontró ${inputFile}`);
  process.exit(1);
}

let html = fs.readFileSync(inputFile, 'utf8');

// ── Minificación Segura ──

// 1. Eliminar comentarios HTML
html = html.replace(/<!--[\s\S]*?-->/g, '');

// 2. Eliminar comentarios de bloque JS/CSS
html = html.replace(/\/\*[\s\S]*?\*\//g, '');

// 3. Eliminar comentarios de línea JS (//) pero no URLs (http://)
html = html.replace(/(?<!:)\/\/.*$/gm, '');

// 4. Colapsar saltos de línea y espacios múltiples
html = html.replace(/\n/g, ' ');
html = html.replace(/\s{2,}/g, ' ');

// 5. Eliminar espacios entre etiquetas (ej: <div>  <p> -> <div><p>)
html = html.replace(/>\s+</g, '><');

// 6. Eliminar espacios al inicio y final
html = html.trim();

fs.writeFileSync(outputFile, html);

const originalSize = Buffer.byteLength(fs.readFileSync(inputFile, 'utf8'), 'utf8');
const minSize = Buffer.byteLength(html, 'utf8');
const savings = ((originalSize - minSize) / originalSize * 100).toFixed(1);

console.log(`✅ Minificación segura exitosa!`);
console.log(`📄 Original: ${(originalSize / 1024).toFixed(1)} KB`);
console.log(`📦 Minificado: ${(minSize / 1024).toFixed(1)} KB`);
console.log(`💾 Ahorro: ${savings}%`);
console.log(`📁 Archivo generado: ${outputFile}`);
