import { createContext, useContext, useState } from "react";

export const alertContext = createContext({
    alert : {
        visible : false,
        type : "", //[]
        message : ""
    },
    toast : {
        visible : false,
        type : "",
        message : ""
    },
    unSetToast : () => {},
    setAlert : () => {},
    setToast : () => {}
})

function AlertContextProvider({children}){
    const [alert, setAlert] = useState({
        visible : false,
        type : "",
        message : ""
    });

    const [toast, setToast] = useState({
        visible : false,
        type : "",
        message : ""
    });

    const unSetToast = () => {
        setToast(prev => ({...prev, visible : false, type : "", message : ""}))
    }

    const setAlertHandler = ( alertType , alertMessage ) => {
        setAlert(prev => ({...prev, visible : true , type : alertType, message : alertMessage}))
        setTimeout(()=>{
            setAlert(prev => ({...prev, visible : false, type : "", message : ""}))
        },3000)
    }

    const setToastHandler = ( toastType , toastMessage ) => {
        setToast(prev => ({...prev, visible : true, type : toastType, message :toastMessage}))
        setTimeout(()=>{
            setToast(prev => ({...prev, visible : false, type : "", message : ""}))
        },4000)
    }

    const context = {
        alert : alert,
        toast : toast,
        unSetToast : unSetToast,
        setAlert : setAlertHandler,
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