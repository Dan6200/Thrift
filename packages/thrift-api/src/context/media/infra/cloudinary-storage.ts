import { randomUUID } from 'node:crypto'
import { cloudinary } from '#src/utils/media-storage.js'
import { MediaStorage } from '../ports/media-storage.js'

const folderFor = (folder: 'avatars' | 'products') =>
  process.env.NODE_ENV === 'testing'
    ? `sellit-media-testing/${folder}`
    : `sellit-media/${folder}`

const cloudinaryStorage: MediaStorage = {
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

/**
 * Test double for the MediaStorage port.
 *
 * Integration tests must never depend on live Cloudinary (flaky, slow,
 * external). Under `NODE_ENV=testing` uploads return a deterministic fake URL
 * that satisfies the response schemas; deletes are DB-only, so this is the only
 * operation that would otherwise touch Cloudinary.
 */
const inMemoryMediaStorage: MediaStorage = {
  async upload(file, folder) {
    const id = `test-${folder}-${randomUUID()}`
    return {
      filename: id,
      filepath: `https://test.invalid/${folder}/${id}`,
      filetype: file.mimetype,
    }
  },
}

export const cloudinaryMediaStorage: MediaStorage =
  process.env.NODE_ENV === 'testing' ? inMemoryMediaStorage : cloudinaryStorage
