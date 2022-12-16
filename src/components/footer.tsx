import React, { useReducer, useState } from 'react';
import githubLogo from '../assets/github-light-bg.svg'
import rsLogo from '../assets/rslogo-light-bg.svg'

export const Footer = () => {
  return (
    <div className='footer'>
      <div className='flex gap-5'>
        <a href = 'https://github.com/gentoosiast' target = "_blank">
          <img src= {githubLogo} alt="github" className='h-8'/>
        </a>
        <a href = 'https://github.com/sinastya' target = "_blank">
          <img src= {githubLogo} alt="github" className='h-8'/>
        </a>
      </div>
      <div>Online Store 2022</div>
      <a href = 'https://rs.school/js/' target = "_blank" className='footer-rsschool'>
        <img src= {rsLogo} alt="github" className='h-8'/>
      </a>
    </div>
  )
}
