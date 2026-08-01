const bcrypt = require("bcryptjs")
const Users = require("../../Models/user")
const PendingUser = require("../../Models/PendingUsers")
const sendMail = require("../../mail")

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000)
}

const postSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const existingUser = await Users.findOne({ email })

        if (existingUser) return res.status(409).json({ status: false, message: "Email already exists" })

        const otp = generateOTP().toString()
        const hashedPassword = await bcrypt.hash(password, 10)
        const pendingUser = await PendingUser.findOne({ email })

        if (pendingUser) {
            pendingUser.name = name
            pendingUser.password = hashedPassword
            pendingUser.otp = otp
            pendingUser.otpExpiresAt = Date.now() + 2 * 60 * 1000
            await pendingUser.save()
        } else {
            await PendingUser.create({ name, email, password: hashedPassword, otp, otpExpiresAt: Date.now() + 2 * 60 * 1000 })
        }

        const mailSent = await sendMail(email, otp);
        if (!mailSent) {
            return res.status(500).json({
                status: false,
                message: "OTP could not be sent"
            });
        }

        return res.status(200).json({ status: true, message: "OTP sent successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: "Server error" })
    }
}

const postVerifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body
        const pendingUser = await PendingUser.findOne({ email })

        if (!pendingUser) return res.status(404).json({ status: false, message: "Signup session not found" })

        if (pendingUser.otpExpiresAt < new Date()) {
            await PendingUser.deleteOne({ email })
            return res.status(400).json({ status: false, message: "OTP expired" })
        }

        if (pendingUser.otp !== otp) return res.status(400).json({ status: false, message: "Invalid OTP" })

        await Users.create({ name: pendingUser.name, email: pendingUser.email, password: pendingUser.password })
        await PendingUser.deleteOne({ email })

        return res.status(201).json({ status: true, message: "Signup successful" })
    } catch (error) {
        console.log("OTP Verification Error:", error)
        return res.status(500).json({ status: false, message: "Server error" })
    }
}

const resendOtp = async (req, res) => {
    try {
        const { email } = req.body
        const pendingUser = await PendingUser.findOne({ email })

        if (!pendingUser) return res.status(404).json({ status: false, message: "Signup session not found" })

        const newOtp = generateOTP().toString()
        pendingUser.otp = newOtp
        pendingUser.otpExpiresAt = Date.now() + 2 * 60 * 1000
        await pendingUser.save()

        const mailSent = await sendMail(email, newOtp);
        if (!mailSent) {
            return res.status(500).json({
                status: false,
                message: "OTP could not be sent"
            });
        }

        return res.status(200).json({ status: true, message: "New OTP sent successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: "Server error" })
    }
}

module.exports = { postSignup, postVerifyOtp, resendOtp }