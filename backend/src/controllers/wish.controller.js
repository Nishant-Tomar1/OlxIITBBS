import { Wish } from "../models/wish.model.js"
import { Product } from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const addWish = asyncHandler(
    async (req, res) => {
        const { id : productId } = req.params

        if (!productId){
            throw new ApiError(400, "ProductId is required")
        }

        const prevWished = await Wish.aggregate([
            {
                $match : {
                    wishedBy : req.user._id,
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
            throw new ApiError(500, "Something went wrong while adding product to wishlist")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(200, wish, "Product Added to Wishlist successfully")
        )
    }
)

const deleteWish = asyncHandler(
    async (req, res) => {
        const { id : productId } = req.params;
        
        // console.log(productId, typeof(new mongoose.Types.ObjectId(productId)));

        if (!productId){
            throw new ApiError(500, "Product Id is required (in params)")
        }

        const product = await Product.findById((new mongoose.Types.ObjectId(productId)))

        if (!product){
            throw new ApiError(400, "Product doesn't exist in the database")
        }

        // console.log(product);

        const success = await Wish.findOneAndDelete({
            wishedBy : req.user._id,
            product : new mongoose.Types.ObjectId(productId)
        })

        if(!success){
            throw new ApiError(400, "Cannot remove! User doesn't have this product in wishlist")
        }

        return res
        .status(204)
        .json()
    }
)

export { addWish, deleteWish }