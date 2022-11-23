const express = require("express");
const {
  getAllCampsSites,
  createCampSite,
  updateCampSite,
  getCampSiteById,
  deleteCampSite,
} = require("../controllers/campSiteController");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");

const router = express.Router();

//To get All camp sites
router.route("/").get(getAllCampsSites);

//To Create NewCampSite
router.route("/newSite").post(isAuthenticatedUser, authorizeRole("admin"), createCampSite);

//To get any CampSite Present in Dasabase by Id
router.route("/:campSiteId").get(getCampSiteById);

//To Update any CampSite Present in Dasabase by Id
router.route("/:campSiteId").put(isAuthenticatedUser, authorizeRole("admin"), updateCampSite);

//To Delete any CampSite Present in Dasabase by Id
router.route("/:campSiteId").delete(isAuthenticatedUser, authorizeRole("admin"), deleteCampSite);


module.exports = router;
