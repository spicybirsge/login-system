require("dotenv").config()
require("./database/connector")()
const express = require("express")
const app = express()
const logger = require('morgan');
const cors = require('cors');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(cors());
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const idgen = require("idgen")
const users = require("./database/schemas/users")

app.post("/register", async(req, res) => {
    const {username, password} = req.body;

    if(!username || !password) {
        return res.status(400).json({success: false, message: "Username and password is required", code: 400})
    }

    const isUserNameTaken = await users.findOne({username: username})
    if(isUserNameTaken) {
        return res.status(400).json({success: false, message: "Username is already in use", code: 400})
    }

    //generating a salt
    const salt = bcrypt.genSaltSync(10)
    
    //hashing the password
    const hashedPass = bcrypt.hashSync(password, salt)

    const ID = idgen(11)

    await users.create({
        _id: ID,
        username: username,
        password: hashedPass
    })

    const token = jwt.sign({_id: ID}, process.env.JWT_SECRET)

    return res.status(200).json({success: true, message: "Successfully created account", token})
})


app.post('/login', async(req, res) => {
    const {username, password} = req.body;

    if(!username || !password) {
        return res.status(400).json({success: false, message: "Username and password is required", code: 400})
    }

    const user = await users.findOne({username: username})
    if(!user) {
        return res.status(400).json({success: false, message: "Username or password is invalid", code: 400})
    }

    //comparing plain text password with the database hash
    const isPasswordCorrect = bcrypt.compareSync(password, user.password)

    if(!isPasswordCorrect) {
        return res.status(400).json({success: false, message: "Username or password is invalid", code: 400})
    }

    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)

    return res.status(200).json({success: true, message: "Successfully logged in", token})


})

app.post('/get-user', async(req, res) => {
    const token = req.header("token")
    if(!token) {
        return res.status(400).json({success: false, message: "token is invalid or expired.", code: 400})
    }

    try {
    const UserID = jwt.verify(token, process.env.JWT_SECRET)
    const getUserDataById = await users.findOne({_id: UserID._id}).select('-password')
    if(!getUserDataById) {
        return res.status(400).json({success: false, message: "token is invalid or expired.", code: 400})  
    }

    return res.status(200).json({success: true, message: 'Token successfully validated', data: getUserDataById, code: 200})


} catch(e) {
    return res.status(400).json({success: false, message: "token is invalid or expired.", code: 400})
}

})




const PORT = process.env.PORT || 7030

app.listen(PORT, () => {
    console.log(`[^] Server started on PORT: ${PORT}`)
})