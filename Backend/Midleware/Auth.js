const jwt = require("jsonwebtoken");
const User = require("../Models/user");

// =====================================================
// GET CURRENT USER
// =====================================================

async function CurrentUser(req, res) {
    try {
        const user = await User.findById(
            req.user.userId
        ).select(
            "_id name email role status visitedStates favoritePlaces"
        );

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found",
            });
        }

        // =========================================
        // CHECK IF USER IS BLOCKED
        // =========================================

        if (user.status === "blocked") {
            res.clearCookie("token", {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
            });

            return res.status(403).json({
                status: false,
                message:
                    "Your account has been blocked by the administrator.",
            });
        }

        return res.status(200).json({
            status: true,
            user,
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            status: false,
            message: "Server Error",
        });
    }
}


// =====================================================
// AUTH MIDDLEWARE
// =====================================================

async function UserLogin(req, res, next) {
    try {
        const token = req.cookies.token;

        // =========================================
        // NO TOKEN
        // =========================================

        if (!token) {
            return res.status(401).json({
                status: false,
                message: "Unauthorized",
            });
        }

        // =========================================
        // VERIFY JWT
        // =========================================

        const decoded = jwt.verify(
            token,
            process.env.SECRET_KEY
        );

        req.user = decoded;

        // =========================================
        // CHECK CURRENT USER FROM DATABASE
        // =========================================

        const user = await User.findById(
            decoded.userId
        ).select(
            "_id name email role status"
        );

        if (!user) {
            res.clearCookie("token", {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
            });

            return res.status(401).json({
                status: false,
                message: "User not found",
            });
        }

        // =========================================
        // IMPORTANT:
        // CHECK BLOCKED STATUS
        // =========================================

        if (user.status === "blocked") {
            console.log(
                "Blocked user attempted authenticated request:",
                user.email
            );

            // Remove JWT cookie
            res.clearCookie("token", {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
            });

            return res.status(403).json({
                status: false,
                message:
                    "Your account has been blocked by the administrator.",
            });
        }

        // =========================================
        // USER IS ACTIVE
        // =========================================

        next();

    } catch (error) {
        console.log(error);

        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        return res.status(401).json({
            status: false,
            message: "Invalid or expired token",
        });
    }
}


// =====================================================
// ADMIN ONLY
// =====================================================

function AdminOnly(req, res, next) {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            status: false,
            message: "Access denied",
        });
    }

    next();
}


// =====================================================
// USER ONLY
// =====================================================

function UserOnly(req, res, next) {
    if (req.user.role !== "user") {
        return res.status(403).json({
            status: false,
            message: "Access denied",
        });
    }

    next();
}


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    UserLogin,
    CurrentUser,
    AdminOnly,
    UserOnly,
};