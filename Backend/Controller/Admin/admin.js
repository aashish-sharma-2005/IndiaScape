const Famous = require("../../Models/famous");
const State = require("../../Models/states");
const User = require("../../Models/user");
const DraftPlace = require("../../Models/draftPlace");

// =====================================================
// ADMIN DASHBOARD DATA
// =====================================================

async function getAdminData(req, res) {
    try {
        const totalPlaces = await Famous.countDocuments();
        const totalStates = await State.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalDraft = await DraftPlace.countDocuments();

        const places = await Famous.find()
            .populate("state_id", "name")
            .sort({ createdAt: -1 });

        const drafts = await DraftPlace.find()
            .populate("state_id", "name")
            .sort({ createdAt: -1 });

        const states = await State.find();

        const featuredPlaces = await Famous.find({
            featured: true,
        })
            .populate("state_id", "name")
            .sort({ views: -1 });

        const totalImages = places.reduce(
            (total, place) =>
                total + (place.photos?.length ?? 0),
            0
        );

        return res.status(200).json({
            status: true,

            stats: {
                totalPlaces,
                totalStates,
                totalUsers,
                totalImages,
                totalDraft,
            },

            places,
            states,
            drafts,
            featuredPlaces,
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
// STATE DATA
// =====================================================

async function getStateData(req, res) {
    try {
        const states = await State.find();

        return res.status(200).json({
            status: true,
            states,
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
// GET ALL USERS
// =====================================================

async function getAdminUsers(req, res) {
    try {
        const users = await User.find({
            role: { $ne: "admin" },
        })
            .select("-password")
            .populate("visitedStates", "name")
            .populate(
                "favoritePlaces",
                "name title photos state_id"
            )
            .sort({ createdAt: -1 });

        const now = new Date();

        const totalUsers = users.length;

        const activeUsers = users.filter(
            (user) =>
                user.status !== "blocked"
        ).length;

        const blockedUsers = users.filter(
            (user) =>
                user.status === "blocked"
        ).length;

        // New users = users created during last 30 days
        const newUsers = users.filter((user) => {
            const createdAt = new Date(user.createdAt);

            const difference =
                now.getTime() -
                createdAt.getTime();

            const thirtyDays =
                30 * 24 * 60 * 60 * 1000;

            return difference <= thirtyDays;
        }).length;

        return res.status(200).json({
            status: true,

            stats: {
                totalUsers,
                activeUsers,
                blockedUsers,
                newUsers,
            },

            users,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            status: false,
            message: "Failed to fetch users",
        });
    }
}

// =====================================================
// GET SINGLE USER
// =====================================================

async function getAdminUser(req, res) {
    try {
        const { id } = req.params;

        const user = await User.findById(id)
            .select("-password")
            .populate("visitedStates", "name")
            .populate(
                "favoritePlaces",
                "name title photos state_id"
            );

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found",
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
            message: "Failed to fetch user",
        });
    }
}

// =====================================================
// BLOCK / UNBLOCK USER
// =====================================================

async function toggleUserStatus(req, res) {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found",
            });
        }

        if (user.role === "admin") {
            return res.status(403).json({
                status: false,
                message: "Admin account cannot be blocked",
            });
        }

        user.status =
            user.status === "blocked"
                ? "active"
                : "blocked";

        await user.save();

        const updatedUser =
            await User.findById(id)
                .select("-password")
                .populate("visitedStates", "name")
                .populate(
                    "favoritePlaces",
                    "name title photos state_id"
                );

        return res.status(200).json({
            status: true,

            message:
                user.status === "blocked"
                    ? "User blocked successfully"
                    : "User unblocked successfully",

            user: updatedUser,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            status: false,
            message: "Failed to update user status",
        });
    }
}

// =====================================================
// DELETE USER
// =====================================================

async function deleteAdminUser(req, res) {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found",
            });
        }

        if (user.role === "admin") {
            return res.status(403).json({
                status: false,
                message: "Admin account cannot be deleted",
            });
        }

        await User.findByIdAndDelete(id);

        return res.status(200).json({
            status: true,
            message: "User deleted successfully",
            userId: id,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            status: false,
            message: "Failed to delete user",
        });
    }
}

// =====================================================
// UPDATE LAST LOGIN
// =====================================================
//
// This endpoint can be called after successful authentication.
// It uses the logged-in user's id supplied by the request.
//
// =====================================================

async function updateLastLogin(req, res) {
    try {
        const userId =
            req.user?._id ||
            req.user?.id ||
            req.body?.userId;

        if (!userId) {
            return res.status(401).json({
                status: false,
                message: "User not authenticated",
            });
        }

        const user =
            await User.findByIdAndUpdate(
                userId,
                {
                    lastLogin: new Date(),
                },
                {
                    new: true,
                }
            ).select("-password");

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            status: true,
            lastLogin: user.lastLogin,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            status: false,
            message: "Failed to update last login",
        });
    }
}

module.exports = {
    getAdminData,
    getStateData,

    getAdminUsers,
    getAdminUser,
    toggleUserStatus,
    deleteAdminUser,

    updateLastLogin,
};