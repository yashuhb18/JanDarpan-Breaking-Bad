import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'daxycknxl',
    api_key: process.env.CLOUDINARY_API_KEY || '21838593343261',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'OBN1ZlxGRnjyADierOqARDf_yQ4'
});

export default cloudinary;
