import React, { useState } from "react";
import ReactSlider from 'react-slider';
import styles from '../css/sidebar.module.css';

interface ISlider {
  minV: number
  maxV: number
  char: string
  handleSliderChange: (value: number[])=> void
  // onReset: boolean
}

export const Slider = ({minV, maxV, char, handleSliderChange}: ISlider) => {
  const [value, setValue] = useState([minV, maxV]);

  // if (onReset) setValue([minV, maxV])

  return (
      <div className={styles.sliderContainer}>
        <ReactSlider
          className={styles.slider}
          trackClassName={styles.sliderTrack}
          thumbClassName={styles.sliderThumb}
          thumbActiveClassName={styles.sliderThumbActive}
          min={minV}
          max={maxV}
          value={value}
          minDistance={0}
          onChange={(value:number[]) => {
            handleSliderChange(value)
            setValue(value);
          }}
        />
        <div className={styles.sliderText}>
          <span className={styles.sliderMin}>{`${char}${value[0]}`}</span>
          <span className={styles.sliderMax}>{`${char}${value[1]}`}</span>
        </div>
      </div>
  )
}
