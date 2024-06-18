import React from 'react'
import { useParams } from 'react-router-dom'

function UserProfile() {
  const {userId} = useParams();

  return (
    <div>
      UserProfile : {userId}
    </div>
  )
}

export default UserProfile
