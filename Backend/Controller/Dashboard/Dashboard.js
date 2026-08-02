const Famous = require("../../Models/famous");

async function getDashboard(req, res) {
    try {
        const featuredPlaces = await Famous.find({
            featured: true
        }).populate("state_id", "name");

        return res.status(200).json({
            status: true,
            featuredPlaces
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            status: false,
            message: "Server Error"
        });
    }
}

module.exports = { getDashboard };