import { useId } from "react"
import { artwork } from "../../services/artwork"
import FadeImage from "../ui/FadeImage/fadeImage"
import "./shenron-artwork.css"

// The paths follow the red eye regions in the original 1002 × 1638 artwork.
const eyes = "M305 574 328 541 342 527Q348 523 361 523L356 545Q353 554 342 560L312 579Z M225 570 227 570 262 590 260 594Q246 593 237 590Z"

const ShenronArtwork = () => {
  const glowId = useId()

  return (
    <span className="shenron-artwork" aria-hidden="true">
      <FadeImage src={artwork("shenron", 1002)} srcSet={`${artwork("shenron", 500)} 500w, ${artwork("shenron", 1002)} 1002w`} sizes="(max-width: 672px) 50vw, 288px" alt="" width="1002" height="1638" loading="eager" />
      <svg viewBox="0 0 1002 1638" focusable="false">
        <defs>
          <filter id={glowId} x="210" y="508" width="170" height="104" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        <g className="shenron-eye-flare">
          <path d={eyes} fill="#ff572d" filter={`url(#${glowId})`} />
          <path d={eyes} fill="#ffb64d" fillOpacity=".75" stroke="#ffe28b" strokeWidth="1.4" />
        </g>
      </svg>
    </span>
  )
}

export default ShenronArtwork
