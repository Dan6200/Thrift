import { cloudinary } from '#src/utils/media-storage.js'
import { MediaStorage } from '../ports/media-storage.js'

const folderFor = (folder: 'avatars' | 'products') =>
  process.env.NODE_ENV === 'testing'
    ? `sellit-media-testing/${folder}`
    : `sellit-media/${folder}`

export const cloudinaryMediaStorage: MediaStorage = {
  async upload(file, folder) {
    const result: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: folderFor(folder),
          use_filename: true,
          unique_filename: true,
          overwrite: true,
          public_id: `${folder}-${Math.trunc(Math.random() * 1e9)}`,
        },
        (error, result) => (error ? reject(error) : resolve(result)),
      )
      stream.end(file.buffer)
    })

    return {
      filename: result.public_id,
      filepath: result.secure_url,
      filetype: file.mimetype,
    }
  },
}
