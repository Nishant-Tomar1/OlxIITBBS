import { createContext, useContext, useState } from "react";

const themeContext = createContext()

export const ThemeContextProvider = ({children})=> {
    const [theme, setTheme] = useState("dark")

    const toggleTheme =()=>{
        theme = (theme === "dark") ? "light" : "dark";
    }

    return(
        <themeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </themeContext.Provider>
    )
}

const useTheme = ()=> {
    return useContext(themeContext) 
}

export default useTheme;