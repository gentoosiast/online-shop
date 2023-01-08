import React from "react";
import { useEffect, useState } from "react";
import styles from '../css/scroll.module.css';
import featherSprite from 'feather-icons/dist/feather-sprite.svg';


export const ScrollToTop = () => {
  const [isVisible, setVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 250) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }

  const scrollUp = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);


  return (
    <>
      <div className="fixed bottom-7 right-7">
        <button type="button" onClick={scrollUp} className = { isVisible ? styles.visible : styles.invisible}>
          <svg className={styles.svgFeather}>
            <use href={`${featherSprite}#arrow-up`} />
          </svg>
        </button>
      </div>
    </>
  )
}
