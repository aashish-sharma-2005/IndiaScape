const mongoose = require("mongoose");

const stateSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    visible:{type:Boolean,default:true}
}, { timestamps: true });

const States = mongoose.model("State", stateSchema);
module.exports = States