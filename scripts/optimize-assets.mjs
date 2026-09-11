// Run: node scripts/optimize-assets.mjs [path-to-sharp] [asset-name ...]
import assert from 'node:assert/strict';
import { mkdir, stat } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const sharp = createRequire(import.meta.url)(process.argv[2] || 'sharp');
const assets = fileURLToPath(new URL('../src/assets/', import.meta.url));
const output = `${assets}optimized/`;
const images = [
  ['dragon_ball_kid_goku_16_dragon_box_by_superjmanplay2_d4u3e2i.png', 'goku-nimbus', { height: 1100 }],
  ['dragon_ball_kid_goku_16_dragon_box_by_superjmanplay2_d4u3e2i.png', 'goku-nimbus-560', { width: 560 }],
  ['ChatGPT Image Sep 10, 2026, 12_18_26 PM (3).png', 'collection-goku', { width: 850 }],
  ['ChatGPT Image Sep 10, 2026, 12_18_26 PM (3).png', 'collection-goku-480', { width: 480 }],
  ['ChatGPT Image Sep 10, 2026, 12_18_25 PM (2).png', 'collection-king-kai', { width: 850 }],
  ['ChatGPT Image Sep 10, 2026, 12_18_25 PM (2).png', 'collection-king-kai-480', { width: 480 }],
  ['ChatGPT Image Sep 10, 2026, 12_18_26 PM (4).png', 'collection-vegeta', { width: 850 }],
  ['ChatGPT Image Sep 10, 2026, 12_18_26 PM (4).png', 'collection-vegeta-480', { width: 480 }],
  ['gsvy5vmjgtn8vzslzgxp.png', 'dragon-ball-cast', { width: 717 }],
  ['ddvnc9y-db38a164-061a-47b3-b66f-4b6d0093a0ef.png', 'shenron-wishes', { width: 1002 }, { lossless: true }],
  ['ddvnc9y-db38a164-061a-47b3-b66f-4b6d0093a0ef.png', 'shenron-wishes-500', { width: 500 }],
  ['Fk9plyuagAMR6Vw_efkuss_snqtnk', 'clothes-gohan', { width: 900 }, { trim: true }],
  ['Fk9plyuagAMR6Vw_efkuss_snqtnk', 'clothes-gohan-480', { width: 480 }, { trim: true }],
  ['GpwWL30aYAAP8S8.png', 'wanted-kid-goku', { width: 900 }, { trim: true }],
  ['FpJQBlNacAAG2ZU.png', 'items-trunks', { width: 900 }, { trim: true }],
  ['FpJQBlNacAAG2ZU.png', 'items-trunks-360', { width: 360 }, { trim: true }],
  ['bg-custom_jzds5v.jpg', 'manga-light', { width: 1800, height: 1800 }],
  ['mk3rnz9busmj8iwsi29h.jpg', 'manga-dark', { width: 1800, height: 1800 }],
];

const requested = process.argv.slice(3);
assert(requested.every(name => images.some(image => image[1] === name)), 'Unknown asset name');
await mkdir(output, { recursive: true });
const report = [];
for (const [original, name, dimensions, options = {}] of images.filter(image => !requested.length || requested.includes(image[1]))) {
  const source = `${assets}${original}`;
  const destination = `${output}${name}.webp`;
  const before = await sharp(source).metadata();
  let pipeline = sharp(source);
  let crop;
  if (options.trim) {
    const { data, info } = await pipeline.clone().extractChannel('alpha').raw().toBuffer({ resolveWithObject: true });
    let left = info.width, top = info.height, right = -1, bottom = -1;
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        if (data[y * info.width + x] === 0) continue;
        left = Math.min(left, x); top = Math.min(top, y);
        right = Math.max(right, x); bottom = Math.max(bottom, y);
      }
    }
    assert(right >= left && bottom >= top, `${name}: artwork is empty`);
    crop = { left, top, width: right - left + 1, height: bottom - top + 1 };
    pipeline = pipeline.extract(crop);
  }
  const encoded = await pipeline
    .resize({ ...dimensions, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 90, alphaQuality: 100, effort: 6, smartSubsample: true, lossless: options.lossless ?? false })
    .toFile(destination);
  const after = await sharp(destination).metadata();
  assert.equal(after.hasAlpha, before.hasAlpha, `${name}: transparency changed`);
  assert(after.width <= before.width && after.height <= before.height, `${name}: enlarged`);
  report.push({ file: `${name}.webp`, width: encoded.width, height: encoded.height,
    before: (await stat(source)).size, after: encoded.size, alpha: after.hasAlpha,
    crop: crop ? `${crop.left},${crop.top} ${crop.width}x${crop.height}` : 'none' });
}
console.table(report);
