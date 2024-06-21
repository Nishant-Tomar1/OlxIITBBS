import {Rating } from "../models/rating.model.js"
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";


const addRating = asyncHandler(
    async (req, res) => {
        const { productId, value : ratingValue } = req.body

        if (!productId || !ratingValue){
            throw new ApiError(400, "Both ProductId and rating value are required")
        }

        const prevRated = await Rating.aggregate([
            {
                $match : {
                    evaluator : new mongoose.Types.ObjectId(req.user._id),
                    product : new mongoose.Types.ObjectId(productId)
                }
            }
        ])
        // console.log(prevRated.length);
        if (prevRated.length > 0){
            throw new ApiError(500 , "User has already rated this product")
        }

        const rating = await Rating.create({
            evaluator : req.user._id,
            product : productId,
            value : ratingValue
        })

        if (!rating){
            throw new ApiError(500, "Somethig went wrong while saving rating")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(200, rating, "Rating added successfully")
        )
    }
)

export {addRating}