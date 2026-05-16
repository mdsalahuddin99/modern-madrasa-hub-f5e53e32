import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export class UploadService {
  static async uploadFile(fileBase64: string, folder: string = "madrasas") {
    try {
      const result = await cloudinary.uploader.upload(fileBase64, {
        folder,
        resource_type: "auto",
        transformation: [
          { width: 1200, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" }
        ]
      });
      return {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        size: result.bytes
      };
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error("ফাইল আপলোড ব্যর্থ হয়েছে");
    }
  }

  static async deleteFile(publicId: string) {
    try {
      return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Cloudinary delete error:", error);
      throw new Error("ফাইল মুছতে সমস্যা হয়েছে");
    }
  }

  static hasConfig() {
    return Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );
  }
}
