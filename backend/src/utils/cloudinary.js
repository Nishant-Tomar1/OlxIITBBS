import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

// Cloudinary configuration
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});


// Upload file on Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload( localFilePath, {
          resource_type : 'auto'
        })
        // console.log(response);
        //file uploaded successfully
        // console.log("File Uploaded Successfully on Cloudinary :",response.url);
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)  //remove the locally stored temporary file as upload operation got failed
        return null;
    }
}
function extractPublicId(url) {
    // Define the regular expression to match the public ID (regex)
    const regex = /\/(?:[a-zA-Z0-9_-]+\/)*v\d+\/([^\/]+?)(?:\.[a-zA-Z]+)?$/i;
    const match = url.match(regex);
    
    if (match && match[1]) {
      return match[1];
    } else {
      throw new Error("Invalid Cloudinary URL");
    }
  }

const deleteFileFromCloudinary = async (url) => {
    try {
        const publicId = extractPublicId(url);
        
        await cloudinary.uploader.destroy(publicId);

    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

export {uploadOnCloudinary, deleteFileFromCloudinary}
