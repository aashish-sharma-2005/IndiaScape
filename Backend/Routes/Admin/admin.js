const express = require("express");

const router = express.Router();

const { uploads } = require("../../Config/cloudinary");

// ========================================
// ADMIN STATE CONTROLLER
// ========================================

const {
    addState,
    updateState,
    deleteState,
    toggleStateVisibility,
} = require("../../Controller/Admin/state");

// ========================================
// ADMIN CONTROLLER
// ========================================

const {
    getAdminData,
    getStateData,

    getAdminUsers,
    getAdminUser,
    toggleUserStatus,
    deleteAdminUser,
} = require("../../Controller/Admin/admin");

// ========================================
// ADMIN PLACE CONTROLLER
// ========================================

const {
    savedDraft,
    savedplace,
    updatePlace,
    deletePlaceImage,
    deletePlace,
    toggleFeatured,
} = require("../../Controller/Admin/saveData");

// ========================================
// DASHBOARD
// ========================================

router.get("/data", getAdminData);

router.get("/stateData", getStateData);

// ========================================
// USERS
// ========================================

router.get("/users", getAdminUsers);

router.get("/users/:id", getAdminUser);

router.put(
    "/users/:id/status",
    toggleUserStatus
);

router.delete(
    "/users/:id",
    deleteAdminUser
);

// ========================================
// PLACES
// ========================================

router.post(
    "/savedDraft",
    uploads.array("placeImages", 3),
    savedDraft
);

router.post(
    "/savedplace",
    uploads.array("placeImages", 3),
    savedplace
);

router.put(
    "/place/:id",
    uploads.array("placeImages", 3),
    updatePlace
);

router.delete(
    "/place/:id/image",
    deletePlaceImage
);

router.delete(
    "/place/:id",
    deletePlace
);

router.put(
    "/place/:id/featured",
    toggleFeatured
);

// ========================================
// STATES
// ========================================

router.post(
    "/state",
    addState
);

router.put(
    "/state/:id",
    updateState
);

router.delete(
    "/state/:id",
    deleteState
);

router.put(
    "/state/:id/visibility",
    toggleStateVisibility
);

module.exports = router;