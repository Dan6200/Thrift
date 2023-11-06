// cspell:disable
///////////////////////////////////////////////////
// Uploads an image file to cloudinary using multer
///////////////////////////////////////////////////
import { CloudinaryStorage, Options } from 'multer-storage-cloudinary'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export default new CloudinaryStorage({
  cloudinary,
  params: {
    use_filename: true,
    folder: 'thrift-app-media',
    unique_filename: true,
    overwrite: true,
    public_id: (_req, file) =>
      `${file.fieldname}-${Math.trunc(Math.random() * 1e9)}`,
  },
} as Options)
