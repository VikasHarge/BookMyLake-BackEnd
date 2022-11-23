const express = require("express");
const {
  getAllCampsSites,
  createCampSite,
  updateCampSite,
  getCampSiteById,
  deleteCampSite,
} = require("../controllers/campSiteController");

const router = express.Router();

//To get All camp sites
router.route("/campSites").get(getAllCampsSites);

//To Create NewCampSite
router.route("/campSites/newSite").post(createCampSite);

//To get any CampSite Present in Dasabase by Id
router.route("/campSites/:campSiteId").get(getCampSiteById);

//To Update any CampSite Present in Dasabase by Id
router.route("/campSites/:campSiteId").put(updateCampSite);

//To Delete any CampSite Present in Dasabase by Id
router.route("/campSites/:campSiteId").delete(deleteCampSite);




module.exports = router;
