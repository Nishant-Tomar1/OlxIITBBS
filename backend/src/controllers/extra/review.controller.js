import {Review } from "../../models/extra/review.model.js"
import ApiError from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import mongoose from "mongoose";


const addReview = asyncHandler(
    async (req, res) => {
        const { productId, comment } = req.body

        if (!productId || !comment){
            throw new ApiError(400, "Both ProductId and review comment are required")
        }

        const prevReviewed = await Review.aggregate([
            {
                $match : {
                    reviewer : new mongoose.Types.ObjectId(req.user._id),
                    product : new mongoose.Types.ObjectId(productId)
                }
            }
        ])
        // console.log(prevRated.length);
        if (prevReviewed.length > 0){
            throw new ApiError(500 , "User has already reviewed this product")
        }

        const review = await Review.create({
            reviewer : req.user._id,
            product : productId,
            comment : comment
        })

        if (!review){
            throw new ApiError(500, "Somethig went wrong while saving review")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(200, review, "Review added successfully")
        )
    }
)

export {addReview}