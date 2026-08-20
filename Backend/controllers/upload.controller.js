import cloudinary from '../config/cloudinary.js';

export const uploadImageToCloudinary = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image file uploaded." });
        }

        // Convert file buffer to base64 data URI
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

        // Upload to Cloudinary folder 'jandarpan_reports'
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: "jandarpan_reports",
            resource_type: "auto"
        });

        res.status(200).json({
            success: true,
            imageUrl: result.secure_url,
            publicId: result.public_id
        });
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        res.status(500).json({ success: false, message: "Failed to upload photo to Cloudinary.", error: error.message });
    }
};
