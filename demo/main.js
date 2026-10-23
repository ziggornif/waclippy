import { createWaclippy } from '../src/index.js';

const wa = createWaclippy({
  message: 'On dirait que vous essayez de gagner…\nUn coup de main pour ne pas finir dernier ?',
  buttons: [
    { label: 'Oui, aide-moi', onClick: introduce },
    { label: 'Wah !', onClick: assistant => assistant.animate('celebrate') },
  ],
});
let visible = true;
function syncVisibility() {
  visible = true;
  document.querySelector('#visibility').textContent = 'Masquer l’assistant';
  document.querySelector('#visibility').setAttribute('aria-pressed', 'false');
}
function introduce() {
  syncVisibility();
  wa.say('Moi, c’est Waclippy. Expert autoproclamé en tout.\nPar quoi on commence ?', [
    { label: 'Le module npm', onClick: () => {
      document.querySelector('#integration').scrollIntoView({ behavior: 'smooth' });
      wa.say('Quelques lignes suffisent pour m’inviter sur votre site. Je prends peu de place. Mon ego, un peu plus.');
      wa.animate('wave');
    } },
    { label: 'Une victoire !', onClick: () => {
      wa.say('Waaah ! Encore une victoire parfaitement méritée. Surtout grâce à moi.');
      wa.animate('celebrate');
    } },
  ]).animate('wave');
}
document.querySelector('#hello').addEventListener('click', introduce);
const reactions = {
  wave: ['Wah ! Vous êtes toujours là ? Excellent. Je supervisais votre travail, évidemment.', 'Salut, Waclippy !'],
  think: ['Grande question : si tout le monde veut être premier… qui s’occupe de finir dernier ?', 'Certainement pas moi'],
  celebrate: ['Vous avez cliqué sur un bouton. Une maîtrise technique exceptionnelle. Ça se fête !', 'Waaah !'],
  point: ['Juste là, au-dessus ! Mon meilleur outil de travail ? Mon propre trombone.', 'Encore une fois !'],
  fold: ['Je peux me faire tout petit. Mon ego, en revanche, ne rentre pas dans la boucle.', 'Replie-toi !'],
  surprised: ['Quoi ?! Vous avez réussi sans mon aide ?! Je… je dois m’asseoir.', 'Surprise !'],
  sleep: ['Je ferme juste les yeux. Je continue de superviser. Zzz… wah…', 'Dors bien'],
};
for (const card of document.querySelectorAll('[data-animation]')) {
  card.addEventListener('click', () => {
    syncVisibility();
    const animation = card.dataset.animation;
    const [text, label] = reactions[animation];
    wa.say(text, [{ label, onClick: () => wa.animate(animation) }]).animate(animation);
  });
}
document.querySelector('#message-form').addEventListener('submit', event => {
  event.preventDefault();
  const input = document.querySelector('#message');
  if (input.value.trim()) {
    syncVisibility();
    wa.say(input.value, [{ label: 'Bien reçu !', onClick: () => wa.animate('wave') }]).animate('think');
  }
});
document.querySelector('#position').addEventListener('change', event => wa.setPosition(event.target.value));
document.querySelector('#visibility').addEventListener('click', event => {
  visible = !visible;
  wa[visible ? 'show' : 'hide']();
  event.target.textContent = visible ? 'Masquer l’assistant' : 'Afficher l’assistant';
  event.target.setAttribute('aria-pressed', String(!visible));
});
