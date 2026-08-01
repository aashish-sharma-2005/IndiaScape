const mongoose = require("mongoose")

const famousSchema = new mongoose.Schema({
    state_id: { type: mongoose.Schema.Types.ObjectId, ref: "State", required: true },
    name: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    photos: [{url: { type: String, required: true },publicId: { type: String, required: false}}],
    story: { type: String, required: true },
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published"], default: "published" },
    publishedAt: { type: Date, default: null }
},
    {
        timestamps: true
    }
)
const Famous = mongoose.model('Famous', famousSchema)
module.exports = Famous