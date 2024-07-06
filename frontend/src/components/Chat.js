import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Server, ServerBase } from "../Constants";
import io from "socket.io-client";
import { useLogin } from "../store/contexts/LoginContextProvider";

const socket = io.connect(ServerBase);
// console.log(socket);

function Chat({ user1, user2 }) {
    const [content, setContent] = useState("");
    const [messages, setMessages] = useState([]);

    const loginCtx = useLogin();
    // console.log(loginCtx.userId);

    useEffect(() => {
        socket.emit("joinRoom", { user1, user2 });

        const fetchMessages = async () => {
            try {
                const res = await axios.get(
                    `${Server}/messages/getmessages/${user1}/${user2}`,
                    { withCredentials: true }
                );
                setMessages(res.data.data);
                // console.log(res.data.data);
            } catch (error) {
                console.log("Failed to fetch messages", error);
            }
        };
        fetchMessages();

        socket.on(`receiveMessage`, (message) => {
            // console.log("received",message.content);
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.off(`receiveMessage`);
        };
    }, [user1, user2]);

    const sendMessage = (e) => {
        e.preventDefault();
        const message = {
            sender: loginCtx.userId,
            receiver: loginCtx.userId === user1 ? user2 : user1,
            content: content,
        };
        socket.emit("sendMessage", message);
        setContent("");
    };

    return (
        <div className="flex flex-col w-11/12 sm:w-8/12 lg:w-7/12 xl:w-1/2 2xl:w-1/3 mx-auto p-2 lg:p-3 bg-white dark:bg-[#202020] shadow-lg rounded-lg my-2 ">
            <div  className="flex flex-col overflow-y-auto p-1 sm:p-2 mb-4 bg-gray-100 dark:bg-[#191919] max-h-[75vh] min-h-80 ">
                {messages.map((message, index) => (
                    <div key={index} className={`flex w-full ${
                        message.sender === loginCtx.userId
                                ? "justify-end "
                                : "justify-start"
                    }`}>
                    <div
                        className={`mb-2 max-w-[80%] md:max-w-[66%] p-2 px-3 rounded-xl ${
                            message.sender === loginCtx.userId
                            ? "bg-cyan-500 dark:bg-teal-500 text-white rounded-tr-none"
                            : "bg-gray-200 text-left rounded-tl-none"
                        }`}
                    >   
                    <span>
                        <span className="font-bold">
                            {message.sender === loginCtx.userId
                                ? "You "
                                : "Them "}
                            :
                            
                        </span>
                        {" "}{message.content}
                        </span>

                        
                    {/* <div className="text-right ms-2 text-[8px]">{[...message.timeStamp.split("T")[0].split("-")].reverse().join("-")}, {(String(message.timeStamp.split("T")[1].split(".")[0]).substring(0,3) > "12") ? (String(message.timeStamp.split("T")[1].split(".")[0]).substring(0,2)-"12" + String(message.timeStamp.split("T")[1].split(".")[0]).substring(2,5) + " pm" ) : (String(message.timeStamp.split("T")[1].split(".")[0]).substring(0,5)+ " am")}</div>
                    </div> */}
                    <div className="text-right ms-2 text-[8px]">{[...message.timeStamp.split("T")[0].split("-")].reverse().join("-")}, {(String(message.timeStamp.split("T")[1].split(".")[0]).substring(0,5))}</div>
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
                        className="flex p-2 w-4/5 lg:w-5/6 dark:bg-[#191919] dark:text-white focus:border-0 rounded-l-full focus:outline-0 ps-4"
                    />
                    <button
                        type="submit"
                        className="px-1 mg:px-4 w-1/5 lg:w-1/6 bg-cyan-500 dark:bg-teal-500 dark:hover:bg-teal-600 text-white rounded-r-full hover:bg-cyan-600 focus:outline-none"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Chat;
