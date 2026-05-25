import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC = path.join(__dirname, '..', 'src');
const LOCALES = path.join(SRC, 'locales');
const EN_FILE = path.join(LOCALES, 'en.json');
const KM_FILE = path.join(LOCALES, 'km.json');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function (file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.js')) {
        results.push(file);
      }
    }
  });
  return results;
}

function slugify(s) {
  return s
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 60);
}

const files = walk(SRC).filter(p => p.includes(path.join('src', 'components')) || p.includes(path.join('src', 'pages')));

let en = JSON.parse(fs.readFileSync(EN_FILE, 'utf8'));
let km = JSON.parse(fs.readFileSync(KM_FILE, 'utf8'));

function setKey(obj, keyPath, value) {
  const parts = keyPath.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    cur[parts[i]] = cur[parts[i]] || {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

function hasKey(obj, keyPath) {
  const parts = keyPath.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length; i++) {
    if (!cur) return false;
    cur = cur[parts[i]];
  }
  return cur !== undefined;
}

let created = 0;

for (const file of files) {
  let src = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Match JSX text between >TEXT< (avoid tags with only whitespace or {{ )
  src = src.replace(/>([^<>\n]*?[A-Za-z0-9\u1780-\u17FF][^<>\n]*?)</g, (m, text) => {
    const trimmed = text.trim();
    if (!trimmed) return `>${text}<`;
    if (trimmed.startsWith('{') || trimmed.endsWith('}')) return `>${text}<`;
    if (trimmed.length > 120) return `>${text}<`;
    // avoid replacing import/export lines or TypeScript types
    if (trimmed.includes('://')) return `>${text}<`;

    // create key using file path and slug
    const rel = path.relative(SRC, file).replace(/\\/g, '/').replace(/\.(tsx|ts|jsx|js)$/, '');
    const key = `${rel.replace(/\//g, '.')}.${slugify(trimmed)}`;
    if (!hasKey(en, key)) {
      setKey(en, key, trimmed);
      setKey(km, key, trimmed); // placeholder
      created++;
    }
    changed = true;
    return `{t('${key}', '${trimmed}')}` + '<';
  });

  // attributes like label="Text" title="Text" placeholder="Text"
  src = src.replace(/(label|title|placeholder|alt)=("|')([^"']{1,120}?)\2/g, (m, attr, q, val) => {
    const trimmed = val.trim();
    if (!trimmed) return m;
    const rel = path.relative(SRC, file).replace(/\\/g, '/').replace(/\.(tsx|ts|jsx|js)$/, '');
    const key = `${rel.replace(/\//g, '.')}.${slugify(trimmed)}`;
    if (!hasKey(en, key)) {
      setKey(en, key, trimmed);
      setKey(km, key, trimmed);
      created++;
    }
    changed = true;
    return `${attr}={t('${key}', '${trimmed}')}`;
  });

  if (changed) {
    fs.writeFileSync(file, src, 'utf8');
    console.log('Updated', file);
  }
}

fs.writeFileSync(EN_FILE, JSON.stringify(en, null, 2), 'utf8');
fs.writeFileSync(KM_FILE, JSON.stringify(km, null, 2), 'utf8');

console.log('Created keys:', created);
