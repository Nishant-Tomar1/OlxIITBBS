import React, { useState } from 'react'
import axios from 'axios';
import { useLogin } from '../store/contexts/LoginContextProvider';
import { useNavigate,Link } from 'react-router-dom';
import { Server } from '../Constants';
import { useAlert } from '../store/contexts/AlertContextProvider';

function Login() {
  const [user, SetUser] = useState({
    username : "",
    email : "",
    password : ""
  });
  const Navigate = useNavigate()
  const alertCtx = useAlert()

  const {isLoggedIn, fullName,  login, logout } = useLogin();
  
  const handleUserChange = (e)=> {
    const {name , value} = e.target;
    
    SetUser( user => ({
      ...user,
      [name]:value
    }))
  }
  
  const handleLogin = async (e)=> {
    e.preventDefault();
    if(user.username === "" && user.email === "" ){
      return alertCtx.setToast("warning", "Enter either username or email")
    }

    try {
      const response = await axios.post("http://localhost:8000/api/v1/users/login",user);
      const user2 = (response.data.data.user);

      if (user2){
        login(response.data.data.accessToken,response.data.data.refreshToken, user2.fullName);
      }
      
      if (response.data.success){
        alertCtx.setToast("success" ,`${response.data.message} `)
      }

    } catch (error) {
      alertCtx.setToast("error",`Incorrect ${!user.username ? "Email"  : "Username"} or Password`)
    }
  }
  

  const handleLogout = async (e) =>{
    e.preventDefault()
    try {
      await axios.post(`${Server}/users/logout`,{},{withCredentials : true});
      logout();
      alertCtx.setToast("success","User Logged Out Successfully")
      
    } catch (error) {
      console.log(error);
      alertCtx.setToast("error","Cannot Logout User! Something went wrong")
    }
  }

  const handleBtn = (e) => {
    e.target.name === "go home" ? Navigate("/") : Navigate("/signup")
  }

  const handleProfile = (e) => {
    e.preventDefault()
    Navigate('/profile')
  }


  return (
    <div className='items-center justify-center gap-2 '>
      <h1 className='text-xl'>{isLoggedIn ? "Login Another Account" : "Login"}</h1>
      <form action="" onSubmit={handleLogin} >

        <label htmlFor="">Username : </label>
        <input 
        onChange={handleUserChange} 
        name='username'
        type="text"
        placeholder='username' 
        value={user.username}
        /><br />

        <label htmlFor="">Email : </label>
        <input 
        type="text"
        name ='email' 
        placeholder='email'
        onChange={handleUserChange}
        value={user.email}
        /><br />

        <label htmlFor="">Password :</label>
        <input 
        required
        type="password" 
        name='password'
        placeholder='password'
        onChange={handleUserChange}
        value={user.password}
        /> <br />


        <button 
        type='submit'
        className='bg-blue-600 px-3 py-2 rounded-lg m-2'>
          Login
        </button>
        <Link to="/forgotpassword" className='text-blue-600 underline m-2'>forgot password ?</Link>

      </form>
      <div className='my-10'>
        <h1>UserLoggidIn : {isLoggedIn ? `Yes` :  "No"} <p>fullName :{fullName}</p></h1>
       { isLoggedIn &&
        <button className='bg-blue-600 px-3 py-2 rounded-lg m-2' onClick={handleLogout}> Logout</button>}
      </div>


      {/* <SignUp /> */}

      <button className=" bg-blue-600 p-3 m-2 rounded-xl" name="go home" onClick={handleBtn}>Home</button>
      <button className=" bg-blue-600 p-3 m-2 rounded-xl" name="signup" onClick={handleBtn}>Signup</button>
      <button className=" bg-blue-600 p-3 m-2 rounded-xl" name="profile" onClick={handleProfile}>Profile</button>
    </div>
  )
}


export default Login
