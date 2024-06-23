import React from 'react'
import { useLogin } from '../store/contexts/LoginContextProvider'
import { useNavigate } from 'react-router-dom'
// import { useAlert } from '../contexts/AlertContextProvider'
import { useLoading } from '../store/contexts/LoadingContextProvider'
import BtnLoader from '../components/loaders/BtnLoader'

function HomePage() {
  const {isLoggedIn, fullName} = useLogin()
  
  // const alertCtx = useAlert()
  const loadingCtx = useLoading();
  const Navigate = useNavigate()

  const handleBtn =()=> {
    Navigate("/login")
  }

  const handleAlert = ()=> {
    loadingCtx.setLoading(!loadingCtx.loading)
  }

  return (
    <div className='mx-10 mt-2 '>
      HomePage <br /> User LoggedIn :  {isLoggedIn ? "yes ," : "No"} {fullName}
      <button className=" bg-blue-600 p-3 m-2 rounded-xl" name="go home" onClick={handleBtn}>Login Page</button>
      <button className=" bg-blue-600 p-3 m-2 rounded-xl" name="go home" onClick={handleAlert}>Testing</button>
      {/* 

     */}

    {/*  */}
    
      < BtnLoader />
    

    </div>
  )
}

export default HomePage
