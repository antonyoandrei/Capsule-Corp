import BackgroundComponent from "./components/Background/background"
import { ClothesProvider } from "./components/Fetch/clothes-fetch"
import { ItemsProvider } from "./components/Fetch/items-fetch"
import { CartProvider } from "./components/CartContext/cartContext"
import { WishlistProvider } from "./components/WishlistContext/wishlistContext"
import RoutesComponent from "./Routes/Routes"

function App() {

  return (
    <ItemsProvider>
      <ClothesProvider>
        <CartProvider>
          <WishlistProvider>
            <BackgroundComponent />
            <RoutesComponent />
          </WishlistProvider>
        </CartProvider>
      </ClothesProvider>
    </ItemsProvider>
  )
}

export default App
