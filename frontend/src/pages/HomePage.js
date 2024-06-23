import React from 'react'
import { useLogin } from '../store/contexts/LoginContextProvider'
import { useNavigate } from 'react-router-dom'
// import { useAlert } from '../contexts/AlertContextProvider'
// import { useLoading } from '../store/contexts/LoadingContextProvider'
import BtnLoader from '../components/loaders/BtnLoader'
import { useTheme } from '../store/contexts/ThemeContextProvider'

function HomePage() {
  const {isLoggedIn, fullName} = useLogin()
  
  // const alertCtx = useAlert()
  // const loadingCtx = useLoading();
  const Navigate = useNavigate()
  const themeCtx = useTheme()

  const handleBtn =()=> {
    Navigate("/login")
  }

  const handleAlert = ()=> {
    themeCtx.toggleTheme()
  }

  return (
    <div className='dark:text-white dark:bg-gray-700 w-full'>
      HomePage <br /> User LoggedIn :  {isLoggedIn ? "yes ," : "No"} {fullName}
      <button className=" bg-blue-600 p-3 m-2 rounded-xl" name="go home" onClick={handleBtn}>Login Page</button>
      <button className=" bg-blue-600 p-3 m-2 rounded-xl" name="go home" onClick={handleAlert}>Testing</button>  
      < BtnLoader />
    </div>
  )
}

export default HomePage
