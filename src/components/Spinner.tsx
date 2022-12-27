import React from "react"
import spinnerImg from "../assets/spinner.svg"
import styles from '../css/spinner.module.css';


export const Spinner = () => {
  return (
    <div className={styles.preloader}>
      <img className={styles.spinner_img} src={spinnerImg} alt="spinner" />
    </div>
  )
}
