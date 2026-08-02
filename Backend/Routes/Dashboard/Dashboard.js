const express = require("express")
const router = express.Router()

const {getDashboard} = require("../../Controller/Dashboard/Dashboard")
const {getStatesData,getOneStateData,detailPlace} = require("../../Controller/States/states")

router.get('/',getDashboard)
router.get('/states',getStatesData)
router.get('/states/:state',getOneStateData)
router.get('/place/:id',detailPlace)

module.exports = router;