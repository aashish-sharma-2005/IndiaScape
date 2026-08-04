const User = require("../../Models/user");

const visitState = async (req, res) => {
    try {
        const { stateId } = req.body;
        const userId = req.user.userId;

        const user = await User.findByIdAndUpdate(
            userId,
            {
                $addToSet: {
                    visitedStates: stateId
                }
            },
            { new: true }
        ).populate("visitedStates");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "State marked as visited",
            visitedStates: user.visitedStates
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to mark state as visited"
        });
    }
};

module.exports = { visitState };