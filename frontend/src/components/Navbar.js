import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TbSunHigh, TbMoonFilled } from "react-icons/tb";
import { FaUserCircle, FaArrowUp } from "react-icons/fa";
import { FaUserLarge } from "react-icons/fa6";
import { BsList } from "react-icons/bs";
import { VscListSelection } from "react-icons/vsc";
import { IoSearchSharp } from "react-icons/io5";
import { useTheme } from "../store/contexts/ThemeContextProvider";
import { useLogin } from "../store/contexts/LoginContextProvider";
import { useAlert } from "../store/contexts/AlertContextProvider"
import { IoMdExit } from "react-icons/io";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md";
import { useLoading } from "../store/contexts/LoadingContextProvider";
import { useSearch } from "../store/contexts/SearchContextProvider"
import BtnLoader from "./loaders/BtnLoader";
import { Server } from "../Constants";
import logo from "../assets/images/logos/logo.png"
import axios from "axios";

function Navbar() {
    const [nav, setNav] = useState("hidden");
    const [drop, setDrop] = useState(false);
    const [search, setSearch] = useState("")

    const searchCtx = useSearch()
    const themeCtx = useTheme();
    const loginCtx = useLogin();
    const loadingCtx = useLoading();
    const alertCtx = useAlert()
    const Navigate = useNavigate()
    const location = useLocation()

    useEffect(()=>{
        setDrop(false)
        setNav("hidden")
    },[loginCtx])

    const handleLogout = async (e) => {
        e.preventDefault();
        const confirm = window.confirm("Are You Sure, you want to Logout?")
        if (!confirm) {setDrop(false);return;}
        loadingCtx.setLoading(true);
        setTimeout(async() => {
            // setDrop(false)
            await axios.post(`${Server}/users/logout`,{},{withCredentials:true})
            loginCtx.logout();
            Navigate("/")
            alertCtx.setToast("success", "User Logged Out Successfully")
            loadingCtx.setLoading(false);
        },800)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        Navigate("/")
        // console.log("hello",search);
        searchCtx.setSearch(search)
    }

    return (
        <>
            <nav className="bg-white border-gray-200 dark:bg-[#111112] dark:border-gray-400 lg:dark:border-b w-full lg:sticky top-0 lg:border-b shadow-md z-20">
                {<div  className="flex justify-center items-center fixed bottom-4 right-3 rounded-full  bg-red-500 text-white shadow-md text-md lg:text-xl p-3 " onClick={() => window.scrollTo(0,0)}>  <button > <FaArrowUp /> </button></div>}
                
                <div className="mx-2 lg:mx-[3vw] flex flex-wrap items-center justify-between pt-3 px-2 lg:py-3 z-20">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            {/* <button
                            title="Toggle Theme"
                                onClick={() => {
                                    themeCtx.toggleTheme();
                                
                                }}
                                className="text-2xl font-bold block py-2 px-1 md:border-0 md:p-0 dark:text-white"
                            >
                                {themeCtx.theme === "light" ? (
                                    <TbSunHigh />
                                ) : (
                                    <TbMoonFilled />
                                )}
                            </button> */}
                        <button 
                            onClick={()=>{window.scrollTo(0,0);Navigate("/");searchCtx.clearSearch()}}
                            className="flex self-center items-center gap-2 text-2xl xl:text-3xl font-bold dark:text-white font-[Montserrat]"
                        >
                           <img src={logo} alt="" className="h-6"/> OlxIITBBS
                        </button>
                    </div>

                    <form onSubmit={handleSearch}  className="hidden lg:flex w-6/12 xl:w-7/12 items-center justify-start  bg-white dark:bg-[#111112] text-black dark:text-white">
                        <input
                            value={search}
                            onChange={(e)=>setSearch(e.target.value)}
                            placeholder="Search for Products"
                            className="shadow-md px-4 md:px-6 bg-gray-100 dark:bg-[#252525] dark:placeholder:text-gray-400 dark:text-gray-100 text-black w-5/6 xl:w-11/12  rounded-l-full h-10  focus:outline-none focus:border focus:border-gray-500 dark:focus:border-gray-300"
                        />
                        <button type="submit" className="shadow-md  flex justify-center items-center w-1/6 xl:w-1/12  bg-red-500 hover:bg-red-600 h-10 text-2xl text-white rounded-r-full">
                            {" "}
                            <IoSearchSharp />{" "}
                        </button>
                    </form>

                    <div className="flex ">
                    <button
                        title="Toggle Theme"
                            onClick={() => {
                                themeCtx.toggleTheme();
                               
                            }}
                            className="text-2xl flex font-extrabold justify-center items-center gap-2 px-1 md:border-0 md:p-0 dark:text-white"
                        >   <span className="hidden 2xl:block text-[1rem] font-semibold font-[Montserrat]"> {themeCtx.theme === "light" ? (
                            "Light" 
                        ) : (
                            "Dark"
                        ) } </span>
                            {themeCtx.theme === "light" ? (
                                <TbSunHigh /> 
                            ) : (
                                <TbMoonFilled />
                            ) } 
                        </button>
                        <div
                            onClick={() => {
                                nav === "hidden" ? setNav("") : setNav("hidden");
                                nav === "hidden" ? setDrop(true) : setDrop(false)
                            }}
                            className="inline-flex items-center p-2 w-14 h-10 justify-center text-sm text-gray-600 dark:text-white rounded-xl lg:hidden transition duration-300 ease-in-out"
                        >
                            {nav === "hidden" ? (
                                <div className="transition duration-300 ease-in-out text-4xl font-bold">
                                    <BsList />
                                </div>
                            ) : (
                                <div className="transition duration-300 ease-in-out text-4xl font-bold">
                                    <VscListSelection />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={`w-full ${nav} lg:flex lg:w-auto`}>
                        <ul className="flex gap-1 items-center flex-col font-medium px-4 lg:p-0 my-1 rounded-2xl bg-gray-100 md:space-x-8 rtl:space-x-reverse lg:flex-row dark:bg-[#191919] lg:dark:bg-transparent lg:bg-transparent">
                            <div>
                                {loginCtx.isLoggedIn ? (
                                    <div>
                                        <button  onClick={() => {
                                    setDrop(!drop);
                                }} className="hidden lg:flex gap-2 justify-center items-center text-xl text-black dark:text-white">
                                            {loginCtx.profilePicture ? (
                                                <img
                                                    className="w-8 h-8 rounded-full object-cover object-center"
                                                    src={`${loginCtx.profilePicture}`}
                                                    alt="avatar"
                                                />
                                            ) : (
                                                <FaUserCircle />
                                            )}
                                            {loginCtx.fullName.split(" ")[0]
                                                .length > 10
                                                ? String(loginCtx.fullName.split(" ")).substring(0,10) + ".."
                                                : loginCtx.fullName.split(" ")[0]}
                                            {drop ? (
                                                <MdOutlineKeyboardArrowUp />
                                            ) : (
                                                <MdOutlineKeyboardArrowDown />
                                            )}
                                        </button>
                                </div>
                                    
                                ) : (
                                    <button
                                        onClick={()=>{setDrop(false);setNav("hidden");Navigate("/login")}}
                                        className="flex my-3 lg:my-0 gap-2 justify-center font-medium items-center text-xl text-gray-700  dark:text-white"
                                    >
                                        {" "}
                                        <FaUserLarge />
                                        Login{" "}
                                    </button>
                                )}
                            </div>
                            { (drop && loginCtx.isLoggedIn) && (
                                <div
                                    id="dropdownDivider"
                                    className="lg:z-20 w-full text-center lg:absolute lg:rounded-md lg:right-6 2xl:right-10 lg:top-14 lg:border bg-gray-100 dark:bg-[#191919] lg:bg-tansparent divide-gray-100 lg:shadow-xl lg:rouded-lg lg:w-40 md:w-1/2 lg:dark:border-gray-600 lg:dark:border"
                                >
                                    <ul
                                        className=" items-center text-lg lg:text-sm text-gray-700 dark:text-white"
                                    >
                                         <li>
                                            <button
                                                onClick ={()=>{setDrop(false);setNav("hidden");Navigate("/myprofile")}}
                                                className="text-center w-full flex justify-center font-medium hover:font-semibold gap-2 items-center px-4 pb-1 pt-2 lg:rounded-t-md hover:bg-gray-300 dark:hover:bg-[#282828] dark:hover:text-white"
                                            >
                                                {loginCtx.profilePicture ? (
                                                <img
                                                    className="lg:hidden w-6 h-6 rounded-full object-cover object-center"
                                                    src={`${loginCtx.profilePicture}`}
                                                    alt="avatar"
                                                />
                                            ) : (
                                                <FaUserCircle />
                                            )} My Profile
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                onClick ={()=>{setDrop(false);setNav("hidden");Navigate("/")}}
                                                className="text-center w-full flex justify-center gap-2 items-center px-4 py-1 font-medium hover:font-semibold hover:bg-gray-300 dark:hover:bg-[#282828] dark:hover:text-white"
                                            >
                                                HomePage 
                                            </button>
                                        </li>
                                        <li>
                                        <button
                                                onClick ={()=>{setDrop(false);setNav("hidden");Navigate("/wishlist")}}
                                                className="text-center w-full flex justify-center gap-2 items-center px-4 py-1 font-medium hover:font-semibold hover:bg-gray-300 dark:hover:bg-[#282828] dark:hover:text-white"
                                            >
                                                 WishList
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                onClick ={()=>{setDrop(false);setNav("hidden");Navigate("/addproduct")}}
                                                className="text-center w-full flex justify-center gap-2 items-center px-4 py-1 font-medium hover:font-semibold hover:bg-gray-300 dark:hover:bg-[#282828] dark:hover:text-white"
                                            >
                                                Sell Product
                                            </button>
                                        </li>
                                        <li>
                                        <button
                                                onClick ={()=>{setDrop(false);setNav("hidden");Navigate("/chats")}}
                                                className="text-center w-full flex justify-center gap-2 items-center px-4 py-1 lg:pb-2 font-medium hover:font-semibold hover:bg-gray-300 dark:hover:bg-[#282828] dark:hover:text-white"
                                            >
                                                My Chats
                                            </button>
                                        </li>
                                    </ul>

                                     <div className="lg:bg-red-600 lg:hover:bg-red-700 lg:rounded-b-md pb-2 lg:pb-0 border-t-1">
                                        <button
                                            className="w-4/5 lg:w-full text-center px-4 lg:text-sm font-bold font-[Montserrat] text-red-500 lg:text-white lg:dark:text-gray-200"
                                            onClick={handleLogout}
                                        >
                                            {loadingCtx.loading ? (
                                                <BtnLoader />
                                            ) : <div className="flex gap-2 w-full items-center py-1 justify-center font-semibold text-xl lg:text-[1rem]">
                                                Logout <IoMdExit/> 
                                                </div>
                                            }
                                        </button>
                                    </div>
                                    
                                </div>
                            ) }
                        </ul>
                    </div>
                </div>
            </nav>

            <form onSubmit={handleSearch} className="flex lg:hidden  items-center justify-start w-full sticky top-0 py-2 px-4 bg-white dark:bg-[#111112] z-10">
                <input
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                    placeholder="Search for Products"
                    className=" shadow-md px-4 md:px-6 bg-gray-100 dark:bg-[#252525] w-5/6 md:w-11/12 rounded-l-full h-10 xs:h-11  dark:text-white focus:outline-none focus:border focus:border-gray-700 dark:focus:border-white"
                />
                <button type="submit" className="shadow-md flex justify-center items-center w-1/6 md:w-1/12 bg-red-500 hover:bg-red-600 h-10 xs:h-11 text-2xl text-white rounded-r-full">
                    {" "}
                    <IoSearchSharp />{" "}
                </button>
            </form>
        </>
    );
}

export default Navbar;
