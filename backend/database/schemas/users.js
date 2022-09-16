const mongoose = require("mongoose")

const users = mongoose.Schema({
    _id: String, 
    username: String,
    password: String
})

module.exports = mongoose.model('Users', users)