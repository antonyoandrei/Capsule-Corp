import type { PointerEvent } from "react"
import { NavLink } from "react-router-dom"
import FadeImage from "../ui/FadeImage/fadeImage"
import { artwork } from "../../services/artwork"
import "./sections.css"

const collections = [
  { to: "/clothes", title: "Clothes", image: artwork("collectionGoku", 850), small: artwork("collectionGoku", 480), width: 850, height: 1133 },
  { to: "/items", title: "Items", image: artwork("collectionKingKai", 850), small: artwork("collectionKingKai", 480), width: 850, height: 1133 },
  { to: "/most-buyed", title: "Most wanted", image: artwork("collectionVegeta", 850), small: artwork("collectionVegeta", 480), width: 850, height: 1133 },
]

const moveLayers = (event: PointerEvent<HTMLAnchorElement>) => {
  if (event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return
  const card = event.currentTarget
  const bounds = card.getBoundingClientRect()
  const x = (event.clientX - bounds.left) / bounds.width - .5
  const y = (event.clientY - bounds.top) / bounds.height - .5
  card.style.setProperty("--tilt-x", `${-y * 7}deg`)
  card.style.setProperty("--tilt-y", `${x * 7}deg`)
  card.style.setProperty("--art-x", `${x * 12}px`)
  card.style.setProperty("--art-y", `${y * 8}px`)
  card.style.setProperty("--light-x", `${(x + .5) * 100}%`)
  card.style.setProperty("--light-y", `${(y + .5) * 100}%`)
}

const resetLayers = (event: PointerEvent<HTMLAnchorElement>) => {
  for (const property of ["--tilt-x", "--tilt-y", "--art-x", "--art-y", "--light-x", "--light-y"]) {
    event.currentTarget.style.removeProperty(property)
  }
}

const SectionsComponent = () => (
  <nav className="sections-container" aria-label="Shop by collection">
    {collections.map((collection, index) => (
      <NavLink className="collection-link" to={collection.to} key={collection.to} draggable={false} onPointerMove={moveLayers} onPointerLeave={resetLayers} onPointerCancel={resetLayers}>
        <span className="collection-scene">
          <span className="collection-surface" aria-hidden="true"><span className="collection-speed" /></span>
          <span className="collection-portrait">
            <FadeImage className="collection-art" src={collection.image} srcSet={`${collection.small} 480w, ${collection.image} 850w`} sizes="(max-width: 600px) 85vw, (max-width: 864px) 36vw, (max-width: 1400px) 30vw, 400px" width={collection.width} height={collection.height} alt="" loading={index === 0 ? "eager" : "lazy"} draggable={false} />
          </span>
          <span className="collection-copy">
            <strong className="collection-title">{collection.title}</strong>
          </span>
        </span>
      </NavLink>
    ))}
  </nav>
)

export default SectionsComponent
