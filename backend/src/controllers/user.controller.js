import { asyncHandler } from  "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { Product } from "../models/product.model.js"
import { Wish } from  "../models/wish.model.js"
import { uploadOnCloudinary, deleteFileFromCloudinary } from  "../utils/cloudinary.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import { Message } from "../models/message.model.js"

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave : false})

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

const verifyAccessToken = asyncHandler(
    async (req, res) => {
        let accessToken;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            accessToken = req.headers.authorization.split(" ")[1];
        }

        else accessToken = req.cookies?.accessToken
        // console.log("accessToken:", accessToken);

        if (!accessToken){
            throw new ApiError(500,"Token was not sent properly");
        }

        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken._id).select("-password")

        if (!user){
            throw new ApiError(500, "No user with this accesstoken exists")
        }
        
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "User Verified "
            )
        )
    }
)

const verifyRefreshToken = asyncHandler(
    async (req,res) => {
            try {
                let incomingRefreshToken;
            if (
                req.headers.authorization &&
                req.headers.authorization.startsWith("Bearer")
            ) { 
                incomingRefreshToken = req.headers.authorization.split(" ")[1];
            }
            else incomingRefreshToken = req.cookies?.refreshToken

            if (!incomingRefreshToken){
                throw new ApiError(401, "Unauthorized Request")
            }
    
            const decodedRefreshToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
            
            const user = await User.findById(decodedRefreshToken._id)

            if (!user){
                throw new ApiError(401, "Invalid Refresh Token");
            }

            // console.log("User : " ,user);

            //comparing the incoming refresh token with the refreshToken that is stored in the database
            if (incomingRefreshToken != user?.refreshToken){
                throw new ApiError(401, "Refresh Token id expired or used");
            }
            
            const {accessToken : newAccessToken ,refreshToken : newRefreshToken} = await generateAccessAndRefreshTokens(user._id);

            const options = {
                // httpOnly : true,
                secure : true
            }
            // console.log(newUser, newAccessToken, newRefreshToken);
            return res
            .status(200)
            .cookie("accessToken", newAccessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                200, {
                    newAccessToken : newAccessToken,
                    newRefreshToken : newRefreshToken
                },
                "Access Token Refreshed"
                )
            )
        } catch (error) {
            throw new ApiError(401 ,  "Invalid refresh token ")
        }
    }
)

const verifyEmail = asyncHandler(
    async (req,res)=>{
        const {email : incomingEmail} = req.body

        const user = await User.aggregate([
            {
                $match : {
                    email : incomingEmail.toLowerCase()
                }
            }
        ])

        // console.log(user[0]);
        if (user.length === 0){
            throw new ApiError(500, "User with this Email doesn't exist")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(200,user[0]._id,"User Exists")
        )
    }
)

const changePasswordByCode = asyncHandler(
    async (req,res)=>{

        const { id , newPassword} = req.body

        if(!id || !newPassword){
            throw new ApiError(500, "Both Id and newPassword are required")
        }

        const user = await User.findById(id) 
        // console.log(user);

        if(!user){
            throw new ApiError(500,"Invalid userId")
        }

        user.password = newPassword

        await user.save({validateBeforeSave:false});

        return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "Password Changed Successfully"
        ))
    }
)

const registerUser = asyncHandler( 
    async (req,res) => {
    // get user details from frontend 
    const{fullName, email, username, password, contactNumber} = req.body

    // validation -not empty
    if (
        [fullName, email, username, password, contactNumber].some((field) => field?.trim()==="")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    // check if user already exists : username. email
    const ExistedUser = await User.findOne({
        $or: [{ username },{ email }]
    })

    if (ExistedUser) {
        throw new ApiError(409, "User with this email or username already exists")
    }

    // check for images, check for profilePicture
    const profilePictureLocalPath = req.files?.profilePicture ? req.files?.profilePicture[0].path : "";
    // console.log(profilePictureLocalPath);

    if(!profilePictureLocalPath) {
        throw new ApiError(400, "profilePicture is required");
    }

    // upload to cloudinary, profilePicture
    const profilePicture = await uploadOnCloudinary(profilePictureLocalPath);
  
    if (!profilePicture) {
        throw new ApiError(400, "profilePicture file is required");
    }

    // create user object - create entry in db 
    const user = await User.create({
        username : username.toLowerCase(),
        fullName, 
        email : email.toLowerCase(),
        profilePicture : profilePicture.url,
        password,
        contactNumber,
    })

    // remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // check for user creation
    if (!createdUser) { 
        throw new ApiError(500, "Something went wrong during user registration" )
    }

    // console.log("User Registered Successfully!!");

    // return res
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
    
}
)

const loginUser = asyncHandler(
    async(req,res) => {
        // req body -> data
        // username or email 
        // find the user
        // password check
        // access and refresh token
        // send cookie
        
        const {username,email,password} = req.body;

        if (!username && !email){
            throw new ApiError(400, "Username or Email is required");
        }

        const user = await User.findOne({
            $or:[{username},{email}]
        })

        if(!user){
            throw new ApiError(400, "User doesn't exist");
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid){
            throw new ApiError(400, "Incorrect Password");
        }

        const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id);

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            // httpOnly : true,
            secure : true
        }

        return res
        .status(200)
        .cookie("accessToken", accessToken,options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In Succesfully"
            )
        )

}
)

