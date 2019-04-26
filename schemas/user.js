var mongoose = require("mongoose")

var User = new mongoose.Schema({
    username:String,
    password:String,
    publishTime:Date
})

module.exports = User