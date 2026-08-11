const jwt = require("jsonwebtoken");
const User = require("../Models/user");

// =====================================================
// COOKIE OPTIONS
// =====================================================

const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
};

// =====================================================
// GET CURRENT USER
// =====================================================

async function CurrentUser(req, res) {

    try {

        // =========================================
        // IMPORTANT
        // NEVER CACHE CURRENT USER
        // =========================================

        res.set(
            "Cache-Control",
            "no-store, no-cache, must-revalidate, private"
        );

        res.set(
            "Pragma",
            "no-cache"
        );

        res.set(
            "Expires",
            "0"
        );

        const user = await User.findById(
            req.user.userId
        ).select(
            "_id name email role status visitedStates favoritePlaces"
        );

        // =========================================
        // USER NOT FOUND
        // =========================================

        if (!user) {

            return res.status(404).json({
                status: false,
                message: "User not found",
            });

        }

        // =========================================
        // CHECK BLOCKED
        // =========================================

        if (user.status === "blocked") {

            res.clearCookie(
                "token",
                cookieOptions
            );

            return res.status(403).json({
                status: false,
                message:
                    "Your account has been blocked by the administrator.",
            });

        }

        // =========================================
        // CURRENT USER
        // =========================================

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
        // CHECK USER
        // =========================================

        const user = await User.findById(
            decoded.userId
        ).select(
            "_id name email role status"
        );

        // =========================================
        // USER NOT FOUND
        // =========================================

        if (!user) {

            res.clearCookie(
                "token",
                cookieOptions
            );

            return res.status(401).json({
                status: false,
                message: "User not found",
            });

        }

        // =========================================
        // BLOCKED USER
        // =========================================

        if (user.status === "blocked") {

            console.log(
                "Blocked user attempted authenticated request:",
                user.email
            );

            res.clearCookie(
                "token",
                cookieOptions
            );

            return res.status(403).json({
                status: false,
                message:
                    "Your account has been blocked by the administrator.",
            });

        }

        // =========================================
        // AUTHENTICATED
        // =========================================

        next();

    } catch (error) {

        console.log(
            "Authentication error:",
            error.message
        );

        res.clearCookie(
            "token",
            cookieOptions
        );

        return res.status(401).json({
            status: false,
            message:
                "Invalid or expired token",
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