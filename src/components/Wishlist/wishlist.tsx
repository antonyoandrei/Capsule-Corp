import { clProduct } from "../../types/interface";
import FrameComponent from "../Frame/frame";
import HeaderLoginComponent from "../Header/header-login";
import HeaderNavComponent from "../Header/header-nav";
import TabComponent from "../Tab/tab";
import { useWishlist } from "../WishlistContext/wishlistContext";

const WishlistComponent = () => {
    interface WishlistContextType {
        wishlist: clProduct[];
    }
  const { wishlist } = useWishlist() as unknown as WishlistContextType;

  return (
    <>
    <HeaderLoginComponent />
    <HeaderNavComponent />
    <FrameComponent>
    {wishlist.map((props: clProduct) => (
     <TabComponent key={props.id} {...props} />
    ))}
    </FrameComponent>
    </>
    )
};

export default WishlistComponent;
