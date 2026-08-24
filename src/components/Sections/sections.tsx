import { NavLink } from "react-router-dom"
import "./sections.css"

const SectionsComponent = () => {
  return (
    <nav className="sections-container" aria-label="Shop by collection">
      <NavLink className="collection-panel collection-panel-clothes" to="/clothes" aria-label="Browse clothes">
        <img
          className="bg-rising-sp-1"
          src="https://res.cloudinary.com/du94mex28/image/upload/f_auto,q_auto/v1/icons/hl3di81ppix6hvighi5h"
          width="768"
          height="376"
          alt="Clothes collection featuring Super Saiyan Goku"
        />
      </NavLink>

      <NavLink className="collection-panel collection-panel-items" to="/items" aria-label="Browse items">
        <img
          className="bg-rising-sp-3"
          src="https://res.cloudinary.com/du94mex28/image/upload/f_auto,q_auto/v1/icons/rcvwzozehyz8iecusdiu"
          width="768"
          height="376"
          alt="Items collection featuring King Kai"
        />
      </NavLink>

      <div className="collection-panel collection-panel-wanted">
        <NavLink to="/most-buyed" aria-label="Browse most wanted products">
          <img
            className="bg-rising-pc-1"
            src="https://res.cloudinary.com/du94mex28/image/upload/f_auto,q_auto/v1/icons/zcbpcykzpo7nv8pmpjfi"
            width="910"
            height="159"
            alt="Most wanted collection featuring Vegeta"
          />
        </NavLink>
        <img
          className="icon-hot-1"
          src="https://res.cloudinary.com/du94mex28/image/upload/f_auto,q_auto/v1/icons/kzw3qn1xvbcu3dp2h1u8"
          width="160"
          height="160"
          alt=""
        />
      </div>
    </nav>
  )
}

export default SectionsComponent
