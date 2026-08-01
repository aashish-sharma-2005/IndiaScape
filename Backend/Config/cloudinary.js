const multer=require("multer");
const {CloudinaryStorage}=require("multer-storage-cloudinary");
const {v2:cloudinary}=require("cloudinary");

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
});

const storage=new CloudinaryStorage({
    cloudinary,
    params:async(req,file)=>{
        let folder="IndiaScape/misc";
        if(file.fieldname==="placeImages"){
            folder="IndiaScape/placeImages";
        }
        return{
            folder,
            resource_type:"image"
        };
    }
});

const uploads=multer({storage});

module.exports={uploads,cloudinary};