const mongoose = require("mongoose")

const ConnectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Database Connected")
    } catch (error) {
        console.log("DB Not Connect")
        console.log(error)
    }
}
module.exports = ConnectDB;