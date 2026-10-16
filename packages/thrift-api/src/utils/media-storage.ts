// cspell:ignore fieldname
///////////////////////////////////////////////////
// Configures the Cloudinary SDK.
// Uploads are performed by context/media/infra/cloudinary-storage.ts via the
// MediaStorage port; this module only owns the SDK configuration.
///////////////////////////////////////////////////
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

if (process.env.NODE_ENV === 'production') {
  if (process.env.VERCEL_ENV)
    dotenv.config({ path: `.env.${process.env.VERCEL_ENV}` })
  else dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
} else dotenv.config({ path: `.env.${process.env.NODE_ENV ?? 'development'}` })

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export { cloudinary }
