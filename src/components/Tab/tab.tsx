import './tab.css'
import { NavLink } from 'react-router-dom'
import { clProduct } from '../../types/interface';
import { FC } from 'react';

const TabComponent:FC<clProduct> = ({id, name, img}) => {
    return (
        <NavLink key={id} className="tab" to={`/product-page/${id}`}>
          <img src={img} alt={name}/>
        </NavLink>
    );
}

export default TabComponent