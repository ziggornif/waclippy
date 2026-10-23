// Toutes les poses utilisent les mêmes sept courbes de Bézier : on interpole
// les points eux-mêmes, plutôt que de déplacer une image rigide.
const base = [
  [177, 218],
  [177, 240, 177, 260, 177, 283],
  [177, 358, 58, 358, 58, 283],
  [58, 230, 58, 160, 58, 111],
  [58, 28, 169, 28, 169, 111],
  [169, 160, 169, 210, 169, 254],
  [169, 311, 91, 311, 91, 254],
  [91, 238, 91, 222, 91, 206],
];
const pose = changes => base.flatMap((segment, index) => changes[index] ?? segment);
export const poses = {
  idle: pose({}),
  waveLeft: pose({ 0: [163, 113], 1: [220, 133, 184, 224, 177, 283] }),
  waveRight: pose({ 0: [222, 133], 1: [234, 174, 180, 232, 177, 283] }),
  think: pose({ 0: [137, 235], 1: [210, 227, 197, 267, 177, 283], 7: [91, 238, 82, 222, 85, 207] }),
  point: pose({ 0: [213, 103], 1: [234, 155, 180, 225, 177, 283], 7: [91, 238, 78, 220, 73, 205] }),
  squash: pose({
    0: [191, 232], 1: [202, 258, 199, 283, 190, 297],
    2: [175, 358, 40, 358, 44, 295], 3: [44, 245, 48, 169, 58, 111],
    5: [180, 168, 184, 228, 174, 269], 6: [162, 314, 82, 313, 87, 265],
  }),
  stretch: pose({
    0: [173, 192], 1: [171, 225, 164, 264, 160, 283],
    2: [160, 358, 75, 358, 75, 283], 3: [75, 230, 65, 160, 58, 111],
    5: [161, 164, 151, 215, 151, 254], 6: [151, 307, 101, 307, 101, 254],
  }),
  fold: pose({
    0: [161, 282], 1: [187, 263, 201, 297, 176, 314],
    2: [153, 353, 45, 350, 57, 302], 3: [62, 270, 70, 237, 75, 206],
    4: [79, 147, 163, 151, 161, 209], 5: [159, 242, 158, 266, 151, 286],
    6: [143, 316, 91, 317, 97, 282], 7: [100, 265, 102, 253, 107, 244],
  }),
};

export function wirePath(points) {
  return `M${points.slice(0, 2).join(' ')} C${points.slice(2).join(' ')}`;
}

export const animations = {
  idle: { duration: 0, frames: [[0, 'idle'], [1, 'idle']] },
  wave: { duration: 2200, frames: [[0, 'idle'], [.18, 'waveLeft'], [.34, 'waveRight'], [.5, 'waveLeft'], [.66, 'waveRight'], [.82, 'waveLeft'], [1, 'idle']] },
  think: { duration: 3000, frames: [[0, 'idle'], [.22, 'think'], [.78, 'think'], [1, 'idle']] },
  celebrate: { duration: 2400, frames: [[0, 'idle'], [.12, 'squash'], [.27, 'stretch'], [.4, 'squash'], [.55, 'stretch'], [.7, 'squash'], [.83, 'stretch'], [1, 'idle']] },
  point: { duration: 2800, frames: [[0, 'idle'], [.22, 'point'], [.78, 'point'], [1, 'idle']] },
  fold: { duration: 3000, frames: [[0, 'idle'], [.28, 'fold'], [.7, 'fold'], [1, 'idle']] },
  surprised: { duration: 2000, frames: [[0, 'idle'], [.12, 'squash'], [.3, 'stretch'], [.72, 'stretch'], [1, 'idle']] },
  sleep: { duration: 4200, frames: [[0, 'idle'], [.23, 'fold'], [.82, 'fold'], [1, 'idle']] },
};

export function createAnimator(host, root) {
  const wires = [...root.querySelectorAll('.wire')];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let frame;
  let current = poses.idle;
  function draw(points) {
    current = points;
    const d = wirePath(points);
    wires.forEach(wire => wire.setAttribute('d', d));
  }
  function stop() {
    cancelAnimationFrame(frame);
    frame = undefined;
    host.dataset.animation = 'idle';
    draw(poses.idle);
  }
  function play(name) {
    if (!Object.hasOwn(animations, name)) throw new TypeError('Animation inconnue.');
    const from = current;
    cancelAnimationFrame(frame);
    host.dataset.animation = 'idle';
    if (name === 'idle' || motion.matches) { stop(); return; }
    // Redémarre également les animations des expressions et des accessoires.
    void root.querySelector('.body').getBoundingClientRect();
    host.dataset.animation = name;
    const { duration, frames } = animations[name];
    host.style.setProperty('--wa-duration', `${duration}ms`);
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      if (progress >= 1) { stop(); return; }
      const nextIndex = frames.findIndex(([time]) => time > progress);
      const [begin, fromName] = frames[nextIndex - 1];
      const [end, toName] = frames[nextIndex];
      const linear = (progress - begin) / (end - begin);
      const eased = linear * linear * (3 - 2 * linear);
      const a = nextIndex === 1 ? from : poses[fromName];
      const b = poses[toName];
      draw(a.map((value, index) => value + (b[index] - value) * eased));
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
  }
  const onMotionChange = () => { if (motion.matches) stop(); };
  motion.addEventListener('change', onMotionChange);
  return {
    play,
    stop,
    destroy() { stop(); motion.removeEventListener('change', onMotionChange); },
  };
}
