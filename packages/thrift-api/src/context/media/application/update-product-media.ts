import { MediaRepository } from '../ports/media-repository.js'
import { MediaStorage, RawUpload } from '../ports/media-storage.js'

export const updateProductMediaUseCase =
  (storage: MediaStorage, repository: MediaRepository) =>
  async (input: {
    mediaId: number
    file?: RawUpload
    description?: string
    filetype?: string
  }) => {
    let stored
    if (input.file) {
      stored = await storage.upload(input.file, 'products')
    }
    return repository.updateProductMedia({
      mediaId: input.mediaId,
      file: stored
        ? { filename: stored.filename, filepath: stored.filepath }
        : undefined,
      description: input.description,
      filetype: input.filetype,
    })
  }
