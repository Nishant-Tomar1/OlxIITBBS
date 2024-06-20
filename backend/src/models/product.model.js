import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema({
	title: {
		type: String,
		required: [true, "product name is required"],
		trim: true,
	},
	description: {
		type: String,
		required: [true, "product description is required"],
	},
	price: {
		type: Number,
		required: [true, "Product price is required"],
	},
	category: {
		type: String,
		enum: ['Vehicles', 'Electronics and Appliances', 'Home and Furniture', 'Fashion and Beauty', 'Sports and Hobbies', 'Stationary'],
		required: [true,"Product categaory is required"],
	},
	ageInMonths : {
		type : Number,
		required : [true,"Product age is required"]
	},
	thumbNail : {
		type : String,
		required : [true, "Atleast One image is required"],
	},
	extraImage : {
		type : String,
		// default : "",
	},
	owner : {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [true, "Owner is not provided"],
	},
	// wish : [
	// 	{
	// 		type: Schema.Types.ObjectId,
	// 		ref : "Wish"
	// 	}
	// ],
	ratings: [
        {
            type : Schema.Types.ObjectId,
			ref : "Rating"
        },
    ],
    reviews: [
        {
            type : Schema.Types.ObjectId, 
			ref : "Review"
        },
    ],
	status: {
		type: String,
		enum: ['active', 'sold'],
		default: 'active',
	}
},{timestamps : true});

export const Product =  mongoose.model('Product', productSchema);
