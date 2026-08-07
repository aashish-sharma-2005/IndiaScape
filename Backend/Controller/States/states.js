const famous = require("../../data/famous.json")
const states = require("../../data/states.json")
const Famous = require("../../Models/famous")
const State = require("../../Models/states")

async function getStatesData(req, res) {
    try {
        const visibleStates = await State.find({ visible: true });

        const visibleStateIds = visibleStates.map(
            (state) => state._id
        );

        const places = await Famous.find({
            state_id: { $in: visibleStateIds }
        }).populate("state_id", "name visible");

        const statesWithImages = visibleStates.map((state) => {

            const statePlace = places.find(
                (place) =>
                    place.state_id?._id?.toString() ===
                    state._id.toString()
            );

            return {
                ...state.toObject(),

                photos: statePlace?.photos || []
            };
        });

        return res.status(200).json({
            status: true,
            states: statesWithImages,
            places
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            status: false,
            message: "Server Error"
        });
    }
}
async function getOneStateData(req,res){
    try{
        const {state}=req.params;
        const stateData=await State.findOne({name:state,visible:true});

        if(!stateData){
            return res.status(404).json({status:false,message:"State not found"});
        }

        const places=await Famous.find({state_id:stateData._id})
            .populate("state_id","name visible");

        return res.json({status:true,places});
    }catch(error){
        console.log(error);
        return res.status(500).json({status:false,message:"Server Error"});
    }
}
async function detailPlace(req, res) {
    try {
        const { id } = req.params;

        const place = await Famous.findById(id).populate(
            "state_id",
            "name"
        );

        if (!place) {
            return res.status(404).json({
                status: false,
                message: "Place not found",
            });
        }

        return res.json({
            status: true,
            place,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Server Error",
        });
    }
}

module.exports = {getStatesData,getOneStateData,detailPlace}