const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail")




//User Schema
const User = require("../models/userModel");

//User Registration
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "sample_id_1",
      url: "samplephoto/1.jpg",
    },
  });

  sendToken(newUser, 201, res);
});

// Login user Controler
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  //Checking if pass and email entered
  if (!password || !email) {
    return next(new ErrorHandler("Please Enter Email or Password", 400));
  }

  //Search for user in dataBase
  const user = await User.findOne({ email: email }).select("+password");

  if (!user) {
    return next(
      new ErrorHandler("Invalid Password or Email, Please Check", 401)
    );
  }

  const isPassMatched = await user.comparePassword(password);

  console.log(isPassMatched);

  if (!isPassMatched) {
    return next(
      new ErrorHandler("Invalid Password or Email, Please Check", 401)
    );
  }

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

//Forgot Password / reset password
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

  const message = `Dear ${user.name}, 
        \n\n Please visit the link to reset your password, \n\n 
        link will expire in 15 minutes \n\n
        Link : ${resetPasswordUrl}, \n\n
        if not reqested by you then please ignore`;



    try {

        //Send Link via Email
        await sendEmail({
            email : user.email,
            subject : "BookMyLake, Password Recovery",
            message,
        })

        res.status(200).json({
            success : true,
            message : `Email send to ${user.email}, Successfully`
        })


        
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave : false});

        return next(new ErrorHandler(error.message, 500));
    }
});
