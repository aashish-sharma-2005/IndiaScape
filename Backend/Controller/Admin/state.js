const State = require("../../Models/states");
const Famous = require("../../Models/famous");

const { getSocketIO } = require("../../Config/socket");


// =========================================
// ADD STATE
// =========================================

async function addState(req, res) {

    try {

        const { name } = req.body;

        if (!name?.trim()) {

            return res.status(400).json({
                status: false,
                message: "State name is required"
            });

        }


        const exists = await State.findOne({
            name: name.trim()
        });

        if (exists) {

            return res.status(400).json({
                status: false,
                message: "State already exists"
            });

        }


        const state = await State.create({
            name: name.trim()
        });


        // =========================================
        // REAL-TIME STATE ADDED
        // =========================================

        const io = getSocketIO();

        if (io) {

            io.emit(
                "stateAdded",
                state
            );

        }


        return res.status(201).json({
            status: true,
            message: "State added successfully",
            state
        });


    } catch (error) {

        console.log(error);

        return res.status(500).json({
            status: false,
            message: "Server Error"
        });

    }

}


// =========================================
// UPDATE STATE
// =========================================

async function updateState(req, res) {

    try {

        const { id } = req.params;
        const { name } = req.body;


        if (!name?.trim()) {

            return res.status(400).json({
                status: false,
                message: "State name is required"
            });

        }


        const state = await State.findByIdAndUpdate(
            id,
            {
                name: name.trim()
            },
            {
                new: true
            }
        );


        if (!state) {

            return res.status(404).json({
                status: false,
                message: "State not found"
            });

        }


        // =========================================
        // REAL-TIME STATE UPDATE
        // =========================================

        const io = getSocketIO();

        if (io) {

            io.emit(
                "stateUpdated",
                state
            );

        }


        return res.status(200).json({
            status: true,
            message: "State updated successfully",
            state
        });


    } catch (error) {

        console.log(error);

        return res.status(500).json({
            status: false,
            message: "Server Error"
        });

    }

}


// =========================================
// DELETE STATE
// =========================================

async function deleteState(req, res) {

    try {

        const { id } = req.params;


        const placeExists = await Famous.findOne({
            state_id: id
        });


        if (placeExists) {

            return res.status(400).json({
                status: false,
                message:
                    "This state contains places. Delete those places first."
            });

        }


        const state = await State.findByIdAndDelete(id);


        if (!state) {

            return res.status(404).json({
                status: false,
                message: "State not found"
            });

        }


        // =========================================
        // REAL-TIME STATE DELETE
        // =========================================

        const io = getSocketIO();

        if (io) {

            io.emit(
                "stateDeleted",
                {
                    _id: id
                }
            );

        }


        return res.status(200).json({
            status: true,
            message: "State deleted successfully"
        });


    } catch (error) {

        console.log(error);

        return res.status(500).json({
            status: false,
            message: "Server Error"
        });

    }

}


// =========================================
// TOGGLE STATE VISIBILITY
// =========================================

// =========================================
// TOGGLE STATE VISIBILITY
// =========================================

async function toggleStateVisibility(req, res) {

    try {
        

        const { id } = req.params;
        const { visible } = req.body;


        const state = await State.findByIdAndUpdate(
            id,
            {
                visible
            },
            {
                new: true
            }
        );


        if (!state) {

            return res.status(404).json({
                status: false,
                message: "State not found"
            });

        }


        // =========================================
        // REAL-TIME VISIBILITY UPDATE
        // =========================================

        const io = getSocketIO();

        if (io) {

            io.emit(
                "stateVisibilityUpdated",
                state
            );

        }


        return res.status(200).json({

            status: true,

            message:
                "State visibility updated",

            state

        });


    } catch (error) {

        console.log(error);

        return res.status(500).json({

            status: false,

            message: "Server error"

        });

    }

}


module.exports = {
    addState,
    updateState,
    deleteState,
    toggleStateVisibility
};