import { createContext, useContext, useState } from "react";


const searchContext = createContext({
    search : "",
    setSearch : ()=>{},
    clearSearch : () =>{}
})

function SearchContextProvider({children}){
    const [search, setSearch] = useState("")
    
    const setSearchHandler = (value) => {
        setSearch(value)
        // console.log(value);
    }

    const clearSearch = () => {
        setSearch("")
    }

    const context = {
        search,
        setSearch : setSearchHandler,
        clearSearch : clearSearch
    }

    return(
        <searchContext.Provider value={context}>
            {children}
        </searchContext.Provider>
    )
}

const useSearch = () => useContext(searchContext)

export {useSearch, SearchContextProvider}
