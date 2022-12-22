import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header'
import { Footer } from './Footer'

export const Root = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
