const express = require("express")
const router = express.Router()
const {uploads} = require("../../Config/cloudinary")

const {addState,updateState,deleteState,toggleStateVisibility} = require("../../Controller/Admin/state");
const {getAdminData,getStateData} = require("../../Controller/Admin/admin")
const {savedDraft,savedplace,updatePlace,deletePlaceImage,deletePlace,toggleFeatured} = require("../../Controller/Admin/saveData")

// router.get('/',getAdminData)
router.get('/data',getAdminData)
router.get('/stateData',getStateData)
router.post('/savedDraft',uploads.array("placeImages",3),savedDraft)
router.post('/savedplace',uploads.array('placeImages',3),savedplace)
router.put('/place/:id',uploads.array('placeImages',3),updatePlace)
router.delete('/place/:id/image',deletePlaceImage)

router.post("/state", addState);
router.put("/state/:id", updateState);
router.delete("/state/:id", deleteState);
router.delete("/place/:id", deletePlace);
router.put("/place/:id/featured",toggleFeatured);
router.put("/state/:id/visibility",toggleStateVisibility);

module.exports = router