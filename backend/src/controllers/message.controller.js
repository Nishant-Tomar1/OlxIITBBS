import { Message } from "../models/message.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const getAllMessagesBetweenTwoUsers = asyncHandler(
    async (req, res) => {
            const { user1Id , user2Id } = req.params 
            // console.log(user1Id, user2Id, req.user._id);
            
            if (!user1Id || !user2Id){
                throw new ApiError(400, "Both userIds are required to fetch old messages")
            }

            if ( ( user1Id !== String(req.user._id)) && (user2Id !== String(req.user._id))){
                throw new ApiError(500, "You are not authorized to see these messages")
            }
            
            const Messages = await Message.aggregate([
                {
                    $match : {
                        $or: [
                            {
                                sender : new mongoose.Types.ObjectId(user1Id),
                                receiver : new mongoose.Types.ObjectId(user2Id)
                            },
                            {
                                sender : new mongoose.Types.ObjectId(user2Id),
                                receiver : new mongoose.Types.ObjectId(user1Id)
                            }
                        ]
                    },
                },
                {
                    $sort : {
                        timeStamp : -1
                    }
                }
            ])
            // console.log(Messages);

            return res
            .status(200)
            .json(
                new ApiResponse(200, Messages , "Messages fetched successfully")
            )
              
    }
)

export {
    getAllMessagesBetweenTwoUsers
}