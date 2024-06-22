import React from 'react'
import Chat from '../components/Chat'
import { useParams } from 'react-router-dom'

function Chatpage() {
    const {senderId, receiverId} = useParams()
    // console.log(senderId , receiverId);
    return (
        <div>
            <Chat senderId={senderId} receiverId={receiverId} />
        </div>
    )
}

export default Chatpage
