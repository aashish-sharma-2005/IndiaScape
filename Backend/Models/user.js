const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
        name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        role: {type: String,default: "user"},
        visitedStates: [{type: mongoose.Schema.Types.ObjectId,ref: "State"}],
        favoritePlaces: [{type: mongoose.Schema.Types.ObjectId,ref: "Famous"}],
    },
    {
        timestamps: true
    }
)
const Users = mongoose.model('User',UserSchema)
module.exports = Users;