import CatalogView from "../Catalog/catalogView"
import { useWishlist } from "../WishlistContext/useWishlist"

const WishlistComponent = () => {
  const { wishlist } = useWishlist()

  return (
    <CatalogView
      kicker="Saved"
      title="Wishlist"
      products={wishlist}
      emptyTitle="Your wishlist is empty"
      emptyCopy="Save a product from its page and it will appear here."
      emptyActionLabel="Browse clothes"
      emptyTo="/clothes"
    />
  )
}

export default WishlistComponent
