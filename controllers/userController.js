const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require('cloudinary')



//User Schema
const User = require("../models/userModel");

//User Registration
exports.registerUser = catchAsyncError(async (req, res, next) => {

  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,
    {
      folder : "avatars",
      width : 150,
      crop : "scale",
    })

  const { name, email, password, phone } = req.body;

  const user = await User.findOne({ email: email })

  if(user){
    return next(new ErrorHandler("Email Id already registered", 400))
  }

  const newUser = await User.create({
    name,
    email,
    password,
    phone,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  sendToken(newUser, 201, res);
});

// Login user Controller
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;


  //Checking if pass and email entered
  if (!password || !email) {
    return next(new ErrorHandler('Please Enter Email or Password', 401));
  }

  //Search for user in dataBase
  const user = await User.findOne({ email: email }).select("+password");

  if (!user) {
    return next(
      new ErrorHandler("Invalid Password or Email, Please Check", 401)
    );
  }

  const isPassMatched = await user.comparePassword(password);

  if (!isPassMatched) {
    return next(
      new ErrorHandler("Invalid Password or Email, Please Check", 401)
    );
  }

  //by default reset pass token is undifened
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save()

  sendToken(user, 200, res);
});

//Logout Funtion
exports.logoutUser = catchAsyncError(async (req, res, next) => {


  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out Successfully",
  });
});

//Forgot Password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  //if found get reset password token
  const resetToken = user.getUserPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/userApi/v1/password/reset/${resetToken}`;

  let mailMessage = `Dear ${user.name}, 
        \n Please visit the link to reset your password, \n
        link will expire in 15 minutes \n
        Link : ${resetPasswordUrl}, \n\n
        if not reqested by you then please ignore`;

  try {z
    //Send Link via Email
    await sendEmail({
      email: user.email,
      subject: "BookMyLake, Password Recovery",
      mailMessage: mailMessage,
    });

    res.status(200).json({
      success: true,
      message: `Email send to ${user.email}, Successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset password
exports.resetPassword = catchAsyncError(async (req, res, next) => {

  //Creating Token Hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex")

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire : {$gt : Date.now()}
  });

  if(!user){
    return next(new ErrorHandler("Reset Password Token is invalid or has been expired", 400))
  }

  if(req.body.password != req.body.confirmPassword){
    return next(new ErrorHandler("Password does not match with confirm password",400))
  }

  //Update password and save user with new password and send token in cookies

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res)


});

//Get User Details
exports.getUserDetails = catchAsyncError( async(req, res, next)=>{

  const user = await User.findById(req.user.id);

  res.status(200).json({
    success : true,
    user,
  })

})

//Update Password
exports.updatePassword = catchAsyncError( async (req, res, next)=>{

  const user = await User.findById(req.user.id).select("+password");

  const isPassMatched = await user.comparePassword(req.body.oldPassword);

  if(!isPassMatched){
    return next(new ErrorHandler("Old Password is Incorrect", 400))
  }

  if(req.body.newPassword != req.body.confirmPassword){
    return next(new ErrorHandler("Password does not match with confirm password"))
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);

})


//Update User Details
exports.updateUserDetails = catchAsyncError( async (req, res, next)=>{

  const newUser = {
    name : req.body.name,
    email : req.body.email,
    phone : req.body.phone,
    //add avatar from cloudinary
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUser, {
    new : true,
  })

  res.status(200).json({
    success : true,
    user,
  })

})



//Admin
//Get All Users
exports.getAllUsers = catchAsyncError( async (req, res, next)=>{
  const allUsers = await User.find();

  const userCount = await User.countDocuments();

  res.setHeader('Content-type', 'application/json');
  res.status(200).json({
      success : true,
      allUsers,
      userCount
  })
})

//Get Single User (admin)
exports.getSingleUser = catchAsyncError( async(req, res, next)=>{

  const user = await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHandler(`User Not Exit with id ${req.params.id}`,400))
  }

  res.setHeader('Content-type', 'application/json');
  res.status(200).json({
      success : true,
      user,
  })

})

//Update User Role
exports.updateUserRole = catchAsyncError( async (req, res, next)=>{

  const newUser = {
    role : req.body.role,
  }

  const user = await User.findByIdAndUpdate(req.params.id, newUser, {
    new : true,
  })

  res.status(200).json({
    success : true,
    user,
  })

})



//Delete User Role
exports.deleteUser = catchAsyncError( async (req, res, next)=>{

  const user = await User.findById(req.params.id);

  if(!user){
    return next( new ErrorHandler(`User Not found with Id ${req.params.id}`, 400))
  }

  await user.remove();

  res.status(200).json({
    success : true, 
    message : "User Deleted Successfully",
    user,
  })

})
