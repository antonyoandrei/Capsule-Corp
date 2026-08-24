import { clProduct } from "../types/interface";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const CACHE_NAMESPACE = "capsule-corp:catalog:v1:";
const REQUEST_TIMEOUT_MS = 8000;
const memoryCache = new Map<string, clProduct[]>();
const pendingRequests = new Map<string, Promise<clProduct[]>>();

export const productEndpoints = {
  clothes: import.meta.env.VITE_API_BASE_URL_CLOTHES || `${apiBaseUrl}/clothes`,
  items: import.meta.env.VITE_API_BASE_URL_ITEMS || `${apiBaseUrl}/items`,
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

const cacheProducts = (url: string, products: clProduct[]) => {
  memoryCache.set(url, products);

  try {
    window.localStorage.setItem(storageKey(url), JSON.stringify(products));
  } catch {
    // The in-memory cache still prevents duplicate requests when storage is unavailable.
  }
};

export const readCachedProducts = (url: string): clProduct[] | null => {
  const memoryProducts = memoryCache.get(url);
  if (memoryProducts) return memoryProducts;

  try {
    const storedProducts = window.localStorage.getItem(storageKey(url));
    if (!storedProducts) return null;

    const products = normalizeProducts(JSON.parse(storedProducts));
    memoryCache.set(url, products);
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
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}.`);
    }

    const products = normalizeProducts(await response.json());
    cacheProducts(url, products);
    return products;
  } catch (requestError) {
    if (timedOut) throw new Error("The product archive took too long to respond.");
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
  if (!force) {
    const cachedProducts = readCachedProducts(url);
    if (cachedProducts) return Promise.resolve(cachedProducts);
  }

  let request = pendingRequests.get(url);

  if (!request || force) {
    request = requestProducts(url);
    pendingRequests.set(url, request);

    const clearPendingRequest = () => {
      if (pendingRequests.get(url) === request) pendingRequests.delete(url);
    };

    request.then(clearPendingRequest, clearPendingRequest);
  }

  return withAbortSignal(request, signal);
};
