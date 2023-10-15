import { useContext } from "react"
import { ClothesContext } from "../Fetch/clothes-fetch"
import FrameComponent from "../Frame/frame"
import TabComponent from "../Tab/tab"
import { clProduct } from "../../types/interface"
import HeaderLoginComponent from "../Header/header-login"
import HeaderNavComponent from "../Header/header-nav"

const ClothesComponent = () => {
    const {clothes} = useContext(ClothesContext)
    
    return (
    <>
    <HeaderLoginComponent />
    <HeaderNavComponent />
    <FrameComponent>
    {clothes.map((props: clProduct) => (
     <TabComponent key={props.id} {...props} />
    ))}
    </FrameComponent>
    </>
    )
}

export default ClothesComponent