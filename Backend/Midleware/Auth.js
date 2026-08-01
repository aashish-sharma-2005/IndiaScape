const jwt = require("jsonwebtoken")

function CurrentUser(req,res,next){
    try {
        return res.status(200).json({status:true,user:req.user})
    } catch (error) {
        console.log(error)
        return res.status(500).json({status: false,message: "Server Error"});
    }
}
function UserLogin(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({status: false,message: "Unauthorized"});
        const decoded = jwt.verify(token,process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({status: false,message: "Invalid or expired token"});
    }
}
function AdminOnly(req, res, next) {
    if (req.user.role !== "admin") {
        return res.status(403).json({status: false,message: "Access denied"});
    }

    next();
}
function UserOnly(req, res, next) {
    if (req.user.role !== "user") {
        return res.status(403).json({status: false,message: "Access denied"});
    }
    next();
}
module.exports = {UserLogin,CurrentUser,AdminOnly,UserOnly}