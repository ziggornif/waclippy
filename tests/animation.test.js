import { test } from 'node:test';
import assert from 'node:assert/strict';
import { poses, animations, wirePath } from '../src/animation.js';

test('les poses possèdent une géométrie compatible pour le morphing', () => {
  assert.equal(poses.idle.length, 44);
  const seen = new Set();
  for (const points of Object.values(poses)) {
    assert.equal(points.length, poses.idle.length);
    assert.ok(points.every(Number.isFinite));
    const path = wirePath(points);
    assert.match(path, /^M[\d .-]+ C[\d .-]+$/);
    assert.ok(!seen.has(path), 'chaque pose doit avoir une silhouette distincte');
    seen.add(path);
  }
});

test('les réactions partent du repos et y reviennent sans trou dans la chronologie', () => {
  for (const [name, { duration, frames }] of Object.entries(animations)) {
    assert.deepEqual(frames[0], [0, 'idle']);
    assert.deepEqual(frames.at(-1), [1, 'idle']);
    assert.ok(name === 'idle' || duration > 0);
    frames.forEach(([time, pose], index) => {
      assert.ok(Object.hasOwn(poses, pose));
      assert.ok(index === 0 || time > frames[index - 1][0]);
    });
  }
});
