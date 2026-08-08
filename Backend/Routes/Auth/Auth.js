const express = require("express")
const router = express.Router()
const {postSignup,postVerifyOtp,resendOtp} = require("../../Controller/Auth/Signup")
const {postLogin} = require("../../Controller/Auth/Login")

// router.get('/',(req,res)=>{res.redirect('/signup')})
router.post('/signup',postSignup)
router.post('/login',postLogin)
router.post('/verify-otp',postVerifyOtp)
router.post('/resend-otp',resendOtp)
router.post('/logout', (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/"
    });

    return res.status(200).json({
        status: true,
        message: "Logout successful"
    });
});

module.exports = router