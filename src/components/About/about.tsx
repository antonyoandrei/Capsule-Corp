import { artwork } from "../../services/artwork"
import FadeImage from "../ui/FadeImage/fadeImage"
import { useVisibleMotion } from "../ui/useVisibleMotion"
import "./about.css"

const AboutComponent = () => {
  const motionRef = useVisibleMotion<HTMLElement>()
  return (
  <article className="frame-3" aria-labelledby="about-title">
    <h1 id="about-title">About<br />this project</h1>
    <figure ref={motionRef} className="about-visual">
      <span className="about-road" aria-hidden="true" />
      <span className="about-car-arrival">
        <span className="about-animation-container">
          <FadeImage
            className="img-main-02-1"
            src={artwork("dragonBallCast", 717)}
            alt="Goku, Bulma and their friends travelling together in a Capsule Corp car"
            width="717"
            height="801"
            loading="eager"
          />
        </span>
      </span>
    </figure>
    <div className="about-story">
      <p>I’m a Dragon Ball fan, and this is a personal project I built in 2022. I updated it in 2026 to keep it up to date.</p>
      <p>The project is built with React, Vite and TypeScript. I use Cloudinary to store and optimize the images so they stay lightweight.</p>
      <p>The original pictures weren’t always great quality. I cut them out by hand and even painted over parts of some images to get a better result. For the 2026 update, GPT helped me refactor the UI and upscale those original images.</p>
    </div>
  </article>
)
}

export default AboutComponent
