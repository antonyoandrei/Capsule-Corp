import { clProduct } from "../types/interface";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:3000" : "https://capsule-corp-api.vercel.app")).replace(/\/$/, "");
const CACHE_NAMESPACE = "capsule-corp:catalog:v3:";
// Reuse validated data in this page session; persisted data revalidates on every full load.
const CACHE_TTL_MS = 5 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 8000;
interface CachedProducts { products: clProduct[]; savedAt: number }
const memoryCache = new Map<string, CachedProducts>();
const pendingRequests = new Map<string, Promise<clProduct[]>>();

export const productEndpoints = {
  clothes: import.meta.env.VITE_API_BASE_URL_CLOTHES || `${apiBaseUrl}/clothes`,
  items: import.meta.env.VITE_API_BASE_URL_ITEMS || `${apiBaseUrl}/items`,
};

export const reconcileSavedProducts = <T extends clProduct>(savedProducts: T[], catalog: readonly clProduct[]): T[] => {
  const currentProducts = new Map(catalog.map(product => [product.id, product]));
  let changed = false;
  const reconciled = savedProducts.map(saved => {
    const current = currentProducts.get(saved.id);
    if (!current) return saved;
    const updated = { ...saved, ...current, quantity: saved.quantity };
    if (JSON.stringify(updated) === JSON.stringify(saved)) return saved;
    changed = true;
    return updated;
  });
  return changed ? reconciled : savedProducts;
};

const normalizeProducts = (data: unknown): clProduct[] => {
  if (!Array.isArray(data)) {
    throw new Error("The API returned an invalid product list.");
  }

  return data.map(product => {
    const item = product as clProduct;
    return {
      ...item,
      price: Number(item.price),
      quantity: Number(item.quantity || 0),
    };
  });
};

const storageKey = (url: string) => `${CACHE_NAMESPACE}${encodeURIComponent(url)}`;
const isFresh = (cached: CachedProducts) => cached.savedAt > 0 && Date.now() >= cached.savedAt && Date.now() - cached.savedAt < CACHE_TTL_MS;

const cacheProducts = (url: string, products: clProduct[]) => {
  const cached = { products, savedAt: Date.now() };
  memoryCache.set(url, cached);

  try {
    window.localStorage.setItem(storageKey(url), JSON.stringify(cached));
  } catch {
    // The in-memory cache still prevents duplicate requests when storage is unavailable.
  }
};

export const readCachedProducts = (url: string): clProduct[] | null => {
  const cached = memoryCache.get(url);
  if (cached) return cached.products;

  try {
    const storedProducts = window.localStorage.getItem(storageKey(url));
    if (!storedProducts) return null;

    const parsed = JSON.parse(storedProducts);
    const stored = Array.isArray(parsed) ? { products: parsed, savedAt: 0 } : parsed as CachedProducts;
    if (!stored || !Number.isFinite(stored.savedAt)) throw new Error("Invalid catalog cache.");
    const products = normalizeProducts(stored.products);
    memoryCache.set(url, { products, savedAt: 0 });
    return products;
  } catch {
    try {
      window.localStorage.removeItem(storageKey(url));
    } catch {
      // Ignore storage access errors and fall back to the API.
    }
    return null;
  }
};

const requestProducts = async (url: string): Promise<clProduct[]> => {
  const controller = new AbortController();
  let timedOut = false;
  const timeoutId = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal, cache: "no-cache" });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}.`);
    }

    const products = normalizeProducts(await response.json());
    cacheProducts(url, products);
    return products;
  } catch (requestError) {
    if (timedOut) throw new Error("The product archive took too long to respond.", { cause: requestError });
    throw requestError;
  } finally {
    window.clearTimeout(timeoutId);
  }
};

const withAbortSignal = <T,>(request: Promise<T>, signal: AbortSignal): Promise<T> => {
  if (signal.aborted) return Promise.reject(new DOMException("The request was cancelled.", "AbortError"));

  return new Promise((resolve, reject) => {
    const abortRequest = () => reject(new DOMException("The request was cancelled.", "AbortError"));
    const clearAbortListener = () => signal.removeEventListener("abort", abortRequest);

    signal.addEventListener("abort", abortRequest, { once: true });
    request.then(
      products => {
        clearAbortListener();
        resolve(products);
      },
      requestError => {
        clearAbortListener();
        reject(requestError);
      },
    );
  });
};

export const fetchProducts = (url: string, signal: AbortSignal, force = false): Promise<clProduct[]> => {
  if (signal.aborted) return Promise.reject(new DOMException("The request was cancelled.", "AbortError"));

  if (!force) {
    const cachedProducts = readCachedProducts(url);
    const cached = memoryCache.get(url);
    if (cachedProducts && cached && isFresh(cached)) return Promise.resolve(cachedProducts);
  }

  let request = pendingRequests.get(url);

  if (!request) {
    request = requestProducts(url);
    pendingRequests.set(url, request);

    const clearPendingRequest = () => {
      if (pendingRequests.get(url) === request) pendingRequests.delete(url);
    };

    request.then(clearPendingRequest, clearPendingRequest);
  }

  return withAbortSignal(request, signal);
};
