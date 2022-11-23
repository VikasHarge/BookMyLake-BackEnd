const sendToken = (user, statusCode, res)=>{
    //Get Token
    const token = user.getJWTToken();

    // cookie options
    const options  ={
        expires : new Date(
            Date.now() + process.env.COCKIES_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly : true,
        // secure: true,
        // sameSite: 'lax'
    }

    // Sending cookie
    res.status(statusCode).cookie("token",token,options).json({
        success : true,
        user,
        token,
    })
}


module.exports = sendToken;