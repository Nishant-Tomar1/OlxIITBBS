import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Server } from '../Constants';
import { useLogin } from '../store/contexts/LoginContextProvider';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import BtnLoader from "../components/loaders/BtnLoader"
import { useLoading } from '../store/contexts/LoadingContextProvider';

// chats/6672afc9a756d3a0a64553b0/667561c3426e67de94d70ce6

function Chatpage() {
    const [chats, setChats] = useState([])
    const [lastMessages , setLastMessages] = useState([])
    const options = {
        timeZone: 'Asia/Kolkata',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true 
    };

    const loadingCtx = useLoading()
    const loginCtx = useLogin()
    const Navigate = useNavigate()
    const [cookies] = useCookies(["accessToken","refreshToken"])

    const fetchChats = async()=>{
        loadingCtx.setLoading(true)
        try {
            const res = await axios.get(`${Server}/users/currentuser-chats`,{withCredentials: true})
            if (res.data.statusCode === 200){
                setChats(res.data.data.data)
                setLastMessages(res.data.data.lastMessages)
                loadingCtx.setLoading(false)
            }
        } catch (error) {
            console.log(error);  
            loadingCtx.setLoading(false)      
        }
    }

    useEffect(() => {
        if(!cookies.accessToken){
            return Navigate("/")
        }
        window.scrollTo(0,0)
        fetchChats()
        // console.log(chats.length);
    },[loginCtx.userId])


    return (
        <div className="container lg:px-5 mx-auto text-gray-700 dark:text-white ">
            <div className="flex flex-col items-center justify-center px-3 mx-auto w-11/12 md:w-5/6 lg:w-1/2">
               {(!loadingCtx.loading &&(chats.length !== 0)) && <div className="flex flex-col text-center w-full pt-4">
                    <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 font-[Montserrat]">
                        Messages
                    </h1>            
                </div>}
               {((!loadingCtx.loading) && (chats.length > 0)) && <div className="flex flex-col w-full min-h-[80vh] overflow-y-auto">
                    {chats?.map((chat, index) => (
                        <div key={chat._id} onClick={()=>{Navigate(`/chats/${loginCtx.userId}/${chat._id}`)}} className="cursor-pointer w-full">
                        <div className="h-full flex items-center border-gray-600 dark:border-gray-200 border-t p-2 ">
                            <img
                                alt="team"
                                className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
                                src={`${chat.profilePicture}`}
                            />
                            <div className="flex-grow">
                                <h2 className="text-gray-700 dark:text-white text-md lg:text-xl font-semibold font-[Montserrat]">
                                    {chat.fullName}
                                </h2>
                                <div className= {`flex justify-between items-center ${String(lastMessages[index][0].receiver) === chat._id ? "text-gray-500" : "text-black dark:text-gray-300"}`}>
                                    <p><span className='font-semibold'> {String(lastMessages[index][0].receiver) === chat._id ? "You" : chat.fullName.split(" ")[0]}{" : "}</span>{String(lastMessages[index][0].content).substring(0,10)}{String(lastMessages[index][0].content).length > 10 ? " ..." : ""}</p>
                                    <p className='text-xs min-w-1/3'>{new Date(lastMessages[index][0].timeStamp).toLocaleString('en-IN', options)}</p>
                                </div>
                            </div>
                        </div>
                        </div>
                    ))}              
                </div>}
                {(loadingCtx.loading) && <div className="flex w-full min-h-[80vh] justify-center items-center p-6">
                       { <BtnLoader/>}
                        {(!loadingCtx.loading &&(chats.length === 0)) && "No Messages !"}
                </div>}
                { (!loadingCtx.loading && (chats.length===0)) && <div className="flex w-full min-h-[80vh] justify-center items-center p-6 text-gray-700 dark:text-gray-200">
                        No Messages !
                </div>}
            </div>
        </div>
    );
}

export default Chatpage
