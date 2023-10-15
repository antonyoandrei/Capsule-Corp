import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { WishlistProvider } from './components/WishlistContext/wishlistContext.tsx'
import AuthProvider from './components/Auth/AuthProvider.tsx'
import { CartProvider } from './components/CartContext/cartContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <AuthProvider>
            <CartProvider>
            <WishlistProvider>
                <App />
            </WishlistProvider>
            </CartProvider>
        </AuthProvider>
    </BrowserRouter>
)
