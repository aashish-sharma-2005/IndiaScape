const DraftPlace = require("../../Models/draftPlace");
const Famous = require("../../Models/famous");

const {
    cloudinary
} = require("../../Config/cloudinary");

const {
    getSocketIO
} = require("../../Config/socket");


// =====================================================
// CLOUDINARY CLEANUP
// =====================================================

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


// =====================================================
// SAVE DRAFT
// =====================================================

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

        if (!result) {

            await deleteUploadedImages(images);

            return res.status(400).json({
                status: false,
                message: "Draft Not Saved"
            });

        }

        // =================================================
        // SOCKET
        // =================================================

        const io = getSocketIO();

        if (io) {

            io.emit(
                "draftAdded",
                result
            );

            console.log(
                "Socket: draftAdded",
                result._id
            );

        }

        return res.status(200).json({
            status: true,
            message: "Draft saved",
            draft: result
        });

    } catch (error) {

        console.log(
            "Save Draft Error:",
            error
        );

        await deleteUploadedImages(images);

        return res.status(500).json({
            status: false,
            message: "Server Error"
        });

    }

}


// =====================================================
// SAVE / PUBLISH PLACE
// =====================================================

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

        // Remove empty state_id
        if (!obj.state_id) {
            delete obj.state_id;
        }

        // FormData sends strings
        if (obj.featured !== undefined) {

            obj.featured =
                obj.featured === true ||
                obj.featured === "true";

        }

        const result = await Famous.create(obj);

        if (!result) {

            await deleteUploadedImages(images);

            return res.status(400).json({
                status: false,
                message: "Place Not Published"
            });

        }

        // =================================================
        // SOCKET
        // =================================================

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

        return res.status(201).json({
            status: true,
            message: "Place published successfully",
            place: result
        });

    } catch (error) {

        console.log(
            "Save Place Error:",
            error
        );

        await deleteUploadedImages(images);

        return res.status(500).json({
            status: false,
            message: "Server Error"
        });

    }

}


// =====================================================
// UPDATE PLACE
// =====================================================

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


        // =================================================
        // BASIC DATA
        // =================================================

        if (req.body.state_id !== undefined) {
            place.state_id = req.body.state_id;
        }

        if (req.body.name !== undefined) {
            place.name = req.body.name;
        }

        if (req.body.title !== undefined) {
            place.title = req.body.title;
        }

        if (req.body.description !== undefined) {
            place.description = req.body.description;
        }

        if (req.body.story !== undefined) {
            place.story = req.body.story;
        }


        // =================================================
        // FEATURED
        // =================================================

        if (req.body.featured !== undefined) {

            place.featured =
                req.body.featured === true ||
                req.body.featured === "true";

        }


        // =================================================
        // ADD NEW PHOTOS
        // =================================================

        if (req.files?.length) {

            const newPhotos = req.files.map(
                (file) => ({
                    url: file.path,
                    publicId: file.filename
                })
            );

            place.photos.push(
                ...newPhotos
            );

        }


        await place.save();


        // =================================================
        // SOCKET
        // =================================================

        const io = getSocketIO();

        if (io) {

            io.emit(
                "placeUpdated",
                {
                    place,
                    changeType: "updated"
                }
            );

            console.log(
                "Socket: placeUpdated",
                place._id
            );

        }


        return res.status(200).json({

            status: true,

            message:
                "Place updated successfully",

            place

        });

    } catch (error) {

        console.log(
            "Update Place Error:",
            error
        );

        return res.status(500).json({
            status: false,
            message: "Server Error"
        });

    }

}


// =====================================================
// DELETE PLACE IMAGE
// =====================================================

