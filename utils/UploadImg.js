const cloudinary = require("../Configs/ImageUpload");

exports.UploadImages = async (files) => {
  try {
    const uploadedFiles = [];
    for (const file of Object.values(files)) {
      console.log("uploading file => ", file.name);
      const result = await cloudinary.uploader.upload(file.tempFilePath);
      uploadedFiles.push(result.secure_url);
    }
    return uploadedFiles;
  } catch (err) {
    console.log(err);
    return null;
  }
};
