import { User }  from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';

export const verifyJWT = asyncHandler(
    async (req , _ , next) => {
        try {
            const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","") 
            // console.log(token.accessToken);
                       
            if (!token) {
                throw new ApiError(401, "Unauthorized request")
            }
            
            //decoding acessToken
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
            const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    
            if (!user) { 
                throw new ApiError(401,"Invalid Access Token");
            }
    
            req.user = user;
            next()
            
        } catch (error) {
            throw new ApiError(404,error?.message || "Invalid access token")
        }

    }
)

// export const verifyRefreshToken = asyncHandler(
//     async (req , _ , next) => {
//         try {
//             const token = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer","");
//             // console.log("token1 :",token);
                       
//             if (!token) {
//                 throw new ApiError(401, "Session Expired")
//             }
            
//             //decoding refreshToken
//             const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    
//             const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    
//             if (!user) { 
//                 throw new ApiError(401,"This refresh token is not owned by any owner");
//             }

//             req.user = user;
//             // console.log(user);
//             next()
//         } catch (error) {
//             throw new ApiError(404,error?.message || "Invalid refresh token")
//         }

//     }
// )
