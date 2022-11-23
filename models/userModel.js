const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Please Enter Your Name"],
    maxLength: [30, "hushhh... Name is too long, please short it down"],
    minLength: [3, "tooo short, Please enter correct name"],
  },
  email: {
    type: String,
    require: [true, "Please Enter your Email Id"],
    unique: [true, "Email already registered"],
    validate: [validator.isEmail, "Please Enter Valid Email"],
  },
  password: {
    type: String,
    require: [true, "Please Enter your Password Id"],
    minLength: [6, "Password should be atleast 6 Charater"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      require: true,
    },
    url: {
      type: String,
      require: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

//Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 12);
});

//JWT Generator Methode
//To Save in cookies
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id : this._id }, process.env.JWT_SECRET, {
    expiresIn : process.env.JWT_EXPIRE,
  });
};

//Password Comparing Methode
userSchema.methods.comparePassword = async function(incomingPassord){
    return await bcrypt.compare(incomingPassord, this.password);
}

//Generating password reset token
//Using Crypto
userSchema.methods.getUserPasswordResetToken = function(){

    // Generating Crypto
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hashing and adding to user schema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15*60*1000;

    return resetToken;

}

module.exports = mongoose.model("User", userSchema);
