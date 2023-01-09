import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

export const Root = () => {
  return (
    <>
      <Header />
      <main className='my-6'>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
