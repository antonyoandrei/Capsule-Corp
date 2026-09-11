// Run: node --experimental-strip-types src/services/productImage.check.mjs
import assert from 'node:assert/strict';
import { productImage, productImageSrcSet } from './productImage.ts';

const original = 'https://res.cloudinary.com/store/image/upload/v123/items/radar.png?version=2';
const optimized = width => original.replace('/upload/', `/upload/f_auto,q_auto,c_limit,w_${width}/`);
assert.equal(productImage(original, 560), optimized(560));
assert.equal(productImage(productImage(original, 160), 560), optimized(560));
assert.equal(productImage(productImage(original, 560), 560), optimized(560));
assert.equal(productImage(original, 559.8), optimized(560));
for (const width of [0, -1, NaN, Infinity]) assert.equal(productImage(original, width), original);
for (const src of ['/local.png', 'data:image/png;base64,abc', original.replace('/upload/', '/upload/s--signature--/')]) {
  assert.equal(productImage(src, 560), src);
  assert.equal(productImageSrcSet(src, [160, 560]), undefined);
}
assert.equal(productImageSrcSet(original, [560, 160, 560.2, 0, NaN]), `${optimized(160)} 160w, ${optimized(560)} 560w`);
assert.equal(productImageSrcSet(original, []), undefined);
console.log('Product image URLs: resizing, idempotency, passthrough and responsive candidates passed.');
