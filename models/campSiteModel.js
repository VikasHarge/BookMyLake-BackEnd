 const mongoose = require('mongoose');

 const campSiteSchema = new mongoose.Schema({

    camp_name : {
        type : String,
        required : [true, "please Enter CampSite Name"],
        trim : true,
    },
    description : {
        type : String,
        required : [true, "please Enter CampSite Description"],
    },
    max_price : {
        type : Number,
        required : [true, "please Enter CampSite Max Price"],
        maxLength : [4, "Too expensive, Please reduce prise"],
    },
    sale_price : {
        type : Number,
        required : [true, "please Enter CampSite sale Price"],
        maxLength : [4, "Too expensive, Please reduce prise"],
    },
    ratings : {
        type : Number,
        default : 0,
    },
    total_bookings : {
        type : Number,
        default : 0,
    },
    tags : [String],
    images : [
        {
            public_id : {
                type : String,
                required : true,
            },
            url : {
                type : String,
                required : true,
            },
        },
    ],
    status : {
        type : String,
        required : [true, "Please set camp Status"], 
        default : "active",  
    },
    reviews : [
        {
            user : {
                type : mongoose.Schema.ObjectId,
                ref : "User",
                required : true
            },
            name : {
                type : String,
                required : true, 
            },
            rating : {
                type : Number,
                required : true,
            },
            comment : {
                type : String,
                required : true,
            }   
        }
    ],
    numOfReviews : {
        type : Number,
        default : 0,
    },
    createdAt : {
        type : Date,
        default : Date.now,
    }
 },
 {
    timestamps : true,
});

module.exports = mongoose.model('CampSite', campSiteSchema);