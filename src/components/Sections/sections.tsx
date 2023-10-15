import { NavLink } from 'react-router-dom';
import './sections.css'

const SectionsComponent = () => {
  return (
    <div className='sections-container'>
      <section className="clothes">
        <NavLink to={'/clothes'} ><img className="bg-rising-sp-1" src="https://res.cloudinary.com/du94mex28/image/upload/f_auto,q_auto/v1/icons/hl3di81ppix6hvighi5h" alt="Clothes"/></NavLink>
      </section>
      
      <section className="items">
        <NavLink to={'/items'} ><img className="bg-rising-sp-3" src="https://res.cloudinary.com/du94mex28/image/upload/f_auto,q_auto/v1/icons/rcvwzozehyz8iecusdiu" alt="Items"/></NavLink>
      </section>

      <section className="most-buyed">
        <NavLink to={'/most-buyed'} ><img className="bg-rising-pc-1" src="https://res.cloudinary.com/du94mex28/image/upload/f_auto,q_auto/v1/icons/zcbpcykzpo7nv8pmpjfi" alt="Most Buyed"/></NavLink>
        <img className="icon-hot-1" src="https://res.cloudinary.com/du94mex28/image/upload/f_auto,q_auto/v1/icons/kzw3qn1xvbcu3dp2h1u8" alt="Hot Icon"/>
      </section>
    </div>
  );
}

export default SectionsComponent;
