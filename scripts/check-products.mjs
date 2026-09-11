// Run with node scripts/check-products.mjs. All storage, requests and time are isolated mocks.
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = fs.readFileSync(new URL("../src/services/products.ts", import.meta.url), "utf8").replaceAll("import.meta.env", "__env");
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const storage = new Map();
const timers = new Map();
const calls = [];
let now = 1_700_000_000_000;
let nextTimer = 0;
const key = url => `capsule-corp:catalog:v3:${encodeURIComponent(url)}`;
const signal = () => new AbortController().signal;
const product = price => ({ id: 1, name: "Test jacket", price, quantity: "0", images: [], img: "jacket.png" });

const load = (env = {}) => {
  const sandbox = {
    exports: {}, __env: env, AbortController, DOMException, Date: { now: () => now },
    window: {
      localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) },
      setTimeout: callback => { timers.set(++nextTimer, callback); return nextTimer; },
      clearTimeout: id => timers.delete(id),
    },
    fetch: (url, { signal, cache }) => new Promise((resolve, reject) => {
      assert.equal(cache, "no-cache", "API data revalidates the browser's HTTP cache");
      calls.push({ url, resolve: (body, status = 200) => resolve({ ok: status < 400, status, json: async () => body }) });
      signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
    }),
  };
  vm.runInNewContext(code, sandbox);
  return sandbox.exports;
};

const service = load();
assert.equal(load({ DEV: true }).productEndpoints.items, "http://localhost:3000/items");
assert.equal(service.productEndpoints.items, "https://capsule-corp-api.vercel.app/items");
assert.equal(load({ VITE_API_BASE_URL: "https://preview.test/" }).productEndpoints.clothes, "https://preview.test/clothes");
assert.equal(load({ VITE_API_BASE_URL_ITEMS: "https://legacy.test/products" }).productEndpoints.items, "https://legacy.test/products");
const url = "https://catalog.test/clothes";
const firstController = new AbortController();
const first = service.fetchProducts(url, firstController.signal, true);
const firstCancelled = assert.rejects(first, { name: "AbortError" });
const second = service.fetchProducts(url, signal(), true);
assert.equal(calls.length, 1, "Concurrent forced requests share one fetch");
firstController.abort();
await firstCancelled;
calls.at(-1).resolve([product("42")]);
assert.equal((await second)[0].price, 42, "Cancelling one subscriber preserves the other");
assert.equal(timers.size, 0);
await service.fetchProducts(url, signal());
assert.equal(calls.length, 1, "Fresh cache avoids another request");
const cancelled = new AbortController();
cancelled.abort();
await assert.rejects(service.fetchProducts(url, cancelled.signal), { name: "AbortError" });
assert.equal(calls.length, 1, "Already-cancelled calls do not fetch, even with cache");

now += 5 * 60 * 1000 + 1;
assert.equal(service.readCachedProducts(url)[0].price, 42, "Stale data remains available");
const refresh = service.fetchProducts(url, signal());
assert.equal(calls.length, 2, "Stale cache revalidates");
assert.equal(service.readCachedProducts(url)[0].price, 42, "Refresh does not clear visible data");
calls.at(-1).resolve([], 503);
await assert.rejects(refresh, /status 503/);
assert.equal(service.readCachedProducts(url)[0].price, 42, "Failed refresh retains the last good data");
const retry = service.fetchProducts(url, signal(), true);
assert.equal(calls.length, 3, "A failed request can be retried");
calls.at(-1).resolve([product("43")]);
await retry;
assert.equal(service.readCachedProducts(url)[0].price, 43);
const nextPage = load();
assert.equal(nextPage.readCachedProducts(url)[0].price, 43, "Persisted products remain visible during revalidation");
const deploymentRefresh = nextPage.fetchProducts(url, signal());
assert.equal(calls.length, 4, "A full page load revalidates even recently saved data after an API deployment");
calls.at(-1).resolve([product("47")]);
await deploymentRefresh;
assert.equal(nextPage.readCachedProducts(url)[0].price, 47);
await nextPage.fetchProducts(url, signal());
assert.equal(calls.length, 4, "Validated data is reused during the same page session");

const timeout = service.fetchProducts("https://catalog.test/timeout", signal());
const timeoutRejected = assert.rejects(timeout, error => {
  assert.match(error.message, /too long/);
  assert.equal(error.cause.name, "AbortError");
  return true;
});
[...timers.values()][0]();
await timeoutRejected;
assert.equal(timers.size, 0, "Request timers are cleaned up after timeout");
const afterTimeout = service.fetchProducts("https://catalog.test/timeout", signal());
calls.at(-1).resolve([product("44")]);
await afterTimeout;

const legacyUrl = "https://catalog.test/legacy";
storage.set(key(legacyUrl), JSON.stringify([product("45")]));
assert.equal(service.readCachedProducts(legacyUrl)[0].price, 45);
const previousCalls = calls.length;
const legacyRefresh = service.fetchProducts(legacyUrl, signal());
assert.equal(calls.length, previousCalls + 1, "Legacy caches display immediately and revalidate");
calls.at(-1).resolve([product("46")]);
await legacyRefresh;
assert.equal(JSON.parse(storage.get(key(legacyUrl))).savedAt, now);

storage.set(key("broken"), "invalid JSON");
assert.equal(service.readCachedProducts("broken"), null);
assert.equal(storage.has(key("broken")), false);
const invalid = service.fetchProducts("https://catalog.test/invalid", signal());
calls.at(-1).resolve({ products: [] });
await assert.rejects(invalid, /invalid product list/);
assert.equal(timers.size, 0);

const migrationUrl = "https://catalog.test/migration";
storage.set(`capsule-corp:catalog:v1:${encodeURIComponent(migrationUrl)}`, JSON.stringify({ products: [product(1)], savedAt: now }));
storage.set(`capsule-corp:catalog:v2:${encodeURIComponent(migrationUrl)}`, JSON.stringify({ products: [{ ...product(1), id: 39 }], savedAt: now }));
assert.equal(service.readCachedProducts(migrationUrl), null, "The new catalog does not reuse pre-migration URLs");

const saved = [{ ...product(42), img: "old.png", images: ["old.png"], quantity: 3, size: "M" }, { ...product(7), id: 99, quantity: 2 }];
const catalog = [{ ...product(42), img: "new.png", images: ["new.png", "new-side.png"], quantity: 0, variantGroup: "jacket" }];
const updated = service.reconcileSavedProducts(saved, catalog);
assert.equal(updated[0].img, "new.png");
assert.deepEqual(updated[0].images, catalog[0].images);
assert.equal(updated[0].quantity, 3, "Catalog quantities never overwrite the user's bag quantity");
assert.equal(updated[0].size, "M", "Selections survive refreshed catalog metadata");
assert.equal(updated[0].variantGroup, "jacket");
assert.equal(updated[1], saved[1], "Products missing from a failed or partial catalog stay saved");
assert.equal(saved[0].img, "old.png", "Reconciliation does not mutate stored input");
assert.equal(service.reconcileSavedProducts(updated, catalog), updated, "Identical metadata keeps the array stable");
assert.equal(service.reconcileSavedProducts(saved, []), saved, "Loading or unavailable catalogs preserve all entries");
const variants = [{ ...product(1), id: 26 }, { ...product(1), id: 30 }];
const refreshedVariants = service.reconcileSavedProducts(variants, variants.map(item => ({ ...item, variantGroup: "scouter" })));
assert.deepEqual(refreshedVariants.map(item => item.id), [26, 30], "Related variants remain separate saved products");
console.log("Catalog checks passed: cache, requests, v3 migration and saved-product reconciliation.");
