const famous = require("../../data/famous.json")
const Famous = require("../../Models/famous")
const State = require("../../Models/states")
const User = require('../../Models/user')
const DraftPlace = require('../../Models/draftPlace')
async function getAdminData(req, res) {
    try {
        const totalPlaces = await Famous.countDocuments()
        const totalStates = await State.countDocuments()
        const totalUsers = await User.countDocuments()
        const totalDraft = await DraftPlace.countDocuments()
        const places = await Famous.find().populate("state_id", "name").sort({ createdAt: -1 })
        const drafts = await DraftPlace.find().populate("state_id", "name").sort({ createdAt: -1 })
        const states = await State.find()
        const featuredPlaces = await Famous.find({ featured: true }).populate("state_id", "name").sort({ views: -1 })
        const totalImages = places.reduce((total, place) => total + (place.photos?.length ?? 0),0);
        return res.status(200).json({
            status: true,
            stats: {
                totalPlaces,
                totalStates,
                totalUsers,
                totalImages,
                totalDraft
            },
            places,
            states,
            drafts,
            featuredPlaces
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: "Server Error" })
    }
}
async function getStateData(req, res) {
    try {
        const states = await State.find()
        return res.status(200).json({ status: true, states })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: "Server Error" })
    }
}

module.exports = { getAdminData, getStateData }