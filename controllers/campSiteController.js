//Import Schema
const CampSite = require('../models/campSiteModel');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncError = require('../middleware/catchAsyncError')



// Crate CampSite (admin)
//(creating Schema requires promise)
exports.createCampSite = catchAsyncError(async (req, res, next)=>{

    const newCampSite = await CampSite.create(req.body);

    res.setHeader('Content-type', 'application/json');
    res.status(201).json({
        success : true,
        newCampSite,

    })
})



//to get all camp sites in database
exports.getAllCampsSites = catchAsyncError(async (req, res, next)=>{

    const allCampSites = await CampSite.find();

    
    const campSiteCount = await CampSite.countDocuments();

    res.setHeader('Content-type', 'application/json');
    res.status(200).json({
        success : true,
        allCampSites,
        campSiteCount
    })
})

//To get Single campSite of given Id
exports.getCampSiteById = catchAsyncError(async (req, res, next)=>{
    const campSite = await CampSite.findById(req.params.campSiteId);

    if(!campSite){
        return next(new ErrorHandler('Camp Site Not Found', 404))
    }

    res.setHeader('Content-type', 'application/json');
    res.status(200).json({
        success : true,
        campSite,
    })
})


// to update any camp site from id (admin)
exports.updateCampSite = catchAsyncError(async (req, res, next)=>{

    let campSite = await CampSite.findById(req.params.campSiteId);

    if(!campSite){
        return next(new ErrorHandler('Camp Site Not Found', 404))
    }

    campSite = await CampSite.findByIdAndUpdate(req.params.campSiteId, req.body,{
        new : true,
    })

    res.setHeader('Content-type', 'application/json');
    res.status(200).json({
        success : true,
        campSite,
    })
} )


// to delete any camp site from id (admin)
exports.deleteCampSite = catchAsyncError(async (req, res, next)=>{

    const campSite = await CampSite.findById(req.params.campSiteId);

    if(!campSite){
        return next(new ErrorHandler('Camp Site Not Found', 404))
    }

    // const name = await CampSite.find({},{})
    await campSite.remove()

    res.setHeader('Content-type', 'application/json');
    res.status(200).json({
        success : true,
        massage : `Camp Site deleted Successfully : Name = ${campSite.camp_name}, Id : ${campSite._id}` ,
    })
} 
)