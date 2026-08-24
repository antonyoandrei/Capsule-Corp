import "./about.css"

const AboutComponent = () => {
  return (
    <article className="frame-3">
      <header className="about-header">
        <div>
          <span>West City archive / legacy file 001</span>
          <h1>About Dragon Ball</h1>
        </div>
        <p>A universe that never stopped moving.</p>
      </header>

      <figure className="about-visual">
        <img className="bg-main-02-1" src="https://res.cloudinary.com/du94mex28/image/upload/f_auto,q_auto/v1/bgs/zflxcrseaqkou4jkwnwi" alt="Dragon Ball banner: enjoy only the best the Dragon Ball universe has to offer" />
        <span className="about-animation-container">
          <img className="img-main-02-1" src="https://res.cloudinary.com/du94mex28/image/upload/f_auto,q_auto/v1/bgs/gsvy5vmjgtn8vzslzgxp" alt="Dragon Ball characters travelling together" />
        </span>
      </figure>

      <section className="about-text" aria-labelledby="about-story-title">
        <span className="about-text-kicker">1984 — today</span>
        <h2 id="about-story-title">From manga pages to a worldwide icon.</h2>
        <div className="about-story">
          <p>Dragon Ball began serialization in Weekly Shonen Jump in Japan in 1984.</p>
          <p>It grew into anime, games and merchandise, with new stories still reaching millions of fans around the world.</p>
        </div>
        <dl className="about-facts">
          <div><dt>1984</dt><dd>First serialization</dd></div>
          <div><dt>Weekly Shonen Jump</dt><dd>Original magazine</dd></div>
          <div><dt>Worldwide</dt><dd>Anime, games and more</dd></div>
        </dl>
      </section>
    </article>
  )
}

export default AboutComponent
