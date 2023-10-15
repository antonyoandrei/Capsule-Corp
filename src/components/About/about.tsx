import HeaderLoginComponent from '../Header/header-login';
import HeaderNavComponent from '../Header/header-nav';
import './about.css'

const AboutComponent = () => {
    return (
      <>
      <HeaderLoginComponent />
      <HeaderNavComponent />
      <div className="frame-3">
        <img className="bg-main-02-1" src="https://res.cloudinary.com/du94mex28/image/upload/f_auto,q_auto/v1/bgs/zflxcrseaqkou4jkwnwi" alt="Background" />
        <section className="about-animation-container">
          <img className="img-main-02-1" src="https://res.cloudinary.com/du94mex28/image/upload/f_auto,q_auto/v1/bgs/gsvy5vmjgtn8vzslzgxp" alt="Image" />
        </section>
        <div className="about-text">
          Dragon Ball first began its serialization in the comic magazine Weekly Shonen Jump in Japan in 1984. From there, it has branched out into various media, including anime and games, as well as spawned a plethora of merchandise, and continues to have new works produced to this day. Currently, Dragon Ball-related media is released all around the world, where it is enjoyed by many millions of fans.
        </div>
      </div>
      </>
    );
}
  
export default AboutComponent;