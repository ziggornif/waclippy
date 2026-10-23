import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname, sep } from 'node:path';

const preview = process.argv.includes('--preview');
const root = fileURLToPath(new URL(preview ? '../dist/' : '../', import.meta.url));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png' };
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = resolve(root, `.${pathname === '/' ? (preview ? '/index.html' : '/demo/index.html') : pathname}`);
    if (!file.startsWith(root.endsWith(sep) ? root : root + sep)) {
      res.writeHead(403).end();
      return;
    }
    const content = await readFile(file);
    res.writeHead(200, { 'Content-Type': `${types[extname(file)] ?? 'application/octet-stream'}; charset=utf-8` });
    res.end(content);
  } catch {
    res.writeHead(404).end('Introuvable');
  }
});
server.listen(4173, '127.0.0.1', () => console.log('Démo : http://127.0.0.1:4173'));
