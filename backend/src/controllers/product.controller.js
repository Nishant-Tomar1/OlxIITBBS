import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { deleteFileFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Wish } from "../models/wish.model.js";

const addProduct = asyncHandler(
    async(req,res) => {
        const {title, description, price, category, ageInMonths} = req.body;

        if (
            [ title, description , price, category, ageInMonths ].some((field) => field?.trim()==="")
        ) {
            throw new ApiError(400, "All fields are required")
        }
        
        const owner = await User.findById(req.user._id).select("username fullName profilePicture ")

        if (!owner){
            throw new ApiError(400, "Owner given is not a valid user");
        }

        const thumbNailLocalPath = req.files?.thumbNail ? req.files?.thumbNail[0].path : '';

        if (!thumbNailLocalPath){
            throw new ApiError(400, "Product ThumbNail is required!")
        }

        const thumbNail = await uploadOnCloudinary(thumbNailLocalPath);

        let extraImageLocalPath = '';
        extraImageLocalPath = req.files?.extraImage ? req.files?.extraImage[0].path : ''; 

        let extraImage = '';
        if (extraImageLocalPath){
            extraImage = await uploadOnCloudinary(extraImageLocalPath)
        }

        const product = await Product.create({
            owner : owner._id,
            title,
            description,
            price, 
            category,
            ageInMonths,
            thumbNail : thumbNail.url,
            extraImage : extraImage.url || ""
        })

        if(!product){
            throw new ApiError(500, "Something went wrong while product registration in database")
        }

        return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                { 
                    _id : product._id, 
                    title : product.title, 
                    category : product.category, 
                    owner : product.owner
                }, 
                "Product Added Successfully"
            )
        )
    }
)

const deleteProduct = asyncHandler(
    async (req, res) => {
        const {id : productId} = req.params
        // console.log(productId, typeof(productId));

        if (!productId){
            throw new ApiError(500, "Product id is required")
        }

        const product = await Product.findById(productId);

        if (!product) { 
            throw new ApiError(400, "Product with this id doesn't exist")
        }

        if (toString(product.owner) !== toString(req.user._id)){
            // console.log(product.ownerId, req.user._id);
            throw new ApiError(500,"User is not authorized to delete this product")
        }

        const wishListDeletion = await Wish.deleteMany({
            product : productId
        })

        if(!wishListDeletion){
            throw new ApiError(500,"Something went wrong while deleting the product wishes")
        }

        await deleteFileFromCloudinary(product.thumbNail);

        if(product.extraImage){
            await deleteFileFromCloudinary(product.extraImage)
        }

        await Product.findByIdAndDelete(product._id);

        res
        .status(200)
        .json(
            new ApiResponse(204, {}, "Product deleted Successfully")
        )
    }
)

const getProducts = asyncHandler(
    async ( req , res) => {
        const { category, search, page, limit} = req.query;
        // console.log(category, page,limit,"search :",search);
        const skip = (page-1)*limit;
        const query = {};

        if(search){
            query.$or = [{title : { $regex: new RegExp(search, "i") }},{description : {$regex: new RegExp(search, "i")}}]
            // query.title = { $regex: new RegExp(search, "i") }
            // query.description = {$regex: new RegExp(search, "i")}
        }

        if(category){
            query.category = String(category)
        }
        query.status = "active"

        const products = await Product.aggregate([
                {
                    $match : query
                },
                {
                    $lookup: {
                        from:"wishes",
                        localField:"_id",
                        foreignField:"product",
                        as:"productWishes"
                    }
                },
                {
                    $addFields : {
                        wishedByPeople : {
                            $size : "$productWishes"
                        },
                    }
                },
                {
                  $project : {
                    productWishes : 0,
                    updatedAt : 0,
                    owner : 0,
                    extraImage : 0,
                    __v : 0
                  }  
                },
                {
                    $sort : {
                        createdAt : -1
                    }
                }
            ]).skip(Number(skip)).limit(Number(limit))
        
        if(!products){
            throw new ApiError(500, "Something went wrong while fetching products")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(200, products, "Products fetched succesfully")
        )

    }
)

