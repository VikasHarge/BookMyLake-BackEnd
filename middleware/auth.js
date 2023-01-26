const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require('jsonwebtoken');
const User = require("../models/userModel");


exports.isAuthenticatedUser = catchAsyncError( async(req, res, next)=>{

    const { token } = req.cookies;

    if(!token){
        return next(new ErrorHandler("Please Login to access this resourse", 401));
    }

    const decoadedData = jwt.verify(token, process.env.JWT_SECRET);

    //saving user in req.user to use further
    req.user = await User.findById(decoadedData.id)

    next();

})


//To check Role
exports.authorizeRole = (...roles)=>{

    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){

            return next(new ErrorHandler(`Role : ${req.user.role} is not allowed to access the resource`, 400))
        }
        next();
    }
}