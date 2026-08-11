const bcrypt = require("bcryptjs");
const Users = require("../../Models/user");
const jwt = require("jsonwebtoken");
const { getSocketIO } = require("../../Config/socket");

const postLogin = async (req, res) => {
    try {

        const { email, password } = req.body;

        // ========================================
        // FIND USER
        // ========================================

        const user = await Users.findOne({ email });

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User does not exist",
            });
        }

        // ========================================
        // CHECK IF USER IS BLOCKED
        // ========================================

        if (user.status === "blocked") {
            return res.status(403).json({
                status: false,
                message:
                    "Your account has been blocked by the administrator.",
            });
        }

        // ========================================
        // CHECK PASSWORD
        // ========================================

        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                status: false,
                message: "Incorrect password",
            });
        }

        // ========================================
        // UPDATE LAST LOGIN
        // ========================================

        user.lastLogin = new Date();

        await user.save();

        // ========================================
        // CREATE JWT
        // ========================================

        const payload = {
            userId: user._id,
            name: user.name,
            role: user.role,
        };

        const token = jwt.sign(
            payload,
            process.env.SECRET_KEY,
            {
                expiresIn: "1h",
            }
        );

        // ========================================
        // COOKIE
        // ========================================

        res.cookie(
            "token",
            token,
            {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 1000 * 60 * 60,
            }
        );

        // ========================================
        // REAL-TIME LOGIN EVENT
        // ========================================

        try {

            const io = getSocketIO();

            io.emit(
                "userLoggedIn",
                {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                    lastLogin: user.lastLogin,
                    visitedStates:
                        user.visitedStates || [],
                    favoritePlaces:
                        user.favoritePlaces || [],
                }
            );

            console.log(
                "Socket → userLoggedIn:",
                user.email
            );

        } catch (socketError) {

            console.log(
                "Socket login event error:",
                socketError.message
            );

        }

        // ========================================
        // REDIRECT LOCATION
        // ========================================

        const location =
            user.role === "admin"
                ? "/admin"
                : user.role === "user"
                    ? "/dashboard"
                    : "/login";

        // ========================================
        // RESPONSE
        // ========================================

        return res.status(200).json({
            status: true,
            role: user.role,
            location,
            message: "Login successful",
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            status: false,
            message: "Server error",
        });

    }
};

module.exports = {
    postLogin,
};