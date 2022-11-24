//Import Schema
const CampSite = require("../models/campSiteModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");

// Crate CampSite (admin)
//(creating Schema requires promise)
exports.createCampSite = catchAsyncError(async (req, res, next) => {
  //sending id of user who is creating camsite
  req.body.user = req.user.id;

  const newCampSite = await CampSite.create(req.body);

  res.setHeader("Content-type", "application/json");
  res.status(201).json({
    success: true,
    newCampSite,
  });
});

//to get all camp sites in database
exports.getAllCampsSites = catchAsyncError(async (req, res, next) => {
  const allCampSites = await CampSite.find();

  const campSiteCount = await CampSite.countDocuments();

  res.setHeader("Content-type", "application/json");
  res.status(200).json({
    success: true,
    allCampSites,
    campSiteCount,
  });
});

//To get Single campSite of given Id
exports.getCampSiteById = catchAsyncError(async (req, res, next) => {
  const campSite = await CampSite.findById(req.params.campSiteId);

  if (!campSite) {
    return next(new ErrorHandler("Camp Site Not Found", 404));
  }

  res.setHeader("Content-type", "application/json");
  res.status(200).json({
    success: true,
    campSite,
  });
});

// to update any camp site from id (admin)
exports.updateCampSite = catchAsyncError(async (req, res, next) => {
  let campSite = await CampSite.findById(req.params.campSiteId);

  if (!campSite) {
    return next(new ErrorHandler("Camp Site Not Found", 404));
  }

  campSite = await CampSite.findByIdAndUpdate(req.params.campSiteId, req.body, {
    new: true,
  });

  res.setHeader("Content-type", "application/json");
  res.status(200).json({
    success: true,
    campSite,
  });
});

// to delete any camp site from id (admin)
exports.deleteCampSite = catchAsyncError(async (req, res, next) => {
  const campSite = await CampSite.findById(req.params.campSiteId);

  if (!campSite) {
    return next(new ErrorHandler("Camp Site Not Found", 404));
  }

  // const name = await CampSite.find({},{})
  await campSite.remove();

  res.setHeader("Content-type", "application/json");
  res.status(200).json({
    success: true,
    massage: `Camp Site deleted Successfully : Name = ${campSite.camp_name}, Id : ${campSite._id}`,
  });
});

// Create new review or update the review
exports.createCampsiteReview = async (req, res, next) => {
  const { rating, comment, campSiteId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment: comment,
  };

  const campSite = await CampSite.findById(campSiteId);

  const isReviewed = campSite.reviews.find((rev) => {
    return rev.user.toString() === req.user._id.toString();
  });

  if (isReviewed) {
    campSite.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        (rev.rating = rating), (rev.comment = comment);
      }
    });
  } else {
    campSite.reviews.push(review);
    campSite.numOfReviews = campSite.reviews.length;
  }

  let total = 0;

  campSite.reviews.forEach((rev) => {
    total = total + rev.rating;
  });

  campSite.ratings = total / campSite.reviews.length;

  await campSite.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
};


//Get All reviews of Camp Site
exports.getCampsiteReviews = async(req, res, next)=>{

    const campSite = await CampSite.findById(req.query.campid);

    if(!campSite){
        return next(new ErrorHandler("Campsite Not found",400));
    }

    res.status(200).json({
        success : true,
        reviews : campSite.reviews
    })
}



//Delete any review
exports.deleteReview = catchAsyncError(async(req, res, next)=>{
    const campSite = await CampSite.findById(req.query.campid);

    if(!campSite){
        return next(new ErrorHandler("Campsite Not found",400));
    }

    const reviews = campSite.reviews.filter(
        (rev)=> rev._id.toString() !== req.query.id.toString() )



    let total = 0;

    reviews.forEach((rev) => {
        total = total + rev.rating;
    });

    const ratings = total / reviews.length;
    const numOfReviews = reviews.length

    //Update with remaining reviews
    await CampSite.findByIdAndUpdate(req.query.campid, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new : true,
        runValidators : true,
    })

    res.status(200).json({
        success : true,
    })

})