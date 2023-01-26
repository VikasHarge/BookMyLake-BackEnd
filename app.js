const express = require('express');
const cookieParser = require('cookie-parser')
const cors = require('cors')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')

//express Module
const app = express();
app.use(express.json());

//Add Cockie parser
app.use(cookieParser())

//CORS
app.use(cors())

//body parser
app.use(bodyParser.urlencoded({extended : true}));

//File Upload
app.use(fileUpload());

//Import MiddleWare
const errorMiddleware = require('./middleware/error')

//import router
const campSiteRouter = require("./routes/campSiteRoute")
const userRouter = require("./routes/userRoute")
const bookingRouter = require("./routes/bookingRoute");

//Redirect to functions
app.use('/campApi/v1/campSites', campSiteRouter);
app.use('/userApi/v1/', userRouter)
app.use('/bookingApi/v1/', bookingRouter)

// Middleware to handle Error
app.use(errorMiddleware);

module.exports = app;
