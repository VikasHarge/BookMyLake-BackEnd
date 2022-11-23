const express = require('express');

const { registerUser, loginUser, logoutUser } = require('../controllers/userController')



const router = express.Router();



//Route to create new user
router.route("/register").post(registerUser);

//Login Route
router.route("/login").post(loginUser);

//Logout Route
router.route("/logout").get(logoutUser)


  








module.exports = router;