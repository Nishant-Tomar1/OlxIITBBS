import axios from "axios";
import { Server } from "../../Constants";

export const verifyToken = async (accessToken) => {
        try {
          const response = await axios.get(`${Server}/users/verifytoken`, {
            headers : {
              Authorization : `Bearer ${accessToken}`
            }
          }); 
          // console.log(response.data);
          if (response?.data.statusCode === 200) {
             return{ isLoggedIn : true , fullName : response.data.data.fullName, id : response.data.data._id, profilePicture: response.data.data.profilePicture }
          }

        } catch (error) {
          console.log("Something went wrong while verifying accesstoken",error);
          return { isLoggedin: false, fullName: null, id : null, profilePicture:null };
        }   
}