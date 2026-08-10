const famous = require("../../data/famous.json");
const states = require("../../data/states.json");

const Famous = require("../../Models/famous");
const State = require("../../Models/states");
const User = require("../../Models/user");


// =====================================================
// GET STATES DATA
// =====================================================

async function getStatesData(req, res) {

    try {

        const visibleStates = await State.find({
            visible: true
        });

        const visibleStateIds = visibleStates.map(
            (state) => state._id
        );

        const places = await Famous.find({
            state_id: {
                $in: visibleStateIds
            }
        }).populate(
            "state_id",
            "name visible"
        );

        const statesWithImages = visibleStates.map(
            (state) => {

                const statePlace = places.find(
                    (place) =>
                        place.state_id?._id?.toString() ===
                        state._id.toString()
                );

                return {
                    ...state.toObject(),

                    photos:
                        statePlace?.photos || []
                };

            }
        );

        return res.status(200).json({
            status: true,
            states: statesWithImages,
            places
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            status: false,
            message: "Server Error"
        });

    }

}


// =====================================================
// GET ONE STATE DATA
// =====================================================

async function getOneStateData(req, res) {

    try {

        const { state } = req.params;

        const stateData = await State.findOne({
            name: state,
            visible: true
        });

        if (!stateData) {

            return res.status(404).json({
                status: false,
                message: "State not found"
            });

        }

        const places = await Famous.find({
            state_id: stateData._id
        }).populate(
            "state_id",
            "name visible"
        );

        return res.json({
            status: true,
            places
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            status: false,
            message: "Server Error"
        });

    }

}


// =====================================================
// GET SINGLE PLACE
// =====================================================

async function detailPlace(req, res) {

    try {

        const { id } = req.params;

        const place = await Famous.findById(id)
            .populate(
                "state_id",
                "name"
            );

        if (!place) {

            return res.status(404).json({
                status: false,
                message: "Place not found"
            });

        }

        return res.json({
            status: true,
            place
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            status: false,
            message: "Server Error"
        });

    }

}


// =====================================================
// TOGGLE FAVORITE PLACE
// =====================================================

async function toggleFavorite(req, res) {

    try {

        const { id } = req.params;

        const userId = req.user._id;

        // =============================================
        // CHECK PLACE
        // =============================================

        const place = await Famous.findById(id);

        if (!place) {

            return res.status(404).json({
                status: false,
                message: "Place not found"
            });

        }


        // =============================================
        // GET USER
        // =============================================

        const user = await User.findById(userId);

        if (!user) {

            return res.status(404).json({
                status: false,
                message: "User not found"
            });

        }


        // =============================================
        // CHECK CURRENT FAVORITE STATUS
        // =============================================

        const favoriteIndex =
            user.favoritePlaces.findIndex(
                (placeId) =>
                    placeId.toString() === id
            );


        // =============================================
        // REMOVE FROM FAVORITES
        // =============================================

        if (favoriteIndex !== -1) {

            user.favoritePlaces.splice(
                favoriteIndex,
                1
            );

            await user.save();

            return res.status(200).json({
                status: true,
                favorite: false,
                message:
                    "Removed from favorites"
            });

        }


        // =============================================
        // ADD TO FAVORITES
        // =============================================

        user.favoritePlaces.push(id);

        await user.save();

        return res.status(200).json({
            status: true,
            favorite: true,
            message:
                "Added to favorites"
        });

    } catch (error) {

        console.log(
            "Toggle Favorite Error:",
            error
        );

        return res.status(500).json({
            status: false,
            message: "Server Error"
        });

    }

}


// =====================================================
// GET USER FAVORITES
// =====================================================

async function getFavorites(req, res) {

    try {

        const userId = req.user._id;

        const user = await User.findById(
            userId
        ).populate({
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
            favorites:
                user.favoritePlaces || []
        });

    } catch (error) {

        console.log(
            "Get Favorites Error:",
            error
        );

        return res.status(500).json({
            status: false,
            message: "Server Error"
        });

    }

}


module.exports = {
    getStatesData,
    getOneStateData,
    detailPlace,
    toggleFavorite,
    getFavorites
};