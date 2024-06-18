import React, { useState } from 'react'
import axios from 'axios';
import { useLogin } from '../contexts/LoginContextProvider';
import { useNavigate } from 'react-router-dom';
import { Server } from '../Constants';

function Login() {
  const [user, SetUser] = useState({
    username : "",
    email : "",
    password : ""
  });
  const Navigate = useNavigate()

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

    try {
      const response = await axios.post("http://localhost:8000/api/v1/users/login",user);
      const user2 = (response.data.data.user);

      if (user2){
        login(response.data.data.accessToken,response.data.data.refreshToken, user2.fullName);
      }
      
      if (response.data.success){
        window.alert(`${response.data.message} \n Name :${response.data.data.user.fullName}`)
      }

    } catch (error) {
      alert(`Error : ${error.code}`)
    }
  }
  

  const handleLogout = async (e) =>{
    e.preventDefault()
    await axios.post(`${Server}/users/logout`,{},{withCredentials : true});
    logout();
  }

  const handleBtn = (e) => {
    e.target.name === "go home" ? Navigate("/") : Navigate("/signup")
  }

  const handleProfile = (e) => {
    e.preventDefault()
    Navigate('/profile')
  }


  return (
    <div className='items-center justify-center gap-2 m-10'>
      <h1 className='text-xl'>Login</h1>
      <form action="" onSubmit={handleLogin} >

        <label htmlFor="">FullName : </label>
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
        type="password" 
        name='password'
        placeholder='password'
        onChange={handleUserChange}
        value={user.password}
        /> <br />

        <button 
        type='submit'
        className='bg-blue-600 px-3 py-2 rounded-lg'>
          Login
        </button>
        <button className='bg-blue-600 px-3 py-2 rounded-lg m-2' onClick={handleLogout}> Logout</button>

      </form>
      <div>
        <h1>UserLoggidIn : {isLoggedIn ? `Yes` :  "No"} <p>fullName :{fullName}</p></h1>
      </div>


      {/* <SignUp /> */}

      <button className=" bg-blue-600 p-3 m-2 rounded-xl" name="go home" onClick={handleBtn}>Home</button>
      <button className=" bg-blue-600 p-3 m-2 rounded-xl" name="signup" onClick={handleBtn}>Signup</button>
      <button className=" bg-blue-600 p-3 m-2 rounded-xl" name="profile" onClick={handleProfile}>Profile</button>
    </div>
  )
}


export default Login
