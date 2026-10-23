import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const dist = new URL('../dist/', import.meta.url);
await rm(dist, { recursive: true, force: true });
await mkdir(new URL('demo/', dist), { recursive: true });
await cp(new URL('../src/', import.meta.url), new URL('src/', dist), { recursive: true });
for (const file of ['style.css', 'main.js']) {
  await cp(new URL(`../demo/${file}`, import.meta.url), new URL(`demo/${file}`, dist));
}
// Les chemins relatifs fonctionnent également sous /waclippy/ sur GitHub Pages.
const html = await readFile(new URL('../demo/index.html', import.meta.url), 'utf8');
await writeFile(new URL('index.html', dist), html.replaceAll('="/demo/', '="./demo/').replaceAll('href="/"', 'href="./"'));
await writeFile(new URL('.nojekyll', dist), '');
console.log('Site de présentation généré dans dist/.');
