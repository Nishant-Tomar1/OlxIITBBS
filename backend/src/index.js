import dotenv from 'dotenv'
import http from 'http'
import https from "https"
import connectDB from './db/index.js'
import { app } from './app.js'
import { Server as socketIo } from 'socket.io';
import { Message } from './models/message.model.js';
import cron from "node-cron"

dotenv.config({
    path : '/.env'
})

const server = http.createServer(app)

const io = new socketIo( server , {
    cors : {
        origin : process.env.CORS_ORIGIN,
        credentials : true
    }
}
)

const backendUrl = "https://olxiitbbs.onrender.com/api/v1/products/getproducts?page=1&limit=1";
cron.schedule("*/10 * * * *", function () {
  console.log("Restarting server");

  https
    .get(backendUrl, (res) => {
      if (res.statusCode === 200) {
        console.log("Restarted");
      } else {
        console.error(`failed to restart with status code: ${res.statusCode}`);
      }
    })
    .on("error", (err) => {
      console.error("Error ", err.message);
    });
});

process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
  });

const port = process.env.PORT || 4000;

io.on("connection", (socket) => {

    socket.on('joinRoom', ({ user1, user2 }) => {
        const roomName = [user1, user2].sort().join('_'); 
        socket.join(roomName);
        // console.log(`${socket.id} joined room: ${roomName}`);
      });

    socket.on('sendMessage', async (message) => {
        const roomName = [message.sender, message.receiver].sort().join('_');

        try {
            const newMessage = new Message(message)
            await newMessage.save()

            io.to(roomName).emit( `receiveMessage` , newMessage )

        } catch (error) {
            console.log("Error sending message", error);   
        }
    })

    socket.on('disconnect', () => {})
})

connectDB()
.then(()=>{
    server.listen(port, ()=>{
        console.log(`Server listening on port : ${port}`);
    })
})
.catch((err)=> {
    console.log("Database Connection Failed !!!",err);
})


// server.listen( 8000, () => {
//     console.log(`Socket server listening on port ${port}`);
// })

process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });





