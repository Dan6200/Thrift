import { MediaRepository } from '../ports/media-repository.js'

export const updateProductMediaUseCase =
  (repository: MediaRepository) =>
  (input: {
    mediaId: number
    file?: any
    description?: string
    filetype?: string
  }) =>
    repository.updateProductMedia(input)
