const express = require('express');
const cookieParser = require('cookie-parser')
const cors = require('cors')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const ErrorMiddleware = require('./middleware/error') ;

//express Module
const app = express();
app.use(express.json());

//body parser
app.use(bodyParser.urlencoded({extended : true}));


//CORS
app.use(cors({origin: true, credentials: true,  optionsSuccessStatus: 200}))

//Add Cockie parser
app.use(cookieParser())

//File Upload
app.use(fileUpload());


//import router
const campSiteRouter = require("./routes/campSiteRoute")
const userRouter = require("./routes/userRoute")
const bookingRouter = require("./routes/bookingRoute");

//Redirect to functions
app.use('/campApi/v1/campSites', campSiteRouter);
app.use('/userApi/v1/', userRouter)
app.use('/bookingApi/v1/', bookingRouter)



module.exports = app;



// Middleware to handle Error
app.use(ErrorMiddleware);