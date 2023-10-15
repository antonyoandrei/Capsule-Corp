import { useContext } from 'react';
import FrameComponent from "../Frame/frame";
import { ClothesContext } from '../Fetch/clothes-fetch';
import { ItemsContext } from '../Fetch/items-fetch';
import TabComponent from '../Tab/tab';
import { clProduct } from '../../types/interface';
import HeaderLoginComponent from '../Header/header-login';
import HeaderNavComponent from '../Header/header-nav';

const MostBuyedComponent = () => {
    const { clothes } = useContext(ClothesContext);
    const { items } = useContext(ItemsContext);

    const allItems = [...clothes, ...items];

    const randomSort = () => Math.random() - 0.5;

    const shuffledItems = allItems.sort(randomSort);

    const mostBuyed = shuffledItems.filter(product => product.mostBuyed === true);

    return (
        <>
        <HeaderLoginComponent />
        <HeaderNavComponent />
            <FrameComponent>
              {mostBuyed.map((props: clProduct) => (
                  <TabComponent key={props.id} {...props} />
                ))}
            </FrameComponent>
        </>
    );
}

export default MostBuyedComponent;
