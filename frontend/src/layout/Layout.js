import React from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
// import Alert from '../components/Alert'
import Toast from '../components/Toast'
import { useTheme } from '../store/contexts/ThemeContextProvider'

function Layout() {
  const {theme} = useTheme()
  return (
    <div className={`${theme} bg-gray-100 dark:bg-[#191919]`}>
      <Navbar />
      {/* <Alert /> */}
      <Toast />
      <Outlet />
      <Footer />
    </div>
  )
}

export default Layout
