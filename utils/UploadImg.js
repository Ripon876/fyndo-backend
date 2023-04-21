const cloudinary = require("../configs/cloudinaryConfig");

exports.UploadImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath);
    return result.secure_url;
  } catch (err) {
    console.log(err);
    return null;
  }
};
