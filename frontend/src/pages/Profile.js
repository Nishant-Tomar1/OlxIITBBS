import React, { useEffect, useState } from 'react'
import { Server } from '../Constants'
import axios from 'axios'
// import { useLogin } from '../contexts/LoginContextProvider'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import { useAlert } from '../contexts/AlertContextProvider'


function Profile() {
    const Navigate = useNavigate()
    const [user, setUser] = useState({
        username : "",
        fullName : "",
        email : "",
        contactNumber : null
    })

    const [cookies] = useCookies(["accessToken", "refreshToken"])
    const alertCtx  = useAlert()

    async function fetchData(){
        try {
            const res = (await axios.get(`${Server}/users/get-current-user`,{withCredentials : true})).data.data
            setUser( prev => ({
                ...prev,
                username : res.username,
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
            // alertCtx.setToast("warning","Login to access profile")
            Navigate('/login')
        }
        fetchData()
    },[cookies.accessToken, alertCtx])

  return (
    <div>
      <h1 className='text-3xl'>Profile</h1>
            <h2> Username : {user.username}</h2>
            <h2> Name : {user.fullName}</h2>
            <h2>Email : {user.email}</h2>
            <h2>Contact Number : {user.contactNumber}</h2>
            <button onClick={()=> {Navigate('/login')}} className='bg-blue-600 p-2 rounded-lg'>Back</button>
    </div>
  )
}

export default Profile
