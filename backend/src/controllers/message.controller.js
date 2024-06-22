import { Message } from "../models/message.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const getAllMessagesBetweenTwoUsers = asyncHandler(
    async (req, res) => {
        try {
            const { user1Id , user2Id } = req.params 
            
            if (!user1Id || !user2Id){
                throw new ApiError(400, "Both userIds are required to fetch old messages")
            }
            
            const Messages = await Message.aggregate([
                {
                    $match : {
                        $or : [
                            {
                                sender : new mongoose.Types.ObjectId(user1Id),
                                reciever : new mongoose.Types.ObjectId(user2Id)
                            },
                            {
                                sender : new mongoose.Types.ObjectId(user2Id),
                                reciever : new mongoose.Types.ObjectId(user1Id)
                            }
                        ]
                    },
                },
                {
                    $sort : {
                        timeStamp : 1
                    }
                }
            ])

            return res
            .status(200)
            .json(
                new ApiResponse(200, Messages , "Messages fetched successfully")
            )
            
        } catch (error) {
            throw new ApiError(500, "Error fetching messages",error)
        }
            
    }
)

export {
    getAllMessagesBetweenTwoUsers
}