import { artwork } from "../../services/artwork"
import FadeImage from "../ui/FadeImage/fadeImage"
import { useVisibleMotion } from "../ui/useVisibleMotion"
import "./home-intro.css"

const HomeIntro = () => {
  const motionRef = useVisibleMotion<HTMLElement>()
  return (
  <section ref={motionRef} className="home-intro" aria-labelledby="home-title">
    <div className="home-intro-content">
      <h1 id="home-title" aria-label="Capsule Corp Store">
        <span>Capsule</span>
        <span>Corp Store</span>
      </h1>
    </div>
    <FadeImage className="home-intro-art" src={artwork("gokuNimbus", 1028)} srcSet={`${artwork("gokuNimbus", 560)} 560w, ${artwork("gokuNimbus", 1028)} 1028w`} sizes="(max-width: 600px) 195px, 360px" alt="Young Goku riding the Flying Nimbus" width="1028" height="1100" loading="eager" fetchPriority="high" />
  </section>
)
}

export default HomeIntro
