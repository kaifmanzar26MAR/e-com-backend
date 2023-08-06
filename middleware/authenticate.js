const jwt=require('jsonwebtoken');
const User=require('../models/userSchema');
const cookieParser =require('cookie-parser');
require('dotenv');
const Authenticate=async (req,res,next)=>{
    console.log("authenticate called form authenticate");
    try {
        const token=req.cookies.jwtoken;
        console.log("token "+token);
        const verifyToken=jwt.verify(token,process.env.SECRET_KEY);
        console.log("verify token "+verifyToken);
        const rootUser=await User.findOne({_id:verifyToken._id, "tokens.token":token});
        console.log("rootuser "+rootUser);
        if(!rootUser){throw new Error("User not Found")}
        req.token=token;
        req.rootUser=rootUser;
        req.userID=rootUser._id;
        next();
    } catch (error) {
        res.status(401).send('Unauthorized:No token provided');
        console.log(error);
    }
}
module.exports=Authenticate;