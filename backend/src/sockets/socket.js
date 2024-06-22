// import dotenv from 'dotenv'
// import http from 'http'
// import { app } from '../app.js';
// import { Message } from '../models/message.model.js'
// import { io } from '../index.js';

// dotenv.config({
//     path : "../../.env"
// })

// const server = http.createServer(app)
// const io = new socketIo(server, {
//     cors : {
//         origin : process.env.CORS_ORIGIN, 
//         methods : ["GET","POST"]
//     }
// })

// server.listen( 5000, () => {
//     console.log(`Socket server listening on port 5000`);
// })

// io.on("connection", (socket) => {
//     console.log(`A User connected ${socket.id}`);

//     socket.on('sendMessage', async (message) => {
//         try {
//             console.log("hiiiiiii");
//             const newMessage = new Message(message)
//             await newMessage.save()
//             io.emit( 'receiveMessage' , newMessage )

//         } catch (error) {
//             console.log("Error sending message", error);   
//         }
//     })

//     socket.on('disconnect', () => {
//         console.log("User disconnected");
//     })
// })