const getProductbyId = asyncHandler(
    async (req, res) => {
        const {id : productId} = req.params
        // console.log(typeof(productId));
        if (!productId){
            throw new ApiError(400, "Product id is required to get the product details")
        }

        const product = await Product.aggregate([ //gives as list of objects
            {
                $match : {
                    _id : new mongoose.Types.ObjectId(productId),
                }
            },
            {
                $lookup: {
                    from:"wishes",
                    localField:"_id",
                    foreignField:"product",
                    as:"productWishes"
                }
            },
            {
                $addFields : {
                    wishedByPeople : {
                        $size : "$productWishes"
                    },
                }
            },
            {
                $project : {
                    productWishes :0
                }
            }
        ])

        // const owner = await User.findById(product[0].owner).select("fullName profilePicture ")
        const owner = await User.aggregate([
            {
                $match : {
                    _id : product[0].owner
                }
            },
            {
                $lookup : {
                    from : "products",
                    localField : "_id",
                    foreignField : "owner",
                    as : "productsAdded",
                    pipeline : [
                        {
                            $project : {
                                id : 1,
                                title : 1,
                                price :1,
                                thumbNail : 1,
                                description :1,
                                status : 1
                            }
                        }
                    ]
                }
            },
            {
                $project : {               
                    fullName :1,
                    profilePicture :1,
                    productsAdded:1
                }
            }
        ])

        if (product.length === 0 ){
            throw new ApiError (400,"Product with this Id doesn't exist")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(200, {product: product[0],owner :owner[0]} , "Product fetched successfully")
        )
    }
)

const sellProduct = asyncHandler(
    async (req, res) => {
        const { id : productId } = req.params;
        // console.log(productId, typeof(productId));
        if (!productId){
            throw new ApiError(500, "Product id is required")
        }

        await Product.findByIdAndUpdate(
            productId,
            {
                $set : {
                    status  : "sold"
                }
            },
            {
                new : true
            })

        const updatedProduct = await User.findById(productId).select("-createdAt -updatedAt -extraImage -owner")

        // console.log(updatedProduct);
        return res
        .status(200)
        .json(
            new ApiResponse(
            200,
            updatedProduct,
            "Product status updated to Sold"
        ))
    }
)
// const getProductbyCategory = asyncHandler(
//     async (req, res) => {
//         const {category, page, limit} = req.query
//         const skip = (page-1)*limit;
//         console.log(category);
//         if (!category){
//             throw new ApiError(500, "Product Category is required")
//         }

//         const productList = await Product.aggregate([
//             {
//                 $match : {
//                     category : category,
//                     status : "active"
//                 }
//             },
//             // {
//             //     $lookup: {
//             //         from:"ratings",
//             //         localField:"_id",
//             //         foreignField:"product",
//             //         as: "rating" ,
//             //         pipeline : [
//             //             {
//             //                 $group : {
//             //                     _id : "$product",
//             //                     avgRating : {
//             //                         $avg : "$value"
//             //                     }
//             //                 }
//             //             },
//             //         ]
//             //     }
//             // },
//             {
//                 $lookup: {
//                     from:"wishes",
//                     localField:"_id",
//                     foreignField:"product",
//                     as:"productWishes"
//                 }
//             },
//             {
//                 $addFields : {
//                     wishedByPeople : {
//                         $size : "$productWishes"
//                     },
//                 }
//             },
//             {
//                 $project : {
//                     status : 0,
//                     owner : 0,
//                     createdAt : 0,
//                     updatedAt : 0,
//                     extraImage : 0,
//                     productWishes : 0,
//                 }
//             }
//         ]).skip(Number(skip)).limit(Number(limit))
        

//         if (!productList?.length){
//             throw new ApiError(400, "Given Category has no products")
//         }

//         return res
//         .status(200)
//         .json(
//             new ApiResponse(200, productList, "Products fetched Successfully")
//         )
//     }
// )


export {
    addProduct,
    deleteProduct,
    getProducts,
    getProductbyId,
    sellProduct
}