import React, { useEffect } from "react"
import {
  Route,
  RouterProvider,
  // createHashRouter,
  createBrowserRouter,
  createRoutesFromElements
} from 'react-router-dom'

import Layout from "./layout/Layout"
import HomePage from "./pages/HomePage"
import Login from "./components/Login"
import SignUp from "./components/SignUp"
import UserProfile from "./pages/UserProfile"
import Product from "./components/Product"
import Profile from "./pages/Profile"
import ForgotPassword from "./components/ForgotPassword"

import { useCookies } from "react-cookie"
import { useLogin } from "./store/contexts/LoginContextProvider"
import {verifyToken} from "./store/utils/verifyToken"
import { refreshAccessToken } from "./store/utils/refreshAccessToken"
import Chatpage from "./pages/Chatpage"
import ChatBox from "./components/ChatBox"
import WishList from "./components/WishList"
import AddProduct from "./components/AddProduct"
import UpdatePassword from "./components/UpdatePassword"



 
function App() {
  const loginCtx = useLogin();
  const [cookies] = useCookies(["accessToken","refreshToken"])
  
  // to verify the token and refresh it if expired
  useEffect( () => {
    const Verify = async(accessToken, refreshToken) => {
      if (!refreshToken && !accessToken){
        return {/*l console.log("Login again") */}
      }
      try {
        const token = accessToken;
        if(!token) return refreshAccessToken(Verify, loginCtx, refreshToken);

        const response = await verifyToken(token);
        // console.log("here",response);
        if (response?.isLoggedIn === true) {
          loginCtx.login(token, refreshToken, response.id , response.fullName, response.profilePicture);
        }
        // console.log(loginCtx);

      } catch (error) {
        console.log(error);
        return refreshAccessToken(Verify, loginCtx, cookies.refreshToken);
      }
    }

    Verify(cookies.accessToken, cookies.refreshToken);
  
  },[loginCtx.isLoggedIn])

  const router = createBrowserRouter(
    createRoutesFromElements(   
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />}/>
        <Route path="/forgotpassword" element={<ForgotPassword />}/>
        <Route path="/myprofile" element={<Profile />} />
        <Route path="/wishlist" element={<WishList />} />
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/updatepassword" element={<UpdatePassword/>} />
        <Route path="/users/:userId" element = {<UserProfile />} />
        <Route path="/products/:productId" element = {<Product />}/>
        <Route path="/products/categories/:category" element = {<HomePage />} />
        <Route path="/chats" element={<Chatpage/>}/>
        <Route path="/chats/:user1/:user2" element={<ChatBox />} />
      </Route>   
    )
  )

  return (
     <RouterProvider router={router}/>
  )
}

export default App

