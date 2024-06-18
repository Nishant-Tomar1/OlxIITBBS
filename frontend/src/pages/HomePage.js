import React from 'react'
import { useLogin } from '../contexts/LoginContextProvider'
import { useNavigate } from 'react-router-dom'

function HomePage() {
  const {isLoggedIn, fullName, login} = useLogin()
  const handleLogin = ()=>{
    login("","",12345)
    console.log("Signup check :",fullName ? fullName : "No");
  }

  const Navigate = useNavigate()

  const handleBtn =()=> {
    Navigate("/login")
  }
  return (
    <div>
      HomePage: {isLoggedIn ? "yes" : "No"}{fullName}
      <button className=" bg-blue-600 p-3 m-2 rounded-xl" onClick={handleLogin}>Click to login</button>
      <button className=" bg-blue-600 p-3 m-2 rounded-xl" name="go home" onClick={handleBtn}>Login</button>
    </div>
  )
}

export default HomePage
