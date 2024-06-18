import { useContext, useState } from "react"
import {useCookies} from "react-cookie"
import { createContext } from "react";

export const loginContext = createContext({
    isLoggedIn : false,
    fullName : null,
    accessToken : null,
    refreshToken : null,
    loading : false,
    login : () => {},
    logout : () => {},
    setAccessToken : () => {},
    setRefreshToken: () => {},
    setLoading : () => {}
})


function LoginContextProvider({children}){
    const [, setCookie] = useCookies(["accessToken : nothing", "refreshToken :  nothing"])
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [fullName , setFullName] = useState(null)
    const [accessToken, setAccessToken] = useState(null)
    const [refreshToken, setRefreshToken] = useState(null)
    const [loading, setIsLoading] = useState(false)

    const loginHandler = (accessToken, refreshToken, fullName) => {
        setIsLoggedIn(true);
        setFullName(fullName);
        setAccessTokenHandler(accessToken);
        setRefreshTokenHandler(refreshToken);
    }

    const logoutHandler = () => {
        setIsLoggedIn(false);
        setFullName(null);
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
        fullName : fullName,
        accessToken : accessToken,
        refreshToken : refreshToken,
        loading : loading,
        login : loginHandler,
        logout : logoutHandler,
        setAccessToken : setAccessTokenHandler,
        setRefreshToken : setRefreshTokenHandler,
        setLoading : setIsLoading
    }

    return(
        <loginContext.Provider value={context}>
            {children}
        </loginContext.Provider>
    )
}

const useLogin = () => useContext(loginContext)

export {useLogin , LoginContextProvider};
