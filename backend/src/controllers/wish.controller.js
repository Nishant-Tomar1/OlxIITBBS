import { Wish } from "../models/wish.model.js"
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";


const addWish = asyncHandler(
    async (req, res) => {
        const { productId } = req.body

        if (!productId){
            throw new ApiError(400, "ProductId is required")
        }

        const prevWished = await Wish.aggregate([
            {
                $match : {
                    wisher : req.user._id,
                    product : new mongoose.Types.ObjectId(productId)
                }
            }
        ])

        // console.log(prevWished.length);
        if (prevWished.length > 0){
            throw new ApiError(500 , "User has already added this product to wishList")
        }

        const wish = await Wish.create({
            wishedBy : req.user._id,
            product : productId
        })

        if (!wish){
            throw new ApiError(500, "Somethig went wrong while adding product to wishlist")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(200, wish, "Product Added to Wishlist successfully")
        )
    }
)

export { addWish }