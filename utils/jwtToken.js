const sendToken = (user, statusCode, res)=>{
    //Get Token
    const token = user.getJWTToken();

    console.log('token is', token);

    // cookie options
    const options  ={
        expires : new Date(
            Date.now() + process.env.COCKIES_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly : true,
        withCredentials: true,
        secure: true,
        // sameSite: 'lax'
    }

    // Sending cookie
    res.status(statusCode).cookie("pawnaToken",token,options).json({
        success : true,
        user,
        token,
    })

}


module.exports = sendToken;