import { character } from './art.js';
import { styles } from './styles.js';
import { validateDialogue, validatePosition } from './options.js';
import { createAnimator } from './animation.js';

/** Crée une instance indépendante. Aucun accès au DOM avant cet appel. */
export function createWaclippy(options = {}) {
  if (typeof document === 'undefined' || !document.body) {
    throw new Error('Créez Waclippy dans le navigateur, après le chargement du body.');
  }
  const position = options.position ?? 'bottom-right';
  validatePosition(position);
  const initialMessage = options.message ?? 'Wah ! Un petit coup de main ?';
  const initialButtons = options.buttons ?? [];
  validateDialogue(initialMessage, initialButtons);
  const host = document.createElement('div');
  host.dataset.position = position;
  const root = host.attachShadow({ mode: 'open' });
  // Ce HTML est constant. Les textes fournis par l'intégrateur utilisent textContent.
  root.innerHTML = `<style>${styles}</style><section class="bubble" aria-label="Dialogue Waclippy"><button class="close" type="button" aria-label="Fermer le dialogue">×</button><div class="label">Waclippy · votre assistant</div><p class="message" role="status" aria-live="polite" aria-atomic="true"></p><div class="actions"></div></section><button class="character" type="button" aria-label="Afficher ou masquer le dialogue Waclippy" aria-expanded="true">${character}</button>`;
  const bubble = root.querySelector('.bubble');
  const mascot = root.querySelector('.character');
  const message = root.querySelector('.message');
  const actions = root.querySelector('.actions');
  let destroyed = false;
  const animator = createAnimator(host, root);
  let dialogueVersion = 0;
  const assertAlive = () => {
    if (destroyed) throw new Error('Cette instance Waclippy a été détruite.');
  };
  function toggleDialogue(visible) {
    bubble.hidden = !visible;
    mascot.setAttribute('aria-expanded', String(visible));
  }
  const api = {
    element: host,
    say(text, buttons = []) {
      assertAlive();
      validateDialogue(text, buttons);
      dialogueVersion += 1;
      const version = dialogueVersion;
      message.textContent = text;
      actions.replaceChildren();
      for (const action of buttons) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'action';
        button.textContent = action.label;
        button.addEventListener('click', async () => {
          const focused = root.activeElement === button;
          const siblings = [...actions.children];
          siblings.forEach(item => { item.disabled = true; });
          try {
            await action.onClick?.(api);
          } catch (error) {
            if (!destroyed) host.dispatchEvent(new CustomEvent('waclippy:error', { detail: error }));
          } finally {
            if (!destroyed && dialogueVersion === version) {
              siblings.forEach(item => { item.disabled = false; });
            } else if (!destroyed && focused) {
              (actions.querySelector('button') ?? mascot).focus();
            }
          }
        });
        actions.append(button);
      }
      host.hidden = false;
      toggleDialogue(true);
      return api;
    },
    animate(name = 'wave') {
      assertAlive();
      animator.play(name);
      return api;
    },
    show() { assertAlive(); host.hidden = false; return api; },
    hide() { assertAlive(); animator.stop(); host.hidden = true; return api; },
    setPosition(next) { assertAlive(); validatePosition(next); host.dataset.position = next; return api; },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      animator.destroy();
      host.remove();
    },
  };
  root.querySelector('.close').addEventListener('click', () => { toggleDialogue(false); mascot.focus(); });
  mascot.addEventListener('click', () => { toggleDialogue(bubble.hidden); api.animate('wave'); });
  root.addEventListener('keydown', event => {
    if (event.key === 'Escape') { toggleDialogue(false); mascot.focus(); }
  });
  document.body.append(host);
  api.say(initialMessage, initialButtons);
  host.hidden = options.visible === false;
  return api;
}
