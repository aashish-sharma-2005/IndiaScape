const DraftPlace = require("../../Models/draftPlace")
const Famous = require("../../Models/famous")
const {cloudinary} = require("../../Config/cloudinary")

async function deleteUploadedImages(images) {
    for (const image of images) {
        try {
            if (image.filename) {
                await cloudinary.uploader.destroy(image.filename)
            }
        } catch (error) {
            console.log("Cloudinary cleanup error:", error.message)
        }
    }
}

async function savedDraft(req, res) {
    const images = req.files || []
    try {
        const photos = images.map((file) => ({
            url: file.path,
            publicId: file.filename
        }))
        const obj = { ...req.body, photos }
        const result = await DraftPlace.create(obj)
        if (result) return res.status(200).json({ status: true, message: "Draft saved" })
        await deleteUploadedImages(images)
        return res.status(400).json({ status: false, message: "Draft Not Saved" })
    } catch (error) {
        console.log(error)
        await deleteUploadedImages(images)
        return res.status(500).json({ status: false, message: "Server Error" })
    }
}

async function savedplace(req, res) {
    const images = req.files || []
    try {
        const photos = images.map((file) => ({
            url: file.path,
            publicId: file.filename
        }))
        const obj = { ...req.body, photos }
        if (!obj.state_id) delete obj.state_id
        const result = await Famous.create(obj)
        if (result) return res.status(200).json({ status: true, message: "Place published successfully", obj: result })
        await deleteUploadedImages(images)
        return res.status(400).json({ status: false, message: "Place Not Published" })
    } catch (error) {
        console.log(error)
        await deleteUploadedImages(images)
        return res.status(500).json({ status: false, message: "Server Error" })
    }
}

async function updatePlace(req,res){
    try{
        const {id}=req.params;

        const place=await Famous.findById(id);

        if(!place){
            return res.status(404).json({
                status:false,
                message:"Place not found"
            });
        }

        place.state_id=req.body.state_id;
        place.name=req.body.name;
        place.title=req.body.title;
        place.description=req.body.description;
        place.story=req.body.story;
        place.featured=req.body.featured==="true";

        if(req.files?.length){
            const newPhotos=req.files.map(file=>({
                url:file.path,
                publicId:file.filename
            }));

            place.photos.push(...newPhotos);
        }

        await place.save();

        return res.status(200).json({
            status:true,
            message:"Place updated successfully",
            place
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            status:false,
            message:"Server Error"
        });
    }
}

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

        if (photo.publicId) {
            await cloudinary.uploader.destroy(photo.publicId);
        }

        photo.deleteOne();

        await place.save();

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


        // Delete images from Cloudinary
        if (place.photos?.length) {

            for (const photo of place.photos) {

                if (photo.publicId) {

                    await cloudinary.uploader.destroy(
                        photo.publicId
                    );

                }

            }

        }


        // Delete from MongoDB
        await Famous.findByIdAndDelete(id);



        return res.status(200).json({

            status: true,

            message: "Place deleted successfully"

        });



    } catch (error) {

        console.log(error);


        return res.status(500).json({

            status:false,

            message:"Server error"

        });

    }

}
async function toggleFeatured(req,res){
    try{
        const {id}=req.params;
        const {featured}=req.body;

        const count=await Famous.countDocuments({
            featured:true
        });

        if(featured===true && count>=6){
            return res.status(400).json({
                status:false,
                message:"Maximum 6 featured places allowed"
            });
        }

        if(featured===false && count<=3){
            return res.status(400).json({
                status:false,
                message:"At least 3 featured places required"
            });
        }

        const place=await Famous.findByIdAndUpdate(
            id,
            {featured},
            {new:true}
        );

        if(!place){
            return res.status(404).json({
                status:false,
                message:"Place not found"
            });
        }

        res.json({
            status:true,
            place
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            status:false,
            message:"Server Error"
        });
    }
}
module.exports = { savedDraft, savedplace, updatePlace, deletePlaceImage,deletePlace,toggleFeatured }