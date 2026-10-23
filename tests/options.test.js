import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateDialogue, validatePosition } from '../src/options.js';
import { createWaclippy } from '../src/index.js';

test('le module peut être importé sans DOM, et explique quand le créer', () => {
  assert.throws(() => createWaclippy(), /navigateur/);
});
test('dialogues simples, vides et callbacks asynchrones acceptés', () => {
  validateDialogue('', []);
  validateDialogue('Wah !', [{ label: 'Oui', onClick: async () => {} }]);
});
test('une configuration mal formée est rejetée', () => {
  for (const value of [undefined, null, {}, 42]) {
    assert.throws(() => validateDialogue(value, []), TypeError);
  }
  assert.throws(() => validateDialogue('Wah', {}), TypeError);
  for (const value of [null, {}, { label: ' ' }, { label: 'Oui', onClick: 'code' }]) {
    assert.throws(() => validateDialogue('Wah', [value]), TypeError);
  }
});
test('seules les deux positions supportées sont acceptées', () => {
  validatePosition('bottom-left');
  validatePosition('bottom-right');
  assert.throws(() => validatePosition('top'), TypeError);
});
