// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import { Server, ServerBase } from "../Constants"
// import io from 'socket.io-client'

// const socket = io(ServerBase)

// function Chat({senderId, receiverId}) { 
//     const [content, setContent] = useState("")
//     const [messages, setMessages] = useState([])

//     useEffect(() => {
//         const fetchMessages = async () => {
//             try {
//                 const res = await axios.get(`${Server}/messages/getmessages/${senderId}/${receiverId}`, {withCredentials : true})
//                 setMessages(res.data)
//             } catch (error) {
//                 console.log("Failed to fetch messages", error);
//             }
//         }
//         fetchMessages();

//         socket.on('receiveMessage', (message) => {
//           setMessages(prev => ([...prev, message]))
//         })

//         return () => {
//           socket.off('receiveMessage')
//         }

        
//     },[senderId, receiverId])

//     const sendMessage = () => {
//       const message = {sender : senderId, receiver : receiverId, content : content};
//       socket.emit('sendMessage', message);
//       setContent("")
//     }

//   return (
//     <div className="flex flex-col h-full max-w-lg mx-auto p-4 bg-white shadow-lg rounded-lg">
//       <div className="flex-grow overflow-y-auto p-4 mb-4 border border-gray-300 rounded-lg">
//         {messages.map((message, index) => (
//           <div
//             key={index}
//             className={`mb-2 p-2 rounded-md ${
//               message.senderId === senderId
//                 ? 'bg-blue-500 text-white self-end'
//                 : 'bg-gray-200 self-start'
//             }`}
//           >
//             <b>{message.senderId === senderId ? 'You' : 'Them'}:</b> {message.content}
//           </div>
//         ))}
//       </div>
//       <div className="flex">
//         <input
//           type="text"
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           placeholder="Type a message"
//           className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none"
//         />
//         <button
//           onClick={sendMessage}
//           className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   )
// }

// export default Chat
