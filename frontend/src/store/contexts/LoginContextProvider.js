import { useContext, useState } from "react"
import {useCookies} from "react-cookie"
import { createContext } from "react";

export const loginContext = createContext({
    isLoggedIn : false,
    userId : "",
    fullName : null,
    profilePicture : null,
    accessToken : null,
    refreshToken : null,
    login : () => {},
    logout : () => {},
    setAccessToken : () => {},
    setRefreshToken: () => {},
})


function LoginContextProvider({children}){
    const [, setCookie] = useCookies(["accessToken : nothing", "refreshToken :  nothing"])
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [fullName , setFullName] = useState(null)
    const [userId , setUserId] = useState(null)
    const [profilePicture, setProfilePicture] = useState(null)
    const [accessToken, setAccessToken] = useState(null)
    const [refreshToken, setRefreshToken] = useState(null)

    const loginHandler = (accessToken, refreshToken, id ,  fullName, profilePicture) => {
        setIsLoggedIn(true);
        setUserId(id);
        setFullName(fullName);
        setProfilePicture(profilePicture)
        setAccessTokenHandler(accessToken);
        setRefreshTokenHandler(refreshToken);
    }

    const logoutHandler = () => {
        setIsLoggedIn(false);
        setFullName(null);
        setUserId(null)
        setProfilePicture(null)
        setCookie(
            "accessToken",
            null,
            {
                path:"/",
                maxAge:0
            }
        );
        setCookie(
            "refreshToken",
            null,
            {
                path:"/",
                maxAge:0
            }
        );

    }

    const setAccessTokenHandler  = (newAccessToken) => {
        setCookie("accessToken", newAccessToken, {
            path: "/",
            maxAge: 60 * 60 * 24 ,
          });
        //   console.log(newAccessToken);
        setAccessToken(newAccessToken);
    }

    const setRefreshTokenHandler = (newRefreshToken) => {
        // console.log(newRefreshToken);
        setCookie("refreshToken", newRefreshToken, {
            path: "/",
            maxAge: 60 * 60 * 24 * 15 ,
          });
        setRefreshToken(newRefreshToken);
    }

    const context = {
        isLoggedIn : isLoggedIn,
        userId : userId,
        fullName : fullName,
        profilePicture : profilePicture,
        accessToken : accessToken,
        refreshToken : refreshToken,
        login : loginHandler,
        logout : logoutHandler,
        setAccessToken : setAccessTokenHandler,
        setRefreshToken : setRefreshTokenHandler,
    }

    return(
        <loginContext.Provider value={context}>
            {children}
        </loginContext.Provider>
    )
}

const useLogin = () => useContext(loginContext)

export {useLogin , LoginContextProvider};
