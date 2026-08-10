const User = require("../../Models/user");
const Famous = require("../../Models/famous");

// =========================================
// GET FAVORITE PLACES
// =========================================

async function getFavoritePlaces(req, res) {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId).populate({
            path: "favoritePlaces",
            populate: {
                path: "state_id",
                select: "name"
            }
        });

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            status: true,
            favoritePlaces: user.favoritePlaces
        });

    } catch (error) {
        console.log("Get Favorite Places Error:", error);

        return res.status(500).json({
            status: false,
            message: "Server Error"
        });
    }
};


// =========================================
// TOGGLE FAVORITE PLACE
// =========================================

async function toggleFavorite(req, res) {

    try {

        const userId = req.user.userId;
        const { placeId } = req.body;

        if (!placeId) {
            return res.status(400).json({
                status: false,
                message: "Place ID is required"
            });
        }

        // Check place exists
        const place = await Famous.findById(placeId);

        if (!place) {
            return res.status(404).json({
                status: false,
                message: "Place not found"
            });
        }

        // Get user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        // Check already favorite
        const alreadyFavorite = user.favoritePlaces.some(
            (id) => id.toString() === placeId
        );

        if (alreadyFavorite) {

            // REMOVE
            user.favoritePlaces = user.favoritePlaces.filter(
                (id) => id.toString() !== placeId
            );

            await user.save();

            return res.status(200).json({
                status: true,
                favorite: false,
                message: "Removed from favorites",
                favoritePlaces: user.favoritePlaces
            });
        }

        // ADD
        user.favoritePlaces.push(placeId);

        await user.save();

        return res.status(200).json({
            status: true,
            favorite: true,
            message: "Added to favorites",
            favoritePlaces: user.favoritePlaces
        });

    } catch (error) {

        console.log("Toggle Favorite Error:", error);

        return res.status(500).json({
            status: false,
            message: "Server Error"
        });
    }
}


module.exports = {
    toggleFavorite,
    getFavoritePlaces
};