const DraftPlace = require("../../Models/draftPlace");
const Famous = require("../../Models/famous");
const { cloudinary } = require("../../Config/cloudinary");
const { getSocketIO } = require("../../Config/socket");


// =========================================
// CLOUDINARY CLEANUP
// =========================================

async function deleteUploadedImages(images) {

    for (const image of images) {

        try {

            if (image.filename) {
                await cloudinary.uploader.destroy(
                    image.filename
                );
            }

        } catch (error) {

            console.log(
                "Cloudinary cleanup error:",
                error.message
            );

        }

    }

}


// =========================================
// SAVE DRAFT
// =========================================

async function savedDraft(req, res) {

    const images = req.files || [];

    try {

        const photos = images.map((file) => ({
            url: file.path,
            publicId: file.filename
        }));

        const obj = {
            ...req.body,
            photos
        };

        const result = await DraftPlace.create(obj);

        if (result) {

            return res.status(200).json({
                status: true,
                message: "Draft saved"
            });

        }

        await deleteUploadedImages(images);

        return res.status(400).json({
            status: false,
            message: "Draft Not Saved"
        });

    } catch (error) {

        console.log(error);

        await deleteUploadedImages(images);

        return res.status(500).json({
            status: false,
            message: "Server Error"
        });

    }

}


// =========================================
// SAVE / PUBLISH PLACE
// =========================================

async function savedplace(req, res) {

    const images = req.files || [];

    try {

        const photos = images.map((file) => ({
            url: file.path,
            publicId: file.filename
        }));

        const obj = {
            ...req.body,
            photos
        };

        if (!obj.state_id) {
            delete obj.state_id;
        }

        // FormData sends strings
        if (obj.featured !== undefined) {
            obj.featured =
                obj.featured === "true";
        }

        const result = await Famous.create(obj);

        if (result) {

            // =====================================
            // REALTIME PLACE ADDED
            // =====================================

            const io = getSocketIO();

            if (io) {

                io.emit(
                    "placeAdded",
                    result
                );

                console.log(
                    "Socket: placeAdded",
                    result._id
                );

            }


            return res.status(200).json({
                status: true,
                message: "Place published successfully",
                obj: result
            });

        }

        await deleteUploadedImages(images);

        return res.status(400).json({
            status: false,
            message: "Place Not Published"
        });

    } catch (error) {

        console.log(error);

        await deleteUploadedImages(images);

        return res.status(500).json({
            status: false,
            message: "Server Error"
        });

    }

}


// =========================================
// UPDATE PLACE
// =========================================

async function updatePlace(req, res) {

    try {

        const { id } = req.params;

        const place = await Famous.findById(id);

        if (!place) {

            return res.status(404).json({
                status: false,
                message: "Place not found"
            });

        }


        // =====================================
        // UPDATE BASIC DATA
        // =====================================

        place.state_id = req.body.state_id;
        place.name = req.body.name;
        place.title = req.body.title;
        place.description = req.body.description;
        place.story = req.body.story;

        place.featured =
            req.body.featured === "true";


        // =====================================
        // ADD NEW PHOTOS
        // =====================================

        if (req.files?.length) {

            const newPhotos = req.files.map((file) => ({
                url: file.path,
                publicId: file.filename
            }));

            place.photos.push(...newPhotos);

        }


        await place.save();


        // =====================================
        // REALTIME PLACE UPDATED
        // =====================================

        const io = getSocketIO();

        if (io) {

            io.emit(
                "placeUpdated",
                place
            );

            console.log(
                "Socket: placeUpdated",
                place._id
            );

        }


        return res.status(200).json({

            status: true,

            message: "Place updated successfully",

            place

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
// DELETE PLACE IMAGE
// =========================================

async function deletePlaceImage(req, res) {

    try {

        const { id } = req.params;
        const { photoId } = req.body;


        const place = await Famous.findById(id);

        if (!place) {

            return res.status(404).json({

                status: false,

                message: "Place not found"

            });

        }


        const photo = place.photos.id(photoId);

        if (!photo) {

            return res.status(404).json({

                status: false,

                message: "Image not found"

            });

        }


        // =====================================
        // DELETE FROM CLOUDINARY
        // =====================================

        if (photo.publicId) {

            await cloudinary.uploader.destroy(
                photo.publicId
            );

        }


        // =====================================
        // DELETE FROM MONGODB
        // =====================================

        photo.deleteOne();

        await place.save();


        // =====================================
        // REALTIME PLACE UPDATED
        // =====================================

        const io = getSocketIO();

        if (io) {

            io.emit(
                "placeUpdated",
                place
            );

            console.log(
                "Socket: placeUpdated (image deleted)",
                place._id
            );

        }


        return res.status(200).json({

            status: true,

            message: "Image deleted successfully",

            photos: place.photos

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            status: false,

            message: "Image delete failed"

        });

    }

}


// =========================================
// DELETE PLACE
// =========================================

async function deletePlace(req, res) {

    try {

        const { id } = req.params;


        const place = await Famous.findById(id);

        if (!place) {

            return res.status(404).json({

                status: false,

                message: "Place not found"

            });

        }


        // =====================================
        // DELETE IMAGES FROM CLOUDINARY
        // =====================================

        if (place.photos?.length) {

            for (const photo of place.photos) {

                if (photo.publicId) {

                    await cloudinary.uploader.destroy(
                        photo.publicId
                    );

                }

            }

        }


        // =====================================
        // DELETE FROM MONGODB
        // =====================================

        await Famous.findByIdAndDelete(id);


        // =====================================
        // REALTIME PLACE DELETED
        // =====================================

        const io = getSocketIO();

        if (io) {

            io.emit(
                "placeDeleted",
                id
            );

            console.log(
                "Socket: placeDeleted",
                id
            );

        }


        return res.status(200).json({

            status: true,

            message: "Place deleted successfully"

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            status: false,

            message: "Server error"

        });

    }

}


// =========================================
// TOGGLE FEATURED
// =========================================

async function toggleFeatured(req, res) {

    try {

        const { id } = req.params;
        const { featured } = req.body;


        const count = await Famous.countDocuments({
            featured: true
        });


        // =====================================
        // MAXIMUM 6 FEATURED
        // =====================================

        if (
            featured === true &&
            count >= 6
        ) {

            return res.status(400).json({

                status: false,

                message:
                    "Maximum 6 featured places allowed"

            });

        }


        // =====================================
        // MINIMUM 3 FEATURED
        // =====================================

        if (
            featured === false &&
            count <= 3
        ) {

            return res.status(400).json({

                status: false,

                message:
                    "At least 3 featured places required"

            });

        }


        const place =
            await Famous.findByIdAndUpdate(

                id,

                { featured },

                { new: true }

            );


        if (!place) {

            return res.status(404).json({

                status: false,

                message: "Place not found"

            });

        }


        // =====================================
        // REALTIME PLACE UPDATED
        // =====================================

        const io = getSocketIO();

        if (io) {

            io.emit(
                "placeUpdated",
                place
            );

            console.log(
                "Socket: placeUpdated (featured)",
                place._id
            );

        }


        return res.json({

            status: true,

            place

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            status: false,

            message: "Server Error"

        });

    }

}


module.exports = {
    savedDraft,
    savedplace,
    updatePlace,
    deletePlaceImage,
    deletePlace,
    toggleFeatured
};