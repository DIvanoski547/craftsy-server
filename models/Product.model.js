const {Schema, model} = require("mongoose");

const productSchema = new Schema(
    {
        title: {
            type:String,
            required: [true, 'Title is required.'],
            trim: true,
            maxlength: [50, 'Title cannot exceed 50 characters.']
        },
        description: {
            type:String,
            trim: true,
            maxlength: [500, 'Description cannot be exceed 500 characters.']
        },
        price: {
            type:Number,
            required: true,
            min:[0, 'Price cannot be less than 0.']
        },
        category: {
            type: String,
            enum: {
                values: ['household', 'kitchen', 'car', 'personal', 'engraved'],
                message: '{VALUE} is not valid category'
            },
            required: [true, 'Category is required']
            
        },
        imageUrl: {
            type: String,
            required: [true, 'Image URL is required']
        }
    },
    {
        timestamps: true
    }
);

const Product = model('Product', productSchema)

module.exports = Product;