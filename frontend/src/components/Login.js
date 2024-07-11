import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLogin } from "../store/contexts/LoginContextProvider";
import { useLoading } from "../store/contexts/LoadingContextProvider";
import { useNavigate, Link } from "react-router-dom";
import { Server } from "../Constants";
import { useAlert } from "../store/contexts/AlertContextProvider";
import BtnLoader from "../components/loaders/BtnLoader";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// import Icon from "../../public/icon.svg"

function Login() {
    const [user, SetUser] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [showpassword, setShowPassword]  = useState(false)
    const Navigate = useNavigate();
    const loginCtx = useLogin()
    const alertCtx = useAlert();
    const loadingCtx = useLoading();

    useEffect(()=>{
    },[Navigate])

    const handleUserChange = (e) => {
        const { name, value } = e.target;

        SetUser((user) => ({
            ...user,
            [name]: value,
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (user.username === "" && user.email === "") {
            return alertCtx.setToast(
                "warning",
                "Enter either username or email"
            );
        }
        if (user.password ==="") return alertCtx.setToast("warning", "Password is Required")

        try {
            loadingCtx.setLoading(true);
            const response = await axios.post(
                `${Server}/users/login`,
               {username : user.username.toLowerCase(), 
                email : user.email.toLowerCase(), 
                password : user.password}
            );
            const user2 = response.data.data.user;

            if (user2) {
                loginCtx.login(
                    response.data.data.accessToken,
                    response.data.data.refreshToken,
                    String(user2._id),
                    user2.fullName,
                    user2.profilePicture
                );
            }

            if (response.data.success) {
                loadingCtx.setLoading(false);
                alertCtx.setToast("success", `${response.data.message} `);
                Navigate("/" )
                window.scrollTo(0,0)
            }
        } catch (error) {
            loadingCtx.setLoading(false);
            alertCtx.setToast(
                "error",
                `Incorrect ${!user.username ? "Email" : "Username"} or Password`
            );
        }
    };

    
    return (
        <>
        
        <div  className="flex flex-col w-full items-center py-6 bg-gray-100 dark:bg-[#191919] dark:text-white min-h-[70vh]">
            <h1 className="text-2xl lg:text-3xl font-bold font-[Raleway] pb-5">
                {loginCtx.isLoggedIn ? "Login Another Account" : "Login"}
                </h1>
        <form className=" mx-auto w-11/12 md:w-1/2 lg:w-1/3" onSubmit={handleLogin}>
        <div className="mb-5">
            <label name="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Username</label>
            <input type="text" name="username" autoComplete="off" className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-[#232323] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white-500 dark:focus:border-white-500 " placeholder="Enter Username" value={user.username} onChange={handleUserChange}/>
        </div>
        <div className="text-center font-medium">OR</div>
        <div className="mb-5">
            <label name="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Email</label>
            <input type="email" name="email" placeholder="Enter your email" autoComplete="off" className="shadow-md bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500 " value={user.email} onChange={handleUserChange}/>
        </div>
        <div className="mb-2">
            <label name="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Password</label>
            <div className="flex">
            <input type={showpassword ? "text" : "password"} autoComplete="off" name="password" className="w-10/12 shadow-md bg-gray-50 border border-gray-300 border-r-0 text-gray-900 text-md rounded-l-lg focus:ring-0 focus:border-gray-400 block p-2.5 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white  "  placeholder="Enter Password" value={user.password} onChange={handleUserChange}/>
            <div onClick={()=>{setShowPassword(!showpassword)}} target="none" className="flex w-1/6 text-xl items-center justify-center bg-gray-50 border border-gray-300 rounded-r-lg shadow-md  border-l-0 shadow-l-0 text-gray-800 dark:bg-[#202020] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ">{showpassword ?<FaEye/> : <FaEyeSlash/>  }</div>
            </div>
        </div>
        <div className="flex items-between justify-between mb-5">
            <Link to="/forgotpassword" className=" text-sm text-cyan-500  dark:text-teal-300">Forgot password ?</Link>
        </div>
            <button type="submit" className="w-full shadow-lg text-white bg-cyan-500 hover:bg-cyan-600  font-medium rounded-lg text-md px-5 py-2.5 text-center dark:bg-teal-500 dark:hover:bg-teal-600 ">{ loadingCtx.loading ? <BtnLoader /> : "Login" }
            </button>
        </form>
            <Link to="/signup" className="w-full text-center mt-3 text-sm md:text-lg">Don't have an account? Signup</Link>
        </div>

        </>
        
    );
}

export default Login;
