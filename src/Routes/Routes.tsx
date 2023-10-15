import { Route, Routes, Navigate } from "react-router-dom"
import About from "../pages/About/About"
import Homepage from "../pages/Homepage/Homepage"
import Clothes from "../pages/Clothes/Clothes"
import Wishlist from "../pages/Wishlist/Wishlist"
import Items from "../pages/Items/Items"
import MostBuyed from "../pages/MostBuyed/MostBuyed"
import ShoppingBag from "../pages/ShoppingBag/ShoppingBag"
import { FC } from "react"
import ProductPage from "../pages/ProductPage/ProductPage"
import LogIn from "../pages/LogIn/LogInPage"
import PrivateRoutes from "./PrivateRoutes"

const RoutesComponent:FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<LogIn />} />
            <Route path="/*" element= {
                <PrivateRoutes>
                    <Routes>
                    <Route path='/homepage' element={<Homepage />} />
                    <Route path='/about' element={<About />} />
                    <Route path='/wishlist' element={<Wishlist />} />
                    <Route path='/shopping-bag' element={<ShoppingBag />} />
                    <Route path='/clothes' element={<Clothes />} />
                    <Route path='/items' element={<Items />} />
                    <Route path='/most-buyed' element={<MostBuyed />} />
                    <Route path='/product-page/:id' element={<ProductPage />} />
                    <Route path="/" element={<Navigate to="/homepage" />} />
                    </Routes>
                </PrivateRoutes>
            } />
        </Routes>
    )
}
  
export default RoutesComponent;
