import FeaturedRail from "../../components/FeaturedRail/featuredRail"
import SectionsComponent from "../../components/Sections/sections"

const Homepage = () => {
  return (
    <div className="home-page">
      <h1 className="sr-only">Capsule Corp collections</h1>
      <SectionsComponent />
      <FeaturedRail />
    </div>
  )
}

export default Homepage
