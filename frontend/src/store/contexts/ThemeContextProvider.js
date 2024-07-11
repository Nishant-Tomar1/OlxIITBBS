import { createContext, useContext, useEffect, useState } from "react";

const themeContext = createContext({
    theme : "dark",
    toggleTheme : ()=> {}
})

function ThemeContextProvider({children}){
    const [theme, setTheme] = useState(localStorage.getItem("themeMode") ? localStorage.getItem("themeMode") : "dark");

    const toggleTheme = () => { 
        setTheme( (theme === "dark") ? "light" : "dark");
    }

    useEffect(()=>{
        // setTheme(localStorage.getItem("themeMode"))
        localStorage.setItem("themeMode",theme)
    },[theme])

    

    return(
        <themeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </themeContext.Provider>
    )
}

const useTheme = ()=> useContext(themeContext) 

export  {useTheme, ThemeContextProvider};