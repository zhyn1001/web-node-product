var mongoose = require('mongoose')
var userSchema = require('../schemas/user')

var Users = mongoose.model('User', userSchema)

module.exports = Users