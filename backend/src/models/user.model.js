import mongoose, {Schema} from 'mongoose'

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        lowercase:true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    fullName : {
        type : String,
        required : true,
        trim : true,
        index : true
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String, //cloudinary
        default: '',
    },
    phoneNumber: {
        type: String,
        default: '',
    },
    productsAdded : [
        {
            type : Schema.Types.ObjectId,
            ref : "Product"
        }
    ],
    cart : [
        {
            type : Schema.Types.ObjectId,
            ref : "Product"
        }
    ],
    ratings: [
        {
            type: Number,
            min: 1,
            max: 5,
        },
    ],
    reviews: [
        {
            reviewer: { type: Schema.Types.ObjectId, ref: 'User' },
            review: String,
        },
    ],
    refreshToken : {
        type : String,
    }
},{timestamps:true});

//password encryption
userSchema.pre("save", async function (next) {
    
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next();    
});

//checkpasswordforcorrect by defining custom methods
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
}

//generating access token
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id,  //more payload in case of accesstoken
            email : this.email, 
            username : this.username,
            fullName : this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
};

//generating refresh token
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id, //lesser payload in case of refreshtoken
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
};

module.exports = mongoose.model('User', userSchema);
