const bcrypt = require("bcryptjs")
const Users = require("../../Models/user")
const jwt = require("jsonwebtoken")

const postLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await Users.findOne({ email })
        if (!user) return res.status(404).json({ status: false, message: "User does not exist" })
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) return res.status(401).json({ status: false, message: "Incorrect password" })
        const payload = { userId: user._id, name: user.name, role: user.role }
        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" })
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 1000 * 60 * 60
        })
        const location = user.role==="admin"?"/admin":user.role==="user"?"/dashboard":"/login"
        return res.status(200).json({ status: true,role:user.role, location, message: "Login successful" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: "Server error" })
    }
}

module.exports = { postLogin }