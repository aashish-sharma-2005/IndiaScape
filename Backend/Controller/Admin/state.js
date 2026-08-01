const State = require("../../Models/states");
const Famous = require("../../Models/famous");

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

async function updateState(req, res) {
    try {

        const { id } = req.params;
        const { name } = req.body;

        const state = await State.findByIdAndUpdate(
            id,
            { name: name.trim() },
            { returnDocument: 'after' }
        );

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

async function deleteState(req, res) {
    try {

        const placeExists = await Famous.findOne({
            state_id: id
        });
        if (placeExists) {
            return res.status(400).json({
                status: false,
                message: "This state contains places. Delete those places first."
            });
        }
        const { id } = req.params;

        await State.findByIdAndDelete(id);

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
async function toggleStateVisibility(req,res){
    try{
        const {id}=req.params;
        const {visible}=req.body;
        const state=await State.findByIdAndUpdate(id,{visible},{returnDocument:true});
        if(!state){
            return res.status(404).json({status:false,message:"State not found"});
        }
        return res.json({status:true,message:"State visibility updated",state});
    }catch(error){
        console.log(error);
        return res.status(500).json({status:false,message:"Server error"});
    }
}

module.exports = {
    addState,
    updateState,
    deleteState,
    toggleStateVisibility
};