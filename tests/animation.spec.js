import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.clock.install();
  await page.goto('/demo/index.html');
  await page.evaluate(async () => {
    const { createWaclippy } = await import('/src/index.js');
    window.animated = createWaclippy({ message: 'Test animation' });
    window.baseWire = window.animated.element.shadowRoot.querySelector('.wire').getAttribute('d');
  });
});

test('chaque réaction déforme le fil, anime une expression et revient au repos', async ({ page }) => {
  for (const [name, selector] of [
    ['wave', '.hat'], ['think', '.brow-left'], ['celebrate', '.hat'],
    ['point', '.pupil'], ['fold', '.head'], ['surprised', '.eyes'], ['sleep', '.head'],
  ]) {
    await page.evaluate(name => window.animated.animate(name), name);
    await page.clock.runFor(800);
    const state = await page.evaluate(selector => {
      const root = window.animated.element.shadowRoot;
      const wires = [...root.querySelectorAll('.wire')].map(wire => wire.getAttribute('d'));
      return {
        deformed: wires[0] !== window.baseWire,
        aligned: wires.every(path => path === wires[0]),
        expression: getComputedStyle(root.querySelector(selector)).transform,
      };
    }, selector);
    expect(state.deformed, `${name} change la géométrie`).toBe(true);
    expect(state.aligned, `${name} conserve les couches du fil alignées`).toBe(true);
    expect(state.expression, `${name} anime le visage ou la casquette`).not.toBe('none');
    await page.clock.runFor(5000);
    const idle = await page.evaluate(() => ({
      name: window.animated.element.dataset.animation,
      restored: window.animated.element.shadowRoot.querySelector('.wire').getAttribute('d') === window.baseWire,
    }));
    expect(idle).toEqual({ name: 'idle', restored: true });
  }
});

test('enchaînement, arrêt, masquage et destruction ne laissent pas de pose figée', async ({ page }) => {
  await page.evaluate(() => window.animated.animate('fold'));
  await page.clock.runFor(900);
  await page.evaluate(() => window.animated.animate('wave').animate('point'));
  await page.clock.runFor(900);
  expect(await page.evaluate(() => window.animated.element.dataset.animation)).toBe('point');
  await page.evaluate(() => window.animated.animate('idle'));
  expect(await page.evaluate(() => window.animated.element.shadowRoot.querySelector('.wire').getAttribute('d') === window.baseWire)).toBe(true);
  await page.evaluate(() => window.animated.animate('sleep').hide());
  await page.clock.runFor(6000);
  expect(await page.evaluate(() => window.animated.element.dataset.animation)).toBe('idle');
  await page.evaluate(() => window.animated.show().animate('celebrate').destroy());
  await page.clock.runFor(6000);
  expect(await page.evaluate(() => window.animated.element.isConnected)).toBe(false);
});

test('la réduction des mouvements arrête aussi le morphing JavaScript', async ({ page }) => {
  await page.evaluate(() => window.animated.animate('fold'));
  await page.clock.runFor(900);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.runFor(100);
  await expect.poll(() => page.evaluate(() => window.animated.element.dataset.animation)).toBe('idle');
  await page.evaluate(() => window.animated.animate('surprised'));
  await page.clock.runFor(1000);
  const result = await page.evaluate(() => ({
    name: window.animated.element.dataset.animation,
    restored: window.animated.element.shadowRoot.querySelector('.wire').getAttribute('d') === window.baseWire,
    head: getComputedStyle(window.animated.element.shadowRoot.querySelector('.head')).animationName,
  }));
  expect(result).toEqual({ name: 'idle', restored: true, head: 'none' });
});

test('les sept réactions sont accessibles dans l’atelier', async ({ page }) => {
  await page.getByRole('button', { name: /Se faire tout petit/ }).click();
  await page.clock.runFor(900);
  await expect(page.locator('.message').first()).toContainText('Mon ego');
  await page.getByRole('button', { name: /Une micro-sieste/ }).click();
  await page.clock.runFor(1000);
  await expect(page.locator('.message').first()).toContainText('Zzz');
  await expect(page.locator('.sleep-mouth').first()).toBeVisible();
});
