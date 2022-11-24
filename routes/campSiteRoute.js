const express = require("express");
const {
  getAllCampsSites,
  createCampSite,
  updateCampSite,
  getCampSiteById,
  deleteCampSite,
  createCampsiteReview,
  getCampsiteReviews,
  deleteReview,
  newFunc,

} = require("../controllers/campSiteController");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");

const router = express.Router();

//To get All camp sites
router.route("/").get(getAllCampsSites);

//To Create NewCampSite
router.route("/admin/newSite").post(isAuthenticatedUser, authorizeRole("admin"), createCampSite);

//To get any CampSite Present in Dasabase by Id
router.route("/:campSiteId").get(getCampSiteById);

//To Update any CampSite Present in Dasabase by Id
router.route("/admin/:campSiteId").put(isAuthenticatedUser, authorizeRole("admin"), updateCampSite);

//To Delete any CampSite Present in Dasabase by Id
router.route("/admin/:campSiteId").delete(isAuthenticatedUser, authorizeRole("admin"), deleteCampSite);

//Create Camp Site Review
router.route("/review").put(isAuthenticatedUser, createCampsiteReview)

//View Camp Site Reviews
router.route("/reviews/all").get(getCampsiteReviews)

//Delete Camp Site Reviews
router.route("/reviews/delete").delete(isAuthenticatedUser, authorizeRole("admin"), deleteReview)

module.exports = router;
