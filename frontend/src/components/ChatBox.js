import React, { useEffect, useState } from "react";
import axios from "axios";
import { Server, ServerBase } from "../Constants";
import io from "socket.io-client";
import { useLogin } from "../store/contexts/LoginContextProvider";
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useCookies } from "react-cookie";
import { FaPhone } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import BtnLoader from "./loaders/BtnLoader";
import { useLoading } from "../store/contexts/LoadingContextProvider";

const socket = io.connect(ServerBase);

function ChatBox() {
    const [content, setContent] = useState("");
    const [chatUser, setChatUser] = useState({})
    const [messages, setMessages] = useState([]);
    const {user1, user2} = useParams()
    const options = {
        timeZone: 'Asia/Kolkata',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true 
    };

    const loginCtx = useLogin();
    const Navigate = useNavigate()
    const loadingCtx = useLoading()
    const [cookies] = useCookies(["accessToken","refreshToken"])

    useEffect(() => {
        if(!cookies.accessToken){
            Navigate("/chats")
        }
        loadingCtx.setLoading(true)

        try {
            
            socket.emit("joinRoom", { user1, user2 });
    
            setTimeout(()=>{fetchMessages()},100);
    
            socket.on(`receiveMessage`, (message) => {
                setMessages((prev) => [ message,...prev]);
            });
    
            return () => {
                socket.off(`receiveMessage`);
            };
        
        } catch (error) {
            console.log(error);
            loadingCtx.setLoading(false)
        }

    }, [user1, user2, loginCtx.userId]);

    const fetchMessages = async () => {
        try {
            const res = await axios.get(
                `${Server}/messages/getmessages/${user1}/${user2}`,
                { withCredentials: true }
            );
            if (res.data.statusCode === 200) setMessages(res.data.data);
                
            const res2 = await axios.get(`${Server}/users/getuserbyId/${loginCtx.userId === user1 ? user2 : user1}`)
            // console.log(res2.data.data);
            if (res2.data.statusCode === 200) setChatUser(res2.data.data);
            loadingCtx.setLoading(false)
        } catch (error) {
            console.log("Failed to fetch messages", error);
            loadingCtx.setLoading(false)
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();

        const message = {
            sender: loginCtx.userId,
            receiver: loginCtx.userId === user1 ? user2 : user1,
            content: content,
            timeStamp : Date.now()
        };
        socket.emit("sendMessage", message);
        setContent("");
    };

    return (
        <div className="flex flex-col w-11/12 sm:w-5/6 lg:w-7/12 xl:w-1/2 2xl:w-1/3 mx-auto p-2 lg:p-3 bg-white dark:bg-[#202020] shadow-lg rounded-lg my-2 ">
            {(!loadingCtx.loading)&&<div>
                {chatUser && (
                    <div
                        key={chatUser._id}
                        className="w-full flex justify-between px-2"
                    >
                        <div
                            onClick={() => {
                                Navigate(`/users/${chatUser._id}`);
                            }}
                            className="cursor-pointer h-full flex items-center pb-2"
                        >
                            <img
                                alt="team"
                                className="w-10 h-10 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
                                src={`${chatUser.profilePicture}`}
                            />
                            <div className="flex-grow">
                                <h2 className="text-gray-700 dark:text-white text-lg lg:text-2xl font-medium">
                                    {chatUser.fullName}
                                </h2>
                            </div>
                        </div>
                        <div className="flex gap-3 items-center">
                            <Link
                                to={`tel:+91${chatUser.contactNumber}`}
                                title="Call User"
                                className="flex items-center justify-center pe-2 text-xl text-gray-500 cursor-pointer dark:text-gray-200"
                            >
                                <FaPhone />
                            </Link>
                            <div
                                title="User Profile"
                                onClick={() => {
                                    Navigate(`/users/${chatUser._id}`);
                                }}
                                className="flex items-center justify-center pe-2 text-xl text-gray-500 cursor-pointer dark:text-gray-200"
                            >
                                <FaUserAlt />
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-col-reverse overflow-y-auto p-2 mb-4 bg-gray-100 dark:bg-[#191919] max-h-[70vh] min-h-[70vh] ">
                    {(messages.length === 0) && <div className="flex w-full min-h-[65vh] justify-center items-center  text-gray-700 dark:text-gray-200 ">No Messages yet</div>}
                    {messages.length > 0 &&
                        messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex w-full ${
                                    message.sender === loginCtx.userId
                                        ? "justify-end "
                                        : "justify-start"
                                }`}
                            >
                                <div
                                    className={`flex flex-col mb-2 max-w-[80%] md:max-w-[66%] p-2 rounded-xl ${
                                        message.sender === loginCtx.userId
                                            ? "bg-cyan-500 dark:bg-teal-500 text-white rounded-tr-none pr-4"
                                            : "bg-gray-200 dark:bg-[#202020] dark:text-white text-left rounded-tl-none pr-4"
                                    }`}
                                >
                                    <div className="flex items-center justify-center">
                                        <div>
                                        <span className="font-bold">{ (message.sender === loginCtx.userId) ? "You " : chatUser?.fullName?.split(" ")[0] }{" :  " } </span>
                                        {message.content}
                                        </div>
                                    </div>

                                    <div className="text-right ms-2 text-[8px]">
                                        {new Date(message.timeStamp).toLocaleString(
                                            "en-IN",
                                            options
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>

                <div className="flex w-full">
                    <form action="" onSubmit={sendMessage} className="flex w-full">
                        <input
                            type="text"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Type a message"
                            className="flex p-2 w-4/5 lg:w-[87.5%] dark:bg-[#191919] border-gray-300 dark:border-gray-400 dark:text-white focus:border-gray-300 dark:focus:border-gray-400 rounded-l-full focus:ring-0 focus:border-2  ps-4"
                        />
                        <button
                            type="submit"
                            className="px-1 mg:px-4 w-1/5 lg:w-[12.5%] bg-cyan-500 dark:bg-teal-500 dark:hover:bg-teal-600 text-white rounded-r-full hover:bg-cyan-600 "
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>}
            {loadingCtx.loading && <div className="flex w-full min-h-[90vh] justify-center items-center p-6">
                       { <BtnLoader/>}
                </div>}

            
        </div>
    );
}

export default ChatBox;
