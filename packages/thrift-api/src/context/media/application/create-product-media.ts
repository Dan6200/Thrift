import { MediaRepository } from '../ports/media-repository.js'
import { MediaStorage, RawUpload } from '../ports/media-storage.js'

export const createProductMediaUseCase =
  (storage: MediaStorage, repository: MediaRepository) =>
  async (input: {
    userId: string
    productId: number
    files: RawUpload[]
    descriptions: Record<string, string>
    isDisplayImage: Record<string, boolean>
    isThumbnailImage: Record<string, boolean>
    filetypes: Record<string, string>
  }) => {
    const storedFiles = await Promise.all(
      input.files.map((file) => storage.upload(file, 'products')),
    )

    const mediaFiles = storedFiles.map((stored, index) => ({
      filename: stored.filename,
      filepath: stored.filepath,
      filetype: stored.filetype,
      originalname: input.files[index].originalname,
    }))

    return repository.createProductMedia({
      userId: input.userId,
      productId: input.productId,
      files: mediaFiles,
      descriptions: input.descriptions,
      isDisplayImage: input.isDisplayImage,
      isThumbnailImage: input.isThumbnailImage,
      filetypes: input.filetypes,
    })
  }