const logoutUser = asyncHandler(
    async(req, res) => {
        
         await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    refreshToken : 1 //we are using the unset operator here , we can also use set operator and give a value null to refreshToken but this approach is better 
                }
            },
            {
                new : true  //isse return mein jo response milega usme new updated value milegi
            }
        )
        // console.log(user);

        const options = {
            // httpOnly : true,
            secure : true
        }

        return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "User logged Out Successfully"
            )
        )

    }
)

const changeCurrentUserPassword = asyncHandler(
    async(req,res) =>{
        const {oldPassword, newPassword} = req.body

        const user = await User.findById(req.user?._id) 
 
        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

        if(!isPasswordCorrect){
            throw new ApiError(401, "Incorrect old password")
        }

        user.password = newPassword;

        await user.save({validateBeforeSave:false});

        return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "Password Changed Successfully"
        ))
    }
)

const getUserById = asyncHandler(
    async(req, res) => {
        const {id :userId} = req.params;

        if(!userId){
            throw new ApiError(500, "UserId is required")
        }

        const user = await User.aggregate([
            {
                $match : {
                    _id : new mongoose.Types.ObjectId(userId)
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
                                status : 1,
                                title : 1,
                                price :1,
                                thumbNail : 1,
                                description :1
                            }
                        }
                    ]
                }
            },
            {
                $project : {
                    password : 0,
                    refreshToken : 0,
                    updatedAt : 0,
                    wishList : 0,
                }
            }
        ])

        if (user.length === 0){
            throw new ApiError(400, "User with this username doesn't exist")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(200, user[0], "User fetched successfully")
        ) 
    }
)

