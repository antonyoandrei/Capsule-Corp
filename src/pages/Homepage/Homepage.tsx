import FeaturedRail from "../../components/FeaturedRail/featuredRail"
import HomeIntro from "../../components/HomeIntro/homeIntro"
import SectionsComponent from "../../components/Sections/sections"

const Homepage = () => {
  return (
    <div className="home-page">
      <div className="home-masthead"><HomeIntro /></div>
      <SectionsComponent />
      <FeaturedRail />
    </div>
  )
}

export default Homepage
