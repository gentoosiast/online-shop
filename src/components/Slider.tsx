import React, { useState } from "react";
import ReactSlider from "react-slider";

export const Slider = () => {
  const [sliderValues, setSliderValues] = useState([0, 100]);
  return (
      <div className="slider-container">
        <ReactSlider
          className="slider"
          trackClassName="slider-track"
          thumbClassName="slider-thumb"
          defaultValue={[0, 100]}
          onChange={(value) => {
            setSliderValues(value);
          }}
        />
        <div className="slider-text">
          <span className="slider-min">{sliderValues[0]}</span>
          <span className="slider-max">{sliderValues[1]}</span>
        </div>
      </div>
  )
}
