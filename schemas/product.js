var mongoose = require("mongoose")

var Product = new mongoose.Schema({
    productID:String,
    productName:String,
    productPic:String,
    price:Number,
    counts:Number
})

module.exports = Product