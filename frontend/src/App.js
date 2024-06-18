import React, { useEffect } from "react"
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements
} from 'react-router-dom'

import Layout from "./layout/Layout"
import HomePage from "./pages/HomePage"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import UserProfile from "./pages/UserProfile"
import Product from "./pages/Product"
import Profile from "./pages/Profile"

import { useCookies } from "react-cookie"
import { useLogin } from "./contexts/LoginContextProvider"
import {verifyToken} from "./store/utils/verifyToken"
import { refreshAccessToken } from "./store/utils/refreshAccessToken"



 
function App() {
  const loginCtx = useLogin();
  const [cookies] = useCookies(["accessToken","refreshToken"])
  
  // to verify the token and refresh it if expired
  useEffect( () => {
    const Verify = async(accessToken, refreshToken) => {
      try {
        const token = accessToken;
        if(!token) return refreshAccessToken(Verify, loginCtx, refreshToken);

        const response = await verifyToken(token);
        if (response?.isLoggedIn === true) {
          loginCtx.login(token, refreshToken, response.fullName);
        }

      } catch (error) {
        console.log(error);
        return refreshAccessToken(Verify, loginCtx, cookies.refreshToken);
      }
    }

    Verify(cookies.accessToken, cookies.refreshToken);
  },[])

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />}/>
        <Route path="/profile" element={<Profile />} />
        <Route path="/users/:userId" element = {<UserProfile />} />
        <Route path="/products/:productId" element = {<Product />}/>
      </Route>
    )
  )

  return (
     <RouterProvider router={router}/>
  )
}

export default App

