import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadImage = async (file: string, folder: string = "madrasas") => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Image upload failed");
  }
};

export const hasCloudinaryConfig = () => {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
};

export const optimizeCloudinaryUrl = (url: string) => {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }
  // Inject auto format/quality transformations for faster delivery.
  return url.replace("/upload/", "/upload/f_auto,q_auto/");
};

export const deleteImage = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
  }
};

export default cloudinary;
