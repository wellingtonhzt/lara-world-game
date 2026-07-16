import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

let errors = 0;

function read(path) {
  try {
    return readFileSync(join(root, path), 'utf8');
  } catch {
    return null;
  }
}

const versionJs = read('src/version.js');
if (!versionJs) {
  console.error('ERRO: src/version.js nao encontrado');
  process.exit(1);
}

const versionMatch = versionJs.match(/APP_VERSION\s*=\s*'([^']+)'/);
if (!versionMatch) {
  console.error('ERRO: APP_VERSION nao encontrado em src/version.js');
  process.exit(1);
}

const expected = versionMatch[1];
console.log(`Fonte oficial: src/version.js => ${expected}`);

function checkFile(path, label, pattern) {
  const content = read(path);
  if (!content) {
    console.error(`ERRO: ${label} (${path}) nao encontrado`);
    errors++;
    return;
  }
  const match = content.match(pattern);
  if (!match) {
    console.error(`ERRO: ${label} (${path}) — versao nao encontrada`);
    errors++;
    return;
  }
  if (match[1] !== expected && !match[1].startsWith(expected)) {
    console.error(`ERRO: ${label} (${path}) — esperava "${expected}", encontrou "${match[1]}"`);
    errors++;
  } else {
    console.log(`  OK  ${label}`);
  }
}

checkFile('src/index.html', 'Cache-busting CSS', /\?v=([^"']+)/);
checkFile('src/index.html', 'Cache-busting JS', /game\.js\?v=([^"']+)/);
checkFile('src/index.html', 'Footer version', /menu-version[^>]*>(v?[^<]+)/);

const mdPattern = /\*\*v0\.\d+\.\d+-preview\*\*\s*\|\s*\w+\/\d{4}\s*\|\s*✅ \*\*Ativo\*\*/;
const readme = read('README.md');
if (readme) {
  const activeRow = readme.match(/\*\*v([\d.]+-preview)\*\*\s*\|\s*\w+\/\d{4}\s*\|\s*✅ \*\*Ativo\*\*/);
  if (activeRow && activeRow[1] !== expected.slice(1)) {
    console.error(`ERRO: README.md — linha Ativo esperava "${expected}", encontrou "v${activeRow[1]}"`);
    errors++;
  } else if (activeRow) {
    console.log(`  OK  README.md (Ativo)`);
  } else {
    console.error('ERRO: README.md — linha Ativo nao encontrada');
    errors++;
  }
} else {
  console.error('ERRO: README.md nao encontrado');
  errors++;
}

const visaoGeral = read('docs/visao-geral.md');
if (visaoGeral) {
  const atualmente = visaoGeral.match(/v([\d.]+-preview)\s*\(Atual\)/);
  if (atualmente && atualmente[1] !== expected.slice(1)) {
    console.error(`ERRO: docs/visao-geral.md — esperava "${expected}", encontrou "v${atualmente[1]}"`);
    errors++;
  } else if (atualmente) {
    console.log(`  OK  docs/visao-geral.md`);
  } else {
    console.error('ERRO: docs/visao-geral.md — secao (Atual) nao encontrada');
    errors++;
  }
} else {
  console.error('ERRO: docs/visao-geral.md nao encontrado');
  errors++;
}

if (errors === 0) {
  console.log(`\nTodas as referencias estao sincronizadas em ${expected}.`);
} else {
  console.log(`\n${errors} erro(s) encontrado(s).`);
  process.exit(1);
}
