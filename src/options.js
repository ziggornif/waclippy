export function validateDialogue(message, buttons) {
  if (typeof message !== 'string') throw new TypeError('Le message doit être une chaîne.');
  if (!Array.isArray(buttons)) throw new TypeError('Les boutons doivent être un tableau.');
  for (const button of buttons) {
    if (!button || typeof button.label !== 'string' || !button.label.trim()) {
      throw new TypeError('Chaque bouton doit avoir un label non vide.');
    }
    if (button.onClick !== undefined && typeof button.onClick !== 'function') {
      throw new TypeError('onClick doit être une fonction.');
    }
  }
}
export function validatePosition(position) {
  if (!['bottom-left', 'bottom-right'].includes(position)) {
    throw new TypeError('Position attendue : bottom-left ou bottom-right.');
  }
}
