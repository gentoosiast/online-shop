import React from 'react';
import githubLogo from '../assets/github-light-bg.svg';
import rsLogo from '../assets/rslogo-light-bg.svg';
import styles from '../css/header.module.css';
import logoImg from '../assets/logo.png';
import email from '../assets/message.png';
import phone from '../assets/calling.png';

export const Footer = () => {
  return (
    <footer>
      <div className='footer2 flex justify-between items-center bg-green-50 py-2 border-t border-b'>
        <div className='flex items-center'>
          <img src={logoImg} alt="Online Shop Logo" className={styles.logo} />
          <h2 className='text-green-600'>Shop name</h2>
        </div>
        <div  className={styles.link_shop}>
          <img src={email} alt="email" className='' />
          <h2>contact@shopname.com</h2>
        </div>
        <div className={styles.link_shop}>
          <img src={phone} alt="phone" className='' />
          <h2 className=''>+375 (17) 209-90-62</h2>
        </div>
      </div>
      <div className='footer3 flex items-center justify-between py-4'>
        <div className='flex gap-5'>
          <a href = 'https://github.com/gentoosiast' target = "_blank">
            {/* <img src= {githubLogo} alt="github" className='h-8'/> */}
            @gentoosiast
          </a>
          <a href = 'https://github.com/sinastya' target = "_blank">
            {/* <img src= {githubLogo} alt="github" className='h-8'/> */}
            @sinastya
          </a>
        </div>
        {/* <div className='-mr-6'>Online Store 2022</div> */}
        <a href = 'https://rs.school/js/' target = "_blank" className='footer-rsschool'>
          <img src= {rsLogo} alt="github" className='h-8'/>
        </a>
      </div>
    </footer>
  )
}
