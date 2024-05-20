const {Schema, model} = require("mongoose");

const productSchema = new Schema(
    {
        title: {
            type:String,
        },
        description: {
            type:String
        },
        price: {
            type:String
        }
    },
    {
        timestamps: true
    }
);

const Product = model('Product', productSchema)

module.exports = Product;