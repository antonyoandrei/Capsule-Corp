import { useContext } from "react"
import { ItemsContext } from "../Fetch/items-fetch"
import FrameComponent from "../Frame/frame"
import TabComponent from "../Tab/tab"
import { clProduct } from "../../types/interface"
import HeaderLoginComponent from "../Header/header-login"
import HeaderNavComponent from "../Header/header-nav"

const ItemsComponent = () => {
    const {items} = useContext(ItemsContext)
    return (
    <>
    <HeaderLoginComponent />
    <HeaderNavComponent />
    <FrameComponent>
    {items.map((props: clProduct) => (
     <TabComponent key={props.id} {...props} />
    ))}
    </FrameComponent>
    </>
    )
}

export default ItemsComponent