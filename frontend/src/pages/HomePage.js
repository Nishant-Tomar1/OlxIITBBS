import React from 'react'
import { useLogin } from '../contexts/LoginContextProvider'
import { useNavigate } from 'react-router-dom'
import { useAlert } from '../contexts/AlertContextProvider'

function HomePage() {
  const {isLoggedIn, fullName} = useLogin()
  
  const alertCtx = useAlert()

  const Navigate = useNavigate()

  const handleBtn =()=> {
    Navigate("/login")
  }

  const handleAlert = ()=> {
    if(isLoggedIn) alertCtx.setToast("warning" , fullName + " Hello World");
  }

  return (
    <div className='mx-10 mt-2 '>
      HomePage <br /> User LoggedIn :  {isLoggedIn ? "yes ," : "No"} {fullName}
      <button className=" bg-blue-600 p-3 m-2 rounded-xl" name="go home" onClick={handleBtn}>Login Page</button>
      <button className=" bg-blue-600 p-3 m-2 rounded-xl" name="go home" onClick={handleAlert}>Alert</button>
    </div>
  )
}

export default HomePage
