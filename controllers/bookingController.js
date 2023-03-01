//Import Schema
const Booking = require("../models/bookingModel");
const CampSite = require("../models/campSiteModel");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorhandler");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const catchAsyncError = require('../middleware/catchAsyncError.js')




//Creating New Booking
exports.newBooking =  catchAsyncError( async(req, res, next)=>{

    const {
        campSite,
        numOfAdults,
        numOfChildrens,
        bookingDate,
        paymentInfo,
        bookingStatus,
        packagePrice
    } = req.body

    const booking = await Booking.create({
        campSite,
        user : req.user.id,
        numOfAdults,
        numOfChildrens,
        bookingDate,
        bookOn : Date.now(),
        paymentInfo,
        bookingStatus,
        packagePrice
    })

    const camp = await CampSite.findById(campSite)

    camp.total_bookings += 1;

    await booking.save({
        validateBeforeSave : false
    })
    
    await camp.save({
        validateBeforeSave : false
    })

    res.status(201).json({
        success : true,
        booking,
        message: "Booked Succesfully"
    })
})

//Get Single Booking 
exports.getSingleBooking = catchAsyncError(async(req, res, next)=>{

    const booking = await Booking.findById(req.params.bookingId).populate("user","name email")

    if(!booking){
        return next(new ErrorHandler("Booking not found", 404));
    }

    res.status(200).json({
        success : true,
        booking
    })
})

//Get loggedin user bookings
exports.myBookings = catchAsyncError(async(req, res, next)=>{

    const bookings = await Booking.find({ user : req.user._id})

    res.status(200).json({
        success : true,
        bookings
    })
})

//Get all bookings -- admin
exports.getAllBookings = async(req, res, next)=>{

    const bookings = await Booking.find();

    let totalAmount = 0;

    bookings.forEach((booking, index)=>{
        totalAmount += booking.packagePrice
    })

    res.status(200).json({
        success : true,
        bookings,
        totalAmount
    })
}

//Update Booking status -- admin
exports.updateBooking = catchAsyncError(async(req, res, next)=>{

    const booking = await Booking.findById(req.params.bookingId)

    if(!booking){
        return next(new ErrorHandler("Booking not found", 404));
    }

    if(booking.bookingStatus === "Completed"){
        return next(new ErrorHandler("Camping is already completed", 404))
    }

    //to update number of adults
    // booking.numOfAdult = req.body.numOfAdult
    // booking.numOfChildrens = req.body.numOfChildrens

    //To Change status
    booking.bookingStatus = req.body.status

    if(req.body.status === "Completed"){
        booking.completedOn = Date.now()
    }

    await booking.save({
        validateBeforeSave : false,
    })

    res.status(200).json({
        success : true,
    })
    
})


//Delete Booking -- admin
exports.deletBooking = catchAsyncError( async (req, res, next)=>{
    const booking = await Booking.findById(req.params.bookingId)

    if(!booking){
        return next(new ErrorHandler("Booking not found", 404));
    }

    await booking.remove();

    res.status(200).json({
        success : true,
    })
})
