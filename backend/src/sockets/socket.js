import http from 'http'
import socketIo from 'socket.io'
import { Message } from '../models/message.model.js'
import app from '../app.js'

const server = http.createServer(app)
const io = socketIo(server)

io.on('connection', (socket) => {
    console.log('A User connected');

    socket.on('sendMessage', async (message) => {
        try {
            const newMessage = new Message(message)
            await newMessage.save()
            io.emit( 'receiveMessage' , newMessage )

        } catch (error) {
            console.log("Error sending message", error);   
        }
    })

    socket.on('disconnect', () => {
        console.log("User disconnected");
    })
})

server.listen( process.env.PORT || 4000, () => {
    console.log(`Socket server listening on port ${process.env.PORT || 4000}`);
})