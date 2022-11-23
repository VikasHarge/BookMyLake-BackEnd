const ErrorHandler = require("../utils/errorhandler");

module.exports = (err, req, res, next)=>{
    
    err.message = err.message || "Camp Site Not Found"
    err.statusCode = err.statusCode || 500;

    // Cast Error Handle
    if(err.name === 'CastError'){
        const message = `Resource not found, ${err.path}`;
        err = new ErrorHandler(message, 400)
    }


    res.status(err.statusCode).json({
        success : false,
        error : err
    })

}