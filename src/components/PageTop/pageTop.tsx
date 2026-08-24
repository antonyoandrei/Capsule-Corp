import { useState, useEffect } from 'react';
import './page-top.css' 

const PageTop = () => {
  const [showPageTop, setShowPageTop] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScroll = () => {
    if (document.documentElement.scrollTop > 200) {
      setShowPageTop(true);
    } else {
      setShowPageTop(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button className={`page-top ${showPageTop ? 'shown' : 'hidden'}`} onClick={scrollToTop} type="button" aria-label="Back to page top">
      Page Top
    </button>
  );
};

export default PageTop;
