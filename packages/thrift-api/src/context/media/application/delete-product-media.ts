import { MediaRepository } from '../ports/media-repository.js'

export const deleteProductMediaUseCase =
  (repository: MediaRepository) => (mediaId: number) =>
    repository.deleteProductMedia(mediaId)
