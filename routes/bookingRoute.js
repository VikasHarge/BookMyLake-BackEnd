const express = require("express");
const { 
    newBooking,
    getSingleBooking,
    myBookings,
    getAllBookings,
    updateBooking,
    deletBooking
} = require("../controllers/bookingController");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");

const router = express.Router();

//Booking Route
router.route("/booking/new").post(isAuthenticatedUser, newBooking);
router.route("/booking/:bookingId").get(isAuthenticatedUser, getSingleBooking);
router.route("/bookings/me").get(isAuthenticatedUser, myBookings);


router.route("/admin/bookings").get(isAuthenticatedUser, authorizeRole("admin"), getAllBookings);
router.route("/admin/bookings/:bookingId").put(isAuthenticatedUser, authorizeRole("admin"), updateBooking);
router.route("/admin/bookings/:bookingId").delete(isAuthenticatedUser, authorizeRole("admin"), deletBooking);



module.exports = router;
