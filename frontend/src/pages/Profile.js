import React, { useEffect, useState } from 'react'
import { Server } from '../Constants'
import axios from 'axios'
// import { AiFillEdit } from "react-icons/ai";
import BtnLoader from '../components/loaders/BtnLoader'
import { useCookies } from 'react-cookie'
import { useNavigate, Link } from 'react-router-dom'
import { useAlert } from '../store/contexts/AlertContextProvider'
import { useLoading } from '../store/contexts/LoadingContextProvider'
import {useLogin } from "../store/contexts/LoginContextProvider"
import {  MdDelete } from "react-icons/md";
import { PiEmptyBold } from "react-icons/pi";
// import { MdOutlineSell, MdSell } from "react-icons/md";


function Profile() {
    const [productList, setProductList] = useState([])
    const [isProductListEmpty, setProductListEmpty] = useState(false)
    const [updateProfilePic, setUpdateProfilePic] = useState(false)
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        contactNumber: '',
        profilePicture: '',
        joined : '',
    });
    const dummy = [1,2,3,4]
    
    const Navigate = useNavigate()
    const [cookies] = useCookies(["accessToken", "refreshToken"])
    const alertCtx  = useAlert()
    const loadingCtx = useLoading()
    const loginCtx = useLogin()

    async function fetchData(){
        try {
            const res = (await axios.get(`${Server}/users/get-current-user`,{withCredentials : true})).data.data
            // console.log(res);
            if (res.productsAdded.length === 0) setProductListEmpty(true)
            else setProductList(res.productsAdded)
            setUser( prev => ({
                ...prev,
                username : res.username,
                firstName : res.fullName.split(" ")[0],
                lastName : res.fullName.split(" ")[1] || "",
                email : res.email,
                contactNumber: res.contactNumber,
                profilePicture : res.profilePicture,
                joined : new Date(res.createdAt).toLocaleDateString("en-IN",{month:"long",day:"numeric",year:"numeric"})
        }))
        } catch (error) {
            console.log(error);
        }
    }  
    
    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        // console.log(user);
        const arr = ["email", "firstName", "contactNumber"];
        for (let i = 0; i < 3; i++) {
            let item = arr[i];
            // console.log(user[item]);
            if (user[item] === "") {
                alertCtx.setToast("warning", `${item} cannot be empty`);
                return;
            }
        }
        try {
            loadingCtx.setLoading(true);
            const res = await axios.patch(
                `${Server}/users/update-user-account-details`,
                {
                    fullName: user.firstName + " " + user.lastName,
                    email: user.email.toLowerCase(),
                    contactNumber: user.contactNumber,
                },
                { withCredentials: true }
            );
            // console.log(res);
            if (res.data.statusCode === 200) {
                // console.log(res.data.data);
                loadingCtx.setLoading(false);
                loginCtx.login(
                    cookies.accessToken,
                    cookies.refreshToken,
                    res.data.data._id,
                    res.data.data.fullName,
                    res.data.data.profilePicture
                );
                alertCtx.setToast("success", "Profile Updated Successfully");
            }
        } catch (error) {
            console.log(error);
            if (error.response.status === 409) {
                alertCtx.setToast(
                    "error",
                    "User with this email already  exists"
                );
            } else alertCtx.setToast("error", "Something went wrong!!");
            loadingCtx.setLoading(false);
        }
    };

    const handleUpdateUserProfilePic = async (e) => {
        e.preventDefault();
        try {
            const fileInput = document.getElementById("profilePicture");
            const file = fileInput.files[0];
            if (!file) return alertCtx.setToast("warning", "No file Chosen! Choose an image");
            // console.log(file);
            loadingCtx.setLoading(true);
            const formData = new FormData();
            formData.append("profilePicture", file);
            const res = await axios.patch(
                `${Server}/users/update-user-profile-picture`,
                formData,
                { withCredentials: true },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            // console.log(res);
            if (res.data.statusCode === 200) {
                loadingCtx.setLoading(false);
                loginCtx.login(
                    cookies.accessToken,
                    cookies.refreshToken,
                    res.data.data._id,
                    res.data.data.fullName,
                    res.data.data.profilePicture
                );
                setUpdateProfilePic(false);
                alertCtx.setToast(
                    "success",
                    "Profile Picture Updated Successfully"
                );
            }
        } catch (error) {
            console.log(error);
            loadingCtx.setLoading(false);
            alertCtx.setToast("error", "Something went wrong!!");
        }
    };

    const handleUpdateActiveStatus = async (id) => {
        const confirm = window.confirm(
            "Are you Sure? The product will be marked as sold and won't be visible to others from now."
        );
        if (!confirm) return;
        try {
            const res = await axios.patch(
                `${Server}/products/sellproduct/${String(id)}`,
                {},
                { withCredentials: true }
            );
            if (res.data.statusCode === 200) {
                setProductList((prev) =>
                    prev.map((product) =>
                        product._id === id
                            ? { ...product, status: "sold" }
                            : product
                    )
                );
                alertCtx.setToast(
                    "success",
                    "Product status updated successfully"
                );
            }
        } catch (error) {
            console.log(error);
            alertCtx.setToast("error", "Server is not responding!");
        }
    };

    const handleProductDeletion = async (id) => {
        const confirm = window.confirm(
            "Do You really want to delete the product? All the product data will be removed"
        );
        if (!confirm) return;
        try {
            // alert(`${id}`)
            const res = await axios.delete(
                `${Server}/products/deleteproduct/${String(id)}`,
                { withCredentials: true }
            );
            // console.log(res);
            if (res.data.statusCode === 204) {
                setProductList((prev) =>
                    prev.filter((product) => product._id !== id)
                );
                alertCtx.setToast("success", "Product Deleted Successfully");
            }
            // console.log(productList.filter(product => product._id!==id));
        } catch (error) {
            alertCtx.setToast("error", "Product could not be deleted!!");
            console.log(error);
        }
    };

    useEffect(() => {
        if (!cookies.accessToken) {
            // alertCtx.setToast("warning","Login to access profile")
            Navigate("/login");
        }
        // alert("hiii")
        fetchData();
        window.scrollTo(0, 0);
    }, [cookies.accessToken, Navigate, alertCtx]);

    return (
        <div className="flex w-full flex-col ">
            <div>
                <div className="bg-gray-100 dark:bg-[#191919] shadow-md flex flex-col w-full lg:flex-row justify-center lg:pt-3">
                    <div className="flex flex-col items-center justify-center p-4 lg:pr-4 lg:w-1/3 py-3 lg:items-center ps-[10%]">
                        {user.profilePicture && <img src={user.profilePicture} alt="Profile" className="text-center w-52 h-52 sm:w-64 sm:h-64 xl:w-72 xl:h-72 rounded-full my-4 object-cover object-center"/> }
                        {!user.profilePicture && <div className="flex text-center w-52 h-52 sm:w-64 sm:h-64 xl:w-72 xl:h-72 rounded-full my-4 justify-center items-center text-gray-700 dark:text-gray-200">Loading..</div> }
                        {!updateProfilePic && <div onClick={()=>{setUpdateProfilePic(true)}} className='cursor-pointer flex text-md lg:text-xl font-medium items-center text-gray-800 dark:text-white '><span className='text-2xl'></span>Update Profile Picture</div>}
                        {updateProfilePic && <form onSubmit={handleUpdateUserProfilePic} className="mt-3">        
                            <input className="shadow-md block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="profilePicture" type="file" accept="image/*" />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG or JPEG.</p>
                            <button type="submit" className="w-full shadow-lg mt-2 text-white bg-cyan-500 hover:bg-cyan-600  font-medium rounded-lg text-md px-5 py-2.5 text-center dark:bg-teal-500 dark:hover:bg-teal-600 ">{ loadingCtx.loading ? <BtnLoader /> : "Update" }</button>
                        </form>}
                    </div>

                    <div  className="flex flex-col lg:w-2/3 pt-5 pb-12 items-center justify-center dark:bg-[#191919] dark:text-white">
                        <h1 className="text-2xl lg:text-4xl font-bold font-[Raleway] pb-2">My Profile</h1>
                        <form className=" mx-auto w-11/12 md:w-5/6 lg:w-2/3" onSubmit={handleProfileUpdate}>
                            <div className="mb-3">
                                <label name="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Username</label>
                                <input type="text" readOnly name="username" className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-0 focus:border-gray-300 block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white-500 dark:focus:border-white-500 cursor-not-allowed" placeholder="Enter Username" value={user.username} onChange={handleUserChange} />
                            </div>
                            <div className="mb-3">
                                <label name="email"  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Email</label>
                                <input type="email" name="email" autoComplete='off' placeholder="Enter your email" className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500 " value={user.email} onChange={handleUserChange} />
                            </div>
                            <div className='grid grid-cols-12 gap-2'>
                                <div className="mb-3 col-span-6">
                                    <label name="firstName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">First Name</label>
                                    <input type="text" name="firstName" autoComplete='off' className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white-500 dark:focus:border-white-500 " placeholder="Enter Firstname" value={user.firstName} onChange={handleUserChange} />
                                </div>
                                <div className="mb-3 col-span-6">
                                    <label name="lastName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Last Name</label>
                                    <input type="text" name="lastName" autoComplete='off' className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white-500 dark:focus:border-white-500 " placeholder="Enter Lastname" value={user.lastName} onChange={handleUserChange} />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label name="contactNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Contact Number</label>
                                <input type="tel" pattern="[6-9]{1}[0-9]{9}" name="contactNumber" className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white-500 dark:focus:border-white-500 " placeholder="Enter Contact Number" value={user.contactNumber} onChange={handleUserChange} />
                            </div>
                            <div className="mb-3">
                                <label
                                    name="Joined"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"
                                >
                                    Joined
                                </label>
                                <input
                                    name="Joined"
                                    className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white cursor-not-allowed"
                                    placeholder="Enter Contact Number"
                                    value={user.joined}
                                    readOnly
                                />
                            </div>
                            <div className="flex items-between justify-between mb-5">
                                <Link to="/updatepassword" className=" text-sm text-cyan-500  dark:text-teal-300">Update password </Link>
                            </div>
                            <button type="submit" className="w-full shadow-lg mt-2 text-white bg-cyan-500 hover:bg-cyan-600  font-medium rounded-lg text-md px-5 py-2.5 text-center dark:bg-teal-500 dark:hover:bg-teal-600 ">{ loadingCtx.loading ? <BtnLoader /> : "Update Profile" }</button>
                        </form>
                    </div>
                </div>
                <div className="flex flex-col w-full items-center bg-gray-100 dark:bg-[#191919] dark:text-white pb-4">
                <div className="container ">
                {!isProductListEmpty && <div className="w-full text-center font-bold font-[Raleway] text-2xl lg:text-3xl pt-5">Products Owned</div>}
                        <div className="flex flex-wrap my-2 justify-center items-center  w-full ">
                        { !isProductListEmpty ? ((productList.length > 0) ?
                            ( productList.map((product)=>(
                                <div  key={product._id} className="p-2 my-1 md:my-0 w-11/12 md:w-1/2 xl:w-1/4 h-full">
                                    <div className="min-w-full bg-gray-100 dark:bg-[#252525] rounded-xl overflow-hidden shadow-lg p-3 lg:p-2">
                                        <img onClick={() => {Navigate(`/products/${product._id}`)}} className="cursor-pointer max-h-72  w-full lg:h-56 object-cover object-center rounded-lg" src={`${product.thumbNail}`} alt="" />
                                        
                                        <div className="py-2 lg:px-2 flex flex-col justify-between h-1/2 w-full">
                                            <div className="flex flex-col">
                                                <h2 className=" text-xs font-[Outfit] text-gray-400">{product.category}</h2>
                                                <div className="flex justify-between ">
                                                    <h1 className="title-font text-lg lg:text-lg font-bold  font-[Montserrat] text-gray-700 dark:text-gray-100 mb-1">{product.title}</h1>
                                                    <h1 className={`title-font
                                                    text-lg lg:text-lg font-bold ${product.status === "active" ? "text-green-500" : "text-gray-400 dark:text-red-900"} mb-1`}>₹ {product.price}</h1>
                                                </div>
                                                <p className="mb-3 lg:text-sm font-normal h-14 overflow-y-auto">{product.description.length > 65 ? (product.description.substr(0,65)+"...") : (product.description) } </p>
                                            </div>
                                            <div className="flex items-center justify-between ">
                                                <Link to={`/products/${product._id}`} className="text-teal-400 font-medium inline-flex items-center md:mb-2 lg:mb-0 " >Show More
                                                    <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M5 12h14"></path>
                                                    <path d="M12 5l7 7-7 7"></path>
                                                    </svg>
                                                </Link>
                                                <div className='flex gap-2'>
                                                    <button title={product.status === "active" ? 'Add product to sold' : 'Product is Sold'} onClick={() =>{ (product.status === "active" ? handleUpdateActiveStatus(product._id) : alertCtx.setToast("error","Product is already Sold!"))}} className={`text-md ${product.status === "active" ? "text-green-500" : "text-gray-400 dark:text-red-900"} font-bold`}>{product.status === "active" ? "Set Sold" : "Sold"}</button>
                                                    <button title='delete product' onClick={()=>{handleProductDeletion(product._id)}} className='text-2xl text-red-500'><MdDelete/> </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )))
                                :
                            ( dummy.map(item => 
                            <div key={item} role="status" className="p-2 md:w-1/2 lg:w-1/4 h-full w-5/6 animate-pulse">
                                <div className="flex items-center justify-center h-64 md:h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                                    <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z"/>
                                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
                                    </svg>
                                </div>
                                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                                <div className="flex items-center mt-4">
                                    <div>
                                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                                        <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                                    </div>
                                </div>
                            </div>)))
                            : (<div className="flex flex-col lg:flex-row justify-center items-center w-full p-10 text-2xl lg:text-5xl gap-2"><span className="text-5xl"> <PiEmptyBold/></span>No Products added yet </div>)}
                    </div>
                </div>
                </div>
            </div>
        </div>
      );
}

export default Profile
