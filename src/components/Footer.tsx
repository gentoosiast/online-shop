import React from 'react';
import styles from '../css/header.module.css';
import rsLogo from '../assets/rslogo-light-bg.svg';
import CatIcon1 from '../assets/cat_walk_icon_.png';
import CatIcon2 from '../assets/cat_icon.png';
import email from '../assets/message.png';
import location from '../assets/location.png';
import phone from '../assets/calling.png';
import fb from '../assets/Facebook.png';
import ig from '../assets/Instagram.png';
import li from '../assets/Linkedin.png';
import tw from '../assets/Twitter.png';
import ut from '../assets/Union.png';
import cards from '../assets/all_cards.png';

export const Footer = () => {
  return (
    <footer className='pt-12'>
      <div className='footer1 mobile-1:hidden laptop:flex justify-between p-4  laptop:flex-row'>
        <div className='col1 mobile-1:w-full laptop:w-1/5 shrink-0'>
          <p className='font-bold'>Категории</p>
          <p className={styles.footerNowhere}>Кружки</p>
          <p className={styles.footerNowhere}>Бумажная продукция</p>
          <p className={styles.footerNowhere}>Сладости</p>
          <p className={styles.footerNowhere}>Сумки</p>
          <p className={styles.footerNowhere}>Одежда</p>
          <p className={styles.footerNowhere}>Книги</p>
        </div>
        <div className='col2 mobile-1:w-full laptop:w-1/4 shrink-0'>
          <p className='font-bold'>Покупателям</p>
          <p className={styles.footerNowhere}>Как сделать заказ</p>
          <p className={styles.footerNowhere}>Способы оплаты</p>
          <p className={styles.footerNowhere}>Доставка</p>
          <p className={styles.footerNowhere}>Возврат товара</p>
          <p className={styles.footerNowhere}>Вопросы и ответы</p>
          <p className={styles.footerNowhere}>Специальные предложения</p>
        </div>
        <div className='col3 mobile-1:w-full laptop:w-1/4 shrink-0'>
          <p className='font-bold'>Разное</p>
          <p className={styles.footerNowhere}>Поставщикам</p>
          <p className={styles.footerNowhere}>Трудоустройство</p>
          <p className={styles.footerNowhere}>О нас</p>
          <p className={styles.footerNowhere}>Статьи</p>
          <p className={styles.footerNowhere}>Контакты</p>
        </div>
        <div className='col4 mobile-1:w-fit laptop:w-1/5 shrink-0'>
          <p className='font-bold pb-2'>Мы в соцсетях</p>
          <div className='flex justify-between'>
            <div className={styles.media}><img src={fb} alt="Иконка Facebook" className='m-auto'/></div>
            <div className={styles.media}><img src={ig} alt="Иконка Instagram" className='m-auto'/></div>
            <div className={styles.media}><img src={tw} alt="Иконка Twitter" className='m-auto'/></div>
            <div className={styles.media}><img src={ut} alt="Иконка YouTube" className='m-auto'/></div>
            <div className={styles.media}><img src={li} alt="Иконка LinkedIn" className='m-auto'/></div>
          </div>
          <p className='font-bold pt-8 pb-2'>Мы принимаем к оплате</p>
          <div className=''><img src={cards} alt="Изображения различных кредитных карт" className=''/></div>
        </div>
      </div>
      <div className='footer2 mobile-1:hidden laptop:flex justify-between items-center bg-green-50 p-4 border-t border-b flex-row'>
        <div className='flex items-center mobile-1:w-full laptop:w-1/5'>
          <div className={styles.logo_footer}>
            <img src={CatIcon1} alt="Иконка с лого магазина - версия 1" className={styles.logo1}/>
            <img src={CatIcon2} alt="Иконка с лого магазина - версия 2" className={styles.logo2}/>
          </div>
          <h2 className='text-orange-800 pl-2 select-none'>RedCat</h2>
        </div>
        <div  className={styles.link_shop_footer}>
          <img src={location} alt="Иконка, обозначающая географическое местоположение" className='' />
          <h2>просп. Независимости, 11, Минск</h2>
        </div>
        <div  className={styles.link_shop_footer}>
          <img src={email} alt="Иконка, обозначающая email-адрес" className='' />
          <h2>contact@redcat.com</h2>
        </div>
        <div className={styles.link_shop_footer1}>
          <img src={phone} alt="Иконка, обозначающая номер телефона" className='' />
          <h2 className=''>+375 (17) 209-90-62</h2>
        </div>
      </div>
      <div className='footer3 mobile-1:hidden tablet:flex items-center justify-between p-4 flex-row'>
        {/* <div className='flex gap-5'> */}
          <a href = 'https://github.com/gentoosiast' target = "_blank" className='w-1/5 text-gray-700 text-sm hover:text-black'>
            @gentoosiast
          </a>
          <a href = 'https://github.com/sinastya' target = "_blank" className='w-1/4 text-gray-700 text-sm hover:text-black'>
            @sinastya
          </a>
        {/* </div> */}
        <div className='w-1/4 text-gray-700 text-sm'>©2023</div>
        <a href = 'https://rs.school/js/' target = "_blank" className='footer-rsschool w-1/5'>
          <img src= {rsLogo} alt="Иконка с логотипом RS School" className={styles.rs}/>
        </a>
      </div>
    </footer>
  )
}
