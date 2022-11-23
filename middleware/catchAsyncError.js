module.exports = asyncErrFunc =>(req, res, next)=>{

    Promise.resolve(asyncErrFunc(req, res, next)).catch(next);

}