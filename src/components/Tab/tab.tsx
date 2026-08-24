import { FC } from "react"
import { NavLink } from "react-router-dom"
import { clProduct } from "../../types/interface"
import FadeImage from "../ui/FadeImage/fadeImage"
import "./tab.css"

type TabProps = clProduct

const priceFormatter = new Intl.NumberFormat("en-US")

const TabComponent: FC<TabProps> = ({ id, name, img, price }) => {
  const formattedPrice = Number.isFinite(price) ? priceFormatter.format(price) : null

  return (
    <NavLink className="tab" to={`/product-page/${id}`}>
      <FadeImage src={img} alt={name} />
      <span className="tab-meta">
        <strong className="tab-name">{name}</strong>
        {formattedPrice ? (
          <span className="tab-price" aria-label={`${formattedPrice} yen`}>
            <span className="tab-price-amount">{formattedPrice}</span>
            <span className="tab-price-currency" aria-hidden="true">¥</span>
          </span>
        ) : null}
      </span>
    </NavLink>
  )
}

export default TabComponent
