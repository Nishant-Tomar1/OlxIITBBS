import React, { useState } from 'react'
import { useLogin } from '../contexts/LoginContextProvider'
import { useNavigate } from 'react-router-dom'
import { Server } from '../Constants'
import axios from 'axios'
import { useAlert } from '../contexts/AlertContextProvider'

function SignUp() {
  const [newUser , setNewUser] = useState({
    username : "",
    email : "",
    password : "",
    fullName : "",
    contactNumber : "",
  })

  const Navigate = useNavigate()
  const alertCtx = useAlert()

  const handlenewUserChange = (e)=>{
    setNewUser(prev => ({
      ...prev,
      [e.target.name] : e.target.value
    }))
  }

  const handleSubmit = async (e)=>{
    const fileInput = document.getElementById("profilePicture")
    const file = fileInput.files[0]
    e.preventDefault()
    try {  
      const formData = new FormData();
      formData.append('username', newUser.username)
      formData.append('email', newUser.email)
      formData.append('fullName', newUser.fullName)
      formData.append('password', newUser.password)
      formData.append('contactNumber', newUser.contactNumber)
      formData.append('profilePicture', file);
      const res = await axios.post(`${Server}/users/register`, formData , {
            headers: {
            'Content-Type': 'multipart/form-data'
        }})
      // console.log(res);
      if (res.data.statusCode === 200){
        alertCtx.setToast("success", "User Registered Successfully")
        setNewUser(prev => ({
          ...prev,
          username : "",
          email : "",
          password : "",
          fullName : "",
          contactNumber : "",
        }))
        Navigate("/login")

      }
    } catch (error) {
      console.log(error);
      alertCtx.error("error", "Something wrong happened")
    }
  }

  const {isLoggedIn, fullName } = useLogin()

  const handleBtn = () => {
    Navigate("/")
  }
  
  
  
  return (
    <>
    <div className='flex flex-col items-center justify-center'> 

    <h1 className='mt-10 text-2xl mb-2'>SignUp</h1>
    <form action="" onSubmit={handleSubmit} >
        <label htmlFor="">Username : </label> 
        <input type="text" value={newUser.username} name='username' onChange={handlenewUserChange}/>
        <br />

        <label htmlFor="">Email : </label> 
        <input type="email" value={newUser.email} name='email' onChange={handlenewUserChange}/>
        <br />

        <label htmlFor="">Full Name : </label> 
        <input type="text" value={newUser.fullName} name='fullName' onChange={handlenewUserChange}/>
        <br />

        <label htmlFor="">Password : </label> 
        <input type="password" value={newUser.password} name='password' onChange={handlenewUserChange}/>
        <br />

        <label htmlFor="">Contact Number : </label> 
        <input type="tel" value={newUser.contactNumber} name='contactNumber' pattern="[0-9]{10}" onChange={handlenewUserChange}/>
        <br />

        <label htmlFor="">Profile Picture : </label> 
        <input type="file" id='profilePicture' accept="image/*"/>

        <button type='submit' className='bg-blue-600 rounded-lg p-2'>SignUp</button>
        </form>
    </div>


    <h1>User Logged In : {isLoggedIn ? "yes" : "No"} {fullName} </h1>
    <button className=" bg-blue-600 p-3 m-2 rounded-xl" onClick={handleBtn}>Homepage</button>
    </>
  )
}

export default SignUp
