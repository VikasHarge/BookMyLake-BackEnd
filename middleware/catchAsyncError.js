module.exports = (passFun)=> (req, res, next)=>{

    Promise.resolve(passFun(req, res, next)).catch(next);

}