const getCurrentUser = asyncHandler(
    async(req,res) => {

        const user = await User.aggregate([
            {
                $match : {
                    _id : req.user._id
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
            // {
            //     $lookup : {
            //         from : "wishes",
            //         localField : "_id",
            //         foreignField : "wishedBy",
            //         as : "wishList",
            //     }
            // },
            {
                $project : {
                    password : 0,
                    cart : 0,
                    refreshToken : 0
                }
            }
        ])

        if (user.length === 0){
            throw new ApiError(500, "Something went wrong")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(
            200,
            user[0],
            "Current User fetched Successfully"
        ));
    }
)

const getCurrentUserChats = asyncHandler(
    async(req, res) => {
        const chats = await Message.aggregate([
            {
                $match : {
                    $or : [
                        {sender : req.user._id},
                        {receiver : req.user._id}
                    ]
                }
            },
            {
                $sort : {
                    timeStamp : -1
                }
            }
        ])
        // console.log(chats);

        const users = []
        chats.map((chat) => {
            if(String(chat.sender) === String(req.user._id)){
                if(!users.includes(String(chat.receiver))){
                    users.push(String(chat.receiver));
                };
            } 
            else{
                if(!users.includes(String(chat.sender))){
                    users.push(String(chat.sender));
                };
            }
        })

        let data = [], lastMessages = [];
        const userPromises = users.map(async (user) => {
            return await User.findById(user).select("fullName profilePicture");
        });
        
        data = await Promise.all(userPromises);
        
        const messagePromise = data.map(async (user) => {
            // console.log(user);
            return await Message.aggregate([
                {
                    $match : {
                        $or : [
                            {sender : req.user._id, receiver : new mongoose.Types.ObjectId(user._id) },
                            {receiver : req.user._id, sender : new mongoose.Types.ObjectId(user._id) }
                        ]
                    }
                },
                {
                    $sort : {
                        timeStamp : -1
                    }
                }
            ]).limit(1)
        })

        lastMessages = await Promise.all(messagePromise)

        // console.log(lastMessages);

        return res
        .status(200)
        .json(
            new ApiResponse (200,{data : data, lastMessages : lastMessages}, "Chats fetched successfully")
        )
    }
)

const getCurrentUserWishlist = asyncHandler(
    async (req, res) => {
        
        const wishList = await Wish.aggregate([
            {
                $match : {
                    wishedBy : req.user._id
                }
            },
            {
                $lookup : {
                    from : "products",
                    localField : "product",
                    foreignField : "_id",
                    as : "product",
                    pipeline : [
                        {
                            $project : {
                                owner : 0,
                                isFeatured : 0,
                                isAdvertised : 0,
                                createdAt :0,
                                updatedAt : 0,
                                extraImage :0,
                            }
                        }
                    ]
                }
            },
            {
                $sort : {
                    createdAt : -1
                }
            },
            {
                $project : {
                    product:1
                }
            }
        ])

        if (!wishList){
            throw new ApiError(500, "Something went wrong while getting wishList")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(200, wishList, "WishList fetched Successfully")
        )

    }
)

const updateAccountDetails = asyncHandler(
    async(req,res) =>  {
        const {fullName, email, contactNumber} = req.body; //any other fields that user wants to update except the images or videos

        if (!fullName || !email || !contactNumber){
            throw new ApiError(401, "All fields are required (fullname and email)")
        }

        // check if user already exists with this email
        const ExistedUser = await User.findOne({
            email : email
        })

        // console.log(ExistedUser);
        if (ExistedUser && (String(ExistedUser._id) !== String(req.user._id))) {
            if(ExistedUser.email===email ) throw new ApiResponse(409,{}, "User with this email or username already exists");
        }

        await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set : {
                    fullName,
                    email : email, //both are similar
                    contactNumber
                }
            },
            {
                new : true
            }           
            )
        
        const updatedUser = await User.findById(req.user._id).select("-password")

        // console.log(updatedUser);
            return res
            .status(200)
            .json(
                new ApiResponse(
                200,
                updatedUser,
                "Account details updated Succesfully"
            ))
    }
)

const updateUserProfilePicture = asyncHandler(
    async (req,res) => {
        const profilePictureLocalPath =  req.file?.path;
        // console.log(profilePictureLocalPath );
        if(!profilePictureLocalPath){
            throw new ApiError(400, "Profile Picture file is missing")
        }
        
        const profilePicture = await uploadOnCloudinary(profilePictureLocalPath);
        
        if (!profilePicture.url){
            throw new ApiError(400,"Error while uploading profilePicture")
        }
        
        await User.findByIdAndUpdate(
            req?.user._id,
            {
                $set:{
                    profilePicture:profilePicture.url
                }
            },
            {new:true}
        )
        
        deleteFileFromCloudinary(req.user.profilePicture); //delete the old profilePicture

        const user = await User.findById(req.user._id).select("-password")
        
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            user,
            "User ProfilePicture Updated Successfully"
        ))
    }
)

const deleteUser = asyncHandler(
    async(req, res) => {

        const productDeletion = await Product.deleteMany({
            owner : req.user._id
        })

        const wishListDeletion = await Wish.deleteMany({
            wishedBy : req.user._id
        })

        const messageDeletion = await Message.deleteMany({
            $or :[{sender : req.user._id}, {receiver : req.user._id }]
        })

        if (!productDeletion || !wishListDeletion || !messageDeletion){
            throw new ApiError(500, "Something went wrong while deleting user data(products and wishlist)")
        }

        console.log(productDeletion, wishListDeletion, messageDeletion);

        const user = await User.findById(req.user._id);
 
        if (!user) { 
            throw new ApiError(500, "Something went wrong (user not found in database)")
        }

        await deleteFileFromCloudinary(user.profilePicture)

        const userDeletion = await User.findByIdAndDelete(req.user._id)

        if (!userDeletion){
            throw new ApiError(500, "Something went wrong while deleting user profile")
        }

        const options = {
            // httpOnly : true,
            secure : true
        }

        return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json( 
            new ApiResponse(204, {}, "User deleted successfully")
        )
    }
)

export {
    registerUser,
    loginUser,
    logoutUser,
    verifyEmail,
    changePasswordByCode,
    changeCurrentUserPassword,
    getUserById,
    getCurrentUser,
    getCurrentUserChats,
    getCurrentUserWishlist,
    updateAccountDetails,
    updateUserProfilePicture,
    verifyAccessToken,
    verifyRefreshToken,
    deleteUser
}