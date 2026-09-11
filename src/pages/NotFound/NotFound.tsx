import { NavLink, useNavigate } from "react-router-dom"
import "./not-found.css"

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <section className="not-found" aria-labelledby="not-found-title">
      <div className="not-found-panel">
        <span className="not-found-kicker">404</span>
        <p className="sr-only">Error 404</p>
        <div className="not-found-code" aria-hidden="true">
          <span>4</span>
          <span className="not-found-ball">
            <span><i>★</i><i>★</i><i>★</i><i>★</i></span>
          </span>
          <span>4</span>
        </div>
        <h1 id="not-found-title">Wrong timeline.</h1>
        <p className="not-found-copy">Bulma's radar cannot find this route. It may have vanished in another timeline.</p>
        <div className="not-found-actions">
          <NavLink className="not-found-home" to="/homepage">Return home <span aria-hidden="true">→</span></NavLink>
          <button className="not-found-back" type="button" onClick={() => navigate(-1)}>Go back</button>
        </div>
        <span className="not-found-coordinate" aria-hidden="true">CC–404 / SIGNAL 00.00</span>
      </div>
    </section>
  )
}

export default NotFound
