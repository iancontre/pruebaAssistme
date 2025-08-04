const fs = require('fs');
const path = require('path');

// Archivos CSS específicos que sabemos que tienen problemas
const cssFiles = [
  './src/pages/DashboardPage.css',
  './src/components/Wizard/Wizard.css',
  './src/components/objetives/Objetives.css',
  './src/components/Intersection/Intersection.css',
  './src/components/contentBlog/ContentBlog.css'
];

function cleanCSSFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Archivo no encontrado: ${filePath}`);
      return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remover caracteres nulos
    content = content.replace(/\x00/g, '');
    
    // Remover comentarios CSS problemáticos
    content = content.replace(/\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g, '');
    
    // Remover líneas vacías múltiples
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Remover espacios en blanco al final de las líneas
    content = content.replace(/[ \t]+$/gm, '');
    
    // Escribir el archivo limpio
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Limpiado: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error limpiando ${filePath}:`, error.message);
  }
}

console.log('🧹 Iniciando limpieza de archivos CSS...');
cssFiles.forEach(cleanCSSFile);
console.log('✨ Limpieza completada!'); 