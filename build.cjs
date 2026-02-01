#!/usr/bin/env node

/**
 * Prosty skrypt do transpilacji TypeScript do JavaScript
 * bez zewnętrznych zależności
 */

const fs = require('fs');
const path = require('path');

function removeTypes(tsCode) {
  // Usuwa typy TypeScript (uproszczona wersja)
  return tsCode
    // Usuń importy typów
    .replace(/import\s+type\s+\{[^}]+\}\s+from\s+['"'][^'"]+['"];?/g, '')
    // Usuń deklaracje typów z parametrów funkcji
    .replace(/(\w+)\s*:\s*[A-Z]\w+(<[^>]+>)?(\[\])?/g, '$1')
    // Usuń typy zwracane z funkcji
    .replace(/\):\s*[A-Z]\w+(<[^>]+>)?(\[\])?(\s*\{)/g, ')$3')
    // Usuń typy z deklaracji zmiennych
    .replace(/:\s*[A-Z]\w+(<[^>]+>)?(\[\])?(\s*=)/g, '$3')
    // Usuń interfejsy
    .replace(/interface\s+\w+\s*\{[^}]+\}/gs, '')
    // Usuń typy z deklaracji właściwości
    .replace(/(\w+)\s*:\s*[A-Z]\w+(<[^>]+>)?(\[\])?\s*;/g, '$1;')
    // Zmień .ts na .js w importach
    .replace(/from\s+['"]([^'"]+)\.ts['"]/g, 'from \'$1.js\'')
    .replace(/from\s+['"]([^'"]+)\.tsx['"]/g, 'from \'$1.js\'');
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const jsContent = removeTypes(content);
  const newPath = filePath.replace(/\.tsx?$/, '.js');
  
  if (newPath !== filePath) {
    fs.writeFileSync(newPath, jsContent, 'utf8');
    console.log(`✓ ${path.basename(filePath)} → ${path.basename(newPath)}`);
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && file !== 'node_modules' && file !== '.git') {
      processDirectory(fullPath);
    } else if (file.match(/\.(ts|tsx)$/)) {
      processFile(fullPath);
    }
  }
}

console.log('🔄 Transpilacja TypeScript → JavaScript...\n');
processDirectory('./src');
console.log('\n✅ Gotowe!');
