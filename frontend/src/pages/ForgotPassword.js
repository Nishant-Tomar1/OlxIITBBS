import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Server } from '../Constants'
import { useNavigate } from 'react-router-dom'
import { useAlert } from '../store/contexts/AlertContextProvider'
import BtnLoader from "../components/loaders/BtnLoader"
import { useLoading } from '../store/contexts/LoadingContextProvider'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

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
    const [showpassword, setShowPassword] = useState(false)
    const [showpassword2, setShowPassword2] = useState(false)
    const [newPassword, setNewPassword] = useState({P1:"", P2 : ""})

    const Navigate = useNavigate()
    const alertCtx = useAlert()
    const loadingCtx = useLoading()

    useEffect(() => {
        setActualCode(Math.floor((Math.random()*899990)) + 100000) ;
        // setActualCode(123456)
    },[])
    
    const handleClick = async (e)=>{
        e.preventDefault()
        if(!email){
            return alertCtx.setToast("warning","Please enter your email !")
        }
        loadingCtx.setLoading(true);
        try {
            const res = await axios.post(`${Server}/users/verifyemail`,{"email" : email.toLowerCase()})
            
            if (res.data.statusCode === 200){
                setId(res.data.data)
                const resp = await axios.post(`${Server}/users/sendemail`,{
                    "email" : email.toLowerCase() , 
                    "subject":"Password Reset Code for OlxIITBBS", 
                    "message": `${actualCode} is your password reset Code. Enter the Code in the website to create New Password.`
                })
                
                if (resp.data.statusCode === 200){
                    loadingCtx.setLoading(false);
                    alertCtx.setToast("success","Verification code sent Successfully!")
                    setSteps(prev => ({...prev,1:false,2:true}))        
                }
            }
        } catch (error) {
            loadingCtx.setLoading(false)
            console.log(error);           
            alertCtx.setToast("error","User with this email doesn't exist")
        }
    }

    const handleCodeSubmit = async(e) => {
        e.preventDefault()
        if(!code){
            return alertCtx.setToast("warning","Enter Verification code  !")
        }
        if (Number.parseInt(code) !== actualCode){
            return alertCtx.setToast("error","Wrong Verification Code")
        }
        loadingCtx.setLoading(true)
        setTimeout(() => {
            alertCtx.setToast("success","Verification Successful")
            setSteps(prev => ({...prev, 2 : false, 3: true}))
            loadingCtx.setLoading(false)
        }, 800); 
    }

    const handlePasswordChange = async (e)=>{
        e.preventDefault();
        try {
            if (newPassword.P1 !== newPassword.P2){
                return alertCtx.setToast("warning","Both passwords should match")
            }
            if (newPassword.P1.length < 6){
                return alertCtx.setToast("warning", "Password must be at least 6 characters long!");
            }
            const res = await axios.post(`${Server}/users/change-password-bycode`,{
                "id" : id,
                "newPassword" : newPassword.P1
            })
            if (res.data.statusCode === 200){
                loadingCtx.setLoading(true)
                setTimeout(() => {
                    alertCtx.setToast("success","Password Changed Successfully! \n Login again to continue")
                    loadingCtx.setLoading(false)
                    Navigate("/login")
                }, 800); 
            }
            
        } catch (error) {
            console.log(error);
            alertCtx.setToast("Error","Something wrong happened! Please try again")
            Navigate("/forgotpassword")
        }

    }

  return (
    <div  className="flex flex-col w-full items-center bg-gray-100 dark:bg-[#191919] dark:text-white py-36">
        {steps[1] && <div className='flex flex-col w-full items-center justify-center '>
            <h1 className='text-xl lg:text-2xl font-bold mb-5'>Forgot Password ?</h1>
            <form className=" mx-auto w-5/6 md:w-1/2 lg:w-1/3" action="" onSubmit={handleClick}>
            <input type="email" className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full ps-4 p-2.5 dark:bg-[#232323] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white-500 dark:focus:border-white-500 " placeholder='Enter Your Email' value={email} onChange={e=> setEmail(e.target.value)}/><br />
            <button type="submit" className="w-full shadow-lg text-white bg-cyan-500 hover:bg-cyan-600  font-medium rounded-lg text-md px-5 py-2.5 text-center dark:bg-teal-500 dark:hover:bg-teal-600 ">{ loadingCtx.loading ? <BtnLoader /> : "Get Code on Email" }
            </button>
            <p  className="w-full text-center mt-3 text-sm  opacity-40"> Warning! Do not refresh the page</p>
            </form>
            </div>
        }
        {steps[2] && <div className='flex flex-col w-full items-center justify-center '>
                <h1 className='text-xl lg:text-2xl font-semibold mb-5 text-gray-700 dark:text-white'>Enter Verification Code </h1>
                <form className=" mx-auto w-5/6 md:w-1/2 lg:w-1/3" action="" onSubmit={handleCodeSubmit}>
                <input className="shadow-md mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 ps-4 dark:bg-[#232323] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white-500 dark:focus:border-white-500 " type="text" value={code} onChange={e => setCode(e.target.value)} placeholder='Verification code'/>
                <button type="submit" className="w-full shadow-lg text-white bg-cyan-500 hover:bg-cyan-600  font-medium rounded-lg text-md px-5 py-2.5 text-center dark:bg-teal-500 dark:hover:bg-teal-600 ">
                { loadingCtx.loading ? <BtnLoader /> : "Verify" } 
                </button>
                <p  className="w-full text-center mt-3 text-sm  opacity-40"> Warning! Do not refresh the page</p>
                </form>
            </div>
        }
        {steps[3] && <div className='flex flex-col w-full items-center justify-center '>
                <h1 className='text-xl lg:text-2xl font-semibold mb-5 text-gray-700 dark:text-white'>Enter New Password</h1>
                <form action="" className=" mx-auto w-5/6 md:w-1/2 lg:w-1/3" onSubmit={handlePasswordChange}>
                <div className="mb-4">
                    <label name="password" className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-200">New Password</label>
                    <div className="flex rounded-lg ">
                        <input type={showpassword ? "text" : "password"} autoComplete="off" name="password" className="w-10/12 shadow-md bg-gray-50 border border-gray-300 border-r-0 text-gray-900 text-md rounded-l-lg focus:ring-0 focus:border-gray-400 block ps-4 p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white  "  placeholder="New Password" value={newPassword.P1} onChange={e => setNewPassword(prev => ({...prev, P1 : e.target.value}))}/>
                        <div onClick={()=>{setShowPassword(!showpassword)}} target="none" className="flex w-1/6 text-xl items-center justify-center bg-gray-50      border border-gray-300 rounded-r-lg shadow-md  border-l-0 shadow-l-0 text-gray-800 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ">{showpassword ?<FaEye/> : <FaEyeSlash/>  }
                        </div>
                    </div>
                </div>
                <div className="mb-6">
                    <label name="password" className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-200">Confirm New Password</label>
                    <div className="flex rounded-lg ">
                        <input type={showpassword2 ? "text" : "password"} autoComplete="off" name="password" className="w-10/12 shadow-md bg-gray-50 border border-gray-300 border-r-0 text-gray-900 text-md rounded-l-lg focus:ring-0 focus:border-gray-400 block ps-4 p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white  "  placeholder="Confirm New Password" value={newPassword.P2} onChange={e => setNewPassword(prev => ({...prev, P2 : e.target.value}))}/>
                        <div onClick={()=>{setShowPassword2(!showpassword2)}} target="none" className="flex w-1/6 text-xl items-center justify-center bg-gray-50      border border-gray-300 rounded-r-lg shadow-md  border-l-0 shadow-l-0 text-gray-800 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ">{showpassword2 ?<FaEye/> : <FaEyeSlash/>  }
                        </div>
                    </div>
                </div>
                <button type='submit' className="w-full shadow-lg text-white bg-cyan-500 hover:bg-cyan-600  font-medium rounded-lg text-md px-5 py-2.5 text-center dark:bg-teal-500 dark:hover:bg-teal-600 ">{ loadingCtx.loading ? <BtnLoader /> : "Submit" } </button>
                <p  className="w-full text-center mt-3 text-sm  opacity-40"> Warning! Do not refresh the page</p>
                </form>

            </div>
        }
    </div>
  )
}

export default ForgotPassword
