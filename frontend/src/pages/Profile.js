import React, { useEffect, useState } from 'react'
import { Server } from '../Constants'
import axios from 'axios'
// import { useLogin } from '../contexts/LoginContextProvider'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'


function Profile() {
    const Navigate = useNavigate()
    const [user, setUser] = useState({
        fullName : "",
        email : "",
        contactNumber : null
    })

    const [cookies] = useCookies(["accessToken", "refreshToken"])
    async function fetchData(){
        try {
            const res = (await axios.get(`${Server}/users/get-current-user`,{withCredentials : true})).data.data
            setUser( prev => ({
                ...prev,
                fullName : res.fullName,
                email : res.email,
                contactNumber: res.contactNumber
        }))
        } catch (error) {
            console.log(error);
        }
    }

    useEffect( ()=>{
        if(!cookies.accessToken){
            return alert("Session Expired!! Refresh the page")
        }
        fetchData()
    },[])

  return (
    <div>
      <h1 className='text-3xl'>Profile</h1>
            <h2> Name : {user.fullName}</h2>
            <h2>Email : {user.email}</h2>
            <h2>Contact Number : {user.contactNumber}</h2>
            <button onClick={()=> {Navigate('/login')}} className='bg-blue-600 p-2 rounded-lg'>Back</button>
    </div>
  )
}

export default Profile
