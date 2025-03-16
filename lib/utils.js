import jwt from "jsonwebtoken"
export const generateToken = (userId, res)=>{
    const token = jwt.sign({userId }, process.env.JWT_SECRET,{
        expiresIn :"24h" 
    } )
    res.cookie("jwt",token, {
        maxAge: 24*60*60*100,
        httpOnly: true,
        samSite : "strict",
        secure: process.env.NODE_ENV != "development"
    })
    return token;
}