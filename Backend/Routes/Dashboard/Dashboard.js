const express = require("express")
const router = express.Router()

const {getDashboard} = require("../../Controller/Dashboard/Dashboard")
const {getStatesData,getOneStateData,detailPlace} = require("../../Controller/States/states")
const {visitState} = require("../../Controller/visitCControler/visit")

router.get('/',getDashboard)
router.get('/states',getStatesData)
router.get('/states/:state',getOneStateData)
router.get('/place/:id',detailPlace)
router.post("/states/visit-state", visitState);

module.exports = router;