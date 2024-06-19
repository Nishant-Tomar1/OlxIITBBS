import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Server } from '../Constants'
import { useNavigate } from 'react-router-dom'

function ForgotPassword() {
    const [id, setId] = useState("")
    const [steps, setSteps] = useState({
        1 : true,
        2 : false,
        3 : false
    })
    const [code , setCode] = useState("")
    const [actualCode, setActualCode] = useState()
    const [email, setEmail] = useState("")
    const [newPassword, setNewPassword] = useState({P1:"", P2 : ""})

    const Navigate = useNavigate()

    useEffect(() => {
        setActualCode(Math.floor((Math.random()*899990)) + 100000) 
    },[])
    
    const handleClick = async ()=>{
        try {
            const res = await axios.post(`${Server}/users/verifyemail`,{"email" : email})
            if (res.data.statusCode === 200){
                setId(res.data.data)
                const resp = await axios.post(`${Server}/users/sendemail`,{
                    "email" : email, 
                    "subject":"Password Reset Code for OlxIITBBS", 
                    "message": `Your One time Verification Code is ${actualCode}. Enter the Code in the website to create New Password.`
                })
             
                if (resp.data.statusCode === 200){
                    alert("Verification code sent Successfully!")
                    setSteps(prev => ({...prev,1:false,2:true}))
                }
            }
        } catch (error) {
            console.log(error);
            alert("User with this email doesn't exist")
        }
    }

    const handleCodeSubmit = async() => {
        if (Number.parseInt(code) !== actualCode){
            return alert("Wrong Verification Code")
        }
        setSteps(prev => ({...prev, 2 : false, 3: true}))
        alert("Verification Successful")
    }

    const handlePasswordChange = async (e)=>{
        e.preventDefault();
        try {
            if (newPassword.P1 !== newPassword.P2){
                return alert("Both passwords should match")
            }
            const res = await axios.post(`${Server}/users/change-password-bycode`,{
                "id" : id,
                "newPassword" : newPassword.P1
            })
            if (res.data.statusCode === 200){
                alert("Password Changed Successfully! Login again to continue")
                Navigate("/login")
            }
            
        } catch (error) {
            console.log(error);
        }

    }

  return (
    <div className='mx-20'>
        {steps[1] && <div>
            <h1>Forgot Password </h1>
            <input type="email" placeholder='Enter Email' value={email} onChange={e=> setEmail(e.target.value)}/><br />
            <button className='bg-blue-600 p-2 rounded-xl' onClick={handleClick}> Get Code on Email</button>
            </div>
        }
        {steps[2] && <div>
                <h1> Enter the Verification Code</h1>
                <input type="text" value={code} onChange={e => setCode(e.target.value)}/>
                <button onClick={handleCodeSubmit} className='bg-blue-600 p-2 rounded-lg'>Submit</button>
            </div>
        }
        {steps[3] && <div className='mx-10'>
                <h1 >Enter New Password</h1>
                <label htmlFor="">New Password</label>
                <input type="text" value={newPassword.P1} onChange={e => setNewPassword(prev => ({...prev, P1 : e.target.value}))} /> <br />
                <label htmlFor="">Confirm New Password</label>
                <input type="text" value={newPassword.P2} onChange={e=> setNewPassword(prev => ({...prev, P2 : e.target.value}))} /> <br />
                <button onClick={handlePasswordChange} className='bg-blue-600 p-2 rounded-lg'>Submit</button>

            </div>
        }
        

    </div>
  )
}

export default ForgotPassword