async function deletePlaceImage(req, res) {

    try {

        const { id } = req.params;
        const { photoId } = req.body;

        const place =
            await Famous.findById(id);

        if (!place) {

            return res.status(404).json({
                status: false,
                message: "Place not found"
            });

        }

        const photo =
            place.photos.id(photoId);

        if (!photo) {

            return res.status(404).json({
                status: false,
                message: "Image not found"
            });

        }


        // =================================================
        // CLOUDINARY
        // =================================================

        if (photo.publicId) {

            await cloudinary.uploader.destroy(
                photo.publicId
            );

        }


        // =================================================
        // MONGODB
        // =================================================

        photo.deleteOne();

        await place.save();


        // =================================================
        // SOCKET
        // =================================================

        const io = getSocketIO();

        if (io) {

            io.emit(
                "placeUpdated",
                {
                    place,
                    changeType: "imageDeleted",
                    photoId
                }
            );

            console.log(
                "Socket: placeUpdated (image deleted)",
                place._id
            );

        }


        return res.status(200).json({

            status: true,

            message:
                "Image deleted successfully",

            photos:
                place.photos

        });

    } catch (error) {

        console.log(
            "Delete Place Image Error:",
            error
        );

        return res.status(500).json({
            status: false,
            message: "Image delete failed"
        });

    }

}


// =====================================================
// DELETE PLACE
// =====================================================

async function deletePlace(req, res) {

    try {

        const { id } = req.params;

        const place =
            await Famous.findById(id);

        if (!place) {

            return res.status(404).json({
                status: false,
                message: "Place not found"
            });

        }


        // =================================================
        // CLOUDINARY
        // =================================================

        if (place.photos?.length) {

            for (const photo of place.photos) {

                if (photo.publicId) {

                    try {

                        await cloudinary.uploader.destroy(
                            photo.publicId
                        );

                    } catch (error) {

                        console.log(
                            "Cloudinary delete error:",
                            error.message
                        );

                    }

                }

            }

        }


        // =================================================
        // MONGODB
        // =================================================

        await Famous.findByIdAndDelete(id);


        // =================================================
        // SOCKET
        // =================================================

        const io = getSocketIO();

        if (io) {

            io.emit(
                "placeDeleted",
                {
                    _id: id
                }
            );

            console.log(
                "Socket: placeDeleted",
                id
            );

        }


        return res.status(200).json({

            status: true,

            message:
                "Place deleted successfully"

        });

    } catch (error) {

        console.log(
            "Delete Place Error:",
            error
        );

        return res.status(500).json({
            status: false,
            message: "Server error"
        });

    }

}


// =====================================================
// TOGGLE FEATURED
// =====================================================

async function toggleFeatured(req, res) {

    try {

        const { id } = req.params;

        let featured = req.body.featured;

        // Normalize JSON/FormData
        if (typeof featured === "string") {
            featured = featured === "true";
        }

        if (typeof featured !== "boolean") {

            return res.status(400).json({
                status: false,
                message:
                    "Featured must be true or false"
            });

        }


        // =================================================
        // CURRENT PLACE
        // =================================================

        const currentPlace =
            await Famous.findById(id);

        if (!currentPlace) {

            return res.status(404).json({
                status: false,
                message: "Place not found"
            });

        }


        // =================================================
        // IF NO CHANGE
        // =================================================

        if (
            currentPlace.featured === featured
        ) {

            return res.status(200).json({
                status: true,
                message:
                    "Featured status already set",
                place: currentPlace
            });

        }


        // =================================================
        // FEATURED COUNT
        // =================================================

        const count =
            await Famous.countDocuments({
                featured: true
            });


        // =================================================
        // MAX 6
        // =================================================

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


        // =================================================
        // MIN 3
        // =================================================

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


        // =================================================
        // UPDATE
        // =================================================

        const place =
            await Famous.findByIdAndUpdate(
                id,
                {
                    featured
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

            io.emit(
                "placeUpdated",
                {
                    place,
                    changeType: "featured"
                }
            );

            console.log(
                "Socket: placeUpdated (featured)",
                place._id,
                featured
            );

        }


        return res.status(200).json({

            status: true,

            message:
                "Featured status updated",

            place

        });

    } catch (error) {

        console.log(
            "Toggle Featured Error:",
            error
        );

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