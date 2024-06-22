import React from 'react'
import Chat from '../components/Chat'
import { useParams } from 'react-router-dom'

// chats/6672afc9a756d3a0a64553b0/667561c3426e67de94d70ce6

function Chatpage() {
    const {senderId, receiverId} = useParams()
    // console.log(senderId , receiverId);
    return (
        <div>
            {/* "Hello" */}
            <Chat senderId={senderId} receiverId={receiverId} />
        </div>
    )
}

export default Chatpage
