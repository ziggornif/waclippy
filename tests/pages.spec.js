import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('le site publié charge ses ressources sous /waclippy/ et ses actions fonctionnent', async ({ page }) => {
  const failures = [];
  const types = { css: 'text/css', js: 'text/javascript', html: 'text/html' };
  await page.route('http://pages.test/**', async route => {
    const path = new URL(route.request().url()).pathname;
    if (!path.startsWith('/waclippy/') || path.includes('..')) {
      failures.push(path);
      await route.fulfill({ status: 404, body: 'Ressource hors du site' });
      return;
    }
    const file = path.slice('/waclippy/'.length) || 'index.html';
    try {
      const body = await readFile(new URL(`../dist/${file}`, import.meta.url));
      await route.fulfill({ body, contentType: types[file.split('.').at(-1)] });
    } catch {
      failures.push(path);
      await route.fulfill({ status: 404 });
    }
  });
  await page.goto('http://pages.test/waclippy/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('petit caractère');
  await expect(page.locator('.message')).toContainText('On dirait');
  await expect(page.locator('.card')).toHaveCount(7);
  await page.getByRole('button', { name: /Quelle surprise/ }).click();
  await expect(page.locator('.message')).toContainText('réussi sans mon aide');
  expect(failures).toEqual([]);
});
