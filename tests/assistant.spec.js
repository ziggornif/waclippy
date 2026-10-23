import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Une page hôte volontairement agressive vérifie l'isolation des styles.
  await page.goto('/demo/index.html');
});

test('parcours de dialogue, fermeture, réouverture et clavier', async ({ page }) => {
  await expect(page.getByRole('status')).toContainText('On dirait');
  await page.getByRole('button', { name: 'Oui, aide-moi' }).click();
  await expect(page.getByRole('status')).toContainText('Moi, c’est Waclippy');
  await page.getByRole('button', { name: 'Une victoire !', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Waaah');
  const mascot = page.getByRole('button', { name: 'Afficher ou masquer le dialogue Waclippy' });
  await mascot.focus();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('status')).toBeHidden();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toBeVisible();
  await expect(mascot).toHaveAttribute('aria-expanded', 'true');
});

test('les messages restent du texte et le widget tient dans un petit écran', async ({ page }) => {
  const literal = '<img src=x onerror="window.injected=true">';
  await page.locator('#message').fill(literal);
  await page.getByRole('button', { name: 'Faire parler' }).click();
  await expect(page.getByRole('status')).toHaveText(literal);
  expect(await page.evaluate(() => window.injected)).toBeUndefined();
  await page.addStyleTag({ content: 'button{background:red!important;padding:100px!important}section{display:none!important}' });
  const bubble = page.getByRole('region', { name: 'Dialogue Waclippy' });
  await expect(bubble).toBeVisible();
  const bounds = await bubble.boundingBox();
  const viewport = page.viewportSize();
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(viewport.width);
});

test('isolation des instances, erreurs asynchrones et destruction', async ({ page }) => {
  const result = await page.evaluate(async () => {
    const { createWaclippy } = await import('/src/index.js');
    const a = createWaclippy({ message: 'Instance A', visible: false });
    const b = createWaclippy({ message: 'Instance B', position: 'bottom-left' });
    const independent = a.element.hidden && !b.element.hidden;
    let caught;
    a.element.addEventListener('waclippy:error', event => { caught = event.detail.message; });
    a.say('Échec ?', [{ label: 'Tester', onClick: async () => { throw new Error('Échec attendu'); } }]);
    const button = a.element.shadowRoot.querySelector('.action');
    button.click();
    await new Promise(resolve => setTimeout(resolve, 0));
    const enabled = !button.disabled;
    a.animate('think');
    a.destroy();
    a.destroy();
    const removed = !a.element.isConnected;
    const survived = b.element.isConnected;
    b.destroy();
    return { independent, caught, enabled, removed, survived };
  });
  expect(result).toEqual({ independent: true, caught: 'Échec attendu', enabled: true, removed: true, survived: true });
});

test('boutons bloqués pendant une action asynchrone et nouveau dialogue utilisable', async ({ page }) => {
  await page.evaluate(async () => {
    const { createWaclippy } = await import('/src/index.js');
    window.testAssistant = createWaclippy({
      message: 'Chargement',
      buttons: [{ label: 'Action asynchrone', onClick: async assistant => {
        await new Promise(resolve => { window.finishAction = resolve; });
        assistant.say('Terminé', [{ label: 'Suite' }]);
      } }],
    });
  });
  await page.getByRole('button', { name: 'Action asynchrone' }).click();
  await expect(page.getByRole('button', { name: 'Action asynchrone' })).toBeDisabled();
  await page.evaluate(() => window.finishAction());
  await expect(page.getByRole('button', { name: 'Suite', exact: true })).toBeEnabled();
});

test('le réglage de réduction des animations est respecté', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const name = await page.locator('.body').evaluate(element => getComputedStyle(element).animationName);
  expect(name).toBe('none');
});
