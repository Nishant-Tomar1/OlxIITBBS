import React from 'react'
import Chat from '../components/Chat'
import { useParams } from 'react-router-dom'

// chats/6672afc9a756d3a0a64553b0/667561c3426e67de94d70ce6

function Chatpage() {
    const {user1, user2} = useParams()
    // console.log(user1 , user2);
    return (
        <div className=' dark:bg-gray-700 w-full'>
            <Chat user1={user1} user2={user2} />
        </div>
    )
}

export default Chatpage
