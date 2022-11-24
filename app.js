const express = require('express');
const cookieParser = require('cookie-parser');

//express Module
const app = express();
app.use(express.json());


//Add Cockie parser
app.use(cookieParser())

 

//Import MiddleWare
const errorMiddleware = require('./middleware/error')



//import router
const campSiteRouter = require("./routes/campSiteRoute")
const userRouter = require("./routes/userRoute")


//Redirect to functions
app.use('/campApi/v1/campSites', campSiteRouter);
app.use('/userApi/v1/', userRouter)



// Middleware to handle Error
app.use(errorMiddleware);





module.exports = app;
