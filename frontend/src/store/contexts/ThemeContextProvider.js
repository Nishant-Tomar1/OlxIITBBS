import { createContext, useContext, useState } from "react";

const themeContext = createContext({
    theme : "dark",
    toggleTheme : ()=> {}
})

function ThemeContextProvider({children}){
    const [theme, setTheme] = useState("light");

    const toggleTheme = () => { 
        setTheme( (theme === "dark") ? "light" : "dark");
    }

    return(
        <themeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </themeContext.Provider>
    )
}

const useTheme = ()=> useContext(themeContext) 

export  {useTheme, ThemeContextProvider};