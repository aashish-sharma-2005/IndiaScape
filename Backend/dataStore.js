require("dotenv").config();
const mongoose = require("mongoose");
const Famous = require("./Models/famous");

async function generatePhotoIds() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database Connected");

        const places = await Famous.find();

        for (const place of places) {
            place.photos = place.photos.map(photo => ({
                _id: new mongoose.Types.ObjectId(),
                url: photo.url,
                publicId: photo.publicId
            }));

            await place.save();
            console.log(`${place.name} updated`);
        }

        console.log("All photo ids generated successfully.");
        process.exit();

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

generatePhotoIds();