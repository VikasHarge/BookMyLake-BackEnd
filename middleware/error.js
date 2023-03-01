
const ErrorMiddleware = (err, req, res, next)=>{

    console.log(err.message);
    
    err.message = err.message || "Enternal Server Error"
    err.statusCode = err.statusCode || 500;

    // Cast Error Handle
    if(err.name === 'CastError'){
        const message = `Resource not found, ${err.path}`;
        err = new ErrorHandler(message, 400)
    }


    res.status(err.statusCode).json({
        success : false,
        message : err.message
    })

}

module.exports =   ErrorMiddleware;