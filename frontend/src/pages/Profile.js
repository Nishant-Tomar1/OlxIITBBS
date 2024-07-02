import React, { useEffect, useState } from 'react'
import { Server } from '../Constants'
import axios from 'axios'
import { AiFillEdit } from "react-icons/ai";
import BtnLoader from '../components/loaders/BtnLoader'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import { useAlert } from '../store/contexts/AlertContextProvider'
import { useLoading } from '../store/contexts/LoadingContextProvider'
import {useLogin } from "../store/contexts/LoginContextProvider"


function Profile() {
    const [updateProfilePic, setUpdateProfilePic] = useState(false)
    const Navigate = useNavigate()
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        contactNumber: '',
        profilePicture: '',
      });
    
    const [cookies] = useCookies(["accessToken", "refreshToken"])
    const alertCtx  = useAlert()
    const loadingCtx = useLoading()
    const loginCtx = useLogin()

    async function fetchData(){
        try {
            const res = (await axios.get(`${Server}/users/get-current-user`,{withCredentials : true})).data.data
            // console.log(res);
            setUser( prev => ({
                ...prev,
                username : res.username,
                firstName : res.fullName.split(" ")[0],
                lastName : res.fullName.split(" ")[1],
                email : res.email,
                contactNumber: res.contactNumber,
                profilePicture : res.profilePicture
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
    },[cookies.accessToken, alertCtx, Navigate])

    
    const handleUserChange = (e) => {
            const { name, value } = e.target;
            setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleProfileUpdate = async(e) =>{
            e.preventDefault();
            // console.log(user);
            const arr = ["email","firstName","contactNumber"]
            arr.map((item) => {
                // console.log(user[item]);
                if (user[item] === ""){
                    return alertCtx.setToast("warning",`${item} cannot be empty`)
                }
            })
            try {
                loadingCtx.setLoading(true)
                const res = await axios.patch(`${Server}/users/update-user-account-details`,{
                    fullName : user.firstName + " " + user.lastName,
                    email : user.email,
                    contactNumber : user.contactNumber
                }, {withCredentials : true})
                if (res.data.statusCode === 200){
                    // console.log(res.data.data);
                    loadingCtx.setLoading(false);
                    loginCtx.login(cookies.accessToken, cookies.refreshToken, res.data.data._id, res.data.data.fullName, res.data.data.profilePicture)
                    alertCtx.setToast("success", "Profile Updated Successfully")
                }
            } catch (error) {
                console.log(error);
                alertCtx.setToast("error","Something went wrong!!")
                loadingCtx.setLoading(false)
            }
        }

    const handleUpdateUserProfilePic = async(e) => {
        e.preventDefault()
        try {
            loadingCtx.setLoading(true)
            const fileInput = document.getElementById("profilePicture")
            const file = fileInput.files[0]
            // console.log(file);
            const formData  = new FormData();
            formData.append("profilePicture",file)
            const res = await axios.patch(`${Server}/users/update-user-profile-picture`,formData, {withCredentials : true},{headers: {
                'Content-Type': 'multipart/form-data'
        }})
            // console.log(res);
            if (res.data.statusCode === 200){
                loadingCtx.setLoading(false)
                loginCtx.login(cookies.accessToken, cookies.refreshToken, res.data.data._id, res.data.data.fullName, res.data.data.profilePicture)
                alertCtx.setToast("success","Profile Picture Updated Successfully")
                setUpdateProfilePic(false)
            }         
        } catch (error) {
            console.log(error);
            loadingCtx.setLoading(false)
            alertCtx.setToast("error","Something went wrong!!")
        }
    }
    
    return (
        
        <div className="flex w-full flex-col ">
            
            <div className="bg-gray-100 dark:bg-[#191919] shadow-md flex flex-col w-full md:flex-row lg:py-12">
                <div className="flex flex-col items-center justify-center p-4 md:pr-4 md:w-1/3 py-3 md:items-end">
                    <img src={user.profilePicture} alt="Profile Picture" className="text-center w-52 h-52 md:w-64 lg:h-64 rounded-full my-4 object-cover object-center " />
                    {!updateProfilePic && <div onClick={()=>{setUpdateProfilePic(true)}} className='cursor-pointer flex gap-2 text-md lg:text-xl font-medium items-center  text-gray-800 dark:text-white'><span className='text-2xl'><AiFillEdit/></span> Update Profile Picture</div>}
                    {updateProfilePic && <form onSubmit={handleUpdateUserProfilePic} className="mt-3">        
                        <input className="shadow-md block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="profilePicture" type="file" accept="image/*" />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG or JPEG.</p>
                        <button type="submit" className="w-full shadow-lg mt-2 text-white bg-cyan-500 hover:bg-cyan-600  font-medium rounded-lg text-md px-5 py-2.5 text-center dark:bg-teal-500 dark:hover:bg-teal-600 ">{ loadingCtx.loading ? <BtnLoader /> : "Submit" }</button>
                    </form>}
                </div>

                <div  className="flex flex-col md:w-2/3 pt-5 pb-12 items-center justify-center dark:bg-[#191919] dark:text-white">
                    <h1 className="text-2xl lg:text-4xl font-bold font-[Raleway] pb-2">User Profile</h1>
                    <form className=" mx-auto w-11/12 md:w-5/6 lg:w-2/3 " onSubmit={handleProfileUpdate}>
                        <div className="mb-3">
                            <label name="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Username</label>
                            <input type="text" readOnly name="username" className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white-500 dark:focus:border-white-500 cursor-not-allowed" placeholder="Enter Username" value={user.username} onChange={handleUserChange} />
                        </div>
                        <div className="mb-3">
                            <label name="email"  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Email</label>
                            <input type="email" name="email" placeholder="Enter your email" className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500 " value={user.email} onChange={handleUserChange} />
                        </div>
                        <div className='grid grid-cols-12 gap-2'>
                            <div className="mb-3 col-span-6">
                                <label name="firstName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">First Name</label>
                                <input type="text" name="firstName" className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white-500 dark:focus:border-white-500 " placeholder="Enter Firstname" value={user.firstName} onChange={handleUserChange} />
                            </div>
                            <div className="mb-3 col-span-6">
                                <label name="lastName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Last Name</label>
                                <input type="text" name="lastName" className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white-500 dark:focus:border-white-500 " placeholder="Enter Lastname" value={user.lastName} onChange={handleUserChange} />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label name="contactNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Contact Number</label>
                            <input type="tel" pattern="[6-9]{1}[0-9]{9}" name="contactNumber" className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white-500 dark:focus:border-white-500 " placeholder="Enter Contact Number" value={user.contactNumber} onChange={handleUserChange} />
                        </div>
                        <button type="submit" className="w-full shadow-lg mt-2 text-white bg-cyan-500 hover:bg-cyan-600  font-medium rounded-lg text-md px-5 py-2.5 text-center dark:bg-teal-500 dark:hover:bg-teal-600 ">{ loadingCtx.loading ? <BtnLoader /> : "Update Profile" }</button>
                    </form>
                </div>
            </div>


            {/* <div className="mt-6">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Products Added</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.products.map((product, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">{product.name}</h4>
                    <p className="text-gray-700 dark:text-gray-300">{product.description}</p>
                  </div>
                ))}
              </div>
            </div> */}

          </div>
    
      );
}

export default Profile
