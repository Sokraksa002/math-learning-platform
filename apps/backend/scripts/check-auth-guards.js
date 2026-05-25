#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROUTES_DIR = path.resolve(__dirname, '..', 'src', 'routes');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    if (e.isDirectory()) files.push(...walk(path.join(dir, e.name)));
    else if (e.name.endsWith('.ts')) files.push(path.join(dir, e.name));
  }
  return files;
}

const routeFiles = walk(ROUTES_DIR);
const problems = [];

const httpMethods = ['post', 'put', 'delete', 'patch'];

const allowlistFiles = [
  'auth.ts',
  'certificate-verification.ts',
];

for (const file of routeFiles) {
  const base = path.basename(file);
  if (allowlistFiles.includes(base)) continue; // public endpoints
  const src = fs.readFileSync(file, 'utf8');
  for (const method of httpMethods) {
    const regex = new RegExp(`\\bapp\\.${method}\\s*\\(|\\bfastify\\.${method}\\s*\\(`, 'g');
    let match;
    while ((match = regex.exec(src))) {
      // Look ahead a small window to find preHandler usage
      const start = match.index;
      const window = src.slice(start, start + 800); // heuristics
      if (!/preHandler\s*:\s*(?:app\.|fastify\.)?authenticate|preHandler\s*:\s*(?:app\.|fastify\.)?requireAdmin/.test(window)) {
        problems.push({ file, method, snippet: window.split('\n')[0].trim() });
      }
    }
  }
}

if (problems.length > 0) {
  console.error('Found unprotected modifying route handlers:');
  for (const p of problems) {
    console.error(`- ${p.file} (${p.method}): ${p.snippet}`);
  }
  process.exit(2);
}

console.log('Auth guard check passed — all modifying handlers have preHandler authenticate/requireAdmin (heuristic).');
process.exit(0);
