import { createContext, useContext, useState } from "react";

const loadingContext = createContext({
    loading : false,
    setLoading : () => {}
})

function LoadingContextProvider({children}){
    const [loading, setLoading] = useState(false);

    const setLoadingHandler = (option) => { 
        setLoading(option)
        // console.log(option , loading);
    }

    return(
        <loadingContext.Provider value={{loading, setLoading : setLoadingHandler}}>
            {children}
        </loadingContext.Provider>
    )
}

const useLoading = () => useContext(loadingContext) 

export  { useLoading, LoadingContextProvider};