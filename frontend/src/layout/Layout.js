import React from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import Alert from '../components/Alert'
import Toast from '../components/Toast'
import { useTheme } from '../store/contexts/ThemeContextProvider'

function Layout() {
  const {theme} = useTheme()
  return (
    <div className={`${theme}`}>
      <Navbar />
      <Toast />
      <Alert />
      <Outlet />
      <Footer />
    </div>
  )
}

export default Layout
