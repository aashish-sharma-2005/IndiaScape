const express = require("express");

const router = express.Router();


// =========================================
// CONTROLLERS
// =========================================

const {
    getDashboard
} = require("../../Controller/Dashboard/Dashboard");

const {
    getStatesData,
    getOneStateData,
    detailPlace
} = require("../../Controller/States/states");

const {
    visitState
} = require("../../Controller/visitCControler/visit");

const {
    toggleFavorite,
    getFavoritePlaces
} = require("../../Controller/favoriteController/favorite");


// =========================================
// DASHBOARD
// =========================================

router.get(
    "/",
    getDashboard
);


// =========================================
// STATES
// =========================================

router.get(
    "/states",
    getStatesData
);

router.get(
    "/states/:state",
    getOneStateData
);


// =========================================
// VISITED STATE
// =========================================

router.post(
    "/states/visit-state",
    visitState
);


// =========================================
// FAVORITES
// IMPORTANT:
// /place/favorites MUST COME BEFORE /place/:id
// =========================================

router.get(
    "/place/favorites",
    getFavoritePlaces
);

router.post(
    "/place/favorite",
    toggleFavorite
);


// =========================================
// PLACE DETAILS
// Keep dynamic route AFTER /place/favorites
// =========================================

router.get(
    "/place/:id",
    detailPlace
);


// =========================================

module.exports = router;