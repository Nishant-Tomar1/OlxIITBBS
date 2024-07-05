import { createContext, useContext, useState } from "react";

export const alertContext = createContext({
    confirm : false,
    toast : {
        visible : false,
        type : "",
        message : ""
    },
    unSetToast : () => {},
    setConfirm : () => {},
    setToast : () => {}
})

function AlertContextProvider({children}){
    const [confirm, setConfirm] = useState(false)

    const [toast, setToast] = useState({
        visible : false,
        type : "",
        message : ""
    });

    const unSetToast = () => {
        setToast(prev => ({...prev, visible : false, type : "", message : ""}))
    }

    const setConfirmHandler = (value) => {
        setConfirm(value)
        return value
    }

    const setToastHandler = ( toastType , toastMessage ) => {
        setToast(prev => ({...prev, visible : true, type : toastType, message :toastMessage}))
        if (toastType !== "confirm" ){
                setTimeout(()=>{
                setToast(prev => ({...prev, visible : false, type : "", message : ""}))
            },2000)
        }
    }

    const context = {
        confirm : confirm,
        toast : toast,
        setConfirm : setConfirmHandler,
        unSetToast : unSetToast,
        setToast : setToastHandler
    }

    return (
        <alertContext.Provider value={context}>
            {children}
        </alertContext.Provider>
    )

}

const useAlert = () => useContext(alertContext)

export {AlertContextProvider, useAlert}