import dotenv from 'dotenv'
import http from 'http'
import connectDB from './db/index.js'
import { app } from './app.js'
import { Server as socketIo } from 'socket.io';
import { Message } from './models/message.model.js';

dotenv.config({
    path : '/.env'
})

// const server = http.createServer(app)
// const io = new socketIo(server, {
//     cors : {
//         origin : process.env.CORS_ORIGIN,
//         methods : ["GET","POST"]
//     }
// })

// io.on("connection", (socket) => {
//     // console.log(`A new User connected ${socket.id}`);

//     socket.on('joinRoom', ({ user1, user2 }) => {
//         const roomName = [user1, user2].sort().join('_'); 
//         socket.join(roomName);
//         // console.log(`${socket.id} joined room: ${roomName}`);
//       });

//     socket.on('sendMessage', async (message) => {
//         const roomName = [message.sender, message.receiver].sort().join('_');
//         // console.log("HAHAHA",roomName);
        

//         try {
//             // console.log(message);
//             const newMessage = new Message(message)
//             await newMessage.save()

//             io.to(roomName).emit( `receiveMessage` , newMessage )

//         } catch (error) {
//             console.log("Error sending message", error);   
//         }
//     })

//     socket.on('disconnect', () => {
//         // console.log("User disconnected");
//     })
// })

// server.listen( 5000, () => {
//     console.log(`Socket server listening on port 5000`);
// })

const port = process.env.PORT || 4000;
connectDB()
.then(()=>{
    app.listen(port, ()=>{
        console.log(`App listening on port : ${port}`);
    })
})
.catch((err)=> {
    console.log("Database Connection Failed !!!",err);
})


