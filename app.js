const express = require('express');

//express Module
const app = express();
app.use(express.json());

//Import MiddleWare
const errorMiddleware = require('./middleware/error')



//import router
const campSiteRouter = require("./routes/campSiteRoute")

app.use('/campApi/v1', campSiteRouter);

// Middleware to handle Error
app.use(errorMiddleware);





module.exports = app;
