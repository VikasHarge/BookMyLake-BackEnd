const app = require('./app');
const dotenv = require("dotenv");

//data base connection import
const connectDataBase = require("./config/database")



//Handling uncaught Exception
process.on("uncaughtException", err=>{
    console.log(`Error : ${err.message}`);

    console.log(`Shutting Server Down due to uncaught Exception`);
    server.close(()=>{
        process.exit();
    })
})


//Connected to config
dotenv.config({path:"./config/config.env"});



// Calling Data Base function to connect
connectDataBase();

//Connect Server to port
const server = app.listen(process.env.PORT, ()=>{
    console.log(`server is running at http:/${process.env.HOST}:${process.env.PORT}`);
})


//Unhandles Promise Rejection
process.on("unhandledRejection" , err=>{
    console.log(`Error : ${err.message}`);
    console.log(`Shutting Server Down due to unhandled Rejection`);

    server.close(()=>{
        process.exit();
    })
})
