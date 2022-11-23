const mongoose = require('mongoose')
const validator = require('validator');

const userSchema = new mongoose.Schema({

    name : {
        type : String,
        require : [true, "Please Enter Your Name" ],
        maxLength : [30, "hushhh... Name is too long, please short it down"],
        minLength : [3, "tooo short, Please enter correct name"]
    },
    email : {
        type : String,
        require : [true, "Please Enter your Email Id"],
        unique : true,
        validate : [validator.isEmail, "Please Enter Valid Email"]
    },
    password : {
        type : String,
        require : [true, "Please Enter your Password Id"],
        minLength : [6, "Password should be atleast 6 Charater"],
        select : false,
    },
    avatar : {
        public_id : {
            type : String,
            require : true,
        },
        url : {
            type : String,
            require : true,
        }
    },
    role : {
        String : "",
        default : "user",
    },

    resetPasswordToken : String,
    resetPasswordExpire : Date,
})


module.exports = mongoose.model('User', userSchema);