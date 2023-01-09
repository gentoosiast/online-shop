import React from "react";
import { useRouteError, Link } from "react-router-dom";
import cat404 from '../assets/cat404.png';

type RouteError = {
  statusText?: string;
  message?: string;
}

export const ErrorPage = () => {
  const error = useRouteError() as RouteError;

  return (
    <div id="error-page" className="flex justify-center items-center">
      <div className="flex flex-col items-center gap-4 text-center p-12">
        <h1 className="text-8xl font-bold text-orange-900 p-4">404</h1>
        <p>Похоже, мы не можем найти нужную Вам страницу</p>
        <p>
          Техническое сообщение об ошибке: <i>{error?.statusText || error?.message}</i>
        </p>
        <div className=''>
              <img src={cat404} alt="404 cat" className='w-64 p-8'/>
            </div>
        <Link to="/" className="button button-add">на главную</Link>
      </div>
    </div>
  );
}
