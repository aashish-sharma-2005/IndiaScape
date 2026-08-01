const mongoose = require("mongoose");

const draftPlaceSchema = new mongoose.Schema({
    state_id: {type: mongoose.Schema.Types.ObjectId,ref: "State"},
    name: String,
    title: String,
    description: String,
    story: String,
    category: String,
    photos: [{url: { type: String, required: true },publicId: { type: String, required: true }}]
}, { timestamps: true });

module.exports = mongoose.model("DraftPlace", draftPlaceSchema);