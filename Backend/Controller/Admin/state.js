const State = require("../../Models/states");
const Famous = require("../../Models/famous");

const { getSocketIO } = require("../../Config/socket");

// =====================================================
// ADD STATE
// =====================================================

async function addState(req, res) {
    try {
        const name = req.body.name?.trim();

        if (!name) {
            return res.status(400).json({
                status: false,
                message: "State name is required"
            });
        }

        const exists = await State.findOne({
            name: name
        });

        if (exists) {
            return res.status(400).json({
                status: false,
                message: "State already exists"
            });
        }

        const state = await State.create({
            name
        });

        // =================================================
        // SOCKET
        // =================================================

        const io = getSocketIO();

        if (io) {
            io.emit("stateAdded", state);

            console.log(
                "Socket: stateAdded",
                state._id
            );
        }

        return res.status(201).json({
            status: true,
            message: "State added successfully",
            state
        });

    } catch (error) {
        console.log("Add State Error:", error);

        return res.status(500).json({
            status: false,
            message: "Server Error"
        });
    }
}


// =====================================================
// UPDATE STATE
// =====================================================

async function updateState(req, res) {
    try {
        const { id } = req.params;
        const name = req.body.name?.trim();

        if (!name) {
            return res.status(400).json({
                status: false,
                message: "State name is required"
            });
        }

        const existingState = await State.findById(id);

        if (!existingState) {
            return res.status(404).json({
                status: false,
                message: "State not found"
            });
        }

        // Prevent duplicate state names
        const duplicate = await State.findOne({
            name,
            _id: { $ne: id }
        });

        if (duplicate) {
            return res.status(400).json({
                status: false,
                message: "State already exists"
            });
        }

        const state = await State.findByIdAndUpdate(
            id,
            {
                name
            },
            {
                new: true,
                runValidators: true
            }
        );

        // =================================================
        // SOCKET
        // =================================================

        const io = getSocketIO();

        if (io) {
            io.emit("stateUpdated", state);

            console.log(
                "Socket: stateUpdated",
                state._id
            );
        }

        return res.status(200).json({
            status: true,
            message: "State updated successfully",
            state
        });

    } catch (error) {
        console.log("Update State Error:", error);

        return res.status(500).json({
            status: false,
            message: "Server Error"
        });
    }
}


// =====================================================
// DELETE STATE
// =====================================================

async function deleteState(req, res) {
    try {
        const { id } = req.params;

        const state = await State.findById(id);

        if (!state) {
            return res.status(404).json({
                status: false,
                message: "State not found"
            });
        }

        // =================================================
        // CHECK PLACES
        // =================================================

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

        await State.findByIdAndDelete(id);

        // =================================================
        // SOCKET
        // =================================================

        const io = getSocketIO();

        if (io) {
            io.emit("stateDeleted", {
                _id: id,
                name: state.name
            });

            console.log(
                "Socket: stateDeleted",
                id
            );
        }

        return res.status(200).json({
            status: true,
            message: "State deleted successfully"
        });

    } catch (error) {
        console.log("Delete State Error:", error);

        return res.status(500).json({
            status: false,
            message: "Server Error"
        });
    }
}


// =====================================================
// TOGGLE STATE VISIBILITY
// =====================================================

async function toggleStateVisibility(req, res) {
    try {
        const { id } = req.params;

        // FormData / JSON can sometimes send strings
        let visible = req.body.visible;

        if (typeof visible === "string") {
            visible = visible === "true";
        }

        if (typeof visible !== "boolean") {
            return res.status(400).json({
                status: false,
                message: "Visibility must be true or false"
            });
        }

        const state = await State.findByIdAndUpdate(
            id,
            {
                visible
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!state) {
            return res.status(404).json({
                status: false,
                message: "State not found"
            });
        }

        // =================================================
        // SOCKET
        // =================================================

        const io = getSocketIO();

        if (io) {
            io.emit(
                "stateVisibilityUpdated",
                state
            );

            console.log(
                "Socket: stateVisibilityUpdated",
                state._id,
                state.visible
            );
        }

        return res.status(200).json({
            status: true,
            message: "State visibility updated",
            state
        });

    } catch (error) {
        console.log(
            "Toggle State Visibility Error:",
            error
        );

        return res.status(500).json({
            status: false,
            message: "Server Error"
        });
    }
}


module.exports = {
    addState,
    updateState,
    deleteState,
    toggleStateVisibility
};