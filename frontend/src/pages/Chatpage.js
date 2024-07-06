import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Server } from '../Constants';
import { useLogin } from '../store/contexts/LoginContextProvider';
import { useNavigate } from 'react-router-dom';

// chats/6672afc9a756d3a0a64553b0/667561c3426e67de94d70ce6

function Chatpage() {
    const [chats, setChats] = useState([])

    const loginCtx = useLogin()
    const Navigate = useNavigate()

    const fetchChats = async()=>{
        try {
            const res = await axios.get(`${Server}/users/currentuser-chats`,{withCredentials: true})
            if (res.data.statusCode === 200){
                setChats(res.data.data)
            }
        } catch (error) {
            console.log(error);        
        }
    }

    useEffect(() => {
        // if(!loginCtx.userId){
        //     return Navigate("/")
        // }
        fetchChats()
    },[loginCtx.userId])


    return (
        <div className="container px-5  mx-auto text-gray-700 dark:text-white ">
            <div className="flex flex-col items-center justify-center px-3 mx-auto w-11/12 md:w-5/6 lg:w-1/2">
                <div className="flex flex-col text-center w-full pt-4">
                    <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4">
                        Messages
                    </h1>            
                </div>
                <div className="flex flex-col gap-1 w-full min-h-[70vh] overflow-y-auto">
                    {chats?.map((chat) => (
                        <div key={chat._id} onClick={()=>{Navigate(`/chats/${loginCtx.userId}/${chat._id}`)}} className="cursor-pointer w-full h-20">
                        <div className="h-full flex items-center border-gray-600 dark:border-gray-200 border-2 p-4 rounded-lg">
                            <img
                                alt="team"
                                className="w-12 h-12 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
                                src={`${chat.profilePicture}`}
                            />
                            <div className="flex-grow">
                                <h2 className="text-gray-700 dark:text-white text-2xl font-medium">
                                    {chat.fullName}
                                </h2>
                                <p className="text-gray-600">last message</p>
                            </div>
                        </div>
                    </div>
                    ))}
                    {!chats.length && "Loading..."}
                    
                </div>
            </div>
        </div>
    );
}

export default Chatpage
