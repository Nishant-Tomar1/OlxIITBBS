import React, { useEffect, useState } from 'react'
import { useLoading } from '../store/contexts/LoadingContextProvider'
import { useNavigate } from 'react-router-dom'
import { Server } from '../Constants'
import BtnLoader from "../components/loaders/BtnLoader"
import axios from 'axios'
import { useAlert } from '../store/contexts/AlertContextProvider'
import { Link } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

function SignUp() {
  const [newUser , setNewUser] = useState({
    username : "",
    email : "",
    password : "",
    firstName : "",
    lastName : "",
    contactNumber : "",
  })
  const [showpassword, setShowPassword] = useState(false)

  const Navigate = useNavigate()
  const alertCtx = useAlert()
  const loadingCtx = useLoading()

  useEffect(()=>{
    const fetchprevUserData = async() => {
        
    }
  })

  const handleNewUserChange = (e)=> {
    setNewUser(prev => ({
      ...prev,
      [e.target.name] : e.target.value
    }))
  }

  const handleSubmit = async (e)=>{
    e.preventDefault()
    for (const key in newUser){
      // console.log(newUser[key]);
      if(newUser[key]==="" && key!=="lastName"){
        return alertCtx.setToast("warning", `${key} is required!`)
      }
    }
    if(newUser.password.length < 6 ){
      return alertCtx.setToast("warning", "Password must be at least 6 characters long")
    }
    const fileInput = document.getElementById("profilePicture")
    const file = fileInput.files[0]
    if (!file){
      return alertCtx.setToast("warning", "Profile Picture is required!!")
    }
    try {  
      loadingCtx.setLoading(true)
      const formData = new FormData();
      formData.append('username', newUser.username.toLowerCase())
      formData.append('email', newUser.email.toLowerCase())
      formData.append('fullName', newUser.firstName+" "+newUser.lastName)
      formData.append('password', newUser.password)
      formData.append('contactNumber', newUser.contactNumber)
      formData.append('profilePicture', file);
      const res = await axios.post(`${Server}/users/register`, formData , {
            headers: {
            'Content-Type': 'multipart/form-data'
        }})
      console.log(res);
      if (res.data.statusCode === 200){
        loadingCtx.setLoading(false)
        alertCtx.setToast("success", "User Registered Successfully")
        setNewUser(prev => ({
          ...prev,
          username : "",
          email : "",
          password : "",
          firstName : "",
          lastName:"",
          contactNumber : "",
        }))
        Navigate("/login")

      }
    } catch (error) {
      // console.log(error.response.data.message);     
        loadingCtx.setLoading(false)
        alertCtx.setToast("error", "User with this email or username already exists")
    }
  }
  
  
  
  return (
    <div  className="flex flex-col w-full pt-5 pb-12 items-center justify-center min-h-[70vh] bg-gray-100 dark:bg-[#191919] dark:text-white">
            <h1 className="text-2xl lg:text-4xl font-bold font-[Raleway] pb-2">SignUp</h1>
        <form className=" mx-auto w-11/12 md:w-7/12 lg:w-4/12" onSubmit={handleSubmit}>
        <div className="mb-3">
            <label name="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Username</label>
            <input type="text" name="username" className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white-500 dark:focus:border-white-500 " placeholder="Enter Username" value={newUser.username} onChange={handleNewUserChange} />
        </div>
        <div className="mb-3">
            <label name="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Email</label>
            <input type="email" name="email" placeholder="Enter your email" className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500 " value={newUser.email} onChange={handleNewUserChange} />
        </div>
        <div className='grid grid-cols-12 gap-2'>
          <div className="mb-3 col-span-6">
              <label name="firstName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">First Name</label>
              <input type="text" name="firstName" className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white-500 dark:focus:border-white-500 " placeholder="Enter Firstname" value={newUser.firstName} onChange={handleNewUserChange} />
          </div>
          <div className="mb-3 col-span-6">
              <label name="lastName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Last Name</label>
              <input type="text" name="lastName" className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white-500 dark:focus:border-white-500 " placeholder="Enter Lastname" value={newUser.lastName} onChange={handleNewUserChange} />
          </div>
        </div>
        <div className="mb-3">
            <label name="contactNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Contact Number</label>
            <input type="text" name="contactNumber" className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white-500 dark:focus:border-white-500 " placeholder="Enter Contact Number" value={newUser.contactNumber} onChange={handleNewUserChange} />
        </div>
        <div className="mb-3">
            <label name="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Password</label>
            <div className="flex rounded-lg ">
            <input type={showpassword ? "text" : "password"} autoComplete="off" name="password" className="w-10/12 shadow-md bg-gray-50 border border-gray-300 border-r-0 text-gray-900 text-md rounded-l-lg focus:ring-0 focus:border-gray-400 block p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Enter Password" value={newUser.password} onChange={handleNewUserChange}/>
            <div onClick={()=>{setShowPassword(!showpassword)}} target="none" className="flex w-1/6 text-xl items-center justify-center bg-gray-50 border border-gray-300 rounded-r-lg shadow-md  border-l-0 shadow-l-0 text-gray-800 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ">{showpassword ?<FaEye/> : <FaEyeSlash/>  }</div>
            </div>
        </div>
        <div className="mb-3">        
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Profile Picture</label>
          <input className="shadow-md block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="profilePicture" type="file" accept="image/*" />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG or JPEG.</p>
        </div>
        <button type="submit" className="w-full shadow-lg text-white bg-cyan-500 hover:bg-cyan-600  font-medium rounded-lg text-md px-5 py-2.5 text-center dark:bg-teal-500 dark:hover:bg-teal-600 ">{ loadingCtx.loading ? <BtnLoader /> : "Signup" }</button>
        </form>
            <Link to="/login" className="w-full text-center mt-3 text-sm md:text-lg">Already have an account? Login</Link>
        </div>

  )
}

export default SignUp
