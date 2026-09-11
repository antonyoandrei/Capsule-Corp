export const pageImports = {
  about: () => import("../pages/About/About"),
  product: () => import("../pages/ProductPage/ProductPage"),
  login: () => import("../pages/LogIn/LogInPage"),
  bag: () => import("../pages/ShoppingBag/ShoppingBag"),
  wishlist: () => import("../pages/Wishlist/Wishlist"),
  clothes: () => import("../pages/Clothes/Clothes"),
  items: () => import("../pages/Items/Items"),
  wanted: () => import("../pages/MostBuyed/MostBuyed"),
  missing: () => import("../pages/NotFound/NotFound"),
}

const routePages: Record<string, keyof typeof pageImports> = {
    "/about": "about", "/shopping-bag": "bag", "/wishlist": "wishlist",
    "/clothes": "clothes", "/items": "items", "/most-buyed": "wanted", "/login": "login",
}

export const prefetchPage = (pathname: string) => {
  const key = pathname.startsWith("/product-page/") ? "product" : routePages[pathname]
  if (key) void pageImports[key]().catch(() => undefined)
}
