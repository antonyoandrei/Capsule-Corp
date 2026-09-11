import { Route, Routes, Navigate } from "react-router-dom"
import Homepage from "../pages/Homepage/Homepage"
import { type FC, lazy, Suspense } from "react"
import PrivateRoutes from "./PrivateRoutes"
import StoreLayout from "../components/Layout/storeLayout"
import { pageImports } from "./pageImports"
import { LoginSkeleton } from "../components/ui/Skeleton/routeSkeleton"
import RouteBoundary from "./routeBoundary"

const About = lazy(pageImports.about)
const ProductPage = lazy(pageImports.product)
const LogIn = lazy(pageImports.login)
const ShoppingBag = lazy(pageImports.bag)
const Wishlist = lazy(pageImports.wishlist)
const Clothes = lazy(pageImports.clothes)
const Items = lazy(pageImports.items)
const MostBuyed = lazy(pageImports.wanted)
const NotFound = lazy(pageImports.missing)

const RoutesComponent: FC = () => {
  return (
    <Routes>
      <Route path="/login" element={
        <RouteBoundary><Suspense fallback={<LoginSkeleton />}>
          <LogIn />
        </Suspense></RouteBoundary>
      } />
      <Route element={<PrivateRoutes />}>
        <Route element={<StoreLayout />}>
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/about" element={<About />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/shopping-bag" element={<ShoppingBag />} />
          <Route path="/clothes" element={<Clothes />} />
          <Route path="/items" element={<Items />} />
          <Route path="/most-buyed" element={<MostBuyed />} />
          <Route path="/product-page/:id" element={<ProductPage />} />
          <Route path="/" element={<Navigate to="/homepage" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default RoutesComponent
