const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const productSchema = new Schema ({
    title: String,
    description: String,
    price: Number,
    materials: [String],
    category: String,
});

module.exports = model('Product', productSchema);