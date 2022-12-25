import React, { useState } from "react";
import ReactSlider from 'react-slider';
import styles from '../css/sidebar.module.css';

interface ISlider {
  min: number
  max: number
}

export const Slider = ({min, max}: ISlider) => {
  const [sliderValues, setSliderValues] = useState([min, max]);
  console.log(min, max)
  return (
      <div className={styles.sliderContainer}>
        <ReactSlider
          className={styles.slider}
          trackClassName={styles.sliderTrack}
          thumbClassName={styles.sliderThumb}
          defaultValue={[min, max]}
          onChange={(value) => {
            setSliderValues(value);
          }}
        />
        <div className={styles.sliderText}>
          <span className={styles.sliderMin}>{sliderValues[0]}</span>
          <span className={styles.sliderMax}>{sliderValues[1]}</span>
        </div>
      </div>
  )
}
