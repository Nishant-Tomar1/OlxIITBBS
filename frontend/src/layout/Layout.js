import React from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import Alert from '../components/Alert'
import Toast from '../components/Toast'

function Layout() {
  return (
    <>
      <Navbar />
      <Toast />
      <Alert />
      <Outlet />
      <Footer />
    </>
  )
}

export default Layout
