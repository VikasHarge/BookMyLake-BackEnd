 const mongoose = require('mongoose')

 const bookingModel  = new mongoose.Schema({

    campSite : {
        type : mongoose.Schema.ObjectId,
        ref : "CampSite",
        required : true,
    },
    user : {
        type : mongoose.Schema.ObjectId,
        ref : "User",
        required : true,
    },
    numOfAdult : {
        type : Number,
        required : true,
        default : 0,
    },
    numOfChildrens : {
        type : Number,
        required : true,
        default : 0,
    },
    bookOn : {
        type : Date,
        default : Date.now(),
        required : true,
    },
    bookingDate : {
        type : Date,
        required : true,
        default : Date.now() + 20*60*60*60*1000
    },
    packagePrice : {
        type : Number,
        required : true,
        default : 0,
    },
    paymentInfo : {
        id : {
            type : String,
            required : true,
        },
        status : {
            type : String,
            required : true,
            default : "processing"
        }
    },
    bookingStatus : {
        type : String,
        required : true,
        default : "Processing"
    },
    completedOn : Date,
 })

 module.exports = mongoose.model("Booking", bookingModel);