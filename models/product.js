var mongoose = require('mongoose')
var productSchema = require('../schemas/product')

var Products = mongoose.model('product', productSchema)

module.exports = Products