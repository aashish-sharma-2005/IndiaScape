const homeSlider = require("../../data/homeSlider.json")
const homeSomeCards = require("../../data/homeSomeCards.json")
function getDashboard(req,res){
    try {
        return res.json({status:true,homeSlider,homeSomeCards})
    } catch (error) {
        console.log(error)
    }
}
function postDashboard(req,res){
    try {
        console.log("post dashboard")
    } catch (error) {
        console.log(error)
    }
}

module.exports = {postDashboard,getDashboard}