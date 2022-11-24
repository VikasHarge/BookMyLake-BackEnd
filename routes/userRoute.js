const express = require("express");

const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateUserDetails,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser
} = require("../controllers/userController");

const  { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");






const router = express.Router();



//Route to create new user
router.route("/register").post(registerUser);

//Login Route
router.route("/login").post(loginUser);

//Forget Pass Route
router.route("/password/forgot").post(forgotPassword);

//Reset Pass Route
router.route("/password/reset/:resetToken").put(resetPassword);

//update Pass Route
router.route("/password/update").put(isAuthenticatedUser, updatePassword);

//update Pass Route
router.route("/me/update").put(isAuthenticatedUser, updateUserDetails);

//Logout Route
router.route("/logout").get(logoutUser);

//Get current user Details
router.route("/me").get(isAuthenticatedUser, getUserDetails);
;


//For Admin
//get all users
router.route("/admin/allUsers").get(isAuthenticatedUser, authorizeRole("admin"), getAllUsers)

//get Single users
router.route("/admin/user/:id").get(isAuthenticatedUser, authorizeRole("admin"), getSingleUser)

//Update user Role
router.route("/admin/user/:id").put(isAuthenticatedUser, authorizeRole("admin"), updateUserRole)

//Delete user
router.route("/admin/user/:id").delete(isAuthenticatedUser, authorizeRole("admin"), deleteUser)



module.exports = router;
