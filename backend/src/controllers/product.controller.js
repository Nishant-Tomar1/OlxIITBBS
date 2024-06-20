import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { deleteFileFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

        const thumbNailLocalPath = req.files?.thumbNail[0].path;

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
            owner : owner,
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
            new ApiResponse(200, product, "Product Added Successfully")
        )
    }
)

const deleteProduct = asyncHandler(
    async (req, res) => {
        const {id : productId} = req.params
        // console.log(productId);

        if (!productId){
            throw new ApiError(500, "Product id is required")
        }

        const product = await Product.findById(productId);

        if (!product) { 
            throw new ApiError(400, "Product with this id doesn't exist")
        }

        if (toString(product.ownerId) !== toString(req.user._id)){
            // console.log(product.ownerId, req.user._id);
            throw new ApiError(500,"User is not authorized to delete this product")
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

const getProductbyId = asyncHandler(
    async (req, res) => {
        const {id : productId} = req.params
        // console.log(typeof(productId));
        if (!productId){
            throw new ApiError(400, "Product id is required to get the product details")
        }

        const product = await Product.findById(productId);

        if (!product){
            throw new ApiError (400,"Product with this Id doesn't exist")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(200, product , "Product fetched successfully")
        )
    }
)

const getProductbyCategory = asyncHandler(
    async (req, res) => {
        const {category} = req.params

        // console.log(category);
        if (!category){
            throw new ApiError(500, "Product Category is required")
        }

        const productList = await Product.aggregate([
            {
                $match : {
                    category : category,
                    status : "active"
                }
            },
            {
                $project : {
                    status : 0,
                    owner : 0,
                    reviews : 0,
                    createdAt : 0,
                    updatedAt : 0,
                    extraImage : 0,
                }
            }
        ])
        

        if (!productList?.length){
            throw new ApiError(400, "Given Category has no products")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(200, productList, "Products fetched Successfully")
        )
    }
)





export {
    addProduct,
    deleteProduct,
    getProductbyId,
    getProductbyCategory
